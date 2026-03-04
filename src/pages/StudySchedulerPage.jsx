import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaDownload, FaCheck, FaTimes, FaForward, FaPlus, FaTrash, FaRedo, FaMinus } from 'react-icons/fa';
import { useStudyScheduler } from '../context/StudySchedulerContext';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

// ── Daily Plan helpers ───────────────────────────────────────────────────
const getTodayKey = () => `maturita-daily-plan-${new Date().toISOString().split('T')[0]}`;

const loadDailyPlan = () => {
    try {
        const raw = localStorage.getItem(getTodayKey());
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const saveDailyPlan = (items) => {
    try { localStorage.setItem(getTodayKey(), JSON.stringify(items)); } catch {}
};

const PLAN_WEIGHTS = { high: 4, medium: 2, low: 1, skip: 0 };

const generatePlan = (bookTopics, allItTopics, priorities, count = 7, customPool = null) => {
    const pool = (customPool || [...bookTopics, ...allItTopics]).filter(t => {
        const p = priorities[t.id] || 'medium';
        return p !== 'skip';
    });

    // Build weighted pool
    const weighted = [];
    pool.forEach(t => {
        const w = PLAN_WEIGHTS[priorities[t.id] || 'medium'];
        for (let i = 0; i < w; i++) weighted.push(t);
    });

    if (weighted.length === 0) return pool.slice(0, count);

    // Pick unique items
    const picked = [];
    const seenIds = new Set();
    const shuffled = [...weighted].sort(() => Math.random() - 0.5);
    for (const t of shuffled) {
        if (seenIds.has(t.id)) continue;
        seenIds.add(t.id);
        picked.push({ ...t, done: false });
        if (picked.length >= count) break;
    }
    return picked;
};

const formatTodayDate = () => {
    return new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' });
};

// ── Daily Plan Tab ───────────────────────────────────────────────────────
const PLAN_GROUPS = [
    { key: 'books', label: '📚 Knihy', type: 'book' },
    { key: 'hw',    label: '💻 HW',    type: 'it', groupKey: 'hw' },
    { key: 'psi',   label: '🌐 PSI',   type: 'it', groupKey: 'psi' },
    { key: 'os',    label: '🖥️ OS',    type: 'it', groupKey: 'os' },
    { key: 'prg',   label: '⌨️ PRG',   type: 'it', groupKey: 'prg' },
    { key: 'db',    label: '🗃️ DB',    type: 'it', groupKey: 'db' },
];

const DailyPlanTab = ({ bookTopics, allItTopics, priorities, questionGroups }) => {
    const navigate = useNavigate();
    const [planItems, setPlanItems] = useState(() => loadDailyPlan() || []);
    const [showPicker, setShowPicker] = useState(false);
    const [showFocusFilter, setShowFocusFilter] = useState(false);
    const [focusGroups, setFocusGroups] = useState(() => new Set(PLAN_GROUPS.map(g => g.key)));
    const [pickerSearch, setPickerSearch] = useState('');
    const [pickerFilter, setPickerFilter] = useState('all'); // 'all' | 'book' | 'it'

    const doneCount = planItems.filter(i => i.done).length;
    const totalCount = planItems.length;

    const updateItems = (items) => {
        setPlanItems(items);
        saveDailyPlan(items);
    };

    // Build pool filtered by focusGroups
    const getFocusedPool = () => {
        const itByGroup = {};
        questionGroups.forEach(g => { itByGroup[g.key] = g.topics; });

        let pool = [];
        if (focusGroups.has('books')) pool = [...pool, ...bookTopics];
        PLAN_GROUPS.filter(g => g.type === 'it').forEach(g => {
            if (focusGroups.has(g.key) && itByGroup[g.key]) {
                pool = [...pool, ...itByGroup[g.key]];
            }
        });
        return pool.length > 0 ? pool : [...bookTopics, ...allItTopics];
    };

    const handleGenerate = () => {
        const pool = getFocusedPool();
        const items = generatePlan(bookTopics, allItTopics, priorities, 7, pool);
        updateItems(items);
        setShowPicker(false);
        setShowFocusFilter(false);
    };

    const toggleFocusGroup = (key) => {
        setFocusGroups(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const toggleDone = (id) => {
        updateItems(planItems.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    const removeItem = (id) => {
        updateItems(planItems.filter(item => item.id !== id));
    };

    const addItem = (topic) => {
        if (planItems.some(i => i.id === topic.id)) return;
        updateItems([...planItems, { ...topic, done: false }]);
    };

    const clearDone = () => {
        updateItems(planItems.filter(i => !i.done));
    };

    const allTopics = useMemo(() => [...bookTopics, ...allItTopics], [bookTopics, allItTopics]);
    const notInPlan = useMemo(() => allTopics.filter(t => !planItems.some(p => p.id === t.id)), [allTopics, planItems]);

    const filteredPicker = useMemo(() => {
        let list = notInPlan;
        if (pickerFilter === 'book') list = list.filter(t => t.type === 'book');
        if (pickerFilter === 'it') list = list.filter(t => t.type === 'it');
        if (pickerSearch.trim()) {
            const q = pickerSearch.toLowerCase();
            list = list.filter(t => t.title.toLowerCase().includes(q) || t.subtitle?.toLowerCase().includes(q));
        }
        return list;
    }, [notInPlan, pickerFilter, pickerSearch]);

    const getDetailLink = (item) => {
        if (item.type === 'book') return `/cj/book/${item.bookId}`;
        if (item.type === 'it') return `/it/question/${item.questionId}`;
        return '#';
    };

    const goAutoscroll = (item) => {
        if (item.type === 'book') {
            navigate('/autoscroll', { state: { preselect: { type: 'book', bookId: item.bookId } } });
        } else {
            navigate('/autoscroll', { state: { preselect: { type: 'it', questionId: item.questionId } } });
        }
    };

    const goExam = (item) => {
        if (item.type === 'book') {
            navigate('/exam-practice', { state: { preselect: { type: 'cj', bookId: item.bookId } } });
        } else {
            navigate('/exam-practice', { state: { preselect: { type: 'it', questionId: item.questionId } } });
        }
    };

    const priorityDot = (id) => {
        const p = priorities[id] || 'medium';
        const colors = { high: 'bg-red-400', medium: 'bg-yellow-400', low: 'bg-green-400', skip: 'bg-terminal-border/30' };
        return <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors[p]}`} />;
    };

    const allGroupsSelected = focusGroups.size === PLAN_GROUPS.length;

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <p className="text-xs text-terminal-text/40 font-mono capitalize">{formatTodayDate()}</p>
                    {totalCount > 0 && (
                        <p className="text-[10px] text-terminal-text/30 font-mono mt-0.5">
                            {doneCount}/{totalCount} splněno
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {doneCount > 0 && (
                        <button
                            onClick={clearDone}
                            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-terminal-text/40 border border-terminal-border/20 rounded hover:text-terminal-text/60 hover:border-terminal-border/40 transition-all"
                        >
                            <FaTrash className="text-[8px]" /> Smazat hotové
                        </button>
                    )}
                    <button
                        onClick={() => setShowFocusFilter(v => !v)}
                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono rounded border transition-all ${
                            allGroupsSelected
                                ? 'border-terminal-border/20 text-terminal-text/40 hover:border-terminal-border/40'
                                : 'bg-terminal-accent/10 border-terminal-accent/30 text-terminal-accent'
                        }`}
                        title="Zaměření generátoru"
                    >
                        🎯 {allGroupsSelected ? 'Vše' : `${focusGroups.size}/${PLAN_GROUPS.length}`}
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20 rounded hover:bg-terminal-accent/20 transition-all"
                    >
                        <FaRedo className="text-[10px]" /> {planItems.length === 0 ? 'Vygenerovat' : 'Nový plán'}
                    </button>
                </div>
            </div>

            {/* Focus filter panel */}
            {showFocusFilter && (
                <div className="terminal-card space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-wider">Zaměření generátoru</span>
                        <button
                            onClick={() => setFocusGroups(allGroupsSelected ? new Set() : new Set(PLAN_GROUPS.map(g => g.key)))}
                            className="text-[10px] font-mono text-terminal-accent/60 hover:text-terminal-accent transition-colors"
                        >
                            {allGroupsSelected ? 'Odznačit vše' : 'Vybrat vše'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {PLAN_GROUPS.map(g => (
                            <button
                                key={g.key}
                                onClick={() => toggleFocusGroup(g.key)}
                                className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-all ${
                                    focusGroups.has(g.key)
                                        ? 'bg-terminal-accent/15 border-terminal-accent/40 text-terminal-accent'
                                        : 'bg-transparent border-terminal-border/20 text-terminal-text/30 hover:border-terminal-border/40'
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-terminal-text/20 font-mono">Ovlivní jen generování — ručně přidat lze cokoli</p>
                </div>
            )}

            {/* Progress bar */}
            {totalCount > 0 && (
                <div className="w-full h-1 bg-terminal-border/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-terminal-accent transition-all duration-500 rounded-full"
                        style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                    />
                </div>
            )}

            {/* Empty state */}
            {planItems.length === 0 && (
                <div className="terminal-card text-center py-10">
                    <p className="text-terminal-text/30 text-sm font-mono">Žádné úkoly na dnes</p>
                    <p className="text-terminal-text/20 text-xs font-mono mt-1">Klikni "Vygenerovat" nebo přidej témata ručně</p>
                </div>
            )}

            {/* Plan list */}
            {planItems.length > 0 && (
                <div className="terminal-card p-0 overflow-hidden divide-y divide-terminal-border/10">
                    {planItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex items-center gap-2 px-3 py-3 group transition-colors ${item.done ? 'opacity-50' : 'hover:bg-terminal-dim/30'}`}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleDone(item.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                                    item.done
                                        ? 'bg-terminal-accent/20 border-terminal-accent/50'
                                        : 'border-terminal-border/40 hover:border-terminal-accent/50'
                                }`}
                            >
                                {item.done && <FaCheck className="text-[9px] text-terminal-accent" />}
                            </button>

                            {/* Priority dot */}
                            {priorityDot(item.id)}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-mono truncate ${item.done ? 'line-through text-terminal-text/30' : 'text-terminal-text/80'}`}>
                                    {item.title}
                                </p>
                                <p className="text-[10px] text-terminal-text/30 font-mono truncate">{item.subtitle}</p>
                            </div>

                            {/* Action buttons — show on hover */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => navigate(getDetailLink(item))}
                                    className="px-1.5 py-1 text-[9px] font-mono rounded text-terminal-text/40 hover:text-terminal-accent hover:bg-terminal-accent/10 transition-all"
                                    title="Detail"
                                >📖</button>
                                <button
                                    onClick={() => goAutoscroll(item)}
                                    className="px-1.5 py-1 text-[9px] font-mono rounded text-terminal-text/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                                    title="Autoscroll"
                                >📜</button>
                                <button
                                    onClick={() => goExam(item)}
                                    className="px-1.5 py-1 text-[9px] font-mono rounded text-terminal-text/40 hover:text-purple-400 hover:bg-purple-400/10 transition-all"
                                    title="Zkouška nanečisto"
                                >🎲</button>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="px-1.5 py-1 text-[9px] font-mono rounded text-terminal-text/20 hover:text-red-400 hover:bg-red-400/10 transition-all ml-1"
                                    title="Odebrat"
                                ><FaMinus /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add topic button */}
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 text-xs font-mono text-terminal-text/40 hover:text-terminal-accent transition-colors"
            >
                <FaPlus className="text-[10px]" />
                {showPicker ? 'Zavřít výběr' : 'Přidat téma ručně'}
            </button>

            {/* Topic picker */}
            {showPicker && (
                <div className="terminal-card space-y-3">
                    <div className="flex gap-2 items-center flex-wrap">
                        <input
                            type="text"
                            placeholder="Hledat..."
                            value={pickerSearch}
                            onChange={e => setPickerSearch(e.target.value)}
                            className="flex-1 min-w-0 bg-terminal-dim border border-terminal-border/30 text-terminal-text text-xs px-2 py-1.5 rounded font-mono placeholder-terminal-text/20 focus:outline-none focus:border-terminal-accent/50"
                        />
                        {['all', 'book', 'it'].map(f => (
                            <button
                                key={f}
                                onClick={() => setPickerFilter(f)}
                                className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${
                                    pickerFilter === f
                                        ? 'bg-terminal-accent/15 border-terminal-accent/30 text-terminal-accent'
                                        : 'border-terminal-border/20 text-terminal-text/40 hover:border-terminal-border/40'
                                }`}
                            >
                                {f === 'all' ? 'Vše' : f === 'book' ? '📚 Knihy' : '💻 IT'}
                            </button>
                        ))}
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                        {filteredPicker.length === 0 && (
                            <p className="text-xs text-terminal-text/30 font-mono py-2 text-center">Nic nenalezeno</p>
                        )}
                        {filteredPicker.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => addItem(topic)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-terminal-dim/60 transition-colors text-left"
                            >
                                {priorityDot(topic.id)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-mono text-terminal-text/70 truncate">{topic.title}</p>
                                    <p className="text-[10px] text-terminal-text/30 font-mono truncate">{topic.subtitle}</p>
                                </div>
                                <FaPlus className="text-[9px] text-terminal-accent/50 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};



const StudySchedulerPage = () => {
    const {
        settings, updateSettings, sessions,
        getStats, getNextSession,
    } = useStudyScheduler();

    const [activeTab, setActiveTab] = useState('plan');

    const stats = getStats();
    const nextSession = getNextSession();

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
                title: q.question || `Otázka ${q.id}`,
                subtitle: `${g.label.split(' — ')[0]} #${q.id}`,
                type: 'it',
                questionId: q.id,
            })),
        }));
    }, []);

    const allItTopics = useMemo(() => questionGroups.flatMap(g => g.topics), [questionGroups]);

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
                    { id: 'plan', label: 'Úkoly', icon: FaCheck },
                    { id: 'schedule', label: 'Sessions', icon: FaClock },
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

            {/* PLAN TAB */}
            {activeTab === 'plan' && (
                <DailyPlanTab
                    bookTopics={bookTopics}
                    allItTopics={allItTopics}
                    priorities={settings.priorities}
                    questionGroups={questionGroups}
                />
            )}

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
