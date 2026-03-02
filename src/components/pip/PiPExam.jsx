import React, { useState, useCallback, useMemo } from 'react';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';

const PSI_IDS = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

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
    if (q.type === 'it') return q.data.compactContent || q.data.answer || '';
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
                <div style={s.sectionLabel}>Zdroj otázek</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {[
                        { key: 'it', label: '💻 IT', count: itQuestions.questions.filter(q => !PSI_IDS.has(q.id)).length },
                        { key: 'psi', label: '🌐 PSI', count: itQuestions.questions.filter(q => PSI_IDS.has(q.id)).length },
                        { key: 'cj', label: '📚 Knihy', count: cjBooks.books.length },
                    ].map(src => (
                        <button key={src.key} style={s.selectBtn(sources[src.key])}
                            onClick={() => setSources(p => ({ ...p, [src.key]: !p[src.key] }))}>
                            {src.label} ({src.count})
                        </button>
                    ))}
                </div>
                <button style={{ ...s.drawBtn, opacity: pool.length === 0 ? 0.3 : 1 }}
                    onClick={draw} disabled={pool.length === 0}>
                    🎲 Losovat ({pool.length})
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
                {getMaterial(question)}
            </div>
        </div>
    );
};

export default PiPExam;
