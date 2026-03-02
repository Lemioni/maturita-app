import React, { useState, useEffect, useCallback } from 'react';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';

const STORAGE_KEY = 'maturita-srs';
const INTERVALS = [1, 3, 7, 14, 30];

const generateCards = () => {
    const cards = [];

    // CJ book cards
    cjBooks.books.forEach(b => {
        const a = b.analysis;
        if (!a) return;
        cards.push({ id: `${b.id}-author`, front: `Kdo napsal "${b.title}"?`, back: b.author, cat: 'cj' });
        if (b.genre) cards.push({ id: `${b.id}-genre`, front: `Žánr: "${b.title}"`, back: b.genre, cat: 'cj' });
        if (b.period) cards.push({ id: `${b.id}-period`, front: `Období: "${b.title}"`, back: b.period, cat: 'cj' });
        if (b.literaryForm) cards.push({ id: `${b.id}-form`, front: `Literární druh: "${b.title}"`, back: b.literaryForm, cat: 'cj' });
        if (a.narration?.narrator) cards.push({ id: `${b.id}-narrator`, front: `Typ vypravěče v "${b.title}"`, back: a.narration.narrator, cat: 'cj' });
        if (a.themes?.main) cards.push({ id: `${b.id}-theme`, front: `Hlavní téma: "${b.title}"`, back: a.themes.main, cat: 'cj' });
        if (a.literaryContext?.movement) cards.push({ id: `${b.id}-movement`, front: `Literární směr: "${b.title}"`, back: a.literaryContext.movement, cat: 'cj' });
        if (a.setting?.place) cards.push({ id: `${b.id}-place`, front: `Místo děje: "${b.title}"`, back: a.setting.place, cat: 'cj' });
        if (a.setting?.time) cards.push({ id: `${b.id}-time`, front: `Čas děje: "${b.title}"`, back: a.setting.time, cat: 'cj' });
        if (a.composition?.structure) cards.push({ id: `${b.id}-comp`, front: `Kompozice: "${b.title}"`, back: a.composition.structure, cat: 'cj' });
        // Characters
        if (a.characters?.length) {
            a.characters.slice(0, 3).forEach((c, i) => {
                if (c.name && (c.description || c.traits)) {
                    const desc = c.description || Object.values(c.traits || {}).join(', ');
                    cards.push({ id: `${b.id}-char-${i}`, front: `Kdo je ${c.name} v "${b.title}"?`, back: desc, cat: 'cj' });
                }
            });
        }
    });

    // IT question cards
    if (itQuestions?.questions) {
        itQuestions.questions.forEach(q => {
            // Title/question card
            if (q.question) {
                const headings = (q.answer || '').split('\n')
                    .filter(l => l.trim().startsWith('## ') || l.trim().startsWith('### '))
                    .map(l => l.replace(/^#{1,4}\s*/, '').trim())
                    .filter(h => h.length > 0 && h.length < 80)
                    .slice(0, 5);
                if (headings.length > 0) {
                    cards.push({
                        id: `it-${q.id}-topics`,
                        front: `Co zahrnuje IT otázka: "${q.question}"?`,
                        back: headings.join(', '),
                        cat: 'it',
                    });
                }
            }
        });
    }

    return cards;
};

const getStoredData = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};

const s = {
    card: {
        background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '8px', padding: '20px 16px', textAlign: 'center',
        minHeight: '180px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
    },
    label: { fontSize: '10px', color: 'rgba(224,224,224,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
    question: { fontSize: '15px', fontWeight: '600', color: '#e0e0e0', lineHeight: '1.5' },
    answer: { fontSize: '16px', fontWeight: '700', color: '#a78bfa', lineHeight: '1.5' },
    hint: { fontSize: '11px', color: 'rgba(224,224,224,0.3)', marginTop: '16px' },
    btnRow: { display: 'flex', gap: '8px', marginTop: '14px', width: '100%' },
    btnGreen: {
        flex: 1, padding: '10px', border: '1px solid rgba(34,197,94,0.4)',
        borderRadius: '6px', background: 'rgba(34,197,94,0.1)', color: '#4ade80',
        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
    },
    btnRed: {
        flex: 1, padding: '10px', border: '1px solid rgba(239,68,68,0.4)',
        borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#f87171',
        fontWeight: '700', fontSize: '13px', cursor: 'pointer',
    },
    progress: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'rgba(224,224,224,0.4)' },
    progressBar: { height: '3px', background: 'rgba(139,92,246,0.15)', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#8b5cf6', borderRadius: '2px', transition: 'width 0.3s ease' },
    catBadge: (cat) => ({
        display: 'inline-block', fontSize: '9px', padding: '1px 6px', borderRadius: '8px', marginLeft: '6px',
        background: cat === 'it' ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)',
        color: cat === 'it' ? '#60a5fa' : '#f472b6',
    }),
    doneBox: { textAlign: 'center', padding: '24px 16px' },
    retryBtn: {
        padding: '10px 24px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
        borderRadius: '6px', color: '#a78bfa', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
    },
};

const PiPFlashcards = () => {
    const [allCards] = useState(() => generateCards());
    const [dueCards, setDueCards] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [sessionDone, setSessionDone] = useState(false);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });

    const loadDue = useCallback(() => {
        const stored = getStoredData();
        const now = Date.now();
        const due = allCards.filter(c => {
            const d = stored[c.id];
            if (!d) return true;
            return now >= d.nextReview;
        });
        for (let i = due.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [due[i], due[j]] = [due[j], due[i]];
        }
        setDueCards(due.slice(0, 20));
        setCurrentIdx(0);
        setShowBack(false);
        setSessionDone(false);
        setStats({ correct: 0, wrong: 0 });
    }, [allCards]);

    useEffect(() => { loadDue(); }, [loadDue]);

    const handleAnswer = (correct) => {
        const card = dueCards[currentIdx];
        const stored = getStoredData();
        const cardData = stored[card.id] || { box: 0 };
        cardData.box = correct ? Math.min(cardData.box + 1, INTERVALS.length - 1) : 0;
        cardData.nextReview = Date.now() + INTERVALS[cardData.box] * 86400000;
        cardData.lastReviewed = Date.now();
        stored[card.id] = cardData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

        setStats(p => ({ correct: p.correct + (correct ? 1 : 0), wrong: p.wrong + (correct ? 0 : 1) }));
        setShowBack(false);
        if (currentIdx + 1 >= dueCards.length) setSessionDone(true);
        else setCurrentIdx(currentIdx + 1);
    };

    if (sessionDone || dueCards.length === 0) {
        return (
            <div style={s.doneBox}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧠</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#a78bfa', marginBottom: '6px' }}>
                    {dueCards.length === 0 ? 'Žádné kartičky!' : 'Hotovo!'}
                </div>
                {sessionDone && (
                    <div style={{ fontSize: '13px', color: 'rgba(224,224,224,0.6)', marginBottom: '8px' }}>
                        <span style={{ color: '#4ade80' }}>{stats.correct} ✓</span>
                        {' · '}
                        <span style={{ color: '#f87171' }}>{stats.wrong} ✗</span>
                    </div>
                )}
                <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '16px' }}>
                    {dueCards.length === 0 ? 'Vrať se zítra!' : 'Skvělá práce!'}
                </div>
                <button style={s.retryBtn} onClick={loadDue}>🔄 Znovu</button>
            </div>
        );
    }

    const current = dueCards[currentIdx];
    const progress = ((currentIdx + 1) / dueCards.length) * 100;
    const stored = getStoredData();
    const box = (stored[current.id]?.box ?? 0) + 1;

    return (
        <div>
            <div style={s.progress}>
                <span>
                    {currentIdx + 1} / {dueCards.length}
                    <span style={s.catBadge(current.cat)}>{current.cat === 'it' ? 'IT' : 'ČJ'}</span>
                </span>
                <span>
                    <span style={{ color: '#4ade80' }}>{stats.correct} ✓</span>
                    {' · '}
                    <span style={{ color: '#f87171' }}>{stats.wrong} ✗</span>
                </span>
            </div>
            <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>
            <div style={s.card} onClick={() => !showBack && setShowBack(true)}>
                <div style={s.label}>{showBack ? 'ODPOVĚĎ' : 'OTÁZKA'} · Box {box}</div>
                <div style={showBack ? s.answer : s.question}>
                    {showBack ? current.back : current.front}
                </div>
                {!showBack && <div style={s.hint}>Klikni pro odpověď</div>}
                {showBack && (
                    <div style={s.btnRow}>
                        <button style={s.btnGreen} onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}>
                            ✓ Věděl
                        </button>
                        <button style={s.btnRed} onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}>
                            ✗ Nevěděl
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PiPFlashcards;
