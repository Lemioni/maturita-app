import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'maturita-study-scheduler';

const StudySchedulerContext = createContext();
export const useStudyScheduler = () => useContext(StudySchedulerContext);

// Default priority settings
const DEFAULT_SETTINGS = {
    sessionsPerDay: 8,        // 8 × 15 min = 2 hours
    sessionDurationMin: 15,
    startHour: 8,
    endHour: 22,
    priorities: {},           // { 'book-1': 'high', 'psi-3': 'medium', ... }
    enableNotifications: true,
    enableSound: true,
};

const PRIORITY_WEIGHTS = { high: 3, medium: 2, low: 1, skip: 0 };

const getStoredSettings = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch { return DEFAULT_SETTINGS; }
};

const getSessionsStorageKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `maturita-sessions-${today}`;
};

const getStoredSessions = () => {
    try {
        const raw = localStorage.getItem(getSessionsStorageKey());
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

// Generate evenly spaced session times for today
const generateSessionTimes = (settings) => {
    const { sessionsPerDay, startHour, endHour } = settings;
    if (sessionsPerDay <= 0) return [];

    const totalMinutes = (endHour - startHour) * 60;
    const gap = totalMinutes / sessionsPerDay;

    const today = new Date();
    today.setHours(startHour, 0, 0, 0);

    return Array.from({ length: sessionsPerDay }, (_, i) => {
        const sessionTime = new Date(today.getTime() + i * gap * 60000);
        return {
            id: i,
            time: sessionTime.toISOString(),
            hour: sessionTime.getHours(),
            minute: sessionTime.getMinutes(),
            status: 'upcoming', // 'upcoming' | 'active' | 'done' | 'missed' | 'skipped'
            topic: null,
        };
    });
};

// Pick a topic based on priorities
const pickWeightedTopic = (priorities, allTopics) => {
    const weighted = [];
    allTopics.forEach(topic => {
        const priority = priorities[topic.id] || 'medium';
        const weight = PRIORITY_WEIGHTS[priority];
        for (let i = 0; i < weight; i++) {
            weighted.push(topic);
        }
    });
    if (weighted.length === 0) return allTopics[Math.floor(Math.random() * allTopics.length)];
    return weighted[Math.floor(Math.random() * weighted.length)];
};

export const StudySchedulerProvider = ({ children }) => {
    const [settings, setSettings] = useState(getStoredSettings);
    const [sessions, setSessions] = useState([]);
    const [activeReminder, setActiveReminder] = useState(null);
    const [dismissedReminders, setDismissedReminders] = useState(new Set());
    const checkIntervalRef = useRef(null);

    // Save settings to localStorage
    const updateSettings = useCallback((newSettings) => {
        const merged = { ...settings, ...newSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        setSettings(merged);
    }, [settings]);

    // Update a single priority
    const setPriority = useCallback((topicId, level) => {
        const newPriorities = { ...settings.priorities, [topicId]: level };
        updateSettings({ priorities: newPriorities });
    }, [settings, updateSettings]);

    // Cycle priority: high → medium → low → skip → high
    const cyclePriority = useCallback((topicId) => {
        const current = settings.priorities[topicId] || 'medium';
        const cycle = { high: 'medium', medium: 'low', low: 'skip', skip: 'high' };
        setPriority(topicId, cycle[current]);
    }, [settings, setPriority]);

    // Set bulk priorities (e.g., "Focus 11 knih" preset)
    const setBulkPriorities = useCallback((mapping) => {
        const newPriorities = { ...settings.priorities, ...mapping };
        updateSettings({ priorities: newPriorities });
    }, [settings, updateSettings]);

    // Generate or load today's sessions
    useEffect(() => {
        const stored = getStoredSessions();
        if (stored && stored.length > 0) {
            setSessions(stored);
        } else {
            const newSessions = generateSessionTimes(settings);
            setSessions(newSessions);
            localStorage.setItem(getSessionsStorageKey(), JSON.stringify(newSessions));
        }
    }, [settings.sessionsPerDay, settings.startHour, settings.endHour]);

    // Mark a session as done/skipped
    const updateSessionStatus = useCallback((sessionId, status) => {
        setSessions(prev => {
            const updated = prev.map(s => s.id === sessionId ? { ...s, status } : s);
            localStorage.setItem(getSessionsStorageKey(), JSON.stringify(updated));
            return updated;
        });
        if (activeReminder?.id === sessionId) {
            setActiveReminder(null);
        }
    }, [activeReminder]);

    // Dismiss a reminder
    const dismissReminder = useCallback((sessionId) => {
        setDismissedReminders(prev => new Set(prev).add(sessionId));
        setActiveReminder(null);
    }, []);

    // Snooze a reminder (5 minutes)
    const snoozeReminder = useCallback((sessionId) => {
        setDismissedReminders(prev => new Set(prev).add(sessionId));
        setActiveReminder(null);

        // Re-enable this reminder after 5 minutes
        setTimeout(() => {
            setDismissedReminders(prev => {
                const next = new Set(prev);
                next.delete(sessionId);
                return next;
            });
        }, 5 * 60 * 1000);
    }, []);

    // Check for due sessions every minute — only when notifications are enabled
    useEffect(() => {
        if (!settings.enableNotifications) return;

        const check = () => {
            const now = new Date();
            sessions.forEach(session => {
                if (session.status !== 'upcoming') return;
                if (dismissedReminders.has(session.id)) return;

                const sessionTime = new Date(session.time);
                const diffMs = now - sessionTime;

                // Trigger if within 0-15 minute window
                if (diffMs >= 0 && diffMs < settings.sessionDurationMin * 60 * 1000) {
                    setActiveReminder(session);

                    // Browser notification
                    if (Notification.permission === 'granted') {
                        new Notification('📚 Čas na studium!', {
                            body: `15minutová session — ${session.topic?.title || 'Maturita příprava'}`,
                            icon: '/favicon.ico',
                            tag: `session-${session.id}`,
                        });
                    }
                }

                // Mark as missed if past the window
                if (diffMs >= settings.sessionDurationMin * 60 * 1000) {
                    updateSessionStatus(session.id, 'missed');
                }
            });
        };

        check();
        checkIntervalRef.current = setInterval(check, 60 * 1000);
        return () => clearInterval(checkIntervalRef.current);
    }, [sessions, settings, dismissedReminders, updateSessionStatus]);

    // Request notification permission on mount
    useEffect(() => {
        if (settings.enableNotifications && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [settings.enableNotifications]);

    // Get stats
    const getStats = useCallback(() => {
        const done = sessions.filter(s => s.status === 'done').length;
        const missed = sessions.filter(s => s.status === 'missed').length;
        const upcoming = sessions.filter(s => s.status === 'upcoming').length;
        const total = sessions.length;
        return { done, missed, upcoming, total };
    }, [sessions]);

    // Get next upcoming session
    const getNextSession = useCallback(() => {
        const now = new Date();
        return sessions.find(s => s.status === 'upcoming' && new Date(s.time) > now);
    }, [sessions]);

    const value = {
        settings,
        updateSettings,
        sessions,
        activeReminder,
        setPriority,
        cyclePriority,
        setBulkPriorities,
        updateSessionStatus,
        dismissReminder,
        snoozeReminder,
        getStats,
        getNextSession,
        PRIORITY_WEIGHTS,
    };

    return (
        <StudySchedulerContext.Provider value={value}>
            {children}
        </StudySchedulerContext.Provider>
    );
};

export default StudySchedulerContext;
