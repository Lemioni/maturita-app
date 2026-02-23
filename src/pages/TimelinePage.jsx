import { useState, useMemo } from 'react';
import { FaClock, FaBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import cjBooks from '../data/cj-books.json';
import dictionaryData from '../data/dictionary.json';
import generatedBookTermsData from '../data/cj-book-terms.generated.json';
import TermAnnotatedText from '../components/common/TermAnnotatedText';
import { buildBookTerms } from '../utils/bookTerms';

const generatedTermsByBookId = new Map((generatedBookTermsData?.books || []).map((entry) => [entry.id, entry.terms || []]));

// Color palette for movements
const MOVEMENT_COLORS = {
    'Romantismus': '#ef4444',
    'Realismus': '#3b82f6',
    'Naturalismus': '#6366f1',
    'Symbolismus': '#8b5cf6',
    'Dekadence': '#a855f7',
    'Expresionismus': '#ec4899',
    'Existencialismus': '#f43f5e',
    'Absurdní drama': '#f97316',
    'Poetismus': '#14b8a6',
    'Surrealismus': '#06b6d4',
    'Preromantismus': '#fb923c',
    'Klasicismus': '#eab308',
    'Moderní próza': '#10b981',
    'Válečná próza': '#78716c',
    'Sociální próza': '#64748b',
};

const getColor = (movement) => {
    if (!movement) return '#6b7280';
    for (const [key, color] of Object.entries(MOVEMENT_COLORS)) {
        if (movement.toLowerCase().includes(key.toLowerCase())) return color;
    }
    return '#6b7280';
};

const TimelinePage = () => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [showMovements, setShowMovements] = useState(true);

    const books = useMemo(() => {
        return cjBooks.books
            .map(b => ({
                ...b,
                yearNum: parseInt(b.year) || 0,
                movement: b.analysis?.literaryContext?.movement || b.period || 'Neznámé',
            }))
            .filter(b => b.yearNum > 0)
            .sort((a, b) => a.yearNum - b.yearNum);
    }, []);

    const movements = useMemo(() => {
        const map = {};
        books.forEach(b => {
            if (!map[b.movement]) map[b.movement] = [];
            map[b.movement].push(b);
        });
        return Object.entries(map).sort((a, b) => {
            const minA = Math.min(...a[1].map(x => x.yearNum));
            const minB = Math.min(...b[1].map(x => x.yearNum));
            return minA - minB;
        });
    }, [books]);

    const minYear = books.length > 0 ? books[0].yearNum - 10 : 1800;
    const maxYear = books.length > 0 ? books[books.length - 1].yearNum + 10 : 2020;
    const yearRange = maxYear - minYear;

    const getPosition = (year) => ((year - minYear) / yearRange) * 100;
    const selectedBookTerms = useMemo(
        () => (selectedBook ? buildBookTerms(selectedBook, dictionaryData.terms, generatedTermsByBookId.get(selectedBook.id)) : []),
        [selectedBook]
    );

    return (
        <div className="max-w-6xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaClock /> Časová osa literatury
                </h1>
                <button
                    onClick={() => setShowMovements(!showMovements)}
                    className={`px-3 py-1 text-xs rounded border transition ${showMovements ? 'bg-terminal-accent text-terminal-bg border-terminal-accent' : 'text-terminal-text/50 border-terminal-border/30'
                        }`}
                >
                    {showMovements ? 'Skrýt směry' : 'Zobrazit směry'}
                </button>
            </div>

            {/* Movement legend */}
            {showMovements && (
                <div className="terminal-card mb-4">
                    <div className="flex flex-wrap gap-2">
                        {movements.map(([name, bks]) => (
                            <span key={name} className="flex items-center gap-1.5 text-[11px]">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getColor(name) }} />
                                <span className="text-terminal-text/70">{name} ({bks.length})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="terminal-card overflow-x-auto">
                <div className="relative min-w-[800px]" style={{ height: `${movements.length * 48 + 80}px` }}>
                    {/* Year marks */}
                    {Array.from({ length: Math.ceil(yearRange / 20) + 1 }, (_, i) => {
                        const year = minYear + i * 20;
                        if (year > maxYear) return null;
                        return (
                            <div key={year} className="absolute top-0 bottom-0" style={{ left: `${getPosition(year)}%` }}>
                                <div className="absolute top-0 text-[10px] text-terminal-text/30 -translate-x-1/2">{year}</div>
                                <div className="absolute top-5 bottom-0 w-px bg-terminal-border/10" />
                            </div>
                        );
                    })}

                    {/* Movement rows */}
                    {movements.map(([name, bks], rowIdx) => (
                        <div key={name} className="absolute left-0 right-0" style={{ top: `${rowIdx * 48 + 30}px`, height: '40px' }}>
                            {/* Row background */}
                            <div className="absolute inset-0 bg-terminal-border/5 rounded" style={{ borderLeft: `3px solid ${getColor(name)}40` }} />

                            {/* Books */}
                            {bks.map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBook(selectedBook?.id === b.id ? null : b)}
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group"
                                    style={{ left: `${getPosition(b.yearNum)}%` }}
                                    title={`${b.title} (${b.year}) — ${b.author}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-all group-hover:scale-125 ${selectedBook?.id === b.id ? 'scale-125 ring-2 ring-white/30' : ''
                                        }`} style={{
                                            backgroundColor: `${getColor(name)}30`,
                                            borderColor: getColor(name),
                                            color: getColor(name),
                                        }}>
                                        {b.id}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected book detail */}
            {selectedBook && (
                <div className="terminal-card mt-4 border-l-2" style={{ borderLeftColor: getColor(selectedBook.movement) }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-terminal-accent"><TermAnnotatedText text={selectedBook.title} terms={selectedBookTerms} /></h3>
                            <p className="text-xs text-terminal-text/60"><TermAnnotatedText text={selectedBook.author} terms={selectedBookTerms} /> · {selectedBook.year}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="compact-pill">{selectedBook.genre}</span>
                                <span className="compact-pill">{selectedBook.movement}</span>
                                <span className="compact-pill">{selectedBook.literaryForm}</span>
                            </div>
                            {selectedBook.analysis?.themes?.main && (
                                <p className="text-xs text-terminal-text/70 mt-2"><TermAnnotatedText text={selectedBook.analysis.themes.main} terms={selectedBookTerms} /></p>
                            )}
                        </div>
                        <Link to={`/cj/book/${selectedBook.id}`} className="px-3 py-1 text-xs bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90">
                            Detail →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelinePage;
