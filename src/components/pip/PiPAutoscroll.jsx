import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import itQuestions from '../../data/it-questions.json';
import cjBooks from '../../data/cj-books.json';

// ── Build rich content from book analysis (matches main site) ──
const buildBookContent = (b) => {
    const a = b.analysis;
    if (!a) return `${b.title} — ${b.author}\nŽádná analýza.`;
    const p = [];
    p.push(`📚 ${b.title} — ${b.author}`);
    p.push(`Žánr: ${b.genre || '?'} · Druh: ${b.literaryForm || '?'} · Rok: ${b.year || '?'} · Období: ${b.period || '?'}`);
    p.push('');
    if (a.titleAnalysis) p.push(`📌 Analýza názvu\n${a.titleAnalysis}\n`);
    if (a.themes) {
        p.push(`💡 Téma a motivy\nHlavní téma: ${a.themes.main}`);
        if (a.themes.motifs?.length) p.push(`Motivy: ${a.themes.motifs.join(', ')}`);
        p.push('');
    }
    if (a.setting) p.push(`🌍 Časoprostor\nMísto: ${a.setting.place}\nČas: ${a.setting.time}\n`);
    if (a.composition) {
        const comp = [];
        if (a.composition.structure) comp.push(`Struktura: ${a.composition.structure}`);
        if (a.composition.timeline) comp.push(`Čas. postup: ${a.composition.timeline}`);
        if (comp.length) p.push(`🏗️ Kompozice\n${comp.join('\n')}\n`);
    }
    if (a.narration) p.push(`🎭 Vypravěč\nTyp: ${a.narration.narrator}\nStyl: ${a.narration.style}\n`);
    if (a.characters?.length) {
        p.push('👤 Postavy');
        a.characters.forEach(c => {
            const desc = c.description || (c.traits ? Object.entries(c.traits).map(([k, v]) => `${k}: ${v}`).join(', ') : '');
            p.push(`${c.isMain ? '★ ' : '• '}${c.name}: ${desc}`);
        });
        p.push('');
    }
    if (a.excerpt) {
        p.push(`📜 Ukázka\n"${a.excerpt.text}"`);
        if (a.excerpt.context) p.push(`Kontext: ${a.excerpt.context}`);
        p.push('');
    }
    if (a.languageDevices?.length) p.push(`✍️ Jazykové prostředky\n${a.languageDevices.map(d => `• ${d}`).join('\n')}\n`);
    if (a.literaryDevices?.length) {
        p.push('🎨 Tropy a figury');
        a.literaryDevices.forEach(d => p.push(`• ${d.name}: ${d.example}`));
        p.push('');
    }
    if (a.authorContext) {
        p.push('👤 Kontext autora');
        if (a.authorContext.bio) p.push(a.authorContext.bio);
        if (a.authorContext.shortBio) {
            p.push(a.authorContext.shortBio.name || '');
            if (a.authorContext.shortBio.info) p.push(a.authorContext.shortBio.info.join('\n'));
        }
        if (a.authorContext.otherWorks?.length) p.push('Další díla: ' + a.authorContext.otherWorks.map(w => w.title).join(', '));
        p.push('');
    }
    if (a.literaryContext) {
        p.push(`🌐 Literární kontext\nSměr: ${a.literaryContext.movement}`);
        if (a.literaryContext.description) p.push(a.literaryContext.description);
        if (a.literaryContext.otherAuthors?.length) p.push('Další autoři: ' + a.literaryContext.otherAuthors.map(au => `${au.name}${au.years ? ` (${au.years})` : ''}`).join(', '));
        p.push('');
    }
    return p.join('\n');
};

const buildITContent = (q) => q.compactContent || q.answer || '';

// ── All items ──  
const CJ_ITEMS = cjBooks.books.filter(b => b.analysis).map(b => ({
    id: `cj-${b.id}`, title: b.title, subtitle: b.author,
    content: buildBookContent(b), type: 'cj', num: b.id,
}));
const IT_ITEMS = (itQuestions?.questions || []).map(q => ({
    id: `it-${q.id}`, title: `Otázka ${q.id}`, subtitle: q.question || q.title || '',
    content: buildITContent(q), type: 'it', num: q.id,
}));
const ALL_ITEMS = [...CJ_ITEMS, ...IT_ITEMS];

const SPEEDS = [0.1, 0.2, 0.3, 0.5, 0.8, 1, 1.5];

const PiPAutoscroll = () => {
    const [filter, setFilter] = useState('cj');
    const [selected, setSelected] = useState(() => new Set(CJ_ITEMS.map(i => i.id)));
    const [phase, setPhase] = useState('select');
    const [playing, setPlaying] = useState(false);
    const [speedIdx, setSpeedIdx] = useState(5); // default 1×
    const [loop, setLoop] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const scrollRef = useRef(null);
    const intervalRef = useRef(null);

    const filteredItems = useMemo(() => {
        if (filter === 'cj') return CJ_ITEMS;
        if (filter === 'it') return IT_ITEMS;
        return ALL_ITEMS;
    }, [filter]);

    // When filter changes, select all of that filter
    const handleFilterChange = (f) => {
        setFilter(f);
        const items = f === 'cj' ? CJ_ITEMS : f === 'it' ? IT_ITEMS : ALL_ITEMS;
        setSelected(new Set(items.map(i => i.id)));
    };

    const selectedCount = useMemo(() => {
        return filteredItems.filter(i => selected.has(i.id)).length;
    }, [filteredItems, selected]);

    const toggleItem = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAll = () => setSelected(new Set(filteredItems.map(i => i.id)));
    const selectNone = () => {
        const idsToRemove = new Set(filteredItems.map(i => i.id));
        setSelected(prev => {
            const next = new Set(prev);
            idsToRemove.forEach(id => next.delete(id));
            return next;
        });
    };

    const startPlaying = () => {
        const list = filteredItems.filter(i => selected.has(i.id));
        if (list.length === 0) return;
        setPlaylist(list);
        setCurrentIdx(0);
        setPhase('play');
        setPlaying(true);
    };

    const goBack = () => {
        setPlaying(false);
        setPhase('select');
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Auto-scroll with auto-advance
    useEffect(() => {
        if (!playing || phase !== 'play') return;
        intervalRef.current = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;
            el.scrollTop += SPEEDS[speedIdx];
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
                if (currentIdx + 1 < playlist.length) {
                    setCurrentIdx(i => i + 1);
                } else if (loop) {
                    setCurrentIdx(0);
                } else {
                    setPlaying(false);
                }
            }
        }, 50);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing, speedIdx, phase, currentIdx, playlist.length, loop]);

    // Reset scroll on item change
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [currentIdx]);

    const currentItem = playlist[currentIdx] || null;

    // ═══ SELECTION ═══
    if (phase === 'select') {
        return (
            <div>
                {/* Filter tabs */}
                <div style={{
                    display: 'flex', gap: '4px', marginBottom: '8px',
                    padding: '3px', background: 'rgba(15,15,25,0.7)', borderRadius: '8px',
                }}>
                    {[
                        { key: 'cj', label: '📚 Knihy', count: CJ_ITEMS.length },
                        { key: 'it', label: '💻 IT', count: IT_ITEMS.length },
                        { key: 'all', label: 'Vše', count: ALL_ITEMS.length },
                    ].map(f => (
                        <button key={f.key} onClick={() => handleFilterChange(f.key)}
                            style={{
                                flex: 1, padding: '6px', border: 'none', borderRadius: '6px',
                                fontSize: '11px', fontWeight: filter === f.key ? '700' : '400',
                                background: filter === f.key ? 'rgba(139,92,246,0.2)' : 'transparent',
                                color: filter === f.key ? '#a78bfa' : 'rgba(224,224,224,0.4)',
                                cursor: 'pointer',
                            }}
                        >{f.label} ({f.count})</button>
                    ))}
                </div>

                {/* Select all/none */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                    <button onClick={selectAll} style={chipBtn}>✓ Vše</button>
                    <button onClick={selectNone} style={chipBtn}>✕ Nic</button>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(224,224,224,0.3)' }}>
                        {selectedCount} vybráno
                    </span>
                </div>

                {/* Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {filteredItems.map(item => {
                        const on = selected.has(item.id);
                        return (
                            <button key={item.id} onClick={() => toggleItem(item.id)}
                                style={{
                                    padding: '4px 10px', border: '1px solid',
                                    borderColor: on ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.1)',
                                    borderRadius: '14px',
                                    background: on ? 'rgba(139,92,246,0.15)' : 'transparent',
                                    color: on ? '#c4b5fd' : 'rgba(224,224,224,0.35)',
                                    fontSize: '11px', cursor: 'pointer',
                                    fontWeight: on ? '600' : '400', whiteSpace: 'nowrap',
                                }}
                            >
                                {item.type === 'cj' ? item.title : `IT ${item.num}`}
                            </button>
                        );
                    })}
                </div>

                {/* Start */}
                <button onClick={startPlaying} disabled={selectedCount === 0}
                    style={{
                        width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
                        background: selectedCount === 0 ? 'rgba(139,92,246,0.1)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                        color: selectedCount === 0 ? 'rgba(224,224,224,0.3)' : '#fff',
                        fontSize: '14px', fontWeight: '700',
                        cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                    }}
                >▶ Spustit ({selectedCount})</button>
            </div>
        );
    }

    // ═══ PLAYER ═══
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
            {/* Controls */}
            <div style={{
                display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap',
                padding: '6px', background: 'rgba(15,15,25,0.8)', borderRadius: '6px', marginBottom: '6px',
                flexShrink: 0,
            }}>
                <Btn onClick={goBack}>←</Btn>
                <Btn onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} title="Předchozí">⏮</Btn>
                <Btn active={playing} onClick={() => setPlaying(!playing)} style={{ fontSize: '14px', padding: '5px 12px' }}>
                    {playing ? '⏸' : '▶'}
                </Btn>
                <Btn onClick={() => setCurrentIdx(i => Math.min(playlist.length - 1, i + 1))} title="Další">⏭</Btn>
                <Btn active={loop} onClick={() => setLoop(!loop)} activeColor="green" title="Opakovat">🔁</Btn>
                <Btn onClick={() => setSpeedIdx(i => (i + 1) % SPEEDS.length)} style={{ marginLeft: 'auto', fontWeight: '600' }}>
                    {SPEEDS[speedIdx]}×
                </Btn>
            </div>

            {/* Item header */}
            {currentItem && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
                    padding: '6px 8px', background: 'rgba(20,20,35,0.7)', borderRadius: '6px',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: '9px', padding: '2px 6px', borderRadius: '8px', fontWeight: '600',
                        background: currentItem.type === 'it' ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)',
                        color: currentItem.type === 'it' ? '#60a5fa' : '#f472b6',
                    }}>{currentItem.type === 'it' ? 'IT' : 'ČJ'}</span>
                    <span style={{
                        fontSize: '12px', fontWeight: '600', color: '#a78bfa',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    }}>{currentItem.title}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(224,224,224,0.3)' }}>
                        {currentIdx + 1}/{playlist.length}
                    </span>
                </div>
            )}

            {/* Scrollable content */}
            <div ref={scrollRef} style={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px',
            }}>
                {currentItem && (
                    <div style={{
                        fontSize: '11px', color: 'rgba(224,224,224,0.75)', lineHeight: '1.7',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>
                        {currentItem.subtitle && (
                            <div style={{ fontSize: '10px', color: 'rgba(224,224,224,0.4)', marginBottom: '8px' }}>
                                {currentItem.subtitle}
                            </div>
                        )}
                        {currentItem.content}
                        {/* Extra space at end so auto-advance triggers */}
                        <div style={{ height: '60px' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Reusable button ──
const Btn = ({ children, active, activeColor, onClick, title, style: extraStyle }) => (
    <button onClick={onClick} title={title} style={{
        padding: '5px 8px', border: '1px solid',
        borderColor: active
            ? (activeColor === 'green' ? 'rgba(34,197,94,0.4)' : 'rgba(139,92,246,0.4)')
            : 'rgba(139,92,246,0.15)',
        borderRadius: '4px',
        background: active
            ? (activeColor === 'green' ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.2)')
            : 'transparent',
        color: active
            ? (activeColor === 'green' ? '#4ade80' : '#a78bfa')
            : 'rgba(224,224,224,0.5)',
        fontSize: '13px', cursor: 'pointer', fontWeight: active ? '700' : '400',
        ...extraStyle,
    }}>{children}</button>
);

const chipBtn = {
    padding: '4px 8px', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '4px',
    background: 'transparent', color: 'rgba(224,224,224,0.5)', fontSize: '10px', cursor: 'pointer',
};

export default PiPAutoscroll;
