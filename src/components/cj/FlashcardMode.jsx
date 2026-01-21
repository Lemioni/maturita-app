import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaRandom, FaCheck, FaTimes, FaRedo, FaChevronDown, FaMinus, FaPlus } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

// Generate ALL possible questions from book data
const generateAllQuestions = (book) => {
    if (!book?.analysis) return [];

    const questions = [];
    const a = book.analysis;

    // Téma
    if (a.themes?.main) {
        questions.push({
            id: 'theme',
            question: 'Jaké je téma díla?',
            answer: a.themes.main
        });
    }

    // Motivy
    if (a.themes?.motifs?.length > 0) {
        questions.push({
            id: 'motifs',
            question: 'Jaké jsou motivy?',
            answer: a.themes.motifs.join(', ')
        });
    }

    // Časoprostor
    if (a.setting) {
        questions.push({
            id: 'setting',
            question: 'Kde a kdy se odehrává děj?',
            answer: `${a.setting.place} • ${a.setting.time}`
        });
    }

    // Hlavní postavy
    if (a.characters?.length > 0) {
        const mainChars = a.characters.filter(c => c.isMain);
        if (mainChars.length > 0) {
            questions.push({
                id: 'main-characters',
                question: 'Kdo jsou hlavní postavy?',
                answer: mainChars.map(c => `${c.name} – ${c.description}`).join('\n')
            });
        }

        // Vedlejší postavy
        const sideChars = a.characters.filter(c => !c.isMain);
        if (sideChars.length > 0) {
            questions.push({
                id: 'side-characters',
                question: 'Kdo jsou vedlejší postavy?',
                answer: sideChars.map(c => `${c.name} – ${c.description}`).join('\n')
            });
        }

        // Random individual character questions
        a.characters.forEach((char, i) => {
            questions.push({
                id: `char-${i}`,
                question: `Charakterizuj postavu: ${char.name}`,
                answer: char.description
            });
        });
    }

    // Vypravěč
    if (a.narration?.narrator) {
        questions.push({
            id: 'narrator',
            question: 'Jaký je typ vypravěče?',
            answer: a.narration.narrator
        });
    }

    // Styl vyprávění
    if (a.narration?.style) {
        questions.push({
            id: 'narration-style',
            question: 'Jaký je styl vyprávění?',
            answer: a.narration.style
        });
    }

    // Kompozice
    if (a.composition) {
        questions.push({
            id: 'composition',
            question: 'Jaká je kompozice díla?',
            answer: `${a.composition.structure} • ${a.composition.timeline}`
        });
    }

    // Literární směr
    if (a.literaryContext?.movement) {
        questions.push({
            id: 'movement',
            question: 'Jaký je literární směr?',
            answer: `${a.literaryContext.movement} (${a.literaryContext.period})`
        });
    }

    // Charakteristika směru
    if (a.literaryContext?.characteristics?.length > 0) {
        questions.push({
            id: 'characteristics',
            question: 'Jaké jsou charakteristiky literárního směru?',
            answer: a.literaryContext.characteristics.join(', ')
        });
    }

    // Období
    questions.push({
        id: 'period',
        question: 'Do jakého období patří?',
        answer: book.period
    });

    // Žánr
    questions.push({
        id: 'genre',
        question: 'Jaký je žánr díla?',
        answer: `${book.genre} (${book.literaryForm})`
    });

    // Analýza názvu
    if (a.titleAnalysis) {
        questions.push({
            id: 'title',
            question: 'Co znamená název díla?',
            answer: a.titleAnalysis
        });
    }

    // Tropy a figury
    if (a.literaryDevices?.length > 0) {
        questions.push({
            id: 'devices',
            question: 'Jaké tropy a figury jsou v díle?',
            answer: a.literaryDevices.map(d => `${d.name} – ${d.example}`).join('\n')
        });
    }

    // O autorovi
    if (a.authorContext?.bio) {
        questions.push({
            id: 'author-bio',
            question: 'Co víš o autorovi?',
            answer: a.authorContext.bio
        });
    }

    // Shuffle questions
    return questions.sort(() => Math.random() - 0.5);
};

const FlashcardMode = ({ filter }) => {
    const [books, setBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionCount, setQuestionCount] = useState(8);
    const [revealedQuestions, setRevealedQuestions] = useState(new Set());
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const questionRefs = useRef({});

    useEffect(() => {
        let filtered = [...cjBooksData.books];

        // Get progress from localStorage
        const progressData = JSON.parse(localStorage.getItem('maturita-progress') || '{}');

        // Filter by known/unknown status
        if (filter === 'known') {
            filtered = filtered.filter(book => progressData.cjBooks?.[book.id]?.known === true);
        } else if (filter === 'unknown') {
            filtered = filtered.filter(book => !progressData.cjBooks?.[book.id]?.known);
        }

        setBooks(filtered);
        setCurrentIndex(0);
        resetQuiz(filtered[0], questionCount);
    }, [filter]);

    const currentBook = books[currentIndex];

    const resetQuiz = (book, count) => {
        if (book) {
            const all = generateAllQuestions(book);
            setAllQuestions(all);
            setQuestions(all.slice(0, count));
        } else {
            setAllQuestions([]);
            setQuestions([]);
        }
        setRevealedQuestions(new Set());
        setAnsweredQuestions(new Set());
        setScore({ correct: 0, wrong: 0 });
    };

    const handleQuestionCountChange = (delta) => {
        const newCount = Math.max(1, Math.min(15, questionCount + delta));
        setQuestionCount(newCount);
        resetQuiz(currentBook, newCount);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % books.length;
        setCurrentIndex(nextIndex);
        resetQuiz(books[nextIndex], questionCount);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + books.length) % books.length;
        setCurrentIndex(prevIndex);
        resetQuiz(books[prevIndex], questionCount);
    };

    const handleShuffle = () => {
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        setBooks(shuffled);
        setCurrentIndex(0);
        resetQuiz(shuffled[0], questionCount);
    };

    const handleReveal = (questionId) => {
        setRevealedQuestions(prev => new Set([...prev, questionId]));
    };

    const handleAnswer = (questionId, isCorrect) => {
        setAnsweredQuestions(prev => new Set([...prev, questionId]));
        setScore(prev => ({
            ...prev,
            correct: prev.correct + (isCorrect ? 1 : 0),
            wrong: prev.wrong + (isCorrect ? 0 : 1)
        }));

        // Scroll to next question after a short delay
        setTimeout(() => {
            const nextIndex = answeredQuestions.size + 1;
            if (nextIndex < questions.length) {
                const nextQuestionId = questions[nextIndex]?.id;
                if (nextQuestionId && questionRefs.current[nextQuestionId]) {
                    questionRefs.current[nextQuestionId].scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }, 100);
    };

    const isQuizComplete = answeredQuestions.size === questions.length && questions.length > 0;
    const currentQuestionIndex = answeredQuestions.size;

    if (books.length === 0) {
        return (
            <div className="terminal-card text-center">
                <p className="text-terminal-text/60 mb-2">
                    NO BOOKS FOR THIS FILTER
                </p>
                <p className="text-xs text-terminal-text/40">
                    Select a different period filter
                </p>
            </div>
        );
    }

    if (!currentBook?.analysis) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-terminal-text/60">
                        {currentIndex + 1} / {books.length}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleQuestionCountChange(-1)} className="icon-btn p-1">
                                <FaMinus className="text-xs" />
                            </button>
                            <span className="text-xs text-terminal-text/60 w-4 text-center">{questionCount}</span>
                            <button onClick={() => handleQuestionCountChange(1)} className="icon-btn p-1">
                                <FaPlus className="text-xs" />
                            </button>
                        </div>
                        <button onClick={handleShuffle} className="icon-btn" title="Shuffle">
                            <FaRandom />
                        </button>
                    </div>
                </div>

                <div className="terminal-card text-center py-8">
                    <h2 className="text-xl text-terminal-text mb-2">{currentBook?.title}</h2>
                    <p className="text-sm text-terminal-accent/70 mb-4">{currentBook?.author}</p>
                    <p className="text-terminal-text/40 text-sm">Rozbor není k dispozici</p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button onClick={handlePrev} className="icon-btn flex items-center gap-2">
                        <FaArrowLeft />
                        <span className="text-xs">PREV</span>
                    </button>
                    <button onClick={handleNext} className="icon-btn flex items-center gap-2">
                        <span className="text-xs">NEXT</span>
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-terminal-text/60">
                    {currentIndex + 1} / {books.length}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleQuestionCountChange(-1)} className="icon-btn p-1">
                            <FaMinus className="text-xs" />
                        </button>
                        <span className="text-xs text-terminal-text/60 w-4 text-center">{questionCount}</span>
                        <button onClick={() => handleQuestionCountChange(1)} className="icon-btn p-1">
                            <FaPlus className="text-xs" />
                        </button>
                    </div>
                    <button onClick={handleShuffle} className="icon-btn" title="Shuffle">
                        <FaRandom />
                    </button>
                </div>
            </div>

            {/* Book Card with All Questions as Accordion */}
            <div className="terminal-card">
                {/* Book Header */}
                <div className="p-6 text-center border-b border-terminal-border/30">
                    <div className="text-xs text-terminal-accent/60 mb-3 tracking-wider">
                        &gt; KNIHA
                    </div>
                    <h2 className="text-xl text-terminal-text mb-2">
                        {currentBook.title}
                    </h2>
                    <p className="text-sm text-terminal-accent/70">
                        {currentBook.author}
                    </p>
                </div>

                {/* Questions inside the card */}
                <div>
                    {questions.map((q, index) => {
                        const isRevealed = revealedQuestions.has(q.id);
                        const isAnswered = answeredQuestions.has(q.id);
                        const isActive = index === currentQuestionIndex;
                        const isFuture = index > currentQuestionIndex;

                        // Don't show future questions
                        if (isFuture) return null;

                        return (
                            <div
                                key={q.id}
                                ref={el => questionRefs.current[q.id] = el}
                                className={`border-b border-terminal-border/20 last:border-b-0 transition-all duration-300 ${isActive ? '' : 'opacity-60'
                                    }`}
                            >
                                {/* Question - clickable entire area */}
                                <div
                                    className={`p-4 ${!isRevealed && isActive ? 'cursor-pointer hover:bg-terminal-accent/5' : ''}`}
                                    onClick={() => !isRevealed && isActive && handleReveal(q.id)}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-xs text-terminal-accent/60">
                                            {index + 1}.
                                        </span>
                                        <span className="text-terminal-text text-center">
                                            {q.question}
                                        </span>
                                        {!isRevealed && isActive && (
                                            <FaChevronDown className="text-terminal-text/40" />
                                        )}
                                        {isAnswered && (
                                            <span className="text-xs text-terminal-accent">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Answer - slides down */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-out ${isRevealed ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-4 pb-4 text-center">
                                        <div className="bg-terminal-bg/50 p-4 border border-terminal-border/30">
                                            <div className="text-xs text-terminal-accent/60 mb-2">
                                                &gt; ODPOVĚĎ
                                            </div>
                                            <p className="text-terminal-text/90 whitespace-pre-line">
                                                {q.answer}
                                            </p>

                                            {/* Answer buttons - icons only */}
                                            {!isAnswered && (
                                                <div className="flex justify-center gap-4 mt-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAnswer(q.id, true); }}
                                                        className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                                                        title="Umím"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAnswer(q.id, false); }}
                                                        className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        title="Neumím"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quiz Complete Summary inside the card */}
                {isQuizComplete && (
                    <div className="p-6 text-center border-t border-terminal-accent/30 bg-terminal-accent/5">
                        <div className="text-xs text-terminal-accent mb-4 tracking-wider">
                            &gt; VÝSLEDEK
                        </div>
                        <div className="flex justify-center gap-8 mb-4">
                            <div>
                                <div className="text-3xl font-bold text-green-400">{score.correct}</div>
                                <div className="text-xs text-terminal-text/50">Správně</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-red-400">{score.wrong}</div>
                                <div className="text-xs text-terminal-text/50">Špatně</div>
                            </div>
                        </div>
                        <div className="text-lg text-terminal-accent mb-4">
                            {Math.round((score.correct / questions.length) * 100)}%
                        </div>
                        <button
                            onClick={() => resetQuiz(currentBook, questionCount)}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 border border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
                        >
                            <FaRedo />
                            <span className="text-sm">Zkusit znovu</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button onClick={handlePrev} className="icon-btn flex items-center gap-2">
                    <FaArrowLeft />
                    <span className="text-xs">PREV</span>
                </button>
                <button onClick={handleNext} className="icon-btn flex items-center gap-2">
                    <span className="text-xs">NEXT</span>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default FlashcardMode;
