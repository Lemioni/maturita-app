import { useState, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaStar, FaDownload, FaBook, FaNetworkWired, FaCheck, FaTimes, FaForward, FaBolt } from 'react-icons/fa';
import { useStudyScheduler } from '../context/StudySchedulerContext';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

const PRIORITY_COLORS = {
    high: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', label: '🔴 Vysoká' },
    medium: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-400', label: '🟡 Střední' },
    low: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', label: '🟢 Nízká' },
    skip: { bg: 'bg-terminal-border/10', border: 'border-terminal-border/20', text: 'text-terminal-text/30', label: '⬛ Přeskočit' },
};

const PRIORITY_CYCLE = { high: 'medium', medium: 'low', low: 'skip', skip: 'high' };

// ── Sweep-able Priority Button ──────────────────────────────────────────
const PriorityButton = ({ topic, priority, onSetPriority, sweepRef }) => {
    const colors = PRIORITY_COLORS[priority];
    const btnRef = useRef(null);

    // Register element for sweep hit-testing
    const refCallback = useCallback((el) => {
        btnRef.current = el;
        if (el) sweepRef.current.set(topic.id, el);
        else sweepRef.current.delete(topic.id);
    }, [topic.id, sweepRef]);

    const handlePointerDown = (e) => {
        // Cycle priority on tap
        const next = PRIORITY_CYCLE[priority];
        onSetPriority(topic.id, next);
        // Start sweep painting with this new priority
        sweepRef.current._painting = true;
        sweepRef.current._paintPriority = next;
        sweepRef.current._touched = new Set([topic.id]);
        e.currentTarget.setPointerCapture?.(e.pointerId);
        e.preventDefault();
    };

    const handlePointerEnter = (e) => {
        if (!sweepRef.current._painting) return;
        if (sweepRef.current._touched?.has(topic.id)) return;
        sweepRef.current._touched?.add(topic.id);
        onSetPriority(topic.id, sweepRef.current._paintPriority);
    };

    return (
        <button
            ref={refCallback}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
            className={`flex items-center gap-2 px-3 py-2 rounded border ${colors.bg} ${colors.border} text-left transition-colors select-none touch-none hover:opacity-80`}
        >
            <span className={`text-xs font-mono ${colors.text} w-16 flex-shrink-0`}>
                {colors.label.split(' ')[0]}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-terminal-text/80 truncate">{topic.title}</p>
                <p className="text-[10px] text-terminal-text/40 truncate">{topic.subtitle}</p>
            </div>
        </button>
    );
};

const StudySchedulerPage = () => {
    const {
        settings, updateSettings, sessions,
        setPriority, cyclePriority, setBulkPriorities, getStats, getNextSession,
    } = useStudyScheduler();

    const [activeTab, setActiveTab] = useState('schedule');

    const stats = getStats();
    const nextSession = getNextSession();

    // Sweep state — shared mutable ref to avoid re-renders during drag
    const sweepRef = useRef(new Map());

    // Stop painting on pointer-up anywhere
    const handleGlobalPointerUp = useCallback(() => {
        sweepRef.current._painting = false;
        sweepRef.current._paintPriority = null;
        sweepRef.current._touched = null;
    }, []);

    // For touch devices — resolve element under finger during move
    const handleGlobalPointerMove = useCallback((e) => {
        if (!sweepRef.current._painting) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;
        // Walk up to find the button with data-topic-id
        const btn = el.closest('[data-topic-id]');
        if (!btn) return;
        const topicId = btn.dataset.topicId;
        if (sweepRef.current._touched?.has(topicId)) return;
        sweepRef.current._touched?.add(topicId);
        setPriority(topicId, sweepRef.current._paintPriority);
    }, [setPriority]);

    // Build topic lists
    const bookTopics = useMemo(() =>
        (cjBooks.books || []).map(b => ({
            id: `book-${b.id}`,
            title: b.title,
            subtitle: b.author,
            type: 'book',
            bookId: b.id,
        })), []);

    const PSI_IDS = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

    const questionGroups = useMemo(() => {
        const questions = itQuestions.questions || [];
        const groups = [
            { key: 'hw', label: 'IKT1 — Hardware', icon: '💻', items: questions.filter(q => q.id >= 1 && q.id <= 10) },
            { key: 'psi', label: 'PSI — Počítačové sítě', icon: '🌐', items: questions.filter(q => PSI_IDS.has(q.id)) },
            { key: 'os', label: 'IKT1 — Operační systémy', icon: '🖥️', items: questions.filter(q => q.id >= 21 && q.id <= 24) },
            { key: 'prg', label: 'IKT2 — Programování', icon: '⌨️', items: questions.filter(q => q.id >= 25 && q.id <= 41) },
            { key: 'db', label: 'IKT2 — Databázové systémy', icon: '🗃️', items: questions.filter(q => q.id >= 42) },
        ];
        return groups.map(g => ({
            ...g,
            topics: g.items.map(q => ({
                id: `it-${q.id}`,
                title: q.title || `Otázka ${q.id}`,
                subtitle: `${g.label.split(' — ')[0]} #${q.id}`,
                type: 'it',
                questionId: q.id,
            })),
        }));
    }, []);

    const allItTopics = useMemo(() => questionGroups.flatMap(g => g.topics), [questionGroups]);

    const handleFocus11 = () => {
        const mapping = {};
        bookTopics.forEach((b, i) => { mapping[b.id] = i < 11 ? 'high' : 'skip'; });
        questionGroups.forEach(g => {
            g.topics.forEach(t => { mapping[t.id] = g.key === 'psi' ? 'high' : 'medium'; });
        });
        setBulkPriorities(mapping);
    };

    const handleAllHigh = () => {
        const mapping = {};
        [...bookTopics, ...allItTopics].forEach(t => { mapping[t.id] = 'high'; });
        setBulkPriorities(mapping);
    };

    const formatTime = (isoStr) => {
        const d = new Date(isoStr);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'done': return <FaCheck className="text-green-400" />;
            case 'missed': return <FaTimes className="text-red-400" />;
            case 'skipped': return <FaForward className="text-yellow-400" />;
            default: return <FaClock className="text-terminal-text/30" />;
        }
    };

    // Helper to render a priority grid section with sweep support
    const renderPriorityGrid = (topics) => (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-1.5"
            onPointerUp={handleGlobalPointerUp}
            onPointerLeave={handleGlobalPointerUp}
            onPointerMove={handleGlobalPointerMove}
        >
            {topics.map(topic => {
                const priority = settings.priorities[topic.id] || 'medium';
                return (
                    <div key={topic.id} data-topic-id={topic.id}>
                        <PriorityButton
                            topic={topic}
                            priority={priority}
                            onSetPriority={setPriority}
                            sweepRef={sweepRef}
                        />
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 font-mono">
                    <FaCalendarAlt /> Study Scheduler
                </h1>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-terminal-text/40 font-mono">
                        {stats.done}/{stats.total} dnes
                    </div>
                    {nextSession && (
                        <div className="text-xs text-terminal-accent/70 font-mono bg-terminal-accent/10 px-2 py-1 rounded border border-terminal-accent/20">
                            Další: {formatTime(nextSession.time)}
                        </div>
                    )}
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-1 border-b border-terminal-border/20 pb-0">
                {[
                    { id: 'schedule', label: 'Dnešní plán', icon: FaClock },
                    { id: 'priorities', label: 'Priority', icon: FaStar },
                    { id: 'setup', label: 'Nastavení', icon: FaCalendarAlt },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-b-2 transition-all ${activeTab === tab.id
                            ? 'border-terminal-accent text-terminal-accent'
                            : 'border-transparent text-terminal-text/40 hover:text-terminal-text/60'
                            }`}
                    >
                        <tab.icon className="text-[10px]" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* SCHEDULE TAB */}
            {activeTab === 'schedule' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: 'Celkem', value: stats.total, color: 'text-terminal-accent' },
                            { label: 'Hotovo', value: stats.done, color: 'text-green-400' },
                            { label: 'Zmešk.', value: stats.missed, color: 'text-red-400' },
                            { label: 'Zbývá', value: stats.upcoming, color: 'text-yellow-400' },
                        ].map(s => (
                            <div key={s.label} className="terminal-card text-center py-2">
                                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                                <div className="text-[10px] text-terminal-text/40 font-mono">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="terminal-card p-0 overflow-hidden">
                        <div className="px-3 py-2 border-b border-terminal-border/20">
                            <span className="text-[10px] text-terminal-text/40 font-mono tracking-widest uppercase">
                                SESSIONS TIMELINE
                            </span>
                        </div>
                        <div className="divide-y divide-terminal-border/10">
                            {sessions.map(session => {
                                const isPast = new Date(session.time) < new Date();
                                const isActive = session.status === 'upcoming' && isPast;
                                return (
                                    <div
                                        key={session.id}
                                        className={`flex items-center gap-3 px-3 py-2.5 ${isActive ? 'bg-terminal-accent/5 border-l-2 border-terminal-accent' : ''
                                            } ${session.status === 'done' ? 'opacity-50' : ''}`}
                                    >
                                        <span className="w-12 text-xs font-mono text-terminal-text/50 text-right">
                                            {formatTime(session.time)}
                                        </span>
                                        <div className="w-5 flex justify-center">
                                            {statusIcon(session.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-xs font-mono ${session.status === 'done' ? 'text-terminal-text/40 line-through' :
                                                isActive ? 'text-terminal-accent font-medium' : 'text-terminal-text/60'
                                                }`}>
                                                Session #{session.id + 1}
                                                {session.topic && ` — ${session.topic.title}`}
                                            </span>
                                        </div>
                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${session.status === 'done' ? 'bg-green-500/10 text-green-400' :
                                            session.status === 'missed' ? 'bg-red-500/10 text-red-400' :
                                                session.status === 'skipped' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-terminal-border/10 text-terminal-text/30'
                                            }`}>
                                            {session.status === 'done' ? 'DONE' :
                                                session.status === 'missed' ? 'MISSED' :
                                                    session.status === 'skipped' ? 'SKIP' :
                                                        isActive ? 'NOW' : '15min'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* PRIORITIES TAB */}
            {activeTab === 'priorities' && (
                <div className="space-y-4">
                    {/* Presets */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleFocus11}
                            className="px-3 py-1.5 text-xs font-mono bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20 rounded hover:bg-terminal-accent/20 transition-all flex items-center gap-1.5"
                        >
                            <FaBolt className="text-[10px]" /> Focus 11 knih + PSI
                        </button>
                        <button
                            onClick={handleAllHigh}
                            className="px-3 py-1.5 text-xs font-mono bg-terminal-border/10 text-terminal-text/50 border border-terminal-border/20 rounded hover:bg-terminal-border/20 transition-all"
                        >
                            Vše na vysokou
                        </button>
                    </div>

                    <p className="text-[10px] text-terminal-text/30 font-mono">
                        Klikni pro změnu priority · Drž a táhni pro hromadné nastavení 🖱️
                    </p>

                    {/* Books */}
                    <div>
                        <h3 className="text-sm text-terminal-text/60 font-mono flex items-center gap-1.5 mb-2">
                            <FaBook className="text-terminal-accent" /> Knihy ({bookTopics.length})
                        </h3>
                        {renderPriorityGrid(bookTopics)}
                    </div>

                    {/* IT Questions — grouped by subject */}
                    {questionGroups.map(group => (
                        <div key={group.key}>
                            <h3 className="text-sm text-terminal-text/60 font-mono flex items-center gap-1.5 mb-2">
                                <span>{group.icon}</span> {group.label} ({group.topics.length})
                            </h3>
                            {renderPriorityGrid(group.topics)}
                        </div>
                    ))}
                </div>
            )}

            {/* SETUP TAB */}
            {activeTab === 'setup' && (
                <div className="space-y-6">
                    <div className="terminal-card">
                        <h3 className="text-sm text-terminal-accent font-mono mb-4 flex items-center gap-1.5">
                            <FaClock /> Nastavení sessions
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider block mb-1">
                                    Počet sessions za den: {settings.sessionsPerDay}
                                </label>
                                <input
                                    type="range"
                                    min={2} max={16} step={1}
                                    value={settings.sessionsPerDay}
                                    onChange={e => updateSettings({ sessionsPerDay: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-terminal-border/20 rounded appearance-none cursor-pointer accent-terminal-accent"
                                />
                                <div className="flex justify-between text-[9px] text-terminal-text/30 font-mono mt-0.5">
                                    <span>2 (30min)</span>
                                    <span>Aktuálně: {settings.sessionsPerDay * settings.sessionDurationMin}min</span>
                                    <span>16 (4h)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider block mb-1">
                                        Začátek dne
                                    </label>
                                    <select
                                        value={settings.startHour}
                                        onChange={e => updateSettings({ startHour: parseInt(e.target.value) })}
                                        className="w-full bg-terminal-dim border border-terminal-border/30 text-terminal-text text-sm px-2 py-1.5 rounded font-mono"
                                    >
                                        {Array.from({ length: 18 }, (_, i) => i + 5).map(h => (
                                            <option key={h} value={h}>{h}:00</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider block mb-1">
                                        Konec dne
                                    </label>
                                    <select
                                        value={settings.endHour}
                                        onChange={e => updateSettings({ endHour: parseInt(e.target.value) })}
                                        className="w-full bg-terminal-dim border border-terminal-border/30 text-terminal-text text-sm px-2 py-1.5 rounded font-mono"
                                    >
                                        {Array.from({ length: 18 }, (_, i) => i + 5).map(h => (
                                            <option key={h} value={h}>{h}:00</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-xs text-terminal-text/60 font-mono">Browser notifikace</label>
                                <button
                                    onClick={() => {
                                        updateSettings({ enableNotifications: !settings.enableNotifications });
                                        if (!settings.enableNotifications && 'Notification' in window) {
                                            Notification.requestPermission();
                                        }
                                    }}
                                    className={`px-3 py-1 text-xs font-mono rounded border transition-all ${settings.enableNotifications
                                        ? 'bg-green-500/15 border-green-500/30 text-green-400'
                                        : 'bg-terminal-border/10 border-terminal-border/20 text-terminal-text/30'
                                        }`}
                                >
                                    {settings.enableNotifications ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auto-launch section */}
                    <div className="terminal-card">
                        <h3 className="text-sm text-terminal-accent font-mono mb-3 flex items-center gap-1.5">
                            <FaDownload /> Auto-launch při startu PC
                        </h3>
                        <p className="text-xs text-terminal-text/50 mb-3 leading-relaxed">
                            Stáhni si script a vlož ho do Windows Startup složky.
                            Maturita app se automaticky otevře při každém zapnutí PC.
                        </p>
                        <div className="space-y-2">
                            <a
                                href="/auto-launch.bat"
                                download="maturita-autolaunch.bat"
                                className="flex items-center gap-2 px-3 py-2 bg-terminal-accent/10 text-terminal-accent text-xs font-mono rounded border border-terminal-accent/20 hover:bg-terminal-accent/20 transition-all w-fit"
                            >
                                <FaDownload /> Stáhnout auto-launch.bat
                            </a>
                            <div className="text-[10px] text-terminal-text/40 font-mono space-y-1 bg-terminal-dim/50 p-3 rounded border border-terminal-border/10">
                                <p className="text-terminal-accent/70 font-bold">Návod:</p>
                                <p>1. Stáhni soubor výše</p>
                                <p>2. Stiskni Win+R, napiš <span className="text-terminal-accent">shell:startup</span> a Enter</p>
                                <p>3. Přesuň stažený .bat soubor do otevřené složky</p>
                                <p>4. Hotovo! Při příštím zapnutí PC se Maturita app otevře automaticky</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-terminal-border/10">
                            <p className="text-[10px] text-terminal-text/40 font-mono mb-2">
                                💡 Tip: Můžeš taky nainstalovat PWA — klikni v Chrome na ⋮ → "Nainstalovat aplikaci"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudySchedulerPage;
