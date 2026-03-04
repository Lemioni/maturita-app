import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfigured, setIsConfigured] = useState(true);

    useEffect(() => {
        // Guard: Check if Firebase auth is configured
        if (!auth) {
            setIsConfigured(false);
            setLoading(false);
            setUser(null);
            return;
        }

        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

    const signInWithGoogle = async () => {
        // Guard: Check if Firebase auth is configured
        if (!auth || !googleProvider) {
            const message = 'Firebase není nakonfigurován. Kontaktujte správce.';
            console.warn('[AUTH]', message);
            throw new Error(message);
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (err) {
            console.error('[AUTH] Google sign-in failed:', err);
            throw err;
        }
    };

    const signOut = async () => {
        // Guard: Check if Firebase auth is configured
        if (!auth) {
            console.warn('[AUTH] Firebase not configured, skipping sign out');
            return;
        }

        try {
            await firebaseSignOut(auth);
        } catch (err) {
            console.error('[AUTH] Sign-out failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isConfigured, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
