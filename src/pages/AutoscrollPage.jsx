import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExperimental } from '../context/ExperimentalContext';
import { FaPlay, FaPause, FaSyncAlt, FaRandom, FaVolumeUp, FaVolumeMute, FaArrowLeft, FaScroll } from 'react-icons/fa';

import itQuestions from '../data/it-questions.json';
import cjBooks from '../data/cj-books.json';
import dictionaryData from '../data/dictionary.json';

const AutoscrollPage = () => {
    const { frutigerAero } = useExperimental();

    const [mode, setMode] = useState('selection'); // 'selection' or 'player'
    const [selectedSubject, setSelectedSubject] = useState('it');

    // Sub-item selection
    const [selectedSubItems, setSelectedSubItems] = useState([]);

    const [itemsToScroll, setItemsToScroll] = useState([]);

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [isLooping, setIsLooping] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isTTS, setIsTTS] = useState(false);

    const scrollContainerRef = useRef(null);
    const requestRef = useRef();
    const scrollPosRef = useRef(0);
    const isUserScrollingRef = useRef(false);
    const userScrollTimeoutRef = useRef(null);
    const currentSpokenItemIndexRef = useRef(-1);

    const subjects = [
        { id: 'it', name: 'IT Otázky', icon: '💻' },
        { id: 'books', name: 'ČJ Knihy', icon: '📖' },
        { id: 'dictionary', name: 'Slovník pojmů', icon: '📚' }
    ];

    // Initialize sub-items based on subject
    useEffect(() => {
        if (selectedSubject === 'it') {
            setSelectedSubItems(itQuestions.categories || []);
        } else if (selectedSubject === 'books') {
            setSelectedSubItems(cjBooks.books.map(b => b.id.toString()));
        } else if (selectedSubject === 'dictionary') {
            setSelectedSubItems(['epochy', 'autori', 'zanry']);
        }
    }, [selectedSubject]);

    const handleSubItemToggle = (subItemId) => {
        setSelectedSubItems(prev => {
            if (prev.includes(subItemId)) {
                return prev.filter(id => id !== subItemId);
            } else {
                return [...prev, subItemId];
            }
        });
    };

    const handleSelectAll = (selectAll) => {
        if (!selectAll) {
            setSelectedSubItems([]);
            return;
        }
        if (selectedSubject === 'it') {
            setSelectedSubItems(itQuestions.categories || []);
        } else if (selectedSubject === 'books') {
            setSelectedSubItems(cjBooks.books.map(b => b.id.toString()));
        } else if (selectedSubject === 'dictionary') {
            setSelectedSubItems(['epochy', 'autori', 'zanry']);
        }
    };

    const handleStart = () => {
        let items = [];

        if (selectedSubject === 'it') {
            items = itQuestions.questions
                .filter(q => selectedSubItems.includes(q.category))
                .map(q => ({
                    id: `it-${q.id}`,
                    title: `Otázka ${q.id}: ${q.question}`,
                    content: q.compactContent?.sections?.map(s => {
                        let text = s.text ? s.text + '\n' : '';
                        if (s.items) {
                            text += s.items.map(i => `${i.term}: ${i.definition}`).join('\n');
                        }
                        return text;
                    }).join('\n\n') || q.answer
                }));
        } else if (selectedSubject === 'books') {
            items = cjBooks.books
                .filter(b => selectedSubItems.includes(b.id.toString()))
                .map(b => {
                    let bookContent = `Autor: ${b.author}\nŽánr/Druh: ${b.genre || b.genres?.join(', ') || ''} / ${b.literaryForm || ''}\nObdobí: ${b.period || ''}\n\n`;

                    if (b.analysis && b.analysis.theme_and_motifs) {
                        bookContent += `TÉMA A MOTIVY:\n`;
                        bookContent += `Hlavní téma: ${b.analysis.theme_and_motifs.main_theme || ''}\n`;
                        bookContent += `Motivy: ${b.analysis.theme_and_motifs.motifs?.join(', ') || ''}\n\n`;
                    }
                    if (b.analysis && b.analysis.setting) {
                        bookContent += `ČASOPROSTOR:\n`;
                        bookContent += `Místo: ${b.analysis.setting.place || ''}\n`;
                        bookContent += `Čas: ${b.analysis.setting.time || ''}\n\n`;
                    }
                    if (b.analysis && b.analysis.composition) {
                        bookContent += `KOMPOZICE:\n`;
                        bookContent += `Struktura: ${b.analysis.composition.structure || ''}\n`;
                        bookContent += `Časová osa: ${b.analysis.composition.timeline || ''}\n\n`;
                    }
                    if (b.analysis && b.analysis.characters) {
                        bookContent += `POSTAVY:\n`;
                        b.analysis.characters.forEach(c => {
                            bookContent += `- ${c.name}: ${c.description || ''}\n`;
                        });
                        bookContent += `\n`;
                    }
                    if (b.analysis && b.analysis.language_and_style) {
                        bookContent += `JAZYK A STYL:\n`;
                        if (Array.isArray(b.analysis.language_and_style.features)) {
                            bookContent += `Znaky: ${b.analysis.language_and_style.features.join(', ')}\n`;
                        } else if (typeof b.analysis.language_and_style === 'string') {
                            bookContent += `${b.analysis.language_and_style}\n`;
                        }
                    }

                    return {
                        id: `book-${b.id}`,
                        title: `${b.title} - ${b.author}`,
                        content: bookContent
                    };
                });
        } else if (selectedSubject === 'dictionary') {
            items = dictionaryData.terms
                .filter(t => selectedSubItems.includes(t.category))
                .map(t => ({
                    id: `dict-${t.id}`,
                    title: t.term,
                    content: t.definition
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

        // Reset TTS & Prime Engine
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (isTTS) {
                const utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0;
                window.speechSynthesis.speak(utterance);
            }
        }
        currentSpokenItemIndexRef.current = -1;
    };

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
                window.speechSynthesis.cancel();
                currentSpokenItemIndexRef.current = activeIndex;

                let contentText = itemsToScroll[activeIndex].content;
                const textToSpeak = `${itemsToScroll[activeIndex].title}. ${contentText}`.replace(/<[^>]*>?/gm, '');

                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'cs-CZ';

                // Get list of voices
                const voices = window.speechSynthesis.getVoices();
                // Try to find a good Czech or suitable voice if available
                const czechVoice = voices.find(v => v.lang === 'cs-CZ' && (v.name.includes('Google') || v.name.includes('Microsoft')))
                    || voices.find(v => v.lang === 'cs-CZ');

                if (czechVoice) {
                    utterance.voice = czechVoice;
                }

                utterance.rate = 1.0;
                window.speechSynthesis.speak(utterance);
            }
        }

        requestRef.current = requestAnimationFrame(animateScroll);
    }, [isPlaying, scrollSpeed, isLooping, isTTS, itemsToScroll]);

    useEffect(() => {
        if (mode === 'player') {
            requestRef.current = requestAnimationFrame(animateScroll);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, [mode, animateScroll]);

    const handleUserInteraction = () => {
        if (!isPlaying) return;

        isUserScrollingRef.current = true;

        if (scrollContainerRef.current) {
            scrollPosRef.current = scrollContainerRef.current.scrollTop;
        }

        if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);

        userScrollTimeoutRef.current = setTimeout(() => {
            isUserScrollingRef.current = false;
        }, 3000);
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
            <div className={`max-w-4xl mx-auto space-y-6 pt-8 pb-12 px-4 ${frutigerAero ? 'text-[#005580]' : 'text-gray-200'}`}>
                <div className="flex items-center gap-3 border-b border-terminal-border/20 pb-4 mb-6">
                    <FaScroll className={`text-2xl ${frutigerAero ? 'text-[#00a2ff]' : 'text-red-500'}`} />
                    <h1 className="text-3xl font-bold">Autoscroll Reader</h1>
                </div>

                <div className={`p-6 rounded-xl ${frutigerAero ? 'bg-white/60 border border-white/80 shadow-[0_8px_32px_rgba(0,120,255,0.15)] backdrop-blur-md' : 'bg-[#1a1a1a] border border-[#333]'}`}>
                    <h2 className="text-xl font-semibold mb-2">Nastavení čtení</h2>
                    <p className={`mb-6 text-sm ${frutigerAero ? 'text-[#005580]/80' : 'text-gray-400'}`}>
                        Vyberte si předmět a materiály pro automatické plynulé scrollování. Ideální pro pasivní opakování (např. před spaním).
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg bg-black/5 dark:bg-white/5">
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input type="checkbox" checked={isLooping} onChange={() => setIsLooping(!isLooping)} className={`w-4 h-4 ${frutigerAero ? 'accent-[#00a2ff]' : 'accent-red-500'}`} />
                            <span>Opakovat dokola (Loop)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input type="checkbox" checked={isRandom} onChange={() => setIsRandom(!isRandom)} className={`w-4 h-4 ${frutigerAero ? 'accent-[#00a2ff]' : 'accent-red-500'}`} />
                            <span>Náhodné pořadí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-medium" title="Upozornění: Prohlížeč může vyžadovat ztišení.">
                            <input type="checkbox" checked={isTTS} onChange={toggleTTS} className={`w-4 h-4 ${frutigerAero ? 'accent-[#00a2ff]' : 'accent-red-500'}`} />
                            <span className="flex items-center gap-1">Předčítat text (TTS) <FaVolumeUp className="opacity-70" /></span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3">1. Výběr předmětu</h3>
                        <div className="flex flex-wrap gap-2">
                            {subjects.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSubject(sub.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedSubject === sub.id
                                        ? frutigerAero ? 'bg-gradient-to-r from-[#00a2ff] to-[#0066cc] text-white shadow-md' : 'bg-red-500 text-white'
                                        : frutigerAero ? 'bg-white/50 hover:bg-white/80' : 'bg-[#222] hover:bg-[#333]'
                                        }`}
                                >
                                    <span>{sub.icon}</span>
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3 border-b border-black/10 dark:border-white/10 pb-2">
                            <h3 className="text-lg font-bold">2. Výběr materiálů</h3>
                            <div className="flex gap-4">
                                <button onClick={() => handleSelectAll(true)} className="text-sm text-blue-500 hover:underline">Vybrat vše</button>
                                <button onClick={() => handleSelectAll(false)} className="text-sm text-blue-500 hover:underline">Zrušit výběr</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                            {allSubItems.map((subId, idx) => (
                                <label key={idx} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${frutigerAero ? 'hover:bg-[#00a2ff]/10' : 'hover:bg-white/5'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubItems.includes(subId)}
                                        onChange={() => handleSubItemToggle(subId)}
                                        className={`w-4 h-4 ${frutigerAero ? 'accent-[#00a2ff]' : 'accent-red-500'}`}
                                    />
                                    <span className="truncate">{getSubItemLabel(subId)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleStart}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-xl font-bold transition-all hover:scale-105 ${frutigerAero
                                ? 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                                }`}
                        >
                            <FaPlay />
                            SPUSTIT ČTENÍ ({selectedSubItems.length})
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${frutigerAero ? 'bg-gradient-to-b from-[#d4f0ff] to-[#f0f8ff] text-[#005580]' : 'bg-[#111] text-gray-200'}`}>
            <div className={`flex-none p-3 flex items-center justify-between shadow-md z-10 ${frutigerAero ? 'bg-white/80 backdrop-blur-md border-b border-[#00a2ff]/20' : 'bg-[#1a1a1a] border-b border-[#333]'}`}>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={stopAndExit}
                        className={`p-2 rounded-full transition-colors ${frutigerAero ? 'hover:bg-[#00a2ff]/10' : 'hover:bg-[#333]'}`}
                        title="Zpět na výběr"
                    >
                        <FaArrowLeft />
                    </button>
                    <div className="hidden md:block">
                        <span className="font-bold mr-2 uppercase text-sm">
                            {subjects.find(s => s.id === selectedSubject)?.name}
                        </span>
                        <span className="text-xs opacity-60">({itemsToScroll.length} položek)</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`p-2 rounded transition-colors ${isLooping ? 'text-green-500' : 'opacity-50'}`}
                        title="Opakovat"
                    >
                        <FaSyncAlt />
                    </button>
                    <button
                        onClick={toggleTTS}
                        className={`p-2 rounded transition-colors ${isTTS ? 'text-blue-500' : 'opacity-50'}`}
                        title={isTTS ? "Vypnout čtení" : "Zapnout čtení"}
                    >
                        {isTTS ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>

                    <div className="w-px h-6 bg-gray-500/30 mx-1 md:mx-2"></div>

                    <div className="flex items-center gap-2 text-xs md:text-sm px-2">
                        <span>Rychlost:</span>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={scrollSpeed}
                            onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                            className={`w-16 md:w-24 ${frutigerAero ? 'accent-[#00a2ff]' : 'accent-red-500'}`}
                        />
                        <span className="w-8 text-right tabular-nums">{scrollSpeed.toFixed(1)}x</span>
                    </div>

                    <div className="w-px h-6 bg-gray-500/30 mx-1 md:mx-2"></div>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform hover:scale-105 ${frutigerAero
                            ? 'bg-gradient-to-b from-[#00a2ff] to-[#0066cc] text-white shadow-md'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                onWheel={handleUserInteraction}
                onTouchMove={handleUserInteraction}
                onKeyDown={handleUserInteraction}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8"
                style={{ scrollBehavior: 'auto' }}
            >
                <div className="max-w-3xl mx-auto pb-[80vh]">
                    {itemsToScroll.map((item, index) => (
                        <div
                            key={item.id}
                            className={`autoscroll-item mb-12 p-6 rounded-xl border ${frutigerAero ? 'bg-white/70 border-white shadow-sm' : 'bg-[#1a1a1a] border-[#333]'}`}
                        >
                            <h2 className="text-2xl font-bold mb-4 border-b border-black/10 dark:border-white/10 pb-3">
                                {item.title}
                            </h2>
                            <div className="whitespace-pre-line leading-relaxed text-lg opacity-90 font-mono">
                                {item.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`h-16 absolute bottom-0 left-0 right-0 pointer-events-none ${frutigerAero ? 'bg-gradient-to-t from-[#d4f0ff]/90 to-transparent' : 'bg-gradient-to-t from-[#111] to-transparent'}`}></div>
        </div>
    );
};

export default AutoscrollPage;
