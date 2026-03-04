import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';

const SyncContext = createContext();
export const useSync = () => useContext(SyncContext);

// Keys to sync (all the important localStorage keys)
const SYNC_KEYS = [
    'maturita-study-scheduler',
    'maturita-srs-data',
    'maturita-progress',
    'maturita-section-knowledge',
    'maturita-streak',
    'maturita-date',
    'dopamine_saves',
];

// Also sync session keys for today
const getTodaySessionKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `maturita-sessions-${today}`;
};

const DEBOUNCE_MS = 2000; // 2s debounce for writes

export const SyncProvider = ({ children }) => {
    const { user } = useAuth();
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const writeTimerRef = useRef(null);
    const unsubRef = useRef(null);
    const isWritingRef = useRef(false);

    // Guard: Check if Firestore is configured
    const isDbConfigured = !!db;

    // Get the user doc reference
    const getUserDocRef = useCallback(() => {
        if (!user || !isDbConfigured) return null;
        return doc(db, 'users', user.uid);
    }, [user, isDbConfigured]);

    // Collect all localStorage data to sync
    const collectLocalData = useCallback(() => {
        const data = {};
        const allKeys = [...SYNC_KEYS, getTodaySessionKey()];
        allKeys.forEach(key => {
            try {
                const val = localStorage.getItem(key);
                if (val !== null) data[key] = val;
            } catch { /* ignore */ }
        });
        return data;
    }, []);

    // Apply cloud data to localStorage
    const applyCloudData = useCallback((cloudData) => {
        if (!cloudData) return;
        Object.entries(cloudData).forEach(([key, val]) => {
            if (typeof val === 'string') {
                try { localStorage.setItem(key, val); } catch { /* ignore */ }
            }
        });
    }, []);

    // Push local data to Firestore (debounced)
    const pushToCloud = useCallback(() => {
        // Guard: Skip if Firestore is not configured
        if (!isDbConfigured) {
            setSyncStatus('offline');
            return;
        }

        const docRef = getUserDocRef();
        if (!docRef) return;

        clearTimeout(writeTimerRef.current);
        writeTimerRef.current = setTimeout(async () => {
            const pushTimeout = setTimeout(() => {
                setSyncStatus('error');
                isWritingRef.current = false;
            }, 10000);
            try {
                isWritingRef.current = true;
                setSyncStatus('syncing');
                const data = collectLocalData();
                await setDoc(docRef, { ...data, _lastSync: new Date().toISOString() }, { merge: true });
                setLastSyncTime(new Date());
                setSyncStatus('synced');
                clearTimeout(pushTimeout);
            } catch (err) {
                console.error('[SYNC] Push failed:', err);
                setSyncStatus('error');
                clearTimeout(pushTimeout);
            } finally {
                isWritingRef.current = false;
            }
        }, DEBOUNCE_MS);
    }, [getUserDocRef, collectLocalData, isDbConfigured]);

    // Initial sync on login — merge local + cloud (local wins on conflict)
    const initialSync = useCallback(async () => {
        // Guard: Skip if Firestore is not configured
        if (!isDbConfigured) {
            setSyncStatus('offline');
            return;
        }

        const docRef = getUserDocRef();
        if (!docRef) return;

        // Timeout: if sync takes longer than 10s, mark as error
        const timeoutId = setTimeout(() => {
            setSyncStatus('error');
        }, 10000);

        try {
            setSyncStatus('syncing');
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const cloudData = snapshot.data();
                // Apply cloud data first (fills in what's missing locally)
                applyCloudData(cloudData);
            }

            // Then push local state (local overwrites cloud for same keys)
            const localData = collectLocalData();
            await setDoc(docRef, { ...localData, _lastSync: new Date().toISOString() }, { merge: true });
            setLastSyncTime(new Date());
            setSyncStatus('synced');
            clearTimeout(timeoutId);
        } catch (err) {
            console.error('[SYNC] Initial sync failed:', err);
            setSyncStatus('error');
            clearTimeout(timeoutId);
        }
    }, [getUserDocRef, applyCloudData, collectLocalData, isDbConfigured]);

    // Listen for realtime changes from other devices
    useEffect(() => {
        // Guard: Skip if Firestore is not configured
        if (!isDbConfigured) {
            setSyncStatus('offline');
            return;
        }

        if (!user) {
            setSyncStatus('idle');
            if (unsubRef.current) {
                unsubRef.current();
                unsubRef.current = null;
            }
            return;
        }

        const docRef = getUserDocRef();
        if (!docRef) return;

        // Do initial sync
        initialSync();

        // Listen for changes
        unsubRef.current = onSnapshot(docRef, (snapshot) => {
            if (isWritingRef.current) return; // Don't apply our own writes
            if (snapshot.exists()) {
                const data = snapshot.data();
                applyCloudData(data);
                setLastSyncTime(new Date(data._lastSync || Date.now()));
                setSyncStatus('synced');
                // Dispatch storage event so contexts re-read
                window.dispatchEvent(new Event('sync-update'));
            }
        }, (err) => {
            console.error('[SYNC] Listener error:', err);
            setSyncStatus('error');
        });

        return () => {
            if (unsubRef.current) {
                unsubRef.current();
                unsubRef.current = null;
            }
        };
    }, [user, getUserDocRef, initialSync, applyCloudData, isDbConfigured]);

    // Watch for localStorage changes and push to cloud
    useEffect(() => {
        // Guard: Skip if Firestore is not configured
        if (!isDbConfigured) {
            setSyncStatus('offline');
            return;
        }

        if (!user) return;

        const handleStorage = () => {
            pushToCloud();
        };

        // Listen for both standard storage events and our custom sync trigger
        window.addEventListener('storage', handleStorage);

        // Intercept localStorage.setItem to auto-sync
        const originalSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = (key, value) => {
            originalSetItem(key, value);
            // Only sync our keys
            if (SYNC_KEYS.includes(key) || key.startsWith('maturita-sessions-')) {
                pushToCloud();
            }
        };

        return () => {
            window.removeEventListener('storage', handleStorage);
            localStorage.setItem = originalSetItem;
        };
    }, [user, pushToCloud, isDbConfigured]);

    return (
        <SyncContext.Provider value={{ syncStatus, lastSyncTime, pushToCloud }}>
            {children}
        </SyncContext.Provider>
    );
};

export default SyncContext;
