import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaRandom, FaVolumeUp, FaVolumeMute, FaArrowLeft, FaScroll, FaBook, FaUser, FaPen, FaGlobe, FaTheaterMasks } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import itQuestions from '../data/it-questions.json';
import cjBooks from '../data/cj-books.json';
import dictionaryData from '../data/dictionary.json';
import generatedBookTermsData from '../data/cj-book-terms.generated.json';
import TermAnnotatedText from '../components/common/TermAnnotatedText';
import { buildBookTerms } from '../utils/bookTerms';
import useLocalStorage from '../hooks/useLocalStorage';

const generatedTermsByBookId = new Map((generatedBookTermsData?.books || []).map((entry) => [entry.id, entry.terms || []]));

// ═══════════════════════════════════════════
// Autoscroll content renderer with memory-optimized colors
// Amber/warm-yellow (#fbbf24) is proven best for memory retention
// ═══════════════════════════════════════════

// Custom markdown components for autoscroll (amber highlights)
const autoscrollMdComponents = {
    h1: ({ children }) => <h1 className="text-xl font-bold text-amber-400 mt-6 mb-2 pb-1 border-b border-amber-400/30">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold text-amber-400 mt-5 mb-2 pb-1 border-b border-amber-400/20">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold text-amber-300 mt-4 mb-1">{children}</h3>,
    h4: ({ children }) => <h4 className="text-sm font-bold text-amber-300/90 mt-3 mb-1">{children}</h4>,
    p: ({ children }) => <p className="text-sm leading-relaxed text-gray-200 mb-2">{children}</p>,
    strong: ({ children }) => <strong className="text-amber-300 font-bold">{children}</strong>,
    em: ({ children }) => <em className="text-amber-200/80 italic">{children}</em>,
    li: ({ children }) => <li className="text-sm text-gray-200 mb-0.5 ml-4 list-disc">{children}</li>,
    ul: ({ children }) => <ul className="mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal ml-4">{children}</ol>,
    code: ({ inline, children }) => inline
        ? <code className="text-amber-300 bg-amber-400/10 px-1 rounded text-xs">{children}</code>
        : <pre className="bg-black/40 border border-amber-400/20 p-3 rounded text-xs text-gray-300 overflow-x-auto mb-2"><code>{children}</code></pre>,
    table: ({ children }) => <table className="w-full text-sm mb-3 border-collapse">{children}</table>,
    th: ({ children }) => <th className="text-left text-amber-400 text-xs uppercase border-b border-amber-400/30 pb-1 pr-3">{children}</th>,
    td: ({ children }) => <td className="text-gray-200 py-1 pr-3 border-b border-gray-700/50 text-sm">{children}</td>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-amber-400/50 pl-3 my-2 text-gray-300 italic">{children}</blockquote>,
    hr: () => <hr className="border-gray-700 my-4" />,
};

// ═══════════════════════════════════════
// Book content renderer — mirrors BookDetailPage exactly
// ═══════════════════════════════════════
const BookAutoscrollContent = ({ book, includePlot }) => {
    const analysis = book.analysis;
    const bookTerms = useMemo(
        () => buildBookTerms(book, dictionaryData.terms, generatedTermsByBookId.get(book?.id)),
        [book]
    );

    if (!analysis) return <p className="text-sm text-terminal-text/50 italic">Rozbor zatím není k dispozici.</p>;

    return (
        <div className="space-y-4">
            {/* I. ČÁST */}
            <div className="terminal-card">
                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">I. ČÁST</span>
                    ANALÝZA UMĚLECKÉHO TEXTU
                </div>

                {analysis.titleAnalysis && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">📌</span><span>Analýza názvu díla</span></h3>
                        <div className="text-xs text-terminal-text/85 pl-3 border-l-2 border-terminal-accent/30">
                            <TermAnnotatedText text={analysis.titleAnalysis} terms={bookTerms} />
                        </div>
                    </div>
                )}

                {analysis.plot && includePlot && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaBook className="text-sm" /><span>Děj</span></h3>
                        <div className="whitespace-pre-line leading-relaxed pl-3 border-l-2 border-terminal-border/20 text-xs text-terminal-text/85">
                            <TermAnnotatedText text={analysis.plot.split('\n').join('\n')} terms={bookTerms} />
                        </div>
                    </div>
                )}

                {analysis.themes && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">💡</span><span>Téma a motivy</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1">
                            <p className="text-xs text-terminal-text/85"><TermAnnotatedText text={analysis.themes.main} terms={bookTerms} /></p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {analysis.themes.motifs?.map((motif, i) => (
                                    <span key={i} className="compact-pill">{motif}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {analysis.setting && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">🌍</span><span>Časoprostor</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5">
                            <div className="text-xs"><span className="text-terminal-accent/70 font-medium">Místo:</span><span className="text-terminal-text/85 ml-1"><TermAnnotatedText text={analysis.setting.place} terms={bookTerms} /></span></div>
                            <div className="text-xs"><span className="text-terminal-accent/70 font-medium">Čas:</span><span className="text-terminal-text/85 ml-1"><TermAnnotatedText text={analysis.setting.time} terms={bookTerms} /></span></div>
                        </div>
                    </div>
                )}

                {analysis.composition && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">🏗️</span><span>Kompozice</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 flex flex-wrap gap-1.5">
                            {analysis.composition.structure && <span className="compact-pill">{analysis.composition.structure}</span>}
                            {analysis.composition.timeline && <span className="compact-pill">{analysis.composition.timeline}</span>}
                            {analysis.composition.rhyme && <span className="compact-pill">{analysis.composition.rhyme}</span>}
                        </div>
                    </div>
                )}

                <div className="mb-2">
                    <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">📚</span><span>Literární druh a žánr</span></h3>
                    <div className="pl-3 border-l-2 border-terminal-border/20 flex flex-wrap gap-1.5">
                        <span className="compact-pill"><strong className="text-terminal-accent/80">Druh:</strong> {book.literaryForm}</span>
                        <span className="compact-pill"><strong className="text-terminal-accent/80">Žánr:</strong> {book.genre}</span>
                    </div>
                </div>
            </div>

            {/* II. ČÁST */}
            <div className="terminal-card">
                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">II. ČÁST</span>
                    CHARAKTERISTIKA POSTAV A VYPRAVĚČ
                </div>

                {analysis.narration && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaTheaterMasks className="text-sm" /><span>Vypravěč a způsob vyprávění</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5">
                            <p className="text-xs text-terminal-text/85"><strong className="text-terminal-accent/70">Typ:</strong> {analysis.narration.narrator}</p>
                            <p className="text-xs text-terminal-text/85"><strong className="text-terminal-accent/70">Styl:</strong> {analysis.narration.style}</p>
                        </div>
                    </div>
                )}

                {analysis.characters?.length > 0 && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaUser className="text-sm" /><span>Postavy</span></h3>
                        <div className="space-y-1.5">
                            {analysis.characters.map((char, i) => (
                                <div key={i} className={`p-2 border ${char.isMain ? 'border-terminal-accent/40 bg-terminal-accent/5' : 'border-terminal-border/20 bg-terminal-bg/50'}`}>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <span className={`font-bold text-xs ${char.isMain ? 'text-terminal-accent' : 'text-terminal-text'}`}><TermAnnotatedText text={char.name} terms={bookTerms} /></span>
                                        {char.isMain && <span className="text-terminal-accent text-[10px]">★</span>}
                                    </div>
                                    {char.traits ? (
                                        <div className="space-y-0">
                                            {Object.entries(char.traits).map(([key, value], j) => (
                                                <div key={j} className="text-[11px] leading-tight">
                                                    <span className="text-terminal-accent/60 font-medium">{key}:</span>
                                                    <span className="text-terminal-text/70 ml-1"><TermAnnotatedText text={String(value)} terms={bookTerms} /></span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-terminal-text/70 text-[11px]"><TermAnnotatedText text={char.description} terms={bookTerms} /></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {analysis.excerpt && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><span className="text-sm">📜</span><span>Ukázka z textu</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-accent/50 space-y-2">
                            <div className="bg-terminal-bg/50 p-2 border border-terminal-border/30 font-mono text-xs whitespace-pre-line leading-relaxed text-terminal-text/85">
                                <TermAnnotatedText text={analysis.excerpt.text.split('\n').join('\n')} terms={bookTerms} />
                            </div>
                            {analysis.excerpt.context && (
                                <div>
                                    <span className="text-[10px] uppercase text-terminal-text/50">KONTEXT:</span>
                                    <p className="text-terminal-text/80 mt-0.5 text-xs"><TermAnnotatedText text={analysis.excerpt.context} terms={bookTerms} /></p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* III. ČÁST */}
            <div className="terminal-card">
                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">III. ČÁST</span>
                    JAZYKOVÉ PROSTŘEDKY
                </div>

                {analysis.languageDevices?.length > 0 && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaPen className="text-sm" /><span>Jazykové prostředky</span></h3>
                        <ul className="pl-3 border-l-2 border-terminal-border/20 space-y-0.5 mt-1">
                            {analysis.languageDevices.map((device, i) => (
                                <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• {device}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {analysis.literaryDevices?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaTheaterMasks className="text-sm" /><span>Tropy a figury</span></h3>
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

            {/* KONTEXT */}
            <div className="terminal-card">
                <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">KONTEXT</span>
                    LITERÁRNĚHISTORICKÝ KONTEXT
                </div>

                {analysis.authorContext && (
                    <div className="mb-2">
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaUser className="text-sm" /><span>Kontext autorovy tvorby</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1.5">
                            <div className="space-y-1">
                                {analysis.authorContext.shortBio ? (
                                    <p className="text-terminal-accent font-bold text-xs"><TermAnnotatedText text={analysis.authorContext.shortBio.name} terms={bookTerms} /></p>
                                ) : (
                                    <p className="text-terminal-text/90 text-xs"><TermAnnotatedText text={analysis.authorContext.bio} terms={bookTerms} /></p>
                                )}
                                {analysis.authorContext.shortBio?.info && (
                                    <ul className="space-y-0">
                                        {analysis.authorContext.shortBio.info.map((item, i) => (
                                            <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• <TermAnnotatedText text={item} terms={bookTerms} /></li>
                                        ))}
                                    </ul>
                                )}
                                {analysis.authorContext.life && (
                                    <ul className="space-y-0 mt-1">
                                        {analysis.authorContext.life.map((item, i) => (
                                            <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• <TermAnnotatedText text={item} terms={bookTerms} /></li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {analysis.authorContext.creationPeriods && (
                                <div className="mt-2">
                                    <span className="text-[10px] uppercase text-terminal-text/50">OBDOBÍ TVORBY:</span>
                                    <div className="mt-0.5 space-y-1">
                                        {analysis.authorContext.creationPeriods.map((period, i) => (
                                            <div key={i} className="text-[11px] border-l border-terminal-accent/30 pl-2">
                                                <span className="text-terminal-accent font-bold"><TermAnnotatedText text={period.name} terms={bookTerms} /></span>
                                                <p className="text-terminal-text/70 leading-snug"><TermAnnotatedText text={period.description} terms={bookTerms} /></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {analysis.authorContext.workPosition && (
                                <div className="bg-terminal-accent/10 p-2 border border-terminal-accent/20">
                                    <span className="text-terminal-accent text-[10px]">ZAŘAZENÍ DÍLA:</span>
                                    <p className="text-terminal-text/85 text-xs mt-0.5"><TermAnnotatedText text={analysis.authorContext.workPosition} terms={bookTerms} /></p>
                                </div>
                            )}

                            {analysis.authorContext.otherWorks && (
                                <div>
                                    <span className="text-terminal-text/50 text-[10px]">DALŠÍ DÍLA:</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {analysis.authorContext.otherWorks.map((work, i) => (
                                            <span key={i} className="compact-pill text-terminal-accent"><TermAnnotatedText text={work.title} terms={bookTerms} /></span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {analysis.literaryContext && (
                    <div>
                        <h3 className="flex items-center gap-2 text-terminal-accent mb-1 text-xs"><FaGlobe className="text-sm" /><span>Literární a kulturní kontext</span></h3>
                        <div className="pl-3 border-l-2 border-terminal-border/20 space-y-1.5">
                            <div>
                                <span className="text-terminal-accent text-sm font-bold"><TermAnnotatedText text={analysis.literaryContext.movement} terms={bookTerms} /></span>
                                <span className="text-terminal-text/50 text-[11px]"> {analysis.literaryContext.period && `(${analysis.literaryContext.period})`}</span>
                                {analysis.literaryContext.description && <p className="text-terminal-text/75 text-[11px] leading-snug"><TermAnnotatedText text={analysis.literaryContext.description} terms={bookTerms} /></p>}
                            </div>
                            {analysis.literaryContext.characteristics && (
                                <div>
                                    <span className="text-terminal-text/50 text-[10px]">CHARAKTERISTIKA:</span>
                                    <ul className="mt-0.5 space-y-0">
                                        {analysis.literaryContext.characteristics.map((char, i) => (
                                            <li key={i} className="text-terminal-text/80 text-[11px] leading-snug">• <TermAnnotatedText text={char} terms={bookTerms} /></li>
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
                                                    <span className="text-terminal-accent font-bold"><TermAnnotatedText text={author.name} terms={bookTerms} /></span>
                                                    <span className="text-terminal-text/50"> {author.years && `(${author.years})`}</span>
                                                </div>
                                                {author.note && <p className="text-terminal-text/60 text-[10px]"><TermAnnotatedText text={author.note} terms={bookTerms} /></p>}
                                                {author.works && (
                                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                                        {author.works.map((work, j) => (
                                                            <span key={j} className="text-[10px] px-1 border border-terminal-border/20 text-terminal-text/70"><TermAnnotatedText text={work} terms={bookTerms} /></span>
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

            {/* DALŠÍ INFORMACE */}
            {analysis.additionalInfo && (
                <div className="terminal-card">
                    <div className="text-xs text-terminal-accent mb-2 pb-1 border-b border-terminal-border/20 flex items-center gap-2">
                        <span className="px-1 py-0.5 text-[10px] bg-terminal-accent/20 border border-terminal-accent/30">DALŠÍ</span>
                        DALŠÍ INFORMACE
                    </div>
                    <div className="space-y-3">
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
                        {analysis.additionalInfo.similarWorks?.length > 0 && (
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
                        {analysis.additionalInfo.adaptations?.length > 0 && (
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
        </div>
    );
};

// Component for rendering autoscroll item content
const AutoscrollContent = ({ item, type, includePlot }) => {
    if (type === 'it') {
        return (
            <div className="autoscroll-md">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={autoscrollMdComponents}
                >
                    {item.content}
                </ReactMarkdown>
            </div>
        );
    }

    if (type === 'books') {
        return <BookAutoscrollContent book={item.bookData} includePlot={includePlot} />;
    }

    // Dictionary
    return (
        <div>
            <p className="text-sm text-gray-200 leading-relaxed">{item.content}</p>
        </div>
    );
};

// Color palette for items — 20 curated distinct colors
const ITEM_COLORS = [
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#e11d48', // rose
    '#a855f7', // purple
    '#0ea5e9', // sky
    '#eab308', // yellow
    '#22c55e', // green
    '#d946ef', // fuchsia
    '#f43f5e', // red-rose
    '#2dd4bf', // teal-light
    '#fb923c', // orange-light
];

const getItemColor = (index) => ITEM_COLORS[index % ITEM_COLORS.length];

// Helper: clean text for TTS
const cleanTextForTTS = (text) => {
    return text
        .replace(/#{1,6}\s*/g, '')       // strip markdown headers
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // strip bold/italic
        .replace(/[•\-]\s+/g, ', ')      // bullets → commas
        .replace(/\|/g, ', ')            // table pipes
        .replace(/`[^`]*`/g, '')         // inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/<[^>]*>/g, '')         // HTML tags
        .replace(/\n{2,}/g, '. ')        // double newlines → pause
        .replace(/\n/g, ', ')            // single newlines → comma
        .replace(/\s{2,}/g, ' ')         // multiple spaces
        .replace(/[★📌💡🌍🏗️📚📜🎭]/g, '') // emojis
        .trim();
};

// Helper: chunk text into sentences for TTS
const chunkTextForTTS = (text, maxLen = 250) => {
    const cleaned = cleanTextForTTS(text);
    const sentences = cleaned.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let current = '';
    for (const sent of sentences) {
        if ((current + ' ' + sent).length > maxLen && current.length > 0) {
            chunks.push(current.trim());
            current = sent;
        } else {
            current += (current ? ' ' : '') + sent;
        }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
};

const AutoscrollPage = () => {
    const [mode, setMode] = useState('selection');
    const [selectedSubject, setSelectedSubject] = useLocalStorage('autoscroll-subject', 'it');
    const [selectedSubItems, setSelectedSubItems] = useLocalStorage('autoscroll-subitems', []);
    const [itemsToScroll, setItemsToScroll] = useState([]);

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [isLooping, setIsLooping] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isTTS, setIsTTS] = useState(false);
    const [includePlot, setIncludePlot] = useState(true);

    const scrollContainerRef = useRef(null);
    const requestRef = useRef();
    const scrollPosRef = useRef(0);
    const isUserScrollingRef = useRef(false);
    const userScrollTimeoutRef = useRef(null);
    const currentSpokenItemIndexRef = useRef(-1);
    const ttsQueueRef = useRef([]);
    const prevSubjectRef = useRef(selectedSubject);

    const subjects = [
        { id: 'it', name: 'IT Otázky', icon: '💻' },
        { id: 'books', name: 'ČJ Knihy', icon: '📖' },
        { id: 'dictionary', name: 'Slovník pojmů', icon: '📚' }
    ];

    useEffect(() => {
        // Only reset sub-items when the subject actually changes, not on initial mount
        if (prevSubjectRef.current !== selectedSubject) {
            prevSubjectRef.current = selectedSubject;
            if (selectedSubject === 'it') {
                setSelectedSubItems(itQuestions.categories || []);
            } else if (selectedSubject === 'books') {
                setSelectedSubItems(cjBooks.books.map(b => b.id.toString()));
            } else if (selectedSubject === 'dictionary') {
                setSelectedSubItems(['epochy', 'autori', 'zanry']);
            }
        }
    }, [selectedSubject]);

    const handleSubItemToggle = (subItemId) => {
        setSelectedSubItems(prev =>
            prev.includes(subItemId) ? prev.filter(id => id !== subItemId) : [...prev, subItemId]
        );
    };

    const handleSelectAll = (selectAll) => {
        if (!selectAll) { setSelectedSubItems([]); return; }
        if (selectedSubject === 'it') setSelectedSubItems(itQuestions.categories || []);
        else if (selectedSubject === 'books') setSelectedSubItems(cjBooks.books.map(b => b.id.toString()));
        else if (selectedSubject === 'dictionary') setSelectedSubItems(['epochy', 'autori', 'zanry']);
    };

    // Get best Czech TTS voice
    const getBestVoice = useCallback(() => {
        const voices = window.speechSynthesis?.getVoices() || [];
        return voices.find(v => v.lang === 'cs-CZ' && (v.name.includes('Google') || v.name.includes('Microsoft')))
            || voices.find(v => v.lang === 'cs-CZ')
            || voices.find(v => v.lang.startsWith('cs'))
            || null;
    }, []);

    const handleStart = () => {
        let items = [];

        if (selectedSubject === 'it') {
            items = itQuestions.questions
                .filter(q => selectedSubItems.includes(q.category))
                .map((q, idx) => ({
                    id: `it-${q.id}`,
                    title: `Otázka ${q.id}: ${q.question}`,
                    subtitle: q.category,
                    content: q.answer,
                    colorIndex: idx
                }));
        } else if (selectedSubject === 'books') {
            items = cjBooks.books
                .filter(b => selectedSubItems.includes(b.id.toString()))
                .map((b, idx) => ({
                    id: `book-${b.id}`,
                    title: b.title,
                    subtitle: b.author,
                    meta: `${b.genre || ''} · ${b.period || ''} · ${b.year || ''}`,
                    bookData: b,
                    content: '',
                    colorIndex: idx
                }));
        } else if (selectedSubject === 'dictionary') {
            items = dictionaryData.terms
                .filter(t => selectedSubItems.includes(t.category))
                .map((t, idx) => ({
                    id: `dict-${t.id}`,
                    title: t.term,
                    subtitle: t.category === 'epochy' ? 'Epocha' : t.category === 'autori' ? 'Autor' : 'Žánr',
                    content: t.definition,
                    colorIndex: idx
                }));
        }

        if (items.length === 0) {
            alert('Vyberte prosím alespoň jednu položku k zobrazení.');
            return;
        }

        if (isRandom) {
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
        }

        setItemsToScroll(items);
        setMode('player');
        setIsPlaying(true);
        scrollPosRef.current = 0;

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (isTTS) {
                const utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0;
                window.speechSynthesis.speak(utterance);
            }
        }
        currentSpokenItemIndexRef.current = -1;
        ttsQueueRef.current = [];
    };

    // Speak an item using chunked TTS
    const speakItem = useCallback((item) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        ttsQueueRef.current = [];

        const fullText = `${item.title}. ${item.content}`;
        const chunks = chunkTextForTTS(fullText);
        const voice = getBestVoice();

        const speakNext = (index) => {
            if (index >= chunks.length) return;
            const utterance = new SpeechSynthesisUtterance(chunks[index]);
            utterance.lang = 'cs-CZ';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            if (voice) utterance.voice = voice;
            utterance.onend = () => speakNext(index + 1);
            utterance.onerror = () => speakNext(index + 1);
            window.speechSynthesis.speak(utterance);
        };
        speakNext(0);
    }, [getBestVoice]);

    const animateScroll = useCallback(() => {
        if (!isPlaying || isUserScrollingRef.current) {
            requestRef.current = requestAnimationFrame(animateScroll);
            return;
        }

        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            scrollPosRef.current += 0.3 * scrollSpeed;
            container.scrollTop = scrollPosRef.current;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
                if (isLooping) {
                    container.scrollTop = 0;
                    scrollPosRef.current = 0;
                } else {
                    setIsPlaying(false);
                }
            }
        }

        // TTS: detect visible item and speak it
        if (isTTS && 'speechSynthesis' in window && scrollContainerRef.current) {
            const containerItems = Array.from(scrollContainerRef.current.querySelectorAll('.autoscroll-item'));
            const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

            let activeIndex = -1;
            for (let i = 0; i < containerItems.length; i++) {
                const rect = containerItems[i].getBoundingClientRect();
                if (rect.top >= containerTop - 100 && rect.top <= containerTop + 300) {
                    activeIndex = i;
                    break;
                }
            }

            if (activeIndex !== -1 && activeIndex !== currentSpokenItemIndexRef.current) {
                currentSpokenItemIndexRef.current = activeIndex;
                speakItem(itemsToScroll[activeIndex]);
            }
        }

        requestRef.current = requestAnimationFrame(animateScroll);
    }, [isPlaying, scrollSpeed, isLooping, isTTS, itemsToScroll, speakItem]);

    useEffect(() => {
        if (mode === 'player') {
            requestRef.current = requestAnimationFrame(animateScroll);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, [mode, animateScroll]);

    // Ensure voices are loaded
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
            const onVoicesChanged = () => window.speechSynthesis.getVoices();
            window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
            return () => window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        }
    }, []);

    const handleUserInteraction = () => {
        if (!isPlaying) return;
        isUserScrollingRef.current = true;
        if (scrollContainerRef.current) scrollPosRef.current = scrollContainerRef.current.scrollTop;
        if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
        userScrollTimeoutRef.current = setTimeout(() => { isUserScrollingRef.current = false; }, 3000);
    };

    const stopAndExit = () => {
        setIsPlaying(false);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setMode('selection');
    };

    const toggleTTS = () => {
        if (isTTS && 'speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsTTS(!isTTS);
        currentSpokenItemIndexRef.current = -1;
    };

    // ═══════════════════════════════════════════
    // SELECTION SCREEN — Terminal style
    // ═══════════════════════════════════════════
    if (mode === 'selection') {
        const getSubItemLabel = (subId) => {
            if (selectedSubject === 'it') return subId;
            if (selectedSubject === 'books') return cjBooks.books.find(b => b.id.toString() === subId.toString())?.title;
            if (selectedSubject === 'dictionary') {
                const dictMap = { 'epochy': 'Epochy a směry', 'autori': 'Autoři', 'zanry': 'Žánry' };
                return dictMap[subId] || subId;
            }
            return subId;
        };

        const getAllSubItems = () => {
            if (selectedSubject === 'it') return itQuestions.categories || [];
            if (selectedSubject === 'books') return cjBooks.books.map(b => b.id.toString()) || [];
            if (selectedSubject === 'dictionary') return ['epochy', 'autori', 'zanry'];
            return [];
        };

        const allSubItems = getAllSubItems();

        return (
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="border-b border-terminal-border/20 pb-3">
                    <h1 className="text-xl text-terminal-accent tracking-wider flex items-center gap-2">
                        <FaScroll /> AUTOSCROLL READER
                    </h1>
                </div>

                {/* Settings Card */}
                <div className="terminal-card space-y-4">
                    <div className="text-xs text-terminal-text/60 mb-1">
                        Vyberte si předmět a materiály pro automatické scrollování.
                    </div>

                    {/* Options Row */}
                    <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-terminal-border/20">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${isLooping ? 'bg-terminal-accent border-terminal-accent' : 'border-terminal-text/30 bg-transparent'}`}>
                                {isLooping && <span className="text-terminal-bg text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-terminal-text/80" onClick={() => setIsLooping(!isLooping)}>Loop</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm" onClick={() => setIsRandom(!isRandom)}>
                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${isRandom ? 'bg-terminal-accent border-terminal-accent' : 'border-terminal-text/30 bg-transparent'}`}>
                                {isRandom && <span className="text-terminal-bg text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-terminal-text/80">Náhodné pořadí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm" onClick={toggleTTS} title="Text-to-Speech">
                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${isTTS ? 'bg-terminal-accent border-terminal-accent' : 'border-terminal-text/30 bg-transparent'}`}>
                                {isTTS && <span className="text-terminal-bg text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-terminal-text/80 flex items-center gap-1">TTS <FaVolumeUp className="opacity-60" /></span>
                        </label>
                        {selectedSubject === 'books' && (
                            <label className="flex items-center gap-2 cursor-pointer text-sm" onClick={() => setIncludePlot(!includePlot)}>
                                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${includePlot ? 'bg-terminal-accent border-terminal-accent' : 'border-terminal-text/30 bg-transparent'}`}>
                                    {includePlot && <span className="text-terminal-bg text-[10px] font-bold">✓</span>}
                                </div>
                                <span className="text-terminal-text/80">Včetně děje</span>
                            </label>
                        )}
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <div className="text-xs text-terminal-text/60 mb-2 uppercase tracking-wider">Předmět</div>
                        <div className="flex flex-wrap gap-1">
                            {subjects.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSubject(sub.id)}
                                    className={`px-3 py-1 text-xs border transition-colors ${selectedSubject === sub.id
                                        ? 'bg-terminal-accent/10 border-terminal-accent text-terminal-accent'
                                        : 'border-terminal-border/30 text-terminal-text/60 hover:border-terminal-text/30'
                                        }`}
                                >
                                    <span className="mr-1">{sub.icon}</span>
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Material Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2 border-b border-terminal-border/20 pb-1">
                            <span className="text-xs text-terminal-text/60 uppercase tracking-wider">Materiály</span>
                            <div className="flex gap-3">
                                <button onClick={() => handleSelectAll(true)} className="text-xs text-terminal-accent hover:underline">Vybrat vše</button>
                                <button onClick={() => handleSelectAll(false)} className="text-xs text-terminal-accent hover:underline">Zrušit</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-60 overflow-y-auto pr-2">
                            {allSubItems.map((subId, idx) => (
                                <label key={idx} className="flex items-center gap-2 p-1.5 cursor-pointer text-sm hover:bg-terminal-border/10 transition-colors" onClick={() => handleSubItemToggle(subId)}>
                                    <div className={`w-4 h-4 border rounded-sm flex-shrink-0 flex items-center justify-center transition-all ${selectedSubItems.includes(subId) ? 'bg-terminal-accent border-terminal-accent' : 'border-terminal-text/30 bg-transparent'}`}>
                                        {selectedSubItems.includes(subId) && <span className="text-terminal-bg text-[10px] font-bold">✓</span>}
                                    </div>
                                    <span className="text-terminal-text/80 truncate">{getSubItemLabel(subId)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex justify-center pt-4 border-t border-terminal-border/20">
                        <button
                            onClick={handleStart}
                            className="flex items-center gap-2 px-6 py-3 bg-terminal-accent text-terminal-bg font-bold text-lg transition-all hover:scale-105"
                        >
                            <FaPlay />
                            SPUSTIT ({selectedSubItems.length})
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // PLAYER SCREEN — Terminal style
    // ═══════════════════════════════════════════
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-terminal-bg text-terminal-text">
            {/* Top Bar */}
            <div className="flex-none p-3 flex items-center justify-between border-b border-terminal-border/30 bg-terminal-dim">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={stopAndExit} className="icon-btn" title="Zpět na výběr">
                        <FaArrowLeft />
                    </button>
                    <div className="hidden md:block">
                        <span className="font-bold mr-2 uppercase text-xs text-terminal-accent">
                            {subjects.find(s => s.id === selectedSubject)?.name}
                        </span>
                        <span className="text-xs text-terminal-text/50">({itemsToScroll.length} položek)</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`icon-btn ${isLooping ? 'active' : ''}`}
                        title="Opakovat"
                    >
                        <FaSyncAlt />
                    </button>
                    <button
                        onClick={toggleTTS}
                        className={`icon-btn ${isTTS ? 'active' : ''}`}
                        title={isTTS ? "Vypnout čtení" : "Zapnout čtení"}
                    >
                        {isTTS ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>

                    <div className="w-px h-6 bg-terminal-border/30 mx-1 md:mx-2"></div>

                    <div className="flex items-center gap-2 text-xs px-2">
                        <span className="text-terminal-text/60">Rychlost:</span>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={scrollSpeed}
                            onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                            className="w-16 md:w-24"
                        />
                        <span className="w-8 text-right tabular-nums text-terminal-text/80">{scrollSpeed.toFixed(1)}x</span>
                    </div>

                    <div className="w-px h-6 bg-terminal-border/30 mx-1 md:mx-2"></div>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="icon-btn active flex items-center justify-center w-10 h-10"
                    >
                        {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                    </button>
                </div>
            </div>

            {/* Scrolling Content */}
            <div
                ref={scrollContainerRef}
                onWheel={handleUserInteraction}
                onTouchMove={handleUserInteraction}
                onKeyDown={handleUserInteraction}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8"
                style={{ scrollBehavior: 'auto' }}
            >
                <div className="max-w-4xl mx-auto pb-[80vh]">
                    {itemsToScroll.map((item, index) => {
                        const color = getItemColor(item.colorIndex ?? index);
                        return (
                            <div key={item.id} className="autoscroll-item mb-10">
                                {/* Stylized Divider Header */}
                                <div
                                    className="relative mb-1 py-6 px-6 flex flex-col items-center justify-center text-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${color}15 0%, transparent 60%)`,
                                        borderLeft: `4px solid ${color}`,
                                        borderTop: `1px solid ${color}30`,
                                        borderBottom: `1px solid ${color}30`,
                                    }}
                                >
                                    {/* Item number badge */}
                                    <div
                                        className="absolute top-3 right-4 text-xs font-mono px-2 py-0.5 rounded-sm"
                                        style={{ color: color, border: `1px solid ${color}40`, background: `${color}10` }}
                                    >
                                        {index + 1} / {itemsToScroll.length}
                                    </div>
                                    <h2
                                        className="text-2xl md:text-3xl font-black tracking-tight mb-1"
                                        style={{ color: color }}
                                    >
                                        {item.title}
                                    </h2>
                                    {item.subtitle && (
                                        <p className="text-lg text-gray-300 font-light">{item.subtitle}</p>
                                    )}
                                    {item.meta && (
                                        <p className="text-xs mt-2 tracking-wider uppercase" style={{ color: `${color}99` }}>
                                            {item.meta}
                                        </p>
                                    )}
                                    {/* Decorative line */}
                                    <div className="mt-4 w-24 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                                </div>

                                {/* Content Card */}
                                <div
                                    className="terminal-card"
                                    style={{ borderLeft: `3px solid ${color}40` }}
                                >
                                    <AutoscrollContent item={item} type={selectedSubject} includePlot={includePlot} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom fade */}
            <div className="h-16 absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-terminal-bg to-transparent"></div>
        </div>
    );
};

export default AutoscrollPage;
