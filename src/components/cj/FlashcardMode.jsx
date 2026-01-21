import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

const FlashcardMode = ({ filter }) => {
    const [books, setBooks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        let filtered = [...cjBooksData.books];

        // Filter by period
        if (filter !== 'all') {
            filtered = filtered.filter(book => book.period === filter);
        }

        setBooks(filtered);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [filter]);

    const currentBook = books[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % books.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
    };

    const handleShuffle = () => {
        const shuffled = [...books].sort(() => Math.random() - 0.5);
        setBooks(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

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

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-terminal-text/60">
                    {currentIndex + 1} / {books.length}
                </div>
                <button
                    onClick={handleShuffle}
                    className="icon-btn"
                    title="Shuffle"
                >
                    <FaRandom />
                </button>
            </div>

            {/* Flashcard */}
            <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="terminal-card cursor-pointer transition-all duration-300"
            >
                {/* Book Title */}
                <div className="p-8">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-terminal-accent/60 mb-4 tracking-wider">
                            &gt; KNIHA
                        </div>
                        <h2 className="text-xl text-center text-terminal-text mb-2">
                            {currentBook.title}
                        </h2>
                        <p className="text-sm text-terminal-accent/70">
                            {currentBook.author}
                        </p>
                        {!isFlipped && (
                            <div className="mt-6 text-xs text-terminal-text/40">
                                [ CLICK TO REVEAL ]
                            </div>
                        )}
                    </div>
                </div>

                {/* Details - Slide down */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${isFlipped ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="border-t border-terminal-border/30 p-8 space-y-3">
                        <div className="text-xs text-terminal-accent/60 mb-3 tracking-wider">
                            &gt; DETAILS
                        </div>
                        <div>
                            <span className="text-xs text-terminal-text/40">Období:</span>
                            <p className="text-sm text-terminal-text/90">{currentBook.period}</p>
                        </div>
                        <div>
                            <span className="text-xs text-terminal-text/40">Žánr:</span>
                            <p className="text-sm text-terminal-text/90">{currentBook.genre}</p>
                        </div>
                        <div>
                            <span className="text-xs text-terminal-text/40">Rok:</span>
                            <p className="text-sm text-terminal-text/90">{currentBook.year}</p>
                        </div>
                        {currentBook.subworks && (
                            <div>
                                <span className="text-xs text-terminal-text/40">Díla:</span>
                                <p className="text-sm text-terminal-text/90">{currentBook.subworks.join(', ')}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-xs text-terminal-text/40">Klíčová slova:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {currentBook.keywords?.map((kw, i) => (
                                    <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={handlePrev}
                    className="icon-btn flex items-center gap-2"
                >
                    <FaArrowLeft />
                    <span className="text-xs">PREV</span>
                </button>
                <button
                    onClick={handleNext}
                    className="icon-btn flex items-center gap-2"
                >
                    <span className="text-xs">NEXT</span>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default FlashcardMode;
