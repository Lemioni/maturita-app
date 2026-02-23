import { useState, useCallback, useEffect } from 'react';
import { FaBolt, FaCheck, FaTimes, FaRedo, FaTrophy } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

// Generate quiz pool from all data
const generateQuizPool = () => {
    const pool = [];

    // From books
    cjBooks.books.forEach(b => {
        const a = b.analysis;
        if (!a) return;

        pool.push({
            q: `Kdo napsal "${b.title}"?`,
            a: b.author,
            category: 'Knihy',
        });
        if (b.genre) pool.push({
            q: `Jaký je žánr knihy "${b.title}"?`,
            a: b.genre,
            category: 'Knihy',
        });
        if (b.period) pool.push({
            q: `Do jakého období patří "${b.title}"?`,
            a: b.period,
            category: 'Knihy',
        });
        if (a.narration?.narrator) pool.push({
            q: `Jaký typ vypravěče je v "${b.title}"?`,
            a: a.narration.narrator,
            category: 'Knihy',
        });
        if (a.themes?.main) pool.push({
            q: `Jaké je hlavní téma knihy "${b.title}"?`,
            a: a.themes.main,
            category: 'Knihy',
        });
        if (a.literaryContext?.movement) pool.push({
            q: `K jakému literárnímu směru patří "${b.title}"?`,
            a: a.literaryContext.movement,
            category: 'Kontext',
        });
        if (a.setting?.place) pool.push({
            q: `Kde se odehrává "${b.title}"?`,
            a: a.setting.place,
            category: 'Knihy',
        });
        // Author → other works
        if (a.authorContext?.otherWorks?.length > 0) {
            pool.push({
                q: `Jmenuj jiné dílo od autora ${b.author}:`,
                a: a.authorContext.otherWorks.map(w => w.title).join(', '),
                category: 'Autoři',
            });
        }
    });

    // From IT questions  
    itQuestions.questions.forEach(q => {
        pool.push({
            q: `IT: ${q.question}`,
            a: q.answer.substring(0, 200) + '...',
            category: q.category,
            isLong: true,
        });
    });

    return pool;
};

const ROUNDS = 10;

const RandomDrillPage = () => {
    const [pool] = useState(() => generateQuizPool());
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'books', 'it'

    const startRound = useCallback(() => {
        const filtered = filter === 'all'
            ? pool.filter(q => !q.isLong)
            : filter === 'books'
                ? pool.filter(q => !q.isLong && (q.category === 'Knihy' || q.category === 'Kontext' || q.category === 'Autoři'))
                : pool.filter(q => q.isLong);

        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, ROUNDS));
        setCurrentIdx(0);
        setShowAnswer(false);
        setScore({ correct: 0, wrong: 0 });
        setIsFinished(false);
    }, [pool, filter]);

    useEffect(() => { startRound(); }, [startRound]);

    const handleAnswer = (correct) => {
        const newScore = {
            correct: score.correct + (correct ? 1 : 0),
            wrong: score.wrong + (correct ? 0 : 1),
        };
        setScore(newScore);
        setShowAnswer(false);

        if (currentIdx + 1 >= questions.length) {
            setIsFinished(true);
        } else {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const current = questions[currentIdx];
    const progress = questions.length > 0 ? ((currentIdx + (isFinished ? 1 : 0)) / questions.length) * 100 : 0;

    if (isFinished) {
        const pct = Math.round((score.correct / ROUNDS) * 100);
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <div className="terminal-card text-center py-12">
                    <FaTrophy className={`text-6xl mx-auto mb-4 ${pct >= 80 ? 'text-yellow-500' : pct >= 50 ? 'text-orange-400' : 'text-gray-500'}`} />
                    <h2 className="text-3xl font-bold text-terminal-accent mb-2">{pct}%</h2>
                    <p className="text-terminal-text/70 mb-6">
                        {score.correct} správně / {score.wrong} špatně z {ROUNDS} otázek
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={startRound} className="px-6 py-2 bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90 transition flex items-center gap-2">
                            <FaRedo /> Znovu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!current) return null;

    return (
        <div className="max-w-2xl mx-auto mt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaBolt /> Random Drill
                </h1>
                <div className="flex gap-2">
                    {['all', 'books', 'it'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-xs font-bold rounded border transition ${filter === f
                                    ? 'bg-terminal-accent text-terminal-bg border-terminal-accent'
                                    : 'text-terminal-text/50 border-terminal-border/30 hover:border-terminal-accent/50'
                                }`}
                        >
                            {f === 'all' ? 'Vše' : f === 'books' ? 'Knihy' : 'IT'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-terminal-border/20 h-1 rounded mb-4">
                <div className="bg-terminal-accent h-1 rounded transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            {/* Score */}
            <div className="flex justify-between text-xs text-terminal-text/50 mb-4">
                <span>{currentIdx + 1} / {questions.length}</span>
                <span>
                    <span className="text-green-400">{score.correct} ✓</span>
                    {' · '}
                    <span className="text-red-400">{score.wrong} ✗</span>
                </span>
            </div>

            {/* Question Card */}
            <div className="terminal-card">
                <div className="text-[10px] text-terminal-text/40 uppercase mb-3">{current.category}</div>
                <h2 className="text-lg font-bold text-terminal-text mb-6 leading-relaxed">{current.q}</h2>

                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="w-full py-3 bg-terminal-accent/10 border border-terminal-accent/30 text-terminal-accent font-bold rounded hover:bg-terminal-accent/20 transition"
                    >
                        Ukázat odpověď
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="pl-3 border-l-2 border-terminal-accent/50 text-sm text-terminal-text/85 leading-relaxed">
                            {current.a}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAnswer(true)}
                                className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded hover:bg-green-500/20 transition flex items-center justify-center gap-2"
                            >
                                <FaCheck /> Věděl jsem
                            </button>
                            <button
                                onClick={() => handleAnswer(false)}
                                className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                            >
                                <FaTimes /> Nevěděl
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RandomDrillPage;
