import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaRedo } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

const QuizMode = ({ filter }) => {
    const [books, setBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [quizType, setQuizType] = useState('author'); // 'author', 'title', 'period'

    useEffect(() => {
        let filtered = [...cjBooksData.books];

        if (filter !== 'all') {
            filtered = filtered.filter(b => b.period === filter);
        }

        // Shuffle books
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setBooks(shuffled);
        setCurrentIndex(0);
        setShowAnswer(false);
        setScore({ correct: 0, total: 0 });
    }, [filter]);

    const currentBook = books[currentIndex];

    const handleSubmit = () => {
        setShowAnswer(true);
    };

    const handleNext = (wasCorrect) => {
        setScore(prev => ({
            correct: prev.correct + (wasCorrect ? 1 : 0),
            total: prev.total + 1
        }));

        if (currentIndex + 1 < books.length) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setShowAnswer(false);
        }
    };

    const handleRestart = () => {
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        setBooks(shuffled);
        setCurrentIndex(0);
        setUserAnswer('');
        setShowAnswer(false);
        setScore({ correct: 0, total: 0 });
    };

    const getQuestion = () => {
        if (!currentBook) return '';
        switch (quizType) {
            case 'author':
                return `Kdo napsal "${currentBook.title}"?`;
            case 'title':
                return `Jaké dílo napsal ${currentBook.author}?`;
            case 'period':
                return `Do jakého období patří "${currentBook.title}"?`;
            default:
                return '';
        }
    };

    const getAnswer = () => {
        if (!currentBook) return '';
        switch (quizType) {
            case 'author':
                return currentBook.author;
            case 'title':
                return currentBook.title;
            case 'period':
                return currentBook.period;
            default:
                return '';
        }
    };

    if (!currentBook) {
        return (
            <div className="terminal-card text-center">
                <p className="text-terminal-text/60">Žádné knihy k zobrazení</p>
            </div>
        );
    }

    const isFinished = currentIndex >= books.length - 1 && showAnswer;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {/* Quiz Type Selection */}
            <div className="flex gap-2 justify-center">
                {[
                    { id: 'author', label: 'AUTOR' },
                    { id: 'title', label: 'DÍLO' },
                    { id: 'period', label: 'OBDOBÍ' }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => {
                            setQuizType(type.id);
                            handleRestart();
                        }}
                        className={`icon-btn text-xs px-3 ${quizType === type.id ? 'active' : ''}`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Progress */}
            <div className="flex justify-between text-xs text-terminal-text/60 mb-2">
                <span>Otázka {currentIndex + 1} z {books.length}</span>
                <span>
                    Skóre: {score.correct} / {score.total}
                    {score.total > 0 && ` (${Math.round((score.correct / score.total) * 100)}%)`}
                </span>
            </div>
            <div className="w-full bg-terminal-border/20 h-1">
                <div
                    className="bg-terminal-accent h-1 transition-all"
                    style={{ width: `${((currentIndex + 1) / books.length) * 100}%` }}
                ></div>
            </div>

            {!isFinished ? (
                <div className="terminal-card">
                    <div className="mb-6">
                        <div className="flex gap-2 mb-4">
                            <span className="text-xs px-2 py-0.5 border border-terminal-border/30 text-terminal-text/60">
                                {currentBook.genre}
                            </span>
                            <span className="text-xs px-2 py-0.5 text-terminal-text/40">
                                {currentBook.year}
                            </span>
                        </div>
                        <h2 className="text-lg text-terminal-text">
                            {getQuestion()}
                        </h2>
                    </div>

                    {!showAnswer ? (
                        <div>
                            <label className="block text-xs text-terminal-text/60 mb-2">
                                Tvoje odpověď:
                            </label>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Napiš svou odpověď..."
                                className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border/30 text-terminal-text rounded focus:border-terminal-accent focus:outline-none resize-none"
                                rows="3"
                            />
                            <button
                                onClick={handleSubmit}
                                className="mt-4 w-full px-6 py-3 bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30 hover:bg-terminal-accent/30 transition-colors"
                            >
                                Zobrazit odpověď
                            </button>
                        </div>
                    ) : (
                        <div>
                            {userAnswer && (
                                <div className="mb-4 p-3 border-l-2 border-terminal-border/30">
                                    <p className="text-xs text-terminal-text/40 mb-1">Tvoje odpověď:</p>
                                    <p className="text-sm text-terminal-text/70">{userAnswer}</p>
                                </div>
                            )}

                            <div className="p-4 bg-terminal-accent/10 border border-terminal-accent/20 mb-6">
                                <p className="text-xs text-terminal-accent/60 mb-1">&gt; SPRÁVNÁ ODPOVĚĎ:</p>
                                <p className="text-terminal-text">{getAnswer()}</p>
                            </div>

                            <div className="border-t border-terminal-border/20 pt-4">
                                <p className="text-center text-terminal-text/60 mb-4 text-sm">
                                    Odpověděl/a jsi správně?
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleNext(false)}
                                        className="flex-1 flex items-center justify-center px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <FaTimes className="mr-2" />
                                        Ne
                                    </button>
                                    <button
                                        onClick={() => handleNext(true)}
                                        className="flex-1 flex items-center justify-center px-4 py-3 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
                                    >
                                        <FaCheck className="mr-2" />
                                        Ano
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="terminal-card text-center">
                    <div className="mb-6">
                        <div className="text-4xl mb-4">
                            {score.correct / score.total >= 0.8 ? '🎉' : score.correct / score.total >= 0.5 ? '👍' : '📚'}
                        </div>
                        <h2 className="text-xl text-terminal-text mb-2">
                            Kvíz dokončen!
                        </h2>
                        <p className="text-terminal-text/60">
                            Skóre: {score.correct} z {score.total} ({Math.round((score.correct / score.total) * 100)}%)
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-3 border border-green-500/20">
                            <div className="text-xl text-green-400">{score.correct}</div>
                            <div className="text-xs text-green-400/60">Správně</div>
                        </div>
                        <div className="p-3 border border-red-500/20">
                            <div className="text-xl text-red-400">{score.total - score.correct}</div>
                            <div className="text-xs text-red-400/60">Špatně</div>
                        </div>
                        <div className="p-3 border border-terminal-accent/20">
                            <div className="text-xl text-terminal-accent">
                                {Math.round((score.correct / score.total) * 100)}%
                            </div>
                            <div className="text-xs text-terminal-accent/60">Úspěšnost</div>
                        </div>
                    </div>

                    <button
                        onClick={handleRestart}
                        className="flex items-center justify-center mx-auto px-6 py-2 border border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
                    >
                        <FaRedo className="mr-2" />
                        Zkusit znovu
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizMode;
