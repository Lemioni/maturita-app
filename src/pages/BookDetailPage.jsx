import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaBook, FaUser, FaMapMarkerAlt, FaClock, FaTheaterMasks, FaPen, FaGlobe } from 'react-icons/fa';
import { useEffect, useMemo } from 'react';
import cjBooksData from '../data/cj-books.json';
import useLocalStorage from '../hooks/useLocalStorage';
import KnowledgeCheckbox from '../components/common/KnowledgeCheckbox';
import TableOfContents from '../components/common/TableOfContents';

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progress, setProgress] = useLocalStorage('maturita-progress', {});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const bookId = parseInt(id);
    const book = cjBooksData.books.find(b => b.id === bookId);

    // Generate table of contents from analysis
    const tableOfContents = useMemo(() => {
        if (!book?.analysis) return [];

        return [
            { id: 'section-dej', title: 'Děj', level: 2, number: 1 },
            { id: 'section-tema', title: 'Téma a motivy', level: 2, number: 2 },
            { id: 'section-casoprostor', title: 'Časoprostor', level: 2, number: 3 },
            { id: 'section-druh', title: 'Literární druh a žánr', level: 2, number: 4 },
            { id: 'section-vypravec', title: 'Vypravěč', level: 2, number: 5 },
            { id: 'section-postavy', title: 'Postavy', level: 2, number: 6 },
            { id: 'section-jazyk', title: 'Jazykové prostředky', level: 2, number: 7 },
            { id: 'section-tropy', title: 'Tropy a figury', level: 2, number: 8 },
            { id: 'section-autor', title: 'Kontext autorovy tvorby', level: 2, number: 9 },
            { id: 'section-literarni', title: 'Literární a kulturní kontext', level: 2, number: 10 },
        ];
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

    const currentIndex = cjBooksData.books.findIndex(b => b.id === bookId);
    const prevBook = currentIndex > 0 ? cjBooksData.books[currentIndex - 1] : null;
    const nextBook = currentIndex < cjBooksData.books.length - 1 ? cjBooksData.books[currentIndex + 1] : null;

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

    const analysis = book.analysis;

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
            </div>

            {/* Analysis Content */}
            {analysis ? (
                <>
                    {/* Table of Contents */}
                    <TableOfContents sections={tableOfContents} />

                    {/* I. ČÁST - Analýza uměleckého textu */}
                    <div className="terminal-card">
                        <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">I. ČÁST</span>
                            ANALÝZA UMĚLECKÉHO TEXTU
                        </div>

                        {/* Děj */}
                        <div id="section-dej" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaBook className="text-sm" />
                                <span>Děj</span>
                            </h3>
                            <div className="text-terminal-text/90 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-terminal-border/20">
                                {analysis.plot}
                            </div>
                        </div>

                        {/* Téma a motivy */}
                        <div id="section-tema" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <span className="text-sm">💡</span>
                                <span>Téma a motivy</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 space-y-3">
                                <div>
                                    <span className="text-xs text-terminal-text/50">TÉMA:</span>
                                    <p className="text-terminal-text/90">{analysis.themes.main}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-terminal-text/50">MOTIVY:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {analysis.themes.motifs.map((motif, i) => (
                                            <span key={i} className="px-2 py-0.5 text-xs border border-terminal-border/30 text-terminal-text/70">
                                                {motif}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Časoprostor */}
                        <div id="section-casoprostor" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <span className="text-sm">🌍</span>
                                <span>Časoprostor</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* Literární druh a žánr */}
                        <div id="section-druh" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <span className="text-sm">📚</span>
                                <span>Literární druh a žánr</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div id="section-postavy" className="scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaUser className="text-sm" />
                                <span>Postavy</span>
                            </h3>
                            <div className="space-y-4">
                                {analysis.characters.map((char, i) => (
                                    <div
                                        key={i}
                                        className={`pl-4 border-l-2 ${char.isMain ? 'border-terminal-accent' : 'border-terminal-border/20'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-bold ${char.isMain ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                                                {char.name}
                                            </span>
                                            {char.isMain && (
                                                <span className="text-xs px-1.5 py-0.5 bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30">
                                                    HLAVNÍ
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-terminal-text/80 text-sm">{char.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* III. ČÁST - Jazykové prostředky */}
                    <div className="terminal-card">
                        <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">III. ČÁST</span>
                            JAZYKOVÉ PROSTŘEDKY
                        </div>

                        {/* Jazykové prostředky */}
                        <div id="section-jazyk" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaPen className="text-sm" />
                                <span>Jazykové prostředky</span>
                            </h3>
                            <ul className="pl-4 border-l-2 border-terminal-border/20 space-y-2">
                                {analysis.languageDevices.map((device, i) => (
                                    <li key={i} className="text-terminal-text/90 text-sm">
                                        • {device}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tropy a figury */}
                        <div id="section-tropy" className="scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaTheaterMasks className="text-sm" />
                                <span>Tropy a figury</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 space-y-3">
                                {analysis.literaryDevices.map((device, i) => (
                                    <div key={i}>
                                        <span className="font-bold text-terminal-text">{device.name}</span>
                                        <span className="text-terminal-text/60"> – </span>
                                        <span className="text-terminal-text/80 text-sm">{device.example}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LITERÁRNĚHISTORICKÝ KONTEXT */}
                    <div className="terminal-card">
                        <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">KONTEXT</span>
                            LITERÁRNĚHISTORICKÝ KONTEXT
                        </div>

                        {/* Autor */}
                        <div id="section-autor" className="mb-6 scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaUser className="text-sm" />
                                <span>Kontext autorovy tvorby</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 space-y-4">
                                <p className="text-terminal-text/90">{analysis.authorContext.bio}</p>

                                <div>
                                    <span className="text-xs text-terminal-text/50">ŽIVOT:</span>
                                    <ul className="mt-2 space-y-1">
                                        {analysis.authorContext.life.map((item, i) => (
                                            <li key={i} className="text-terminal-text/80 text-sm">• {item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="text-xs text-terminal-text/50">DALŠÍ DÍLA:</span>
                                    <div className="mt-2 space-y-2">
                                        {analysis.authorContext.otherWorks.map((work, i) => (
                                            <div key={i} className="text-sm">
                                                <span className="text-terminal-accent">{work.title}</span>
                                                <span className="text-terminal-text/50"> ({work.year})</span>
                                                {work.note && <span className="text-terminal-text/60"> – {work.note}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Literární směr */}
                        <div id="section-literarni" className="scroll-mt-4">
                            <h3 className="flex items-center gap-2 text-terminal-accent mb-3">
                                <FaGlobe className="text-sm" />
                                <span>Literární a kulturní kontext</span>
                            </h3>
                            <div className="pl-4 border-l-2 border-terminal-border/20 space-y-4">
                                <div>
                                    <span className="text-lg text-terminal-accent">{analysis.literaryContext.movement}</span>
                                    <span className="text-terminal-text/50"> ({analysis.literaryContext.period})</span>
                                    <p className="text-terminal-text/80 mt-1">{analysis.literaryContext.description}</p>
                                </div>

                                <div>
                                    <span className="text-xs text-terminal-text/50">CHARAKTERISTIKA:</span>
                                    <ul className="mt-2 space-y-1">
                                        {analysis.literaryContext.characteristics.map((char, i) => (
                                            <li key={i} className="text-terminal-text/80 text-sm">• {char}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="text-xs text-terminal-text/50">DALŠÍ AUTOŘI SMĚRU:</span>
                                    <div className="mt-2 space-y-3">
                                        {analysis.literaryContext.otherAuthors.map((author, i) => (
                                            <div key={i} className="text-sm border-l border-terminal-text/10 pl-3">
                                                <div>
                                                    <span className="text-terminal-accent font-bold">{author.name}</span>
                                                    <span className="text-terminal-text/50"> ({author.years})</span>
                                                </div>
                                                <p className="text-terminal-text/60 text-xs">{author.note}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {author.works.map((work, j) => (
                                                        <span key={j} className="text-xs px-1.5 border border-terminal-border/20 text-terminal-text/70">
                                                            {work}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            )}

            {/* Keywords */}
            {book.keywords && book.keywords.length > 0 && (
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
            )}

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
        </div>
    );
};

export default BookDetailPage;
