import React, { useEffect, useMemo, useState } from 'react';
import { useStudyScheduler } from '../../context/StudySchedulerContext';

const StudyReminderOverlay = () => {
    const { activeReminder, settings, updateSessionStatus, dismissReminder, snoozeReminder } = useStudyScheduler();

    const durationSeconds = useMemo(() => Math.max(1, (settings?.sessionDurationMin || 15) * 60), [settings?.sessionDurationMin]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

    useEffect(() => {
        if (!activeReminder) {
            setIsRunning(false);
            setIsPaused(false);
            setRemainingSeconds(durationSeconds);
            return;
        }

        setIsRunning(false);
        setIsPaused(false);
        setRemainingSeconds(durationSeconds);
    }, [activeReminder, durationSeconds]);

    useEffect(() => {
        if (!activeReminder || !isRunning || isPaused) return;
        if (remainingSeconds <= 0) {
            updateSessionStatus(activeReminder.id, 'done');
            setIsRunning(false);
            setIsPaused(false);
            return;
        }

        const timer = setInterval(() => {
            setRemainingSeconds(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [activeReminder, isRunning, isPaused, remainingSeconds, updateSessionStatus]);

    if (!activeReminder) return null;

    const sessionTime = new Date(activeReminder.time);
    const timeStr = `${sessionTime.getHours().toString().padStart(2, '0')}:${sessionTime.getMinutes().toString().padStart(2, '0')}`;
    const mm = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const ss = (remainingSeconds % 60).toString().padStart(2, '0');
    const progressPct = ((durationSeconds - remainingSeconds) / durationSeconds) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {/* CRT scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
                }} />

            <div className="relative w-full max-w-md mx-4 border border-terminal-accent/30 bg-terminal-bg rounded-lg overflow-hidden shadow-2xl shadow-terminal-accent/10">
                {/* Top bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-terminal-accent/10 border-b border-terminal-accent/20">
                    <span className="w-2 h-2 rounded-full bg-terminal-accent animate-pulse" />
                    <span className="text-[10px] text-terminal-accent font-mono tracking-widest uppercase">
                        STUDY SESSION — {timeStr}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h2 className="text-xl font-bold text-terminal-accent font-mono mb-2">
                        Čas na studium!
                    </h2>
                    <p className="text-terminal-text/60 text-sm mb-1">
                        15minutová session #{activeReminder.id + 1}
                    </p>
                    {activeReminder.topic && (
                        <p className="text-terminal-text/80 text-sm font-medium mt-2">
                            Téma: {activeReminder.topic.title}
                        </p>
                    )}

                    {/* Timer bar */}
                    <div className="mt-6 mb-6">
                        <div className="h-1 bg-terminal-border/20 rounded-full overflow-hidden">
                            <div className="h-full bg-terminal-accent rounded-full transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }} />
                        </div>
                        <p className="text-[10px] text-terminal-text/30 mt-1 font-mono">{mm}:{ss} min</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                        {!isRunning ? (
                            <button
                                onClick={() => {
                                    setIsRunning(true);
                                    setIsPaused(false);
                                }}
                                className="w-full py-3 bg-terminal-accent text-terminal-bg font-bold font-mono text-sm rounded border border-terminal-accent hover:bg-terminal-accent/90 transition-all tracking-wider"
                            >
                                {'>'} START SESSION
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsPaused(prev => !prev)}
                                    className="flex-1 py-2 bg-terminal-accent/10 text-terminal-accent text-xs font-mono rounded border border-terminal-accent/20 hover:bg-terminal-accent/20 transition-all"
                                >
                                    {isPaused ? 'RESUME' : 'PAUSE'}
                                </button>
                                <button
                                    onClick={() => updateSessionStatus(activeReminder.id, 'done')}
                                    className="flex-1 py-2 bg-green-500/10 text-green-400 text-xs font-mono rounded border border-green-500/20 hover:bg-green-500/20 transition-all"
                                >
                                    DONE
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setIsRunning(false);
                                    setIsPaused(false);
                                    snoozeReminder(activeReminder.id);
                                }}
                                className="flex-1 py-2 bg-terminal-accent/10 text-terminal-accent/70 text-xs font-mono rounded border border-terminal-accent/20 hover:bg-terminal-accent/20 transition-all"
                            >
                                SNOOZE 5min
                            </button>
                            <button
                                onClick={() => {
                                    dismissReminder(activeReminder.id);
                                    updateSessionStatus(activeReminder.id, 'skipped');
                                }}
                                className="flex-1 py-2 bg-red-500/10 text-red-400/70 text-xs font-mono rounded border border-red-500/20 hover:bg-red-500/20 transition-all"
                            >
                                SKIP
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom accent */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-terminal-accent/50 to-transparent" />
            </div>
        </div>
    );
};

export default StudyReminderOverlay;
