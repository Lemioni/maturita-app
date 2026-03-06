import React, { useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';

// Compact PiP markdown components — much tighter than full-page MarkdownRenderer
const pipMd = {
    h1: ({ children }) => <h1 style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', margin: '6px 0 2px', paddingBottom: '2px', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', margin: '5px 0 2px', paddingBottom: '1px', borderBottom: '1px solid rgba(251,191,36,0.15)' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#fcd34d', margin: '4px 0 1px' }}>{children}</h3>,
    h4: ({ children }) => <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(252,211,77,0.85)', margin: '3px 0 1px' }}>{children}</h4>,
    p: ({ children }) => <p style={{ fontSize: '10px', lineHeight: '1.5', color: 'rgba(224,224,224,0.75)', margin: '0 0 3px' }}>{children}</p>,
    strong: ({ children }) => <strong style={{ color: '#fcd34d', fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em style={{ color: 'rgba(252,211,77,0.7)', fontStyle: 'italic' }}>{children}</em>,
    li: ({ children }) => <li style={{ fontSize: '10px', color: 'rgba(224,224,224,0.75)', marginBottom: '1px', marginLeft: '12px', listStyleType: 'disc', lineHeight: '1.4' }}>{children}</li>,
    ul: ({ children }) => <ul style={{ margin: '0 0 3px' }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ margin: '0 0 3px', marginLeft: '12px', listStyleType: 'decimal' }}>{children}</ol>,
    code: ({ inline, children }) => inline
        ? <code style={{ color: '#fcd34d', background: 'rgba(251,191,36,0.1)', padding: '0 3px', borderRadius: '2px', fontSize: '9px' }}>{children}</code>
        : <pre style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(251,191,36,0.15)', padding: '4px', borderRadius: '3px', fontSize: '9px', color: 'rgba(224,224,224,0.6)', overflowX: 'auto', margin: '2px 0' }}><code>{children}</code></pre>,
    table: ({ children }) => <table style={{ width: '100%', fontSize: '10px', margin: '2px 0', borderCollapse: 'collapse' }}>{children}</table>,
    th: ({ children }) => <th style={{ textAlign: 'left', color: '#fbbf24', fontSize: '9px', borderBottom: '1px solid rgba(251,191,36,0.2)', padding: '2px 4px' }}>{children}</th>,
    td: ({ children }) => <td style={{ color: 'rgba(224,224,224,0.7)', padding: '2px 4px', borderBottom: '1px solid rgba(100,100,100,0.2)', fontSize: '10px' }}>{children}</td>,
    blockquote: ({ children }) => <blockquote style={{ borderLeft: '2px solid rgba(251,191,36,0.4)', paddingLeft: '6px', margin: '2px 0', color: 'rgba(224,224,224,0.6)', fontStyle: 'italic' }}>{children}</blockquote>,
    hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(100,100,100,0.3)', margin: '4px 0' }} />,
};

const PSI_IDS = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

const compactContentToText = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (!Array.isArray(content.sections)) return '';

    const lines = [];

    content.sections.forEach((section) => {
        if (!section || typeof section !== 'object') return;

        if (section.title) lines.push(String(section.title));
        if (section.text) lines.push(String(section.text));

        if (Array.isArray(section.items)) {
            section.items.forEach((item) => {
                if (!item) return;
                if (typeof item === 'string') {
                    lines.push(`• ${item}`);
                    return;
                }
                if (typeof item === 'object') {
                    if (item.term && item.definition) {
                        lines.push(`• ${item.term} – ${item.definition}`);
                        return;
                    }
                    if (item.term) {
                        lines.push(`• ${item.term}`);
                    }
                }
            });
        }

        if (Array.isArray(section.numberedItems)) {
            section.numberedItems.forEach((item, index) => {
                if (!item) return;
                lines.push(`${index + 1}. ${typeof item === 'string' ? item : String(item)}`);
            });
        }

        if (Array.isArray(section.subsections)) {
            section.subsections.forEach((subsection) => {
                if (!subsection || typeof subsection !== 'object') return;
                if (subsection.title) lines.push(subsection.title);
                if (subsection.text) lines.push(subsection.text);

                if (Array.isArray(subsection.items)) {
                    subsection.items.forEach((item) => {
                        if (!item) return;
                        if (typeof item === 'string') {
                            lines.push(`• ${item}`);
                            return;
                        }
                        if (typeof item === 'object') {
                            if (item.term && item.definition) {
                                lines.push(`• ${item.term} – ${item.definition}`);
                                return;
                            }
                            if (item.term) {
                                lines.push(`• ${item.term}`);
                            }
                        }
                    });
                }

                if (Array.isArray(subsection.numberedItems)) {
                    subsection.numberedItems.forEach((item, index) => {
                        if (!item) return;
                        lines.push(`${index + 1}. ${typeof item === 'string' ? item : String(item)}`);
                    });
                }
            });
        }

        lines.push('');
    });

    return lines.join('\n').trim();
};

const s = {
    selectBtn: (active) => ({
        padding: '8px 12px', border: '1px solid',
        borderColor: active ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.15)',
        borderRadius: '6px', background: active ? 'rgba(139,92,246,0.2)' : 'transparent',
        color: active ? '#a78bfa' : 'rgba(224,224,224,0.5)',
        fontSize: '11px', fontWeight: active ? '700' : '400', cursor: 'pointer', transition: 'all 0.15s',
    }),
    drawBtn: {
        width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        marginTop: '10px', transition: 'opacity 0.15s',
    },
    questionBox: {
        background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '8px', padding: '12px', marginBottom: '10px',
    },
    badge: (type) => ({
        display: 'inline-block', fontSize: '9px', padding: '2px 8px', borderRadius: '10px',
        fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
        background: type === 'it' ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)',
        color: type === 'it' ? '#60a5fa' : '#f472b6',
    }),
    title: { fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '4px' },
    subtitle: { fontSize: '10px', color: 'rgba(224,224,224,0.4)' },
    notepad: {
        width: '100%', flex: '0 0 auto', height: '100px',
        background: 'rgba(10,10,20,0.8)',
        border: '1px solid rgba(139,92,246,0.15)', borderRadius: '4px',
        color: '#e0e0e0', fontSize: '10px', padding: '6px', resize: 'vertical',
        fontFamily: 'monospace', lineHeight: '1.4', outline: 'none',
        minHeight: '40px', maxHeight: '60vh',
    },
    revealBtn: (revealed) => ({
        padding: '8px 14px', border: '1px solid',
        borderColor: revealed ? 'rgba(34,197,94,0.4)' : 'rgba(251,191,36,0.4)',
        borderRadius: '6px', background: revealed ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)',
        color: revealed ? '#4ade80' : '#fbbf24',
        fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
    }),
    materialBox: (revealed) => ({
        background: 'rgba(15,15,25,0.8)', border: '1px solid rgba(139,92,246,0.1)',
        borderRadius: '4px', padding: '8px', flex: 1, minHeight: 0, overflowY: 'auto',
        filter: revealed ? 'none' : 'blur(6px)',
        userSelect: revealed ? 'auto' : 'none', transition: 'filter 0.3s',
    }),
    controlRow: { display: 'flex', gap: '6px', marginBottom: '8px' },
    smallBtn: {
        padding: '6px 10px', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '4px',
        background: 'transparent', color: 'rgba(224,224,224,0.5)', fontSize: '11px', cursor: 'pointer',
    },
    sectionLabel: { fontSize: '10px', color: 'rgba(224,224,224,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '8px' },
};

const getMaterial = (q) => {
    if (!q) return '';
    if (q.type === 'it') {
        if (typeof q.data.answer === 'string' && q.data.answer.trim()) return q.data.answer;

        const compactText = compactContentToText(q.data.compactContent);
        if (compactText) return compactText;

        if (typeof q.data.compactContent === 'string') return q.data.compactContent;
        return '';
    }
    const b = q.data;
    const a = b.analysis;
    if (!a) return 'Žádná analýza.';
    const parts = [`${b.title} – ${b.author}\n`];
    if (b.genre) parts.push(`Žánr: ${b.genre} | Forma: ${b.literaryForm}`);
    if (a.plot) parts.push(`\nDěj:\n${typeof a.plot === 'string' ? a.plot : ''}`);
    if (a.themes?.main) parts.push(`\nTéma: ${a.themes.main}`);
    if (a.setting) parts.push(`Místo: ${a.setting.place} | Čas: ${a.setting.time}`);
    if (a.narration?.narrator) parts.push(`Vypravěč: ${a.narration.narrator}`);
    if (a.literaryContext?.movement) parts.push(`Směr: ${a.literaryContext.movement}`);
    return parts.join('\n');
};

const PiPExam = () => {
    const [phase, setPhase] = useState('select');
    const [sources, setSources] = useState({ it: true, psi: true, cj: true });
    const [question, setQuestion] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [notepad, setNotepad] = useState('');

    const pool = useMemo(() => {
        const items = [];
        if (sources.it) {
            itQuestions.questions.filter(q => !PSI_IDS.has(q.id)).forEach(q => items.push({ type: 'it', data: q }));
        }
        if (sources.psi) {
            itQuestions.questions.filter(q => PSI_IDS.has(q.id)).forEach(q => items.push({ type: 'it', data: q }));
        }
        if (sources.cj) {
            cjBooks.books.forEach(b => items.push({ type: 'cj', data: b }));
        }
        return items;
    }, [sources]);

    const draw = useCallback(() => {
        if (pool.length === 0) return;
        const item = pool[Math.floor(Math.random() * pool.length)];
        setQuestion(item);
        setRevealed(false);
        setNotepad('');
        setPhase('practice');
    }, [pool]);

    if (phase === 'select') {
        return (
            <div>
                <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.45)', marginBottom: '10px', textAlign: 'center', letterSpacing: '0.5px' }}>
                    Vyber zdroje a losuj otázku
                </div>

                {/* Source cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                    {[
                        { key: 'it', emoji: '💻', label: 'IT Otázky', count: itQuestions.questions.filter(q => !PSI_IDS.has(q.id)).length, desc: 'Hardware, software, sítě…' },
                        { key: 'psi', emoji: '🌐', label: 'PSI Otázky', count: itQuestions.questions.filter(q => PSI_IDS.has(q.id)).length, desc: 'Programování, databáze…' },
                        { key: 'cj', emoji: '📚', label: 'Knihy', count: cjBooks.books.length, desc: 'Povinná četba + rozbory' },
                    ].map(src => {
                        const on = sources[src.key];
                        return (
                            <button key={src.key}
                                onClick={() => setSources(p => ({ ...p, [src.key]: !p[src.key] }))}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 12px', border: '1px solid',
                                    borderColor: on ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.08)',
                                    borderRadius: '10px',
                                    background: on ? 'rgba(139,92,246,0.08)' : 'rgba(15,15,25,0.5)',
                                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                                }}
                            >
                                <span style={{ fontSize: '22px', filter: on ? 'none' : 'grayscale(0.8) opacity(0.5)', transition: 'filter 0.2s' }}>{src.emoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: on ? '#e0e0e0' : 'rgba(224,224,224,0.4)', transition: 'color 0.15s' }}>
                                        {src.label}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'rgba(224,224,224,0.3)', marginTop: '1px' }}>{src.desc}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    <span style={{
                                        fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px',
                                        background: on ? 'rgba(139,92,246,0.2)' : 'rgba(224,224,224,0.05)',
                                        color: on ? '#c4b5fd' : 'rgba(224,224,224,0.25)', transition: 'all 0.15s',
                                    }}>{src.count}</span>
                                    <div style={{
                                        width: '34px', height: '18px', borderRadius: '9px',
                                        background: on ? 'rgba(124,58,237,0.8)' : 'rgba(224,224,224,0.1)',
                                        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                                    }}>
                                        <div style={{
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            background: on ? '#fff' : 'rgba(224,224,224,0.3)',
                                            position: 'absolute', top: '2px',
                                            left: on ? '18px' : '2px', transition: 'left 0.2s, background 0.2s',
                                        }} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Pool counter */}
                <div style={{
                    textAlign: 'center', padding: '14px 12px',
                    background: 'rgba(139,92,246,0.04)', borderRadius: '10px',
                    border: '1px solid rgba(139,92,246,0.1)', marginBottom: '10px',
                }}>
                    <div style={{
                        fontSize: '30px', fontWeight: '800', letterSpacing: '-1px',
                        color: pool.length > 0 ? '#a78bfa' : 'rgba(224,224,224,0.12)',
                        lineHeight: '1', transition: 'color 0.2s',
                    }}>{pool.length}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(224,224,224,0.35)', marginTop: '4px', letterSpacing: '0.3px' }}>
                        otázek v losovacím fondu
                    </div>
                </div>

                <button style={{ ...s.drawBtn, opacity: pool.length === 0 ? 0.3 : 1 }}
                    onClick={draw} disabled={pool.length === 0}>
                    🎲 Losovat otázku
                </button>
            </div>
        );
    }

    const title = question.type === 'it'
        ? question.data.question
        : `${question.data.title} – ${question.data.author}`;
    const sub = question.type === 'it'
        ? `${PSI_IDS.has(question.data.id) ? 'PSI' : 'IT'} · Otázka ${question.data.id}`
        : `${question.data.period} · Kniha ${question.data.id}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* Controls + question info in one compact row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexShrink: 0 }}>
                <button style={s.smallBtn} onClick={() => setPhase('select')}>← Zpět</button>
                <button style={s.smallBtn} onClick={draw}>🎲 Další</button>
                <div style={{ flex: 1, minWidth: 0, marginLeft: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                            fontSize: '8px', padding: '1px 5px', borderRadius: '6px',
                            fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0,
                            background: question.type === 'it' ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)',
                            color: question.type === 'it' ? '#60a5fa' : '#f472b6',
                        }}>{question.type === 'it' ? 'IT' : 'ČJ'}</span>
                        <span style={{
                            fontSize: '11px', fontWeight: '600', color: '#e0e0e0',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{title}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(224,224,224,0.3)', marginTop: '1px' }}>{sub}</div>
                </div>
            </div>

            <div style={{ ...s.sectionLabel, flexShrink: 0, marginTop: '4px' }}>Poznámky</div>
            <textarea style={s.notepad} value={notepad} onChange={e => setNotepad(e.target.value)}
                placeholder="Piš si poznámky..." spellCheck={false} />

            <div style={{ ...s.materialBox(revealed), cursor: 'pointer' }} onClick={() => setRevealed(r => !r)}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={pipMd}>
                    {getMaterial(question) || ''}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default PiPExam;
