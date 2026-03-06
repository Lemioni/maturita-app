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
    if (a.plot) p.push(`📖 Děj\n${a.plot}\n`);
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
        // Replace literal \n sequences (stored as backslash-n in JSON) with real newlines
        const excerptText = a.excerpt.text.replace(/\\n/g, '\n');
        p.push(`📜 Ukázka\n"${excerptText}"`);
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
        if (a.authorContext?.otherWorks?.length) p.push('Další díla: ' + a.authorContext.otherWorks.filter(Boolean).map(w => typeof w === 'string' ? w : w?.title || '?').join(', '));
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
const SELECTION_STORAGE_KEY = 'pip-autoscroll-selected';

// ── Theme ──
const _A = '#8b5cf6';
const _TX = '#e0e0e0';
const _TM = 'rgba(224,224,224,0.4)';
const _TD = 'rgba(224,224,224,0.2)';
const _B = 'rgba(255,255,255,0.06)';

const PiPAutoscroll = () => {
    const [filter, setFilter] = useState('cj');
    const [selected, setSelected] = useState(() => {
        try {
            const stored = localStorage.getItem(SELECTION_STORAGE_KEY);
            if (stored) {
                const arr = JSON.parse(stored);
                if (Array.isArray(arr) && arr.length > 0) return new Set(arr);
            }
        } catch {}
        return new Set(CJ_ITEMS.map(i => i.id));
    });
    const [phase, setPhase] = useState('select');
    const [playing, setPlaying] = useState(false);
    const [speedIdx, setSpeedIdx] = useState(5); // default 1×
    const [loop, setLoop] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const scrollRef = useRef(null);
    const intervalRef = useRef(null);
    const scrollAccRef = useRef(0);

    // Persist selection to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify([...selected]));
        } catch {}
    }, [selected]);

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

    // Build concatenated content from all selected items with separators
    const combinedContent = useMemo(() => {
        if (phase !== 'play' || playlist.length === 0) return '';
        return playlist.map((item, i) => {
            const separator = i > 0 ? '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' : '';
            const header = `▸ ${item.title}${item.subtitle ? ` — ${item.subtitle}` : ''}\n\n`;
            return separator + header + item.content;
        }).join('\n');
    }, [playlist, phase]);

    const startPlaying = () => {
        const list = filteredItems.filter(i => selected.has(i.id));
        if (list.length === 0) return;
        setPlaylist(list);
        setPhase('play');
        setPlaying(true);
    };

    const goBack = () => {
        setPlaying(false);
        setPhase('select');
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Auto-scroll
    useEffect(() => {
        if (!playing || phase !== 'play') return;
        scrollAccRef.current = 0;
        intervalRef.current = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;
            scrollAccRef.current += SPEEDS[speedIdx];
            const step = Math.floor(scrollAccRef.current);
            if (step > 0) {
                el.scrollTop += step;
                scrollAccRef.current -= step;
            }
            // Reached the end
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
                if (loop) {
                    el.scrollTop = 0;
                } else {
                    setPlaying(false);
                }
            }
        }, 50);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing, speedIdx, phase, loop]);

    // ═══ SELECTION ═══
    if (phase === 'select') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {/* Tab bar + counter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', borderBottom: `1px solid ${_B}`, flexShrink: 0 }}>
                    {[
                        { key: 'cj', label: 'Knihy' },
                        { key: 'it', label: 'IT' },
                        { key: 'all', label: 'Vše' },
                    ].map(f => (
                        <button key={f.key} onClick={() => handleFilterChange(f.key)}
                            style={{
                                padding: '6px 0', border: 'none',
                                borderBottom: `2px solid ${filter === f.key ? _A : 'transparent'}`,
                                background: 'transparent',
                                fontSize: '11px', fontWeight: filter === f.key ? '600' : '400',
                                color: filter === f.key ? _TX : _TM,
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >{f.label}</button>
                    ))}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: _TD, paddingBottom: '6px' }}>
                        {selectedCount}/{filteredItems.length}
                    </span>
                </div>

                {/* Ghost select links */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '6px', flexShrink: 0 }}>
                    <button onClick={selectAll} style={_ghost}>vše</button>
                    <span style={{ color: _TD, fontSize: '10px' }}>·</span>
                    <button onClick={selectNone} style={_ghost}>nic</button>
                </div>

                {/* Item list */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, marginBottom: '8px' }}>
                    {filteredItems.map(item => {
                        const on = selected.has(item.id);
                        return (
                            <button key={item.id} onClick={() => toggleItem(item.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '5px 2px', border: 'none',
                                    borderBottom: `1px solid ${_B}`,
                                    background: 'transparent',
                                    cursor: 'pointer', textAlign: 'left', width: '100%',
                                }}
                            >
                                <div style={{
                                    width: '12px', height: '12px', borderRadius: '2px', flexShrink: 0,
                                    border: `1.5px solid ${on ? _A : 'rgba(255,255,255,0.1)'}`,
                                    background: on ? _A : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s',
                                }}>
                                    {on && <span style={{ color: '#fff', fontSize: '7px', fontWeight: '900' }}>✓</span>}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '12px', fontWeight: '500',
                                        color: on ? _TX : _TM,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>{item.title}</div>
                                    {item.subtitle && (
                                        <div style={{
                                            fontSize: '10px', color: _TD,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{item.subtitle}</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Start button */}
                <button onClick={startPlaying} disabled={selectedCount === 0}
                    style={{
                        width: '100%', padding: '10px',
                        border: `1px solid ${selectedCount === 0 ? _B : _A}`,
                        borderRadius: '2px',
                        background: selectedCount === 0 ? 'transparent' : 'rgba(139,92,246,0.1)',
                        color: selectedCount === 0 ? _TD : _TX,
                        fontSize: '11px', fontWeight: '500',
                        cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s', flexShrink: 0,
                    }}
                >Spustit · {selectedCount}</button>
            </div>
        );
    }

    // ═══ PLAYER ═══
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '6px', flexShrink: 0 }}>
                <_MBtn onClick={goBack}>←</_MBtn>
                <_MBtn onClick={() => setPlaying(!playing)} accent>
                    {playing ? '⏸' : '▶'}
                </_MBtn>
                <_MBtn onClick={() => setLoop(!loop)} active={loop}>🔁</_MBtn>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: '10px', color: _TD }}>{playlist.length} položek</span>
                <_MBtn onClick={() => setSpeedIdx(i => (i + 1) % SPEEDS.length)}>
                    {SPEEDS[speedIdx]}×
                </_MBtn>
            </div>

            {/* Scrollable concatenated content */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
                <div style={{
                    fontSize: '11px', color: 'rgba(224,224,224,0.7)', lineHeight: '1.7',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                    {combinedContent}
                    <div style={{ height: '60px' }} />
                </div>
            </div>
        </div>
    );
};

// ── Helpers ──
const _MBtn = ({ children, onClick, active, accent }) => (
    <button onClick={onClick} style={{
        padding: '5px 8px', border: `1px solid ${active ? _A : accent ? _A : _B}`,
        borderRadius: '2px',
        background: active ? 'rgba(139,92,246,0.15)' : accent ? 'rgba(139,92,246,0.1)' : 'transparent',
        color: active || accent ? _A : _TM,
        fontSize: '12px', cursor: 'pointer',
        fontWeight: active ? '600' : '400',
        minWidth: '30px', minHeight: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
);

const _ghost = {
    padding: 0, border: 'none', background: 'transparent',
    color: _TD, fontSize: '10px', cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.08)',
    textUnderlineOffset: '2px',
};

export default PiPAutoscroll;
