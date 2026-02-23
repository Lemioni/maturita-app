import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaBook, FaUser, FaMapMarkerAlt, FaClock, FaTheaterMasks, FaPen, FaGlobe, FaChevronDown, FaChevronUp, FaListUl, FaFileAlt, FaCheck } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import cjBooksData from '../data/bookData.js';
import useLocalStorage from '../hooks/useLocalStorage';
import KnowledgeCheckbox from '../components/common/KnowledgeCheckbox';
import TableOfContents from '../components/common/TableOfContents';

// Small inline checkbox for section-level knowledge tracking
const SectionCheck = ({ bookId, section }) => {
    const key = 'maturita-section-knowledge';
    const [known, setKnown] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            return data[bookId]?.[section] || false;
        } catch { return false; }
    });
    const toggle = () => {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (!data[bookId]) data[bookId] = {};
        data[bookId][section] = !known;
        localStorage.setItem(key, JSON.stringify(data));
        setKnown(!known);
    };
    return (
        <button onClick={toggle} title={known ? 'Umím ✓' : 'Označit jako naučené'}
            className={`ml-auto w-5 h-5 rounded border text-[10px] flex items-center justify-center transition-all ${known ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-terminal-border/30 text-transparent hover:border-terminal-text/30 hover:text-terminal-text/30'
                }`}>
            <FaCheck />
        </button>
    );
};

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
        <div className="max-w-5xl mx-auto space-y-4 compact-mode">
            {/* Back Button */}
            <button
                onClick={() => navigate('/cj')}
                className="flex items-center text-terminal-accent hover:text-terminal-border transition-colors"
            >
                <FaArrowLeft />
            </button>

            {/* Book Header */}
            <div className="terminal-card">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-terminal-text/60">#{book.id}</span>
                    <span className="text-xs px-2 py-0.5 border border-terminal-border/30 text-terminal-text/80">
                        {book.period}
                    </span>
                    <span className="text-xs px-2 py-0.5 border border-terminal-text/20 text-terminal-text/60">
                        {book.genre}
                    </span>
                    <span className="text-xs text-terminal-text/40">{book.year}</span>
                </div>

                <h1 className="text-2xl font-bold text-terminal-accent">
                    {book.title}
                </h1>

                <div className="flex items-center gap-3 mt-1">
                    <p className="text-lg text-terminal-text/80">
                        {book.author}
                    </p>
                    <KnowledgeCheckbox
                        questionId={`cj-${bookId}`}
                        initialKnown={isKnown}
                        onChange={toggleKnown}
                    />
                    {analysis && (
                        <button
                            onClick={() => setIsShortVersion(!isShortVersion)}
                            className={`w-7 h-7 flex items-center justify-center border transition-all ${isShortVersion
                                ? 'bg-terminal-accent/20 border-terminal-accent text-terminal-accent'
                                : 'bg-transparent border-terminal-border/30 text-terminal-text/40 hover:border-terminal-accent/50 hover:text-terminal-text/70'
                                }`}
                            title={isShortVersion ? 'Krátká verze' : 'Plná verze'}
                        >
                            {isShortVersion ? <FaListUl className="text-xs" /> : <FaFileAlt className="text-xs" />}
                        </button>
                    )}
                </div>
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
                                <div id="section-nazev" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">📌</span>
                                        <span>Analýza názvu díla</span>
                                        <SectionCheck bookId={bookId} section="nazev" />
                                    </h3>
                                    <div className="text-xs text-terminal-text/85 pl-3 border-l-2 border-terminal-accent/30">
                                        {analysis.titleAnalysis}
                                    </div>
                                </div>
                            )}

                            {/* Děj - Collapsible */}
                            <div id="section-dej" className="mb-2 scroll-mt-4">
                                <button
                                    onClick={() => setIsPlotExpanded(!isPlotExpanded)}
                                    className="w-full flex items-center justify-between text-terminal-accent mb-2 hover:opacity-80 transition-opacity"
                                >
                                    <h3 className="flex items-center gap-2 text-xs">
                                        <FaBook className="text-sm" />
                                        <span>Děj</span>
                                        <SectionCheck bookId={bookId} section="dej" />
                                    </h3>
                                    <span className="text-xs flex items-center gap-1 text-terminal-text/50">
                                        {isPlotExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        <span>{isPlotExpanded ? 'Skrýt' : 'Zobrazit'}</span>
                                    </span>
                                </button>
                                {isPlotExpanded && (
                                    <div className="whitespace-pre-line leading-relaxed pl-3 border-l-2 border-terminal-border/20 animate-fadeIn text-xs text-terminal-text/85">
                                        {analysis.plot.split('\\n').join('\n')}
                                    </div>
                                )}
                                {!isPlotExpanded && (
                                    <div className="text-terminal-text/50 text-xs pl-3 border-l-2 border-terminal-border/20 italic mt-1">
                                        Klikni pro zobrazení děje...
                                    </div>
                                )}
                            </div>

                            {/* Téma a motivy */}
                            {analysis.themes && (
                                <div id="section-tema" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">💡</span>
                                        <span>Téma a motivy</span>
                                        <SectionCheck bookId={bookId} section="tema" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1">
                                        <p className="text-xs text-terminal-text/85">{analysis.themes.main}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {analysis.themes.motifs?.map((motif, i) => (
                                                <span key={i} className="compact-pill">
                                                    {motif}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Časoprostor */}
                            {analysis.setting && (
                                <div id="section-casoprostor" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">🌍</span>
                                        <span>Časoprostor</span>
                                        <SectionCheck bookId={bookId} section="casoprostor" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5">
                                        <div className="text-xs">
                                            <span className="text-terminal-accent/70 font-medium">Místo:</span>
                                            <span className="text-terminal-text/85 ml-1">{analysis.setting.place}</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-terminal-accent/70 font-medium">Čas:</span>
                                            <span className="text-terminal-text/85 ml-1">{analysis.setting.time}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kompozice */}
                            {analysis.composition && (
                                <div id="section-kompozice" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">🏗️</span>
                                        <span>Kompozice</span>
                                        <SectionCheck bookId={bookId} section="kompozice" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 flex flex-wrap gap-1.5">
                                        {analysis.composition.structure && (
                                            <span className="compact-pill">{analysis.composition.structure}</span>
                                        )}
                                        {analysis.composition.timeline && (
                                            <span className="compact-pill">{analysis.composition.timeline}</span>
                                        )}
                                        {analysis.composition.rhyme && (
                                            <span className="compact-pill">{analysis.composition.rhyme}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Literární druh a žánr */}
                            <div id="section-druh" className="mb-2 scroll-mt-4">
                                <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                    <span className="text-sm">📚</span>
                                    <span>Literární druh a žánr</span>
                                </h3>
                                <div className="pl-3 border-l-2 border-terminal-border/20 flex flex-wrap gap-1.5">
                                    <span className="compact-pill"><strong className="text-terminal-accent/80">Druh:</strong> {book.literaryForm}</span>
                                    <span className="compact-pill"><strong className="text-terminal-accent/80">Žánr:</strong> {book.genre}</span>
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
                                <div id="section-vypravec" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">🎭</span>
                                        <span>Vypravěč a způsob vyprávění</span>
                                        <SectionCheck bookId={bookId} section="vypravec" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5">
                                        <p className="text-xs text-terminal-text/85"><strong className="text-terminal-accent/70">Typ:</strong> {analysis.narration.narrator}</p>
                                        <p className="text-xs text-terminal-text/85"><strong className="text-terminal-accent/70">Styl:</strong> {analysis.narration.style}</p>
                                    </div>
                                </div>
                            )}

                            {/* Postavy */}
                            {analysis.characters && analysis.characters.length > 0 && (
                                <div id="section-postavy" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <FaUser className="text-sm" />
                                        <span>Postavy</span>
                                        <SectionCheck bookId={bookId} section="postavy" />
                                    </h3>
                                    <div className="space-y-1.5">
                                        {analysis.characters.map((char, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 border ${char.isMain
                                                    ? 'border-terminal-accent/40 bg-terminal-accent/5'
                                                    : 'border-terminal-border/20 bg-terminal-bg/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <span className={`font-bold text-xs ${char.isMain ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                                                        {char.name}
                                                    </span>
                                                    {char.isMain && <span className="text-terminal-accent text-[10px]">★</span>}
                                                </div>
                                                {char.traits ? (
                                                    <div className="space-y-0">
                                                        {Object.entries(char.traits).map(([key, value], j) => (
                                                            <div key={j} className="text-[11px] leading-tight">
                                                                <span className="text-terminal-accent/60 font-medium">{key}:</span>
                                                                <span className="text-terminal-text/70 ml-1">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-terminal-text/70 text-[11px]">{char.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ukázka z textu - only in full version */}
                            {!isShortVersion && analysis.excerpt && (
                                <div id="section-ukazka" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <span className="text-sm">📜</span>
                                        <span>Ukázka z textu</span>
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-accent/50 space-y-2">
                                        <div className="bg-terminal-bg/50 p-2 border border-terminal-border/30 font-mono text-xs whitespace-pre-line leading-relaxed text-terminal-text/85">
                                            {analysis.excerpt.text.split('\\n').join('\n')}
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase text-terminal-text/50">KONTEXT:</span>
                                            <p className="text-terminal-text/80 mt-0.5 text-xs">{analysis.excerpt.context}</p>
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
                                <div id="section-jazyk" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <FaPen className="text-sm" />
                                        <span>Jazykové prostředky</span>
                                        <SectionCheck bookId={bookId} section="jazyk" />
                                    </h3>
                                    <ul className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5 mt-1">
                                        {analysis.languageDevices.map((device, i) => (
                                            <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">
                                                • {device}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tropy a figury */}
                            {analysis.literaryDevices && analysis.literaryDevices.length > 0 && (
                                <div id="section-tropy" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <FaTheaterMasks className="text-sm" />
                                        <span>Tropy a figury</span>
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1.5 mt-1">
                                        {analysis.literaryDevices.map((device, i) => (
                                            <div key={i} className="text-[11px] leading-tight">
                                                <span className="font-bold text-terminal-text">{device.name}</span>
                                                <span className="text-terminal-text/50"> – </span>
                                                <span className="text-terminal-text/75">{device.example}</span>
                                            </div>
                                        ))}
                                    </div>
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
                                <div id="section-autor" className="mb-2 scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <FaUser className="text-sm" />
                                        <span>Kontext autorovy tvorby</span>
                                        <SectionCheck bookId={bookId} section="autor" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1.5">
                                        {/* ŽIVOT a BIO*/}
                                        <div className="space-y-1">
                                            {/* Name or bio */}
                                            {analysis.authorContext.shortBio ? (
                                                <p className="text-terminal-accent font-bold text-xs">{analysis.authorContext.shortBio.name}</p>
                                            ) : (
                                                <p className="text-terminal-text/90 text-xs">{analysis.authorContext.bio}</p>
                                            )}

                                            {/* Short bio info */}
                                            {analysis.authorContext.shortBio?.info && (
                                                <ul className="space-y-0">
                                                    {analysis.authorContext.shortBio.info.map((item, i) => (
                                                        <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• {item}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* Life points */}
                                            {analysis.authorContext.life && (
                                                <ul className="space-y-0 mt-1">
                                                    {analysis.authorContext.life.map((item, i) => (
                                                        <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• {item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Období tvorby */}
                                        {analysis.authorContext.creationPeriods && (
                                            <div className="mt-2">
                                                <span className="text-[10px] uppercase text-terminal-text/50">OBDOBÍ TVORBY:</span>
                                                <div className="mt-0.5 space-y-1">
                                                    {analysis.authorContext.creationPeriods.map((period, i) => (
                                                        <div key={i} className="text-[11px] border-l border-terminal-accent/30 pl-2">
                                                            <span className="text-terminal-accent font-bold">{period.name}</span>
                                                            <p className="text-terminal-text/70 leading-snug">{period.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Zařazení díla */}
                                        {analysis.authorContext.workPosition && (
                                            <div className="bg-terminal-accent/10 p-2 border border-terminal-accent/20">
                                                <span className="text-terminal-accent text-[10px]">ZAŘAZENÍ DÍLA:</span>
                                                <p className="text-terminal-text/85 text-xs mt-0.5">{analysis.authorContext.workPosition}</p>
                                            </div>
                                        )}

                                        {/* Další díla */}
                                        {analysis.authorContext.otherWorks && (
                                            <div>
                                                <span className="text-terminal-text/50 text-[10px]">DALŠÍ DÍLA:</span>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {analysis.authorContext.otherWorks.map((work, i) => (
                                                        <span key={i} className="compact-pill text-terminal-accent">
                                                            {work.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Literární směr */}
                            {analysis.literaryContext && (
                                <div id="section-literarni" className="scroll-mt-4">
                                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs">
                                        <FaGlobe className="text-sm" />
                                        <span>Literární a kulturní kontext</span>
                                        <SectionCheck bookId={bookId} section="kontext" />
                                    </h3>
                                    <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1.5">
                                        <div>
                                            <span className="text-terminal-accent text-sm font-bold">{analysis.literaryContext.movement}</span>
                                            <span className="text-terminal-text/50 text-[11px]"> {analysis.literaryContext.period && `(${analysis.literaryContext.period})`}</span>
                                            {analysis.literaryContext.description && <p className="text-terminal-text/75 text-[11px] leading-snug">{analysis.literaryContext.description}</p>}
                                        </div>

                                        {analysis.literaryContext.characteristics && (
                                            <div>
                                                <span className="text-terminal-text/50 text-[10px]">CHARAKTERISTIKA:</span>
                                                <ul className="mt-0.5 space-y-0">
                                                    {analysis.literaryContext.characteristics.map((char, i) => (
                                                        <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• {char}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {analysis.literaryContext.otherAuthors && (
                                            <div>
                                                <span className="text-terminal-text/50 text-[10px]">DALŠÍ AUTOŘI SMĚRU:</span>
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {analysis.literaryContext.otherAuthors.map((author, i) => (
                                                        <div key={i} className="text-[11px] border-l border-terminal-text/10 pl-2">
                                                            <div>
                                                                <span className="text-terminal-accent font-bold">{author.name}</span>
                                                                <span className="text-terminal-text/50"> {author.years && `(${author.years})`}</span>
                                                            </div>
                                                            {author.note && <p className="text-terminal-text/60 text-[10px]">{author.note}</p>}
                                                            {author.works && (
                                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                                    {author.works.map((work, j) => (
                                                                        <span key={j} className="text-[10px] px-1 border border-terminal-border/20 text-terminal-text/70">
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
                                <div className="text-xs text-terminal-accent mb-2 pb-1 border-b border-terminal-border/20 flex items-center gap-2">
                                    <span className="px-1 py-0.5 text-[10px] bg-terminal-accent/20 border border-terminal-accent/30">DALŠÍ</span>
                                    DALŠÍ INFORMACE
                                </div>

                                <div id="section-dalsi" className="scroll-mt-4 space-y-3">
                                    {/* Základní info */}
                                    <div className="flex flex-col gap-2">
                                        {analysis.additionalInfo.dominantStyle && (
                                            <div className="pl-3 border-l-2 border-terminal-border/20">
                                                <span className="text-[10px] uppercase text-terminal-text/50">SLOHOVÝ POSTUP:</span>
                                                <p className="text-terminal-text/90 text-xs">{analysis.additionalInfo.dominantStyle}</p>
                                            </div>
                                        )}
                                        {analysis.additionalInfo.audience && (
                                            <div className="pl-3 border-l-2 border-terminal-border/20">
                                                <span className="text-[10px] uppercase text-terminal-text/50">ADRESÁT:</span>
                                                <p className="text-terminal-text/90 text-xs">{analysis.additionalInfo.audience}</p>
                                            </div>
                                        )}
                                    </div>

                                    {analysis.additionalInfo.relevance && (
                                        <div className="pl-3 border-l-2 border-terminal-border/20">
                                            <span className="text-[10px] uppercase text-terminal-text/50">AKTUÁLNOST DÍLA:</span>
                                            <p className="text-terminal-text/90 text-xs">{analysis.additionalInfo.relevance}</p>
                                        </div>
                                    )}

                                    {analysis.additionalInfo.purpose && (
                                        <div className="pl-3 border-l-2 border-terminal-border/20">
                                            <span className="text-[10px] uppercase text-terminal-text/50">SMYSL DÍLA:</span>
                                            <p className="text-terminal-text/90 text-xs">{analysis.additionalInfo.purpose}</p>
                                        </div>
                                    )}

                                    {/* Podobná díla */}
                                    {analysis.additionalInfo.similarWorks && analysis.additionalInfo.similarWorks.length > 0 && (
                                        <div>
                                            <span className="text-[10px] uppercase text-terminal-text/50">TEMATICKY PODOBNÁ DÍLA:</span>
                                            <div className="mt-1 space-y-1.5">
                                                {analysis.additionalInfo.similarWorks.map((work, i) => (
                                                    <div key={i} className="pl-3 border-l-2 border-terminal-accent/30">
                                                        <div>
                                                            <span className="text-terminal-accent text-xs font-bold">{work.title}</span>
                                                            <span className="text-terminal-text/50 text-[10px]"> – {work.author} ({work.year})</span>
                                                        </div>
                                                        <p className="text-terminal-text/70 text-[11px]">{work.note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Adaptace */}
                                    {analysis.additionalInfo.adaptations && analysis.additionalInfo.adaptations.length > 0 && (
                                        <div>
                                            <span className="text-[10px] uppercase text-terminal-text/50">FILMOVÉ A DIVADELNÍ ADAPTACE:</span>
                                            <ul className="mt-1 space-y-0.5 pl-3">
                                                {analysis.additionalInfo.adaptations.map((adaptation, i) => (
                                                    <li key={i} className="text-terminal-text/80 text-[11px]">• {adaptation}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* MATURITNÍ OSNOVA */}
                        {analysis && (
                            <div className="terminal-card">
                                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">OSNOVA</span>
                                    MATURITNÍ ODPOVĚĎ
                                </div>
                                <div className="space-y-2 text-xs">
                                    {[
                                        { time: '1 min', label: '1. Název, autor, období, žánr, druh', detail: `${book.title} — ${book.author} — ${book.period || ''} — ${book.genre || ''} — ${book.literaryForm || ''}` },
                                        { time: '2 min', label: '2. Analýza názvu + zasazení', detail: analysis.titleAnalysis || '' },
                                        { time: '3 min', label: '3. Děj (stručně)', detail: 'Hlavní zápletka, klíčové momenty, rozuzlení' },
                                        { time: '2 min', label: '4. Postavy', detail: analysis.characters?.map(c => `${c.name}${c.isMain ? ' ★' : ''}`).join(', ') || '' },
                                        { time: '1 min', label: '5. Vypravěč + kompozice', detail: `${analysis.narration?.narrator || ''} · ${analysis.composition?.structure || ''}` },
                                        { time: '1 min', label: '6. Téma a motivy', detail: analysis.themes?.main || '' },
                                        { time: '2 min', label: '7. Jazykové prostředky + tropy', detail: `${analysis.languageDevices?.slice(0, 3).join(', ') || ''} · ${analysis.literaryDevices?.slice(0, 2).map(d => d.name).join(', ') || ''}` },
                                        { time: '2 min', label: '8. Ukázka — přečíst + analyzovat', detail: 'Jazykové prostředky v ukázce' },
                                        { time: '2 min', label: '9. Kontext autora', detail: analysis.authorContext?.workPosition || analysis.authorContext?.shortBio?.name || '' },
                                        { time: '1 min', label: '10. Literární kontext + směr', detail: `${analysis.literaryContext?.movement || ''} ${analysis.literaryContext?.period ? `(${analysis.literaryContext.period})` : ''}` },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-3 items-start pl-2 border-l-2 border-terminal-border/20">
                                            <span className="text-terminal-accent/50 font-mono text-[10px] w-10 flex-shrink-0 pt-0.5">{step.time}</span>
                                            <div>
                                                <div className="text-terminal-text/80 font-medium">{step.label}</div>
                                                {step.detail && <div className="text-terminal-text/40 text-[10px] leading-snug mt-0.5">{step.detail}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-2 border-t border-terminal-border/10 text-[10px] text-terminal-text/30">
                                    Celkem ~17 minut · Přizpůsob délku otázek komise
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
                        <div className="text-xs text-terminal-text/60 mb-2">KEYWORDS</div>
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
