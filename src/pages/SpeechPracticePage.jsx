import { useState, useEffect, useRef, useCallback } from 'react';
import { FaMicrophone, FaStop, FaCheck, FaTimes, FaRedo } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';

const SpeechPracticePage = () => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const recognitionRef = useRef(null);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Tvůj prohlížeč nepodporuje rozpoznávání řeči. Použij Chrome.');
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'cs-CZ';
        recognition.continuous = true;
        recognition.interimResults = true;

        let finalTranscript = '';
        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setTranscript(finalTranscript + interim);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
        setTranscript('');
        setAnalysis(null);
    }, []);

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    const analyzeTranscript = useCallback(() => {
        if (!selectedBook || !transcript) return;
        const a = selectedBook.analysis;
        const text = transcript.toLowerCase();

        const checkpoints = [
            { label: 'Autor', keywords: [selectedBook.author?.toLowerCase()].filter(Boolean), found: false },
            { label: 'Žánr', keywords: [selectedBook.genre?.toLowerCase()].filter(Boolean), found: false },
            { label: 'Období / Směr', keywords: [selectedBook.period?.toLowerCase(), a?.literaryContext?.movement?.toLowerCase()].filter(Boolean), found: false },
            { label: 'Děj', keywords: ['děj', 'příběh', 'hlavní postava', 'zápletka'].filter(Boolean), found: false },
            { label: 'Postavy', keywords: (a?.characters || []).map(c => c.name.toLowerCase()).slice(0, 3), found: false },
            { label: 'Téma', keywords: [a?.themes?.main?.toLowerCase()?.split(' ')?.[0]].filter(Boolean), found: false },
            { label: 'Vypravěč', keywords: ['vypravěč', 'ich-forma', 'er-forma', 'ich', a?.narration?.narrator?.toLowerCase()].filter(Boolean), found: false },
            { label: 'Jazykové prostředky', keywords: ['jazyk', 'metafora', 'personifikace', 'přirovnání', 'archaismy', 'nespisovný'].filter(Boolean), found: false },
            { label: 'Kontext autora', keywords: ['tvorba', 'období', 'další díla', a?.authorContext?.shortBio?.name?.toLowerCase()].filter(Boolean), found: false },
            { label: 'Literární kontext', keywords: ['směr', 'kontext', a?.literaryContext?.movement?.toLowerCase()].filter(Boolean), found: false },
        ];

        checkpoints.forEach(cp => {
            cp.found = cp.keywords.some(kw => kw && text.includes(kw));
        });

        setAnalysis(checkpoints);
    }, [selectedBook, transcript]);

    useEffect(() => {
        if (!isListening && transcript.length > 10) {
            analyzeTranscript();
        }
    }, [isListening, transcript, analyzeTranscript]);

    if (!selectedBook) {
        return (
            <div className="max-w-3xl mx-auto mt-4">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 mb-6">
                    <FaMicrophone /> Mluvení – Cvičení
                </h1>
                <div className="terminal-card">
                    <h2 className="text-sm text-terminal-text/50 mb-3">Vyber knihu k procvičení:</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {cjBooks.books.map(b => (
                            <button key={b.id} onClick={() => setSelectedBook(b)}
                                className="px-3 py-2 text-xs text-left border border-terminal-border/20 rounded hover:border-terminal-accent/50 transition">
                                <div className="font-bold text-terminal-text truncate">{b.title}</div>
                                <div className="text-terminal-text/40 text-[10px]">{b.author}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const foundCount = analysis?.filter(c => c.found).length || 0;
    const totalCount = analysis?.length || 10;

    return (
        <div className="max-w-2xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaMicrophone /> {selectedBook.title}
                </h1>
                <button onClick={() => { setSelectedBook(null); setTranscript(''); setAnalysis(null); }}
                    className="px-3 py-1 text-xs text-terminal-text/40 border border-terminal-border/20 rounded hover:border-terminal-accent/50">
                    Změnit knihu
                </button>
            </div>

            <div className="terminal-card text-center mb-6">
                <p className="text-sm text-terminal-text/60 mb-4">Mluv o knize jako u maturity. Zmíň co nejvíc bodů:</p>
                {!isListening ? (
                    <button onClick={startListening}
                        className="px-8 py-3 bg-red-500/20 border-2 border-red-500 text-red-400 font-bold rounded-full text-lg hover:bg-red-500/30 transition flex items-center gap-2 mx-auto">
                        <FaMicrophone /> Začít mluvit
                    </button>
                ) : (
                    <button onClick={stopListening}
                        className="px-8 py-3 bg-red-500 text-white font-bold rounded-full text-lg hover:bg-red-600 transition flex items-center gap-2 mx-auto animate-pulse">
                        <FaStop /> Zastavit
                    </button>
                )}
            </div>

            {/* Live transcript */}
            {transcript && (
                <div className="terminal-card mb-6">
                    <div className="text-[10px] text-terminal-text/40 uppercase mb-2">Přepis</div>
                    <p className="text-xs text-terminal-text/80 leading-relaxed whitespace-pre-wrap">{transcript}</p>
                </div>
            )}

            {/* Analysis */}
            {analysis && (
                <div className="terminal-card">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] text-terminal-text/40 uppercase">Analýza odpovědi</div>
                        <div className="text-sm font-bold" style={{ color: foundCount >= 7 ? '#22c55e' : foundCount >= 4 ? '#eab308' : '#ef4444' }}>
                            {foundCount}/{totalCount}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {analysis.map((cp, i) => (
                            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs ${cp.found
                                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                    : 'border-red-500/20 bg-red-500/5 text-red-400/70'
                                }`}>
                                {cp.found ? <FaCheck className="text-[10px]" /> : <FaTimes className="text-[10px]" />}
                                {cp.label}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { setTranscript(''); setAnalysis(null); }}
                        className="mt-4 px-4 py-2 text-xs text-terminal-text/50 border border-terminal-border/20 rounded hover:border-terminal-accent/50 w-full flex items-center justify-center gap-1">
                        <FaRedo /> Zkusit znovu
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpeechPracticePage;
