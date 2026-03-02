import React, { useState, useEffect, useCallback } from 'react';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';

// Generate quiz questions from CJ books + IT data
const generateQuizQuestions = () => {
    const questions = [];
    const booksArr = cjBooks.books.filter(b => b.analysis);

    // ── CJ: Author questions ──
    booksArr.forEach(b => {
        const otherAuthors = [...new Set(booksArr.filter(x => x.author !== b.author).map(x => x.author))];
        if (otherAuthors.length < 3) return;
        const opts = otherAuthors.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Kdo napsal "${b.title}"?`,
            options: [...opts, b.author].sort(() => Math.random() - 0.5),
            correct: b.author, category: 'Autor', cat: 'cj',
        });
    });

    // ── CJ: Genre questions ──
    const genreBooks = booksArr.filter(b => b.genre);
    genreBooks.forEach(b => {
        const others = [...new Set(genreBooks.filter(x => x.genre !== b.genre).map(x => x.genre))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Žánr díla "${b.title}"?`,
            options: [...opts, b.genre].sort(() => Math.random() - 0.5),
            correct: b.genre, category: 'Žánr', cat: 'cj',
        });
    });

    // ── CJ: Literary movement ──
    booksArr.forEach(b => {
        const movement = b.analysis?.literaryContext?.movement;
        if (!movement) return;
        const others = [...new Set(booksArr
            .filter(x => x.analysis?.literaryContext?.movement && x.analysis.literaryContext.movement !== movement)
            .map(x => x.analysis.literaryContext.movement))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Literární směr: "${b.title}"?`,
            options: [...opts, movement].sort(() => Math.random() - 0.5),
            correct: movement, category: 'Směr', cat: 'cj',
        });
    });

    // ── CJ: Period questions ──
    const periodBooks = booksArr.filter(b => b.period);
    periodBooks.forEach(b => {
        const others = [...new Set(periodBooks.filter(x => x.period !== b.period).map(x => x.period))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Období díla "${b.title}"?`,
            options: [...opts, b.period].sort(() => Math.random() - 0.5),
            correct: b.period, category: 'Období', cat: 'cj',
        });
    });

    // ── CJ: Narrator type ──
    booksArr.forEach(b => {
        const narrator = b.analysis?.narration?.narrator;
        if (!narrator) return;
        const others = [...new Set(booksArr
            .filter(x => x.analysis?.narration?.narrator && x.analysis.narration.narrator !== narrator)
            .map(x => x.analysis.narration.narrator))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Typ vypravěče v "${b.title}"?`,
            options: [...opts, narrator].sort(() => Math.random() - 0.5),
            correct: narrator, category: 'Vypravěč', cat: 'cj',
        });
    });

    // ── CJ: Theme questions ──
    booksArr.forEach(b => {
        const theme = b.analysis?.themes?.main;
        if (!theme) return;
        const others = [...new Set(booksArr
            .filter(x => x.analysis?.themes?.main && x.analysis.themes.main !== theme)
            .map(x => x.analysis.themes.main))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Hlavní téma "${b.title}"?`,
            options: [...opts, theme].sort(() => Math.random() - 0.5),
            correct: theme, category: 'Téma', cat: 'cj',
        });
    });

    // ── IT: Category-based matching ──
    if (itQuestions?.questions) {
        const itqs = itQuestions.questions.filter(q => q.question && q.category);
        const categories = [...new Set(itqs.map(q => q.category))];
        itqs.forEach(q => {
            const others = categories.filter(c => c !== q.category);
            if (others.length < 3) return;
            const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
            questions.push({
                question: `Kategorie otázky: "${q.question}"?`,
                options: [...opts, q.category].sort(() => Math.random() - 0.5),
                correct: q.category, category: 'IT Kat.', cat: 'it',
            });
        });
    }

    return questions;
};

const s = {
    question: { fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '14px', lineHeight: '1.5' },
    catRow: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' },
    category: {
        fontSize: '9px', color: 'rgba(139,92,246,0.7)', background: 'rgba(139,92,246,0.1)',
        padding: '2px 8px', borderRadius: '10px', letterSpacing: '1px', textTransform: 'uppercase',
    },
    catBadge: (cat) => ({
        fontSize: '9px', padding: '2px 8px', borderRadius: '10px',
        background: cat === 'it' ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)',
        color: cat === 'it' ? '#60a5fa' : '#f472b6',
    }),
    option: (selected, isCorrect, showResult) => ({
        width: '100%', padding: '10px 12px', border: '1px solid',
        borderColor: showResult
            ? (isCorrect ? 'rgba(34,197,94,0.5)' : selected ? 'rgba(239,68,68,0.5)' : 'rgba(139,92,246,0.15)')
            : 'rgba(139,92,246,0.15)',
        borderRadius: '6px',
        background: showResult
            ? (isCorrect ? 'rgba(34,197,94,0.1)' : selected ? 'rgba(239,68,68,0.1)' : 'rgba(20,20,30,0.6)')
            : 'rgba(20,20,30,0.6)',
        color: showResult
            ? (isCorrect ? '#4ade80' : selected ? '#f87171' : 'rgba(224,224,224,0.7)')
            : 'rgba(224,224,224,0.8)',
        fontSize: '12px', textAlign: 'left', cursor: showResult ? 'default' : 'pointer',
        transition: 'all 0.15s ease', fontWeight: showResult && isCorrect ? '700' : '400',
    }),
    progress: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'rgba(224,224,224,0.4)' },
    progressBar: { height: '3px', background: 'rgba(139,92,246,0.15)', borderRadius: '2px', marginBottom: '14px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#8b5cf6', borderRadius: '2px', transition: 'width 0.3s ease' },
    doneBox: { textAlign: 'center', padding: '24px 16px' },
    retryBtn: {
        padding: '10px 24px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
        borderRadius: '6px', color: '#a78bfa', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
    },
};

const QUIZ_SIZE = 10;

const PiPQuiz = () => {
    const [allQuestions] = useState(() => generateQuizQuestions());
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const startQuiz = useCallback(() => {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE);
        setQuestions(shuffled);
        setCurrentIdx(0);
        setSelected(null);
        setShowResult(false);
        setScore(0);
        setDone(false);
    }, [allQuestions]);

    useEffect(() => { startQuiz(); }, [startQuiz]);

    const handleSelect = (option) => {
        if (showResult) return;
        setSelected(option);
        setShowResult(true);
        if (option === questions[currentIdx].correct) setScore(s => s + 1);
        setTimeout(() => {
            if (currentIdx + 1 >= questions.length) setDone(true);
            else { setCurrentIdx(i => i + 1); setSelected(null); setShowResult(false); }
        }, 1200);
    };

    if (done || questions.length === 0) {
        return (
            <div style={s.doneBox}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>❓</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#a78bfa', marginBottom: '6px' }}>
                    {questions.length === 0 ? 'Žádné otázky!' : 'Kvíz dokončen!'}
                </div>
                {done && (
                    <div style={{ fontSize: '20px', color: '#e0e0e0', marginBottom: '8px' }}>
                        <span style={{ color: '#4ade80', fontWeight: '700' }}>{score}</span>
                        <span style={{ color: 'rgba(224,224,224,0.4)' }}> / {questions.length}</span>
                    </div>
                )}
                <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '16px' }}>
                    {score >= questions.length * 0.8 ? '🔥 Výborně!' : score >= questions.length * 0.5 ? '👍 Dobrá práce!' : '💪 Příště to bude lepší!'}
                </div>
                <button style={s.retryBtn} onClick={startQuiz}>🔄 Nový kvíz</button>
            </div>
        );
    }

    const current = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div>
            <div style={s.progress}>
                <span>{currentIdx + 1} / {questions.length}</span>
                <span style={{ color: '#4ade80' }}>{score} ✓</span>
            </div>
            <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>

            <div style={s.catRow}>
                <span style={s.category}>{current.category}</span>
                <span style={s.catBadge(current.cat)}>{current.cat === 'it' ? 'IT' : 'ČJ'}</span>
            </div>
            <div style={s.question}>{current.question}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {current.options.map((opt, i) => (
                    <button
                        key={i}
                        style={s.option(opt === selected, opt === current.correct, showResult)}
                        onClick={() => handleSelect(opt)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PiPQuiz;
