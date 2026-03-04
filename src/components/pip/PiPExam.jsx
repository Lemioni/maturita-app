import React, { useState, useCallback, useMemo } from 'react';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';
import MarkdownRenderer from '../common/MarkdownRenderer';

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
        width: '100%', height: '140px', background: 'rgba(10,10,20,0.8)',
        border: '1px solid rgba(139,92,246,0.15)', borderRadius: '6px',
        color: '#e0e0e0', fontSize: '11px', padding: '8px', resize: 'none',
        fontFamily: 'monospace', lineHeight: '1.5', outline: 'none',
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
        borderRadius: '6px', padding: '10px', maxHeight: '200px', overflowY: 'auto',
        fontSize: '11px', color: 'rgba(224,224,224,0.7)', lineHeight: '1.6',
        whiteSpace: 'pre-wrap', filter: revealed ? 'none' : 'blur(6px)',
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
        <div>
            <div style={s.controlRow}>
                <button style={s.smallBtn} onClick={() => setPhase('select')}>← Zpět</button>
                <button style={s.smallBtn} onClick={draw}>🎲 Další</button>
            </div>

            <div style={s.questionBox}>
                <div style={s.badge(question.type)}>{question.type === 'it' ? 'IT' : 'ČJ'}</div>
                <div style={s.title}>{title}</div>
                <div style={s.subtitle}>{sub}</div>
            </div>

            <div style={s.sectionLabel}>Poznámky</div>
            <textarea style={s.notepad} value={notepad} onChange={e => setNotepad(e.target.value)}
                placeholder="Piš si poznámky..." spellCheck={false} />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                <button style={s.revealBtn(revealed)} onClick={() => setRevealed(r => !r)}>
                    {revealed ? '🙈 Skrýt materiál' : '👁 Odkrýt materiál'}
                </button>
            </div>

            <div style={s.materialBox(revealed)}>
                <MarkdownRenderer content={getMaterial(question)} />
            </div>
        </div>
    );
};

export default PiPExam;
