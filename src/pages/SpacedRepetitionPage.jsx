import { useState, useEffect, useCallback } from 'react';
import { FaBrain, FaCheck, FaTimes, FaRedo, FaSyncAlt } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';

const STORAGE_KEY = 'maturita-srs';
const INTERVALS = [1, 3, 7, 14, 30]; // days per box

// Generate flashcards from book data
const generateCards = () => {
    const cards = [];
    cjBooks.books.forEach(b => {
        const a = b.analysis;
        if (!a) return;
        cards.push({ id: `${b.id}-author`, front: `Kdo napsal "${b.title}"?`, back: b.author });
        if (b.genre) cards.push({ id: `${b.id}-genre`, front: `Žánr: "${b.title}"`, back: b.genre });
        if (b.period) cards.push({ id: `${b.id}-period`, front: `Období: "${b.title}"`, back: b.period });
        if (b.literaryForm) cards.push({ id: `${b.id}-form`, front: `Literární druh: "${b.title}"`, back: b.literaryForm });
        if (a.narration?.narrator) cards.push({ id: `${b.id}-narrator`, front: `Typ vypravěče v "${b.title}"`, back: a.narration.narrator });
        if (a.themes?.main) cards.push({ id: `${b.id}-theme`, front: `Hlavní téma: "${b.title}"`, back: a.themes.main });
        if (a.literaryContext?.movement) cards.push({ id: `${b.id}-movement`, front: `Literární směr: "${b.title}"`, back: a.literaryContext.movement });
        if (a.setting?.place) cards.push({ id: `${b.id}-place`, front: `Místo děje: "${b.title}"`, back: a.setting.place });
        if (a.setting?.time) cards.push({ id: `${b.id}-time`, front: `Время děje: "${b.title}"`, back: a.setting.time });
        if (a.composition?.structure) cards.push({ id: `${b.id}-comp`, front: `Kompozice: "${b.title}"`, back: a.composition.structure });
    });
    return cards;
};

const getStoredData = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};

const SpacedRepetitionPage = () => {
    const [allCards] = useState(() => generateCards());
    const [dueCards, setDueCards] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [sessionDone, setSessionDone] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });

    const loadDueCards = useCallback(() => {
        const stored = getStoredData();
        const now = Date.now();
        const due = allCards.filter(c => {
            const cardData = stored[c.id];
            if (!cardData) return true; // new card
            return now >= cardData.nextReview;
        });
        // Shuffle
        for (let i = due.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [due[i], due[j]] = [due[j], due[i]];
        }
        setDueCards(due.slice(0, 20)); // max 20 per session
        setCurrentIdx(0);
        setShowBack(false);
        setSessionDone(false);
        setSessionStats({ correct: 0, wrong: 0 });
    }, [allCards]);

    useEffect(() => { loadDueCards(); }, [loadDueCards]);

    const handleAnswer = (correct) => {
        const card = dueCards[currentIdx];
        const stored = getStoredData();
        const cardData = stored[card.id] || { box: 0 };

        if (correct) {
            cardData.box = Math.min(cardData.box + 1, INTERVALS.length - 1);
        } else {
            cardData.box = 0;
        }
        const intervalDays = INTERVALS[cardData.box];
        cardData.nextReview = Date.now() + intervalDays * 24 * 60 * 60 * 1000;
        cardData.lastReviewed = Date.now();
        stored[card.id] = cardData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

        setSessionStats(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
        }));
        setShowBack(false);

        if (currentIdx + 1 >= dueCards.length) {
            setSessionDone(true);
        } else {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const stored = getStoredData();
    const boxCounts = [0, 0, 0, 0, 0];
    allCards.forEach(c => {
        const box = stored[c.id]?.box ?? 0;
        boxCounts[box]++;
    });

    if (sessionDone || dueCards.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <div className="terminal-card text-center py-10">
                    <FaBrain className="text-5xl text-terminal-accent mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-terminal-accent mb-2">
                        {dueCards.length === 0 ? 'Žádné kartičky dnes!' : 'Session dokončena!'}
                    </h2>
                    {sessionDone && (
                        <p className="text-terminal-text/60 mb-4">
                            {sessionStats.correct} správně · {sessionStats.wrong} špatně
                        </p>
                    )}
                    <p className="text-terminal-text/50 text-sm mb-6">
                        {dueCards.length === 0 ? 'Všechny kartičky jsou v boxech s budoucím reviewem. Vrať se zítra!' : 'Skvělá práce!'}
                    </p>

                    {/* Box distribution */}
                    <div className="flex justify-center gap-2 mb-6">
                        {boxCounts.map((count, i) => (
                            <div key={i} className="text-center">
                                <div className="text-xs text-terminal-text/40 mb-1">Box {i + 1}</div>
                                <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-red-500/20 text-red-400' :
                                        i === 4 ? 'bg-green-500/20 text-green-400' :
                                            'bg-terminal-accent/10 text-terminal-accent'
                                    }`}>
                                    {count}
                                </div>
                                <div className="text-[9px] text-terminal-text/30 mt-0.5">{INTERVALS[i]}d</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={loadDueCards} className="px-6 py-2 bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90 transition flex items-center gap-2 mx-auto">
                        <FaRedo /> Znovu zkontrolovat
                    </button>
                </div>
            </div>
        );
    }

    const current = dueCards[currentIdx];
    const progress = ((currentIdx + 1) / dueCards.length) * 100;

    return (
        <div className="max-w-2xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaBrain /> Kartičky (SRS)
                </h1>
                <span className="text-sm text-terminal-text/50">{dueCards.length} kartiček dnes</span>
            </div>

            <div className="w-full bg-terminal-border/20 h-1 rounded mb-4">
                <div className="bg-terminal-accent h-1 rounded transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between text-xs text-terminal-text/50 mb-4">
                <span>{currentIdx + 1} / {dueCards.length}</span>
                <span>
                    <span className="text-green-400">{sessionStats.correct} ✓</span>
                    {' · '}
                    <span className="text-red-400">{sessionStats.wrong} ✗</span>
                </span>
            </div>

            <div className="terminal-card min-h-[200px] flex flex-col justify-center items-center cursor-pointer"
                onClick={() => !showBack && setShowBack(true)}>

                <div className="text-[10px] text-terminal-text/30 uppercase mb-3">
                    {showBack ? 'ODPOVĚĎ' : 'OTÁZKA'} · Box {(stored[current.id]?.box ?? 0) + 1}
                </div>

                <h2 className="text-lg font-bold text-terminal-text text-center px-4 leading-relaxed">
                    {showBack ? current.back : current.front}
                </h2>

                {!showBack && (
                    <p className="text-xs text-terminal-text/30 mt-6">Klikni pro odpověď</p>
                )}

                {showBack && (
                    <div className="flex gap-3 mt-8">
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
                            className="px-6 py-2 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded hover:bg-green-500/20 transition flex items-center gap-2">
                            <FaCheck /> Věděl
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
                            className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded hover:bg-red-500/20 transition flex items-center gap-2">
                            <FaTimes /> Nevěděl
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpacedRepetitionPage;
