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

    // ── CJ: Setting place ──
    const placeBooks = booksArr.filter(b => b.analysis?.setting?.place);
    placeBooks.forEach(b => {
        const place = b.analysis.setting.place;
        const others = [...new Set(placeBooks.filter(x => x.analysis.setting.place !== place).map(x => x.analysis.setting.place))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Kde se odehrává děj "${b.title}"?`,
            options: [...opts, place].sort(() => Math.random() - 0.5),
            correct: place, category: 'Místo', cat: 'cj',
        });
    });

    // ── CJ: Year of publication ──
    const yearBooks = booksArr.filter(b => b.year);
    yearBooks.forEach(b => {
        const year = b.year.toString();
        const others = [...new Set(yearBooks.filter(x => x.year?.toString() !== year).map(x => x.year.toString()))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Rok vydání díla "${b.title}"?`,
            options: [...opts, year].sort(() => Math.random() - 0.5),
            correct: year, category: 'Rok', cat: 'cj',
        });
    });

    // ── CJ: Main character ──
    booksArr.forEach(b => {
        const mainChar = b.analysis?.characters?.find(c => c.isMain);
        if (!mainChar?.name) return;
        const others = [...new Set(booksArr
            .flatMap(x => {
                const mc = x.analysis?.characters?.find(c => c.isMain);
                return mc?.name && mc.name !== mainChar.name ? [mc.name] : [];
            }))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Hlavní postava díla "${b.title}"?`,
            options: [...opts, mainChar.name].sort(() => Math.random() - 0.5),
            correct: mainChar.name, category: 'Postava', cat: 'cj',
        });
    });

    // ── CJ: Composition structure ──
    const compBooks = booksArr.filter(b => b.analysis?.composition?.structure);
    compBooks.forEach(b => {
        const comp = b.analysis.composition.structure;
        const others = [...new Set(compBooks.filter(x => x.analysis.composition.structure !== comp).map(x => x.analysis.composition.structure))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Kompozice díla "${b.title}"?`,
            options: [...opts, comp].sort(() => Math.random() - 0.5),
            correct: comp, category: 'Kompozice', cat: 'cj',
        });
    });

    // ── CJ: Which book does a character belong to ──
    booksArr.forEach(b => {
        if (!b.analysis?.characters?.length) return;
        const mainChar = b.analysis.characters.find(c => c.isMain);
        if (!mainChar?.name) return;
        const otherTitles = booksArr.filter(x => x.id !== b.id).map(x => x.title);
        if (otherTitles.length < 3) return;
        const opts = otherTitles.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `V jakém díle se vyskytuje postava "${mainChar.name}"?`,
            options: [...opts, b.title].sort(() => Math.random() - 0.5),
            correct: b.title, category: 'Postava', cat: 'cj',
        });
    });

    // ── CJ: Narrator style ──
    const styleBooks = booksArr.filter(b => b.analysis?.narration?.style);
    styleBooks.forEach(b => {
        const style = b.analysis.narration.style;
        const others = [...new Set(styleBooks.filter(x => x.analysis.narration.style !== style).map(x => x.analysis.narration.style))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Styl vyprávění v "${b.title}"?`,
            options: [...opts, style].sort(() => Math.random() - 0.5),
            correct: style, category: 'Styl', cat: 'cj',
        });
    });

    // ── CJ: Literary form ──
    const formBooks = booksArr.filter(b => b.literaryForm);
    formBooks.forEach(b => {
        const form = b.literaryForm;
        const others = [...new Set(formBooks.filter(x => x.literaryForm !== form).map(x => x.literaryForm))];
        if (others.length < 3) return;
        const opts = others.sort(() => Math.random() - 0.5).slice(0, 3);
        questions.push({
            question: `Literární druh díla "${b.title}"?`,
            options: [...opts, form].sort(() => Math.random() - 0.5),
            correct: form, category: 'Druh', cat: 'cj',
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

        // ── IT: Match question number to title ──
        itqs.forEach(q => {
            if (!q.question) return;
            const otherQuestions = itqs.filter(x => x.id !== q.id && x.question).map(x => x.question);
            if (otherQuestions.length < 3) return;
            const opts = otherQuestions.sort(() => Math.random() - 0.5).slice(0, 3);
            questions.push({
                question: `Jak se jmenuje IT otázka č.${q.id}?`,
                options: [...opts, q.question].sort(() => Math.random() - 0.5),
                correct: q.question, category: 'IT Otázka', cat: 'it',
            });
        });
    }

    return questions;
};

const s = {
    question: { fontSize: '13px', fontWeight: '500', color: '#e0e0e0', marginBottom: '12px', lineHeight: '1.5' },
    catRow: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' },
    category: {
        fontSize: '9px', color: 'rgba(139,92,246,0.6)',
        letterSpacing: '1px', textTransform: 'uppercase',
    },
    catBadge: (cat) => ({
        fontSize: '9px', padding: '1px 4px', borderRadius: '2px',
        color: cat === 'it' ? 'rgba(96,165,250,0.7)' : 'rgba(244,114,182,0.7)',
    }),
    option: (selected, isCorrect, showResult) => ({
        width: '100%', padding: '8px 10px', border: '1px solid',
        borderColor: showResult
            ? (isCorrect ? 'rgba(51,255,51,0.25)' : selected ? 'rgba(255,51,51,0.25)' : 'rgba(255,255,255,0.06)')
            : 'rgba(255,255,255,0.06)',
        borderRadius: '2px',
        background: showResult
            ? (isCorrect ? 'rgba(51,255,51,0.05)' : selected ? 'rgba(255,51,51,0.05)' : 'transparent')
            : 'transparent',
        color: showResult
            ? (isCorrect ? '#33ff33' : selected ? '#ff3333' : 'rgba(224,224,224,0.5)')
            : 'rgba(224,224,224,0.7)',
        fontSize: '11px', textAlign: 'left', cursor: showResult ? 'default' : 'pointer',
        transition: 'all 0.15s ease', fontWeight: showResult && isCorrect ? '600' : '400',
    }),
    progress: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: 'rgba(224,224,224,0.3)' },
    progressBar: { height: '2px', background: 'rgba(255,255,255,0.04)', marginBottom: '12px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#8b5cf6', transition: 'width 0.3s ease' },
    doneBox: { textAlign: 'center', padding: '32px 16px' },
    retryBtn: {
        padding: '8px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '2px', color: 'rgba(224,224,224,0.4)', fontWeight: '500', fontSize: '11px', cursor: 'pointer',
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
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>❓</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#8b5cf6', marginBottom: '6px' }}>
                    {questions.length === 0 ? 'Žádné otázky!' : 'Kvíz dokončen!'}
                </div>
                {done && (
                    <div style={{ fontSize: '16px', color: '#e0e0e0', marginBottom: '8px' }}>
                        <span style={{ color: '#33ff33', fontWeight: '600' }}>{score}</span>
                        <span style={{ color: 'rgba(224,224,224,0.3)' }}> / {questions.length}</span>
                    </div>
                )}
                <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.3)', marginBottom: '16px' }}>
                    {score >= questions.length * 0.8 ? 'Výborně!' : score >= questions.length * 0.5 ? 'Dobrá práce!' : 'Příště to bude lepší!'}
                </div>
                <button style={s.retryBtn} onClick={startQuiz}>Nový kvíz</button>
            </div>
        );
    }

    const current = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div>
            <div style={s.progress}>
                <span>{currentIdx + 1} / {questions.length}</span>
                <span style={{ color: '#33ff33' }}>{score} ✓</span>
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
