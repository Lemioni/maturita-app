import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaBook, FaUser, FaMapMarkerAlt, FaClock, FaTheaterMasks, FaPen, FaGlobe, FaChevronDown, FaChevronUp, FaListUl, FaFileAlt } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import cjBooksData from '../data/bookData.js';
import useLocalStorage from '../hooks/useLocalStorage';
import KnowledgeCheckbox from '../components/common/KnowledgeCheckbox';
import TableOfContents from '../components/common/TableOfContents';

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progress, setProgress] = useLocalStorage('maturita-progress', {});
    const [isPlotExpanded, setIsPlotExpanded] = useState(false);
    const [isShortVersion, setIsShortVersion] = useLocalStorage('maturita-short-version', false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedStoryIndex(0);
    }, [id]);

    const bookId = parseInt(id);
    const book = cjBooksData.books.find(b => b.id === bookId);

    // Generate table of contents from analysis
    const tableOfContents = useMemo(() => {
        if (!book?.analysis) return [];

        const sections = [
            { id: 'section-nazev', title: 'Analýza názvu', level: 2, number: 1 },
            { id: 'section-dej', title: 'Děj', level: 2, number: 2 },
            { id: 'section-tema', title: 'Téma a motivy', level: 2, number: 3 },
            { id: 'section-casoprostor', title: 'Časoprostor', level: 2, number: 4 },
            { id: 'section-kompozice', title: 'Kompozice', level: 2, number: 5 },
            { id: 'section-druh', title: 'Literární druh a žánr', level: 2, number: 6 },
            { id: 'section-vypravec', title: 'Vypravěč', level: 2, number: 7 },
            { id: 'section-postavy', title: 'Postavy', level: 2, number: 8 },
            { id: 'section-ukazka', title: 'Ukázka z textu', level: 2, number: 9 },
            { id: 'section-jazyk', title: 'Jazykové prostředky', level: 2, number: 10 },
            { id: 'section-tropy', title: 'Tropy a figury', level: 2, number: 11 },
            { id: 'section-autor', title: 'Kontext autorovy tvorby', level: 2, number: 12 },
            { id: 'section-literarni', title: 'Literární a kulturní kontext', level: 2, number: 13 },
            { id: 'section-dalsi', title: 'Další informace', level: 2, number: 14 },
        ];
        const analysis = book.analysis;
        if (!analysis) return [];
        // Filter out sections that don't have data
        return sections.filter(section => {
            if (section.id === 'section-nazev' && !analysis.titleAnalysis) return false;
            if (section.id === 'section-kompozice' && !analysis.composition) return false;
            if (section.id === 'section-ukazka' && !analysis.excerpt) return false;
            if (section.id === 'section-dalsi' && !analysis.additionalInfo) return false;
            return true;
        });
    }, [book]);

    if (!book) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="terminal-card border-l-4 border-red-500">
                    <h2 className="text-lg font-bold text-red-400 mb-2">ERROR: BOOK NOT FOUND</h2>
                    <p className="text-terminal-text/60 mb-4">Book #{id} does not exist.</p>
                    <Link to="/cj" className="text-terminal-accent hover:underline">
                        ← BACK TO LIST
                    </Link>
                </div>
            </div>
        );
    }

    const allBooks = cjBooksData.books;
    const currentIndex = allBooks.findIndex(b => b.id === bookId);
    const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : null;
    const nextBook = currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : null;

    const isKnown = progress.cjBooks?.[bookId]?.known || false;

    const toggleKnown = (known) => {
        setProgress(prev => ({
            ...prev,
            cjBooks: {
                ...(prev.cjBooks || {}),
                [bookId]: {
                    ...(prev.cjBooks?.[bookId] || {}),
                    known,
                    lastReviewed: new Date().toISOString(),
                }
            }
        }));
    };

    const rawAnalysis = book.analysis;
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const analysis = useMemo(() => {
        if (!rawAnalysis) return null;
        if (rawAnalysis.stories && rawAnalysis.stories[selectedStoryIndex]) {
            return { ...rawAnalysis, ...rawAnalysis.stories[selectedStoryIndex] };
        }
        return rawAnalysis;
    }, [rawAnalysis, selectedStoryIndex]);

    return (
        <div className="max-w-5xl mx-auto space-y-4">
            {/* Back Button */}
            <button
                onClick={() => navigate('/cj')}
                className="flex items-center text-terminal-accent hover:text-terminal-border transition-colors"
            >
                <FaArrowLeft className="mr-2" />
                BACK
            </button>

            {/* Book Header */}
            <div className="terminal-card">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs text-terminal-text/60">#{book.id}</span>
                    <span className="text-xs px-2 py-1 border border-terminal-border/30 text-terminal-text/80">
                        {book.period}
                    </span>
                    <span className="text-xs px-2 py-1 border border-terminal-text/20 text-terminal-text/60">
                        {book.genre}
                    </span>
                    <span className="text-xs text-terminal-text/40">{book.year}</span>
                </div>

                <h1 className="text-2xl font-bold text-terminal-accent mb-2">
                    {book.title}
                </h1>
                <p className="text-lg text-terminal-text/80 mb-4">
                    {book.author}
                </p>

                {/* Checkbox */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-terminal-text/60">STATUS:</span>
                    <KnowledgeCheckbox
                        questionId={`cj-${bookId}`}
                        initialKnown={isKnown}
                        onChange={toggleKnown}
                    />
                </div>

                {/* Version Toggle */}
                {analysis && (
                    <button
                        onClick={() => setIsShortVersion(!isShortVersion)}
                        className={`mt-4 flex items-center gap-2 px-3 py-2 border transition-all ${isShortVersion
                            ? 'bg-terminal-accent/20 border-terminal-accent text-terminal-accent'
                            : 'bg-transparent border-terminal-border/30 text-terminal-text/70 hover:border-terminal-accent/50'
                            }`}
                    >
                        {isShortVersion ? <FaListUl className="text-sm" /> : <FaFileAlt className="text-sm" />}
                        <span className="text-xs font-bold">{isShortVersion ? 'KRÁTKÁ VERZE' : 'PLNÁ VERZE'}</span>
                    </button>
                )}
            </div>

            {/* Stories Selector (for books like Poe) */}
            {rawAnalysis?.stories && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {rawAnalysis.stories.map((story, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedStoryIndex(index)}
                            className={`px-4 py-2 border transition-colors ${selectedStoryIndex === index
                                ? 'bg-terminal-accent text-terminal-bg border-terminal-accent font-bold'
                                : 'bg-terminal-bg border-terminal-border/30 text-terminal-text/70 hover:border-terminal-accent/50'
                                }`}
                        >
                            {story.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Analysis Content */}
            {
                analysis ? (
                    <>
                        {/* Table of Contents */}
                        <TableOfContents sections={tableOfContents} />

                        {/* I. ČÁST - Analýza uměleckého textu */}
                        <div className="terminal-card">
                            <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">I. ČÁST</span>
                                ANALÝZA UMĚLECKÉHO TEXTU
                            </div>

                            {/* Analýza názvu */}
                            {analysis.titleAnalysis && (
                                <div id="section-nazev" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">📌</span>
                                        <span>Analýza názvu díla</span>
                                    </h3>
                                    <div className="text-terminal-text/90 pl-4 border-l-2 border-terminal-border/20">
                                        {analysis.titleAnalysis}
                                    </div>
                                </div>
                            )}

                            {/* Děj - Collapsible */}
                            <div id="section-dej" className="mb-6 scroll-mt-4">
                                <button
                                    onClick={() => setIsPlotExpanded(!isPlotExpanded)}
                                    className="w-full flex items-center justify-between text-terminal-accent mb-3 hover:opacity-80 transition-opacity"
                                >
                                    <h3 className="flex items-center gap-2">
                                        <FaBook className="text-sm" />
                                        <span>Děj</span>
                                    </h3>
                                    <span className="text-xs flex items-center gap-1 text-terminal-text/50">
                                        {isPlotExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        <span>{isPlotExpanded ? 'Skrýt' : 'Zobrazit'}</span>
                                    </span>
                                </button>
                                {isPlotExpanded && (
                                    <div className="text-terminal-text/90 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-terminal-border/20 animate-fadeIn">
                                        {analysis.plot.split('\\n').join('\n')}
                                    </div>
                                )}
                                {!isPlotExpanded && (
                                    <div className="text-terminal-text/50 text-xs pl-4 border-l-2 border-terminal-border/20 italic">
                                        Klikni pro zobrazení děje...
                                    </div>
                                )}
                            </div>

                            {/* Téma a motivy */}
                            {analysis.themes && (
                                <div id="section-tema" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">💡</span>
                                        <span>Téma a motivy</span>
                                    </h3>
                                    {isShortVersion ? (
                                        <div className="pl-4 border-l-2 border-terminal-border/20 space-y-2">
                                            <p className="text-terminal-text/90 text-sm">{analysis.themes.main}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.themes.motifs?.map((motif, i) => (
                                                    <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                                        {motif}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pl-4 border-l-2 border-terminal-border/20 space-y-3">
                                            <div>
                                                <span className="text-xs text-terminal-text/50">TÉMA:</span>
                                                <p className="text-terminal-text/90">{analysis.themes.main}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-terminal-text/50">MOTIVY:</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {analysis.themes.motifs?.map((motif, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                                            {motif}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Časoprostor */}
                            {analysis.setting && (
                                <div id="section-casoprostor" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">🌍</span>
                                        <span>Časoprostor</span>
                                    </h3>
                                    <div className="p-4 border border-terminal-border/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-terminal-text/50 flex items-center gap-1">
                                                    <FaMapMarkerAlt /> MÍSTO:
                                                </span>
                                                <p className="text-terminal-text/90">{analysis.setting.place}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-terminal-text/50 flex items-center gap-1">
                                                    <FaClock /> ČAS:
                                                </span>
                                                <p className="text-terminal-text/90">{analysis.setting.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kompozice */}
                            {analysis.composition && (
                                <div id="section-kompozice" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">🏗️</span>
                                        <span>Kompozice</span>
                                    </h3>
                                    <div className="p-4 border border-terminal-border/20">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {analysis.composition.structure && (
                                                <div>
                                                    <span className="text-xs text-terminal-text/50">STRUKTURA:</span>
                                                    <p className="text-terminal-text/90">{analysis.composition.structure}</p>
                                                </div>
                                            )}
                                            {analysis.composition.timeline && (
                                                <div>
                                                    <span className="text-xs text-terminal-text/50">ČASOVÁ LINIE:</span>
                                                    <p className="text-terminal-text/90">{analysis.composition.timeline}</p>
                                                </div>
                                            )}
                                            {analysis.composition.rhyme && (
                                                <div>
                                                    <span className="text-xs text-terminal-text/50">RÝM:</span>
                                                    <p className="text-terminal-text/90">{analysis.composition.rhyme}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Literární druh a žánr */}
                            <div id="section-druh" className="mb-6 scroll-mt-4">
                                <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                    <span className="text-sm">📚</span>
                                    <span>Literární druh a žánr</span>
                                </h3>
                                <div className="p-4 border border-terminal-border/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-terminal-text/50">DRUH:</span>
                                            <p className="text-terminal-text/90">{book.literaryForm}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-terminal-text/50">ŽÁNR:</span>
                                            <p className="text-terminal-text/90">{book.genre}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* II. ČÁST - Charakteristika postav */}
                        <div className="terminal-card">
                            <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">II. ČÁST</span>
                                CHARAKTERISTIKA POSTAV A VYPRAVĚČ
                            </div>

                            {/* Vypravěč */}
                            {analysis.narration && (
                                <div id="section-vypravec" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">🎭</span>
                                        <span>Vypravěč a způsob vyprávění</span>
                                    </h3>
                                    <div className="pl-4 border-l-2 border-terminal-border/20 space-y-2">
                                        <p className="text-terminal-text/90"><strong>Typ:</strong> {analysis.narration.narrator}</p>
                                        <p className="text-terminal-text/90"><strong>Styl:</strong> {analysis.narration.style}</p>
                                    </div>
                                </div>
                            )}

                            {/* Postavy */}
                            {analysis.characters && analysis.characters.length > 0 && (
                                <div id="section-postavy" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <FaUser className="text-sm" />
                                        <span>Postavy</span>
                                    </h3>
                                    {isShortVersion ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {analysis.characters.map((char, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 border ${char.isMain
                                                        ? 'border-terminal-accent/50 bg-terminal-accent/5'
                                                        : 'border-terminal-border/30 bg-terminal-bg/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <span className={`font-bold text-sm ${char.isMain ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                                                            {char.name}
                                                        </span>
                                                        {char.isMain && <span className="text-terminal-accent text-xs">★</span>}
                                                    </div>
                                                    {char.traits ? (
                                                        <div className="space-y-0.5">
                                                            {Object.entries(char.traits).map(([key, value], j) => (
                                                                <div key={j} className="text-xs">
                                                                    <span className="text-terminal-accent/70 font-medium">{key}:</span>
                                                                    <span className="text-terminal-text/70 ml-1">{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-terminal-text/70 text-xs">{char.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {analysis.characters.map((char, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-4 border ${char.isMain
                                                        ? 'border-terminal-accent/50 bg-terminal-accent/5'
                                                        : 'border-terminal-border/30 bg-terminal-bg/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className={`font-bold ${char.isMain ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                                                            {char.name}
                                                        </span>
                                                        {char.isMain && (
                                                            <span className="text-xs px-1.5 py-0.5 bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30">
                                                                HLAVNÍ
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* New structured traits format */}
                                                    {char.traits ? (
                                                        <div className="space-y-1.5">
                                                            {Object.entries(char.traits).map(([key, value], j) => (
                                                                <div key={j} className="text-sm">
                                                                    <span className="text-terminal-accent/70 font-medium">{key}:</span>
                                                                    <span className="text-terminal-text/80 ml-1">{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        /* Fallback to old description format */
                                                        <p className="text-terminal-text/80 text-sm">{char.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ukázka z textu - only in full version */}
                            {!isShortVersion && analysis.excerpt && (
                                <div id="section-ukazka" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <span className="text-sm">📜</span>
                                        <span>Ukázka z textu</span>
                                    </h3>
                                    <div className="pl-4 border-l-2 border-terminal-accent/50 space-y-4">
                                        <div className="bg-terminal-bg/50 p-4 border border-terminal-border/30 font-mono text-sm whitespace-pre-line">
                                            {analysis.excerpt.text.split('\\n').join('\n')}
                                        </div>
                                        <div>
                                            <span className="text-xs text-terminal-text/50">KONTEXT:</span>
                                            <p className="text-terminal-text/80 mt-1">{analysis.excerpt.context}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* III. ČÁST - Jazykové prostředky */}
                        <div className="terminal-card">
                            <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">III. ČÁST</span>
                                JAZYKOVÉ PROSTŘEDKY
                            </div>

                            {/* Jazykové prostředky */}
                            {analysis.languageDevices && analysis.languageDevices.length > 0 && (
                                <div id="section-jazyk" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <FaPen className="text-sm" />
                                        <span>Jazykové prostředky</span>
                                    </h3>
                                    {isShortVersion ? (
                                        <div className="pl-4 border-l-2 border-terminal-border/20 flex flex-wrap gap-2">
                                            {analysis.languageDevices.map((device, i) => {
                                                const name = device.split('–')[0].trim();
                                                return (
                                                    <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                                        {name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <ul className="pl-4 border-l-2 border-terminal-border/20 space-y-2">
                                            {analysis.languageDevices.map((device, i) => (
                                                <li key={i} className="text-terminal-text/90 text-sm">
                                                    • {device}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Tropy a figury */}
                            {analysis.literaryDevices && analysis.literaryDevices.length > 0 && (
                                <div id="section-tropy" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <FaTheaterMasks className="text-sm" />
                                        <span>Tropy a figury</span>
                                    </h3>
                                    {isShortVersion ? (
                                        <div className="pl-4 border-l-2 border-terminal-border/20 flex flex-wrap gap-2">
                                            {analysis.literaryDevices.map((device, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                                    {device.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pl-4 border-l-2 border-terminal-border/20 space-y-3">
                                            {analysis.literaryDevices.map((device, i) => (
                                                <div key={i}>
                                                    <span className="font-bold text-terminal-text">{device.name}</span>
                                                    <span className="text-terminal-text/60"> – </span>
                                                    <span className="text-terminal-text/80 text-sm">{device.example}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* LITERÁRNĚHISTORICKÝ KONTEXT */}
                        <div className="terminal-card">
                            <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">KONTEXT</span>
                                LITERÁRNĚHISTORICKÝ KONTEXT
                            </div>

                            {/* Autor */}
                            {analysis.authorContext && (
                                <div id="section-autor" className="mb-6 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <FaUser className="text-sm" />
                                        <span>Kontext autorovy tvorby</span>
                                    </h3>
                                    <div className="pl-4 border-l-2 border-terminal-border/20 space-y-4">
                                        {/* Short version - use shortBio if available */}
                                        {isShortVersion && analysis.authorContext.shortBio ? (
                                            <div className="space-y-2">
                                                <p className="text-terminal-accent font-bold">{analysis.authorContext.shortBio.name}</p>
                                                <ul className="space-y-0.5">
                                                    {analysis.authorContext.shortBio.info?.map((item, i) => (
                                                        <li key={i} className="text-terminal-text/80 text-sm">• {item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <>
                                                {analysis.authorContext.bio && <p className="text-terminal-text/90">{analysis.authorContext.bio}</p>}

                                                {/* ŽIVOT - only in full version */}
                                                {analysis.authorContext.life && (
                                                    <div>
                                                        <span className="text-xs text-terminal-text/50">ŽIVOT:</span>
                                                        <ul className="mt-2 space-y-1">
                                                            {analysis.authorContext.life.map((item, i) => (
                                                                <li key={i} className="text-terminal-text/80 text-sm">• {item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Období tvorby - only in full version */}
                                        {!isShortVersion && analysis.authorContext.creationPeriods && (
                                            <div>
                                                <span className="text-xs text-terminal-text/50">OBDOBÍ TVORBY:</span>
                                                <div className="mt-2 space-y-2">
                                                    {analysis.authorContext.creationPeriods.map((period, i) => (
                                                        <div key={i} className="text-sm border-l border-terminal-accent/30 pl-3">
                                                            <span className="text-terminal-accent font-bold">{period.name}</span>
                                                            <p className="text-terminal-text/70">{period.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Zařazení díla */}
                                        {analysis.authorContext.workPosition && (
                                            <div className="bg-terminal-accent/10 p-3 border border-terminal-accent/20">
                                                <span className="text-xs text-terminal-accent">ZAŘAZENÍ DÍLA:</span>
                                                <p className="text-terminal-text/90 mt-1">{analysis.authorContext.workPosition}</p>
                                            </div>
                                        )}

                                        {analysis.authorContext.otherWorks && (
                                            <div>
                                                <span className="text-xs text-terminal-text/50">DALŠÍ DÍLA:</span>
                                                {isShortVersion ? (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {analysis.authorContext.otherWorks.map((work, i) => (
                                                            <span key={i} className="px-2 py-0.5 text-xs border border-terminal-accent/30 text-terminal-accent">
                                                                {work.title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 space-y-2">
                                                        {analysis.authorContext.otherWorks.map((work, i) => (
                                                            <div key={i} className="text-sm">
                                                                <span className="text-terminal-accent">{work.title}</span>
                                                                <span className="text-terminal-text/50"> ({work.year})</span>
                                                                {work.note && <span className="text-terminal-text/60"> – {work.note}</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Literární směr */}
                            {analysis.literaryContext && (
                                <div id="section-literarni" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                        <FaGlobe className="text-sm" />
                                        <span>Literární a kulturní kontext</span>
                                    </h3>
                                    <div className="pl-4 border-l-2 border-terminal-border/20 space-y-4">
                                        <div>
                                            <span className="text-lg text-terminal-accent">{analysis.literaryContext.movement}</span>
                                            <span className="text-terminal-text/50"> {analysis.literaryContext.period && `(${analysis.literaryContext.period})`}</span>
                                            {analysis.literaryContext.description && <p className="text-terminal-text/80 mt-1">{analysis.literaryContext.description}</p>}
                                        </div>

                                        {analysis.literaryContext.characteristics && (
                                            <div>
                                                <span className="text-xs text-terminal-text/50">CHARAKTERISTIKA:</span>
                                                <ul className="mt-2 space-y-1">
                                                    {analysis.literaryContext.characteristics.map((char, i) => (
                                                        <li key={i} className="text-terminal-text/80 text-sm">• {char}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {analysis.literaryContext.otherAuthors && (
                                            <div>
                                                <span className="text-xs text-terminal-text/50">DALŠÍ AUTOŘI SMĚRU:</span>
                                                <div className="mt-2 space-y-3">
                                                    {analysis.literaryContext.otherAuthors.map((author, i) => (
                                                        <div key={i} className="text-sm border-l border-terminal-text/10 pl-3">
                                                            <div>
                                                                <span className="text-terminal-accent font-bold">{author.name}</span>
                                                                <span className="text-terminal-text/50"> {author.years && `(${author.years})`}</span>
                                                            </div>
                                                            {author.note && <p className="text-terminal-text/60 text-xs">{author.note}</p>}
                                                            {author.works && (
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {author.works.map((work, j) => (
                                                                        <span key={j} className="text-xs px-1.5 border border-terminal-border/20 text-terminal-text/70">
                                                                            {work}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DALŠÍ INFORMACE - only in full version */}
                        {!isShortVersion && analysis.additionalInfo && (
                            <div className="terminal-card">
                                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">DALŠÍ</span>
                                    DALŠÍ INFORMACE
                                </div>

                                <div id="section-dalsi" className="scroll-mt-4 space-y-6">
                                    {/* Základní info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.additionalInfo.dominantStyle && (
                                            <div className="pl-4 border-l-2 border-terminal-border/20">
                                                <span className="text-xs text-terminal-text/50">SLOHOVÝ POSTUP:</span>
                                                <p className="text-terminal-text/90">{analysis.additionalInfo.dominantStyle}</p>
                                            </div>
                                        )}
                                        {analysis.additionalInfo.audience && (
                                            <div className="pl-4 border-l-2 border-terminal-border/20">
                                                <span className="text-xs text-terminal-text/50">ADRESÁT:</span>
                                                <p className="text-terminal-text/90">{analysis.additionalInfo.audience}</p>
                                            </div>
                                        )}
                                    </div>

                                    {analysis.additionalInfo.relevance && (
                                        <div className="pl-4 border-l-2 border-terminal-border/20">
                                            <span className="text-xs text-terminal-text/50">AKTUÁLNOST DÍLA:</span>
                                            <p className="text-terminal-text/90">{analysis.additionalInfo.relevance}</p>
                                        </div>
                                    )}

                                    {analysis.additionalInfo.purpose && (
                                        <div className="pl-4 border-l-2 border-terminal-border/20">
                                            <span className="text-xs text-terminal-text/50">SMYSL DÍLA:</span>
                                            <p className="text-terminal-text/90">{analysis.additionalInfo.purpose}</p>
                                        </div>
                                    )}

                                    {/* Podobná díla */}
                                    {analysis.additionalInfo.similarWorks && analysis.additionalInfo.similarWorks.length > 0 && (
                                        <div>
                                            <span className="text-xs text-terminal-text/50">TEMATICKY PODOBNÁ DÍLA:</span>
                                            <div className="mt-2 space-y-3">
                                                {analysis.additionalInfo.similarWorks.map((work, i) => (
                                                    <div key={i} className="pl-4 border-l-2 border-terminal-accent/30">
                                                        <div>
                                                            <span className="text-terminal-accent font-bold">{work.title}</span>
                                                            <span className="text-terminal-text/50"> – {work.author} ({work.year})</span>
                                                        </div>
                                                        <p className="text-terminal-text/70 text-sm">{work.note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Adaptace */}
                                    {analysis.additionalInfo.adaptations && analysis.additionalInfo.adaptations.length > 0 && (
                                        <div>
                                            <span className="text-xs text-terminal-text/50">FILMOVÉ A DIVADELNÍ ADAPTACE:</span>
                                            <ul className="mt-2 space-y-1 pl-4">
                                                {analysis.additionalInfo.adaptations.map((adaptation, i) => (
                                                    <li key={i} className="text-terminal-text/80 text-sm">• {adaptation}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="terminal-card">
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-lg text-terminal-accent mb-2">Rozbor zatím není k dispozici</h3>
                            <p className="text-terminal-text/60 text-sm">
                                Pro tuto knihu ještě nebyl přidán podrobný maturitní rozbor.
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Keywords */}
            {
                book.keywords && book.keywords.length > 0 && (
                    <div className="terminal-card">
                        <div className="text-xs text-terminal-text/60 mb-2">&gt; KEYWORDS</div>
                        <div className="flex flex-wrap gap-2">
                            {book.keywords.map((keyword, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 border border-terminal-text/20 text-xs text-terminal-text/70"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Navigation */}
            <div className="flex justify-between items-center">
                {prevBook ? (
                    <Link
                        to={`/cj/book/${prevBook.id}`}
                        className="icon-btn flex items-center gap-2"
                    >
                        <FaChevronLeft />
                        <span className="text-xs">#{prevBook.id}</span>
                    </Link>
                ) : (
                    <div></div>
                )}

                {nextBook ? (
                    <Link
                        to={`/cj/book/${nextBook.id}`}
                        className="icon-btn flex items-center gap-2"
                    >
                        <span className="text-xs">#{nextBook.id}</span>
                        <FaChevronRight />
                    </Link>
                ) : (
                    <div></div>
                )}
            </div>
        </div >
    );
};

export default BookDetailPage;
