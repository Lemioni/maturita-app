import { useState, useMemo } from 'react';
import { FaCheck, FaTimes, FaRedo, FaBook, FaGlobe, FaPlay, FaList, FaQuoteRight } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

const QuizMode = ({ filter }) => {
    // Stages: 'selection', 'config', 'quiz', 'result'
    const [stage, setStage] = useState('selection');
    const [selectedBookId, setSelectedBookId] = useState('all');

    // Config State
    const [questionLimit, setQuestionLimit] = useState(10);
    const [showExcerpts, setShowExcerpts] = useState(true);
    const [previewQuestions, setPreviewQuestions] = useState([]);

    // Quiz State
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    // Filter books based on props first
    const availableBooks = useMemo(() => cjBooksData.books.filter(b =>
        filter === 'all' || b.period === filter
    ), [filter]);

    // --- Logic to Generate Questions ---
    const generateQuestionPool = (bookId) => {
        let pool = [];
        const sourceBooks = bookId === 'all'
            ? availableBooks
            : availableBooks.filter(b => b.id === parseInt(bookId));

        sourceBooks.forEach(book => {
            // 1. Literary Form & Genre (Druh a Žánr) - SYLLABUS
            pool.push({
                type: 'form',
                book: book,
                question: `Urči literární druh a žánr díla.`,
                answer: `Druh: ${book.literaryForm}\nŽánr: ${book.genre}`
            });

            // 2. Time & Space (Časoprostor) - SYLLABUS
            if (book.analysis?.setting) {
                pool.push({
                    type: 'setting',
                    book: book,
                    question: `Urči časoprostor díla (kde a kdy se děj odehrává).`,
                    answer: `Místo: ${book.analysis.setting.place}\nČas: ${book.analysis.setting.time}`
                });
            }

            // 3. Composition (Kompozice) - SYLLABUS
            if (book.analysis?.composition) {
                const { structure, timeline } = book.analysis.composition;
                pool.push({
                    type: 'composition',
                    book: book,
                    question: `Jaká je kompozice díla? (Struktura a časová posloupnost)`,
                    answer: `Struktura: ${structure || 'Neznámo'}\nPosloupnost: ${timeline || 'Neznámo'}`
                });
            }

            // 4. Narrator / Lyrical Subject (Vypravěč) - SYLLABUS
            if (book.analysis?.narration) {
                pool.push({
                    type: 'narrator',
                    book: book,
                    question: `Kdo je vypravěčem (nebo lyrickým subjektem) a jaká je forma vyprávění?`,
                    answer: `${book.analysis.narration.narrator}\n${book.analysis.narration.style || ''}`
                });
            }

            // 5. Theme / Main Idea (Hlavní myšlenka) - SYLLABUS
            if (book.analysis?.themes?.main) {
                pool.push({
                    type: 'theme',
                    book: book,
                    question: `Jaké je hlavní téma a myšlenka tohoto díla?`,
                    answer: book.analysis.themes.main
                });
            }

            // 6. Characters (Postavy) - SYLLABUS
            if (book.analysis?.characters?.length > 0) {
                const allChars = book.analysis.characters
                    .map(c => `• ${c.name} (${c.traits?.Role || ''})`)
                    .join('\n');

                if (allChars) {
                    pool.push({
                        type: 'characters',
                        book: book,
                        question: `Vyjmenuj hlavní postavy a stručně je charakterizuj.`,
                        answer: allChars
                    });
                }
            }

            // 7. Author Context (O autorovi) - EXTRA/SYLLABUS
            if (book.analysis?.authorContext?.shortBio) {
                const bio = book.analysis.authorContext.shortBio.info.join('\n• ');
                pool.push({
                    type: 'author',
                    book: book,
                    question: `Co víš o autorovi tohoto díla? (Zasadit do kontextu)`,
                    answer: `• ${bio}`
                });
            }

            // 8. Excerpt Analysis (Práce s textem)
            if (book.analysis?.excerpt?.text) {
                const cleanExcerpt = book.analysis.excerpt.text.split('\\n').join('\n');
                pool.push({
                    type: 'excerpt',
                    book: book,
                    question: `Přečti si pozorně úryvek. Z jakého je díla, kdo je autorem a **kde v díle se tento úryvek nachází**?\n\n"${cleanExcerpt.slice(0, 300)}${cleanExcerpt.length > 300 ? '...' : ''}"`,
                    answer: `Dílo: ${book.title}\nAutor: ${book.author}\n\nKontext: ${book.analysis.excerpt.context || 'Není uveden.'}`
                });
            }
        });
        return pool;
    };

    const handleSelectBook = (bookId) => {
        setSelectedBookId(bookId);
        const pool = generateQuestionPool(bookId);

        // Reset defaults
        setShowExcerpts(true);

        if (bookId === 'all') {
            // Immediate start for 'all' with defaults
            startQuiz(pool, 20);
        } else {
            // Go to config for specific book
            setPreviewQuestions(pool);
            setQuestionLimit(Math.min(10, pool.length));
            setStage('config');
        }
    };

    const startQuiz = (pool, limit) => {
        // Filter excerpts if disabled
        const filteredPool = showExcerpts
            ? pool
            : pool.filter(q => q.type !== 'excerpt');

        const finalLimit = Math.min(limit, filteredPool.length);
        const shuffled = filteredPool.sort(() => Math.random() - 0.5).slice(0, finalLimit);

        setQuestions(shuffled);
        setStage('quiz');
        setCurrentIndex(0);
        setScore({ correct: 0, total: 0 });
        setUserAnswer('');
        setShowAnswer(false);
    };

    const handleNext = (wasCorrect) => {
        setScore(prev => ({
            correct: prev.correct + (wasCorrect ? 1 : 0),
            total: prev.total + 1
        }));

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setShowAnswer(false);
        } else {
            setStage('result');
        }
    };

    const handleRestart = () => {
        setStage('selection');
        setSelectedBookId('all');
    };

    const getQuestionTypeLabel = (type) => {
        const labels = {
            form: 'LITERÁRNÍ FORMA A ŽÁNR',
            setting: 'ČASOPROSTOR',
            composition: 'KOMPOZICE',
            narrator: 'VYPRAVĚČ',
            theme: 'HLAVNÍ TÉMA',
            characters: 'POSTAVY',
            author: 'AUTOR',
            excerpt: 'PRÁCE S TEXTEM'
        };
        return labels[type] || type;
    };

    // Calculate effective questions for config stage
    const effectiveQuestions = useMemo(() => {
        return showExcerpts
            ? previewQuestions
            : previewQuestions.filter(q => q.type !== 'excerpt');
    }, [previewQuestions, showExcerpts]);

    // --- Render Components ---

    if (stage === 'selection') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-4">
                <div className="grid md:grid-cols-2 gap-8 h-[400px]">
                    {/* All Books Option */}
                    <button
                        onClick={() => handleSelectBook('all')}
                        className="group relative flex flex-col items-center justify-center border border-terminal-border/30 hover:border-terminal-accent/50 bg-terminal-bg hover:bg-terminal-accent/5 transition-all duration-500 h-full"
                    >
                        <div className="w-32 h-32 rounded-full border-2 border-terminal-accent/20 flex items-center justify-center group-hover:scale-110 group-hover:border-terminal-accent transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_50px_rgba(0,255,150,0.1)]">
                            <FaGlobe className="text-5xl text-terminal-accent/80 group-hover:text-terminal-highlight transition-colors" />
                        </div>
                    </button>

                    {/* Specific Book Option */}
                    <div className="flex flex-col border border-terminal-border/30 bg-terminal-bg/30 h-full overflow-hidden">
                        <div className="p-6 border-b border-terminal-border/20 bg-terminal-bg flex justify-center">
                            <div className="w-16 h-16 rounded-full border border-terminal-border/30 flex items-center justify-center">
                                <FaBook className="text-2xl text-terminal-text/60" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            {availableBooks.map(book => (
                                <button
                                    key={book.id}
                                    onClick={() => handleSelectBook(book.id)}
                                    className="w-full text-center px-6 py-4 border-b border-terminal-border/10 hover:bg-terminal-accent/10 hover:text-terminal-accent transition-all text-sm font-medium last:border-0"
                                >
                                    {book.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'config') {
        const selectedBook = availableBooks.find(b => b.id === parseInt(selectedBookId));
        return (
            <div className="max-w-2xl mx-auto terminal-card p-8 space-y-8">
                <div className="text-center border-b border-terminal-border/20 pb-6">
                    <div className="inline-block p-3 rounded-full bg-terminal-accent/10 mb-4">
                        <FaBook className="text-2xl text-terminal-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-terminal-text">{selectedBook?.title}</h2>
                    <p className="text-terminal-text/60">{selectedBook?.author}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Questions Count Slider */}
                    <div className="space-y-4">
                        <label className="flex justify-between text-sm text-terminal-text/80">
                            <span>Počet otázek</span>
                            <span className="text-terminal-accent font-bold">{Math.min(questionLimit, effectiveQuestions.length)}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max={Math.max(1, effectiveQuestions.length)}
                            value={Math.min(questionLimit, effectiveQuestions.length)}
                            onChange={(e) => setQuestionLimit(parseInt(e.target.value))}
                            className="w-full h-2 bg-terminal-border/30 rounded-lg appearance-none cursor-pointer accent-terminal-accent"
                        />
                        <div className="flex justify-between text-xs text-terminal-text/40">
                            <span>1</span>
                            <span>{effectiveQuestions.length} (Max)</span>
                        </div>
                    </div>

                    {/* Excerpt Toggle */}
                    <div className="flex items-center justify-between p-4 border border-terminal-border/30 rounded bg-terminal-bg/30">
                        <div className="flex items-center gap-3">
                            <FaQuoteRight className={`text-xl ${showExcerpts ? 'text-terminal-accent' : 'text-terminal-text/30'}`} />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-terminal-text/80">Ukázky z díla</span>
                                <span className="text-xs text-terminal-text/40">Zahrnout práci s textem?</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowExcerpts(!showExcerpts)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${showExcerpts ? 'bg-terminal-accent' : 'bg-terminal-border/30'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-terminal-bg transition-all ${showExcerpts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="border border-terminal-border/30 rounded-lg overflow-hidden bg-terminal-bg/50">
                    <div className="px-4 py-3 border-b border-terminal-border/20 bg-terminal-surface flex items-center gap-2">
                        <FaList className="text-terminal-text/50" />
                        <span className="text-sm font-bold text-terminal-text/70">
                            Náhled otázek ({effectiveQuestions.length})
                        </span>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {effectiveQuestions.map((q, idx) => (
                            <div key={idx} className="text-xs text-terminal-text/60 border-l-2 border-terminal-border/30 pl-3">
                                <span className="uppercase text-[10px] tracking-wider text-terminal-accent/70 block mb-1">
                                    {getQuestionTypeLabel(q.type)}
                                </span>
                                {q.question.slice(0, 80)}{q.question.length > 80 ? '...' : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => setStage('selection')}
                        className="flex-1 py-3 px-4 border border-terminal-border/30 text-terminal-text/60 hover:text-terminal-text hover:bg-terminal-surface transition-colors rounded"
                    >
                        Zpět
                    </button>
                    <button
                        onClick={() => startQuiz(previewQuestions, questionLimit)}
                        className="flex-[2] py-3 px-4 bg-terminal-accent text-terminal-bg font-bold hover:opacity-90 transition-opacity rounded flex items-center justify-center gap-2"
                    >
                        <FaPlay className="text-sm" /> Spustit Kvíz
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'result') {
        return (
            <div className="max-w-2xl mx-auto terminal-card text-center p-8">
                <div className="mb-8">
                    <div className="text-6xl mb-4 animate-bounce-slow">
                        {score.correct / score.total >= 0.8 ? '🎉' : score.correct / score.total >= 0.5 ? '👍' : '📚'}
                    </div>
                    <h2 className="text-2xl text-terminal-text mb-2 font-bold">
                        Kvíz dokončen!
                    </h2>
                    <p className="text-terminal-text/60">
                        Skóre: {score.correct} / {score.total}
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleRestart}
                        className="px-8 py-3 bg-terminal-accent/10 border border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/20 transition-all flex items-center"
                    >
                        <FaRedo className="mr-2" />
                        Nový Kvíz
                    </button>
                </div>
            </div>
        );
    }

    // --- Quiz Stage ---
    const currentQ = questions[currentIndex];

    if (!currentQ) return <div className="text-center p-10">Načítání otázek...</div>;

    // CONDITIONAL HEADER: Hide for 'excerpt' questions
    const showHeader = currentQ.type !== 'excerpt';

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-end text-xs text-terminal-text/60 border-b border-terminal-border/20 pb-2">
                <span>Otázka {currentIndex + 1} / {questions.length}</span>
                <span className="text-terminal-accent/80 font-mono uppercase tracking-widest">
                    {getQuestionTypeLabel(currentQ.type)}
                </span>
            </div>

            <div className="terminal-card shadow-lg shadow-terminal-accent/5">
                <div className="mb-8">
                    {showHeader && (
                        <div className="flex gap-2 mb-4 animate-fade-in">
                            <span className="text-xs px-2 py-0.5 border border-terminal-border/30 text-terminal-text/60 bg-terminal-surface">
                                {currentQ.book.title}
                            </span>
                            <span className="text-xs px-2 py-0.5 text-terminal-text/40">
                                {currentQ.book.author}
                            </span>
                        </div>
                    )}

                    <h2 className="text-xl md:text-2xl text-terminal-text leading-relaxed whitespace-pre-line">
                        {currentQ.type === 'excerpt' ? (
                            // Render markdown-like bold for excerpt question
                            currentQ.question.split('**').map((part, i) =>
                                i % 2 === 1 ? <span key={i} className="text-terminal-accent font-bold">{part}</span> : part
                            )
                        ) : (
                            currentQ.question
                        )}
                    </h2>
                </div>

                {!showAnswer ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-terminal-text/60 mb-2 uppercase tracking-wide">
                                Tvoje odpověď
                            </label>
                            <textarea
                                value={userAnswer}
                                autoFocus
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Zde si můžeš napsat odpověď (nepovinné)..."
                                className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border/30 text-terminal-text rounded focus:border-terminal-accent focus:outline-none resize-none min-h-[100px]"
                            />
                        </div>
                        <button
                            onClick={() => setShowAnswer(true)}
                            className="w-full px-6 py-4 bg-terminal-accent text-terminal-bg font-bold hover:opacity-90 transition-opacity"
                        >
                            ZOBRAZIT ODPOVĚĎ
                        </button>
                    </div>
                ) : (
                    <div className="animate-slide-up space-y-6">
                        {userAnswer && (
                            <div className="p-4 border-l-2 border-terminal-border/30 bg-terminal-bg/50">
                                <p className="text-xs text-terminal-text/40 mb-1 uppercase">Tvoje poznámka</p>
                                <p className="text-terminal-text/80 italic">{userAnswer}</p>
                            </div>
                        )}

                        <div className="p-6 bg-terminal-accent/10 border border-terminal-accent/20 rounded shadow-inner">
                            <p className="text-xs text-terminal-accent/80 mb-2 uppercase font-bold tracking-wider">
                                &gt; Správná odpověď
                            </p>
                            <p className="text-lg text-terminal-text font-medium whitespace-pre-line">
                                {currentQ.answer}
                            </p>
                        </div>

                        <div className="border-t border-terminal-border/20 pt-6">
                            <p className="text-center text-terminal-text/60 mb-6 text-sm font-medium">
                                Měl/a jsi pravdu?
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleNext(false)}
                                    className="px-4 py-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex justify-center items-center"
                                >
                                    <FaTimes className="mr-2" /> NE
                                </button>
                                <button
                                    onClick={() => handleNext(true)}
                                    className="px-4 py-4 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors flex justify-center items-center"
                                >
                                    <FaCheck className="mr-2" /> ANO
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full bg-terminal-border/20 h-1 rounded-full overflow-hidden">
                <div
                    className="bg-terminal-accent h-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default QuizMode;
