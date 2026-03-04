import React from 'react';
import { useStudyScheduler } from '../../context/StudySchedulerContext';

const StudyReminderOverlay = () => {
    const { activeReminder, updateSessionStatus, dismissReminder, snoozeReminder } = useStudyScheduler();

    if (!activeReminder) return null;

    const sessionTime = new Date(activeReminder.time);
    const timeStr = `${sessionTime.getHours().toString().padStart(2, '0')}:${sessionTime.getMinutes().toString().padStart(2, '0')}`;

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
                            <div className="h-full bg-terminal-accent rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                        <p className="text-[10px] text-terminal-text/30 mt-1 font-mono">15:00 min</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => updateSessionStatus(activeReminder.id, 'done')}
                            className="w-full py-3 bg-terminal-accent text-terminal-bg font-bold font-mono text-sm rounded border border-terminal-accent hover:bg-terminal-accent/90 transition-all tracking-wider"
                        >
                            {'>'} START SESSION
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => snoozeReminder(activeReminder.id)}
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
