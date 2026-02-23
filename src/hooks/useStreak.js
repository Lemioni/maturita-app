import { useState, useEffect, useCallback } from 'react';

/**
 * useStreak — Track daily learning streak
 * Stores in localStorage: { currentStreak, longestStreak, lastActiveDate, totalDaysActive, history }
 */
const STORAGE_KEY = 'maturita-streak';

const getToday = () => new Date().toISOString().split('T')[0]; // "2026-02-23"

const getStoredData = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const useStreak = () => {
    const [streak, setStreak] = useState(() => {
        const data = getStoredData();
        if (!data) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysActive: 0 };
        return data;
    });

    // Check and update streak on mount
    useEffect(() => {
        const today = getToday();
        const data = getStoredData() || { currentStreak: 0, longestStreak: 0, lastActiveDate: null, totalDaysActive: 0 };

        if (data.lastActiveDate === today) {
            // Already active today — no change
            setStreak(data);
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak;
        if (data.lastActiveDate === yesterdayStr) {
            // Consecutive day — increment streak
            newStreak = {
                currentStreak: data.currentStreak + 1,
                longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
                lastActiveDate: today,
                totalDaysActive: (data.totalDaysActive || 0) + 1,
            };
        } else {
            // Streak broken — reset to 1
            newStreak = {
                currentStreak: 1,
                longestStreak: Math.max(data.longestStreak || 0, 1),
                lastActiveDate: today,
                totalDaysActive: (data.totalDaysActive || 0) + 1,
            };
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));
        setStreak(newStreak);
    }, []);

    // Manual refresh (call after quiz completion etc.)
    const refresh = useCallback(() => {
        const data = getStoredData();
        if (data) setStreak(data);
    }, []);

    return { ...streak, refresh };
};

export default useStreak;
