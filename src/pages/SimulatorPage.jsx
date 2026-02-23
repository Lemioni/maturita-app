import { useState, useEffect, useRef, useCallback } from 'react';
import { FaGraduationCap, FaPlay, FaStop, FaMicrophone, FaRedo, FaKeyboard, FaBook } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

const PREP_BOTH = 15 * 60;   // 15 min for IT + Book
const PREP_SINGLE = 8 * 60;  // 8 min for one subject only

const SimulatorPage = () => {
    const [phase, setPhase] = useState('start');
    const [examFilter, setExamFilter] = useState('all'); // all, IKT1, IKT2
    const [includeBook, setIncludeBook] = useState(true);
    const [includeIT, setIncludeIT] = useState(true);
    const [drawnIT, setDrawnIT] = useState(null);
    const [drawnBook, setDrawnBook] = useState(null);
    const [prepTime, setPrepTime] = useState(PREP_BOTH);
    const [timeLeft, setTimeLeft] = useState(PREP_BOTH);
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [notes, setNotes] = useState('');
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const draw = useCallback(() => {
        let it = null, book = null;

        if (includeIT) {
            const pool = examFilter === 'all'
                ? itQuestions.questions
                : itQuestions.questions.filter(q => q.exam === examFilter);
            it = pool[Math.floor(Math.random() * pool.length)];
        }

        if (includeBook) {
            book = cjBooks.books[Math.floor(Math.random() * cjBooks.books.length)];
        }

        const bothSelected = includeIT && includeBook;
        const time = bothSelected ? PREP_BOTH : PREP_SINGLE;

        setDrawnIT(it);
        setDrawnBook(book);
        setPrepTime(time);
        setTimeLeft(time);
        setPhase('prep');
        setRecordings([]);
        setNotes('');
    }, [examFilter, includeIT, includeBook]);

    useEffect(() => {
        if (phase === 'prep' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setPhase('speaking');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [phase, timeLeft]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setRecordings(prev => [...prev, url]);
                stream.getTracks().forEach(t => t.stop());
            };
            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) {
            alert('Nepodařilo se zapnout mikrofon. Povoliš přístup?');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const skipToSpeaking = () => {
        clearInterval(timerRef.current);
        setPhase('speaking');
        setTimeLeft(0);
    };

    const ikt1Count = itQuestions.questions.filter(q => q.exam === 'IKT1').length;
    const ikt2Count = itQuestions.questions.filter(q => q.exam === 'IKT2').length;
    const canDraw = includeIT || includeBook;

    if (phase === 'start') {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <div className="terminal-card text-center py-10">
                    <FaGraduationCap className="text-5xl text-terminal-accent mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-terminal-accent mb-2">Maturitní Simulátor</h1>
                    <p className="text-terminal-text/60 mb-6 text-sm">
                        Vyber si předměty, vylosuj a připrav se!
                    </p>

                    {/* Subject toggles */}
                    <div className="flex justify-center gap-3 mb-4">
                        <button
                            onClick={() => setIncludeIT(!includeIT)}
                            className={`px-4 py-2 text-sm border rounded-lg transition-all flex items-center gap-2 ${includeIT
                                    ? 'bg-blue-500/15 border-blue-500/50 text-blue-400 font-bold'
                                    : 'border-terminal-border/20 text-terminal-text/30'
                                }`}
                        >
                            💻 IT otázka
                        </button>
                        <button
                            onClick={() => setIncludeBook(!includeBook)}
                            className={`px-4 py-2 text-sm border rounded-lg transition-all flex items-center gap-2 ${includeBook
                                    ? 'bg-green-500/15 border-green-500/50 text-green-400 font-bold'
                                    : 'border-terminal-border/20 text-terminal-text/30'
                                }`}
                        >
                            <FaBook /> Kniha
                        </button>
                    </div>

                    {/* Time info */}
                    <div className="text-[11px] text-terminal-text/30 mb-4">
                        Čas na přípravu: {includeIT && includeBook ? '15 min (oba předměty)' : '8 min (jeden předmět)'}
                    </div>

                    {/* Exam filter (only if IT is on) */}
                    {includeIT && (
                        <div className="flex justify-center gap-2 mb-6">
                            {[
                                { id: 'all', label: 'Vše', count: itQuestions.questions.length },
                                { id: 'IKT1', label: 'IKT1', count: ikt1Count },
                                { id: 'IKT2', label: 'IKT2', count: ikt2Count },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setExamFilter(f.id)}
                                    className={`px-4 py-1.5 text-xs border rounded transition-all ${examFilter === f.id
                                            ? 'bg-terminal-accent text-terminal-bg border-terminal-accent font-bold'
                                            : 'text-terminal-text/50 border-terminal-border/30 hover:border-terminal-accent/50'
                                        }`}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={draw}
                        disabled={!canDraw}
                        className={`px-8 py-3 font-bold rounded-lg text-lg transition flex items-center gap-2 mx-auto ${canDraw
                                ? 'bg-terminal-accent text-terminal-bg hover:opacity-90'
                                : 'bg-terminal-border/20 text-terminal-text/20 cursor-not-allowed'
                            }`}
                    >
                        <FaPlay /> Losovat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-4">
            <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 mb-6">
                <FaGraduationCap /> Simulátor
            </h1>

            {/* Drawn items */}
            <div className={`grid grid-cols-1 ${drawnIT && drawnBook ? 'md:grid-cols-2' : ''} gap-4 mb-6`}>
                {drawnIT && (
                    <div className="terminal-card border-l-2 border-blue-500/50">
                        <div className="text-[10px] text-blue-400 uppercase mb-1">IT Otázka · {drawnIT.exam}</div>
                        <h3 className="text-sm font-bold text-terminal-text">{drawnIT.question}</h3>
                        <p className="text-[11px] text-terminal-text/50 mt-1">{drawnIT.category}</p>
                    </div>
                )}
                {drawnBook && (
                    <div className="terminal-card border-l-2 border-green-500/50">
                        <div className="text-[10px] text-green-400 uppercase mb-1">Kniha</div>
                        <h3 className="text-sm font-bold text-terminal-text">{drawnBook.title}</h3>
                        <p className="text-[11px] text-terminal-text/50 mt-1">{drawnBook.author} · {drawnBook.period}</p>
                    </div>
                )}
            </div>

            {/* Timer (prep phase) */}
            {phase === 'prep' && (
                <div className="terminal-card text-center mb-4">
                    <div className="text-[10px] text-terminal-text/40 uppercase mb-2">Čas na přípravu</div>
                    <div className={`text-5xl font-bold tabular-nums ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-terminal-accent'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-terminal-border/20 h-1 rounded mt-4">
                        <div className="bg-terminal-accent h-1 rounded transition-all" style={{ width: `${(timeLeft / prepTime) * 100}%` }} />
                    </div>
                    <button onClick={skipToSpeaking} className="mt-4 px-4 py-1 text-xs text-terminal-text/40 border border-terminal-border/20 rounded hover:text-terminal-accent transition">
                        Přeskočit →
                    </button>
                </div>
            )}

            {/* Notes / Typing area */}
            {(phase === 'prep' || phase === 'speaking') && (
                <div className="terminal-card mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FaKeyboard className="text-terminal-accent text-xs" />
                        <span className="text-[10px] text-terminal-text/40 uppercase">Poznámky / Odpověď</span>
                        <span className="text-[10px] text-terminal-text/20 ml-auto">{notes.length} znaků</span>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Piš si poznámky, body, osnovu odpovědi..."
                        className="w-full bg-terminal-bg border border-terminal-border/20 rounded p-3 text-sm text-terminal-text placeholder-terminal-text/20 outline-none focus:border-terminal-accent/50 transition resize-y"
                        style={{ minHeight: '120px' }}
                        rows={6}
                    />
                </div>
            )}

            {/* Speaking phase */}
            {phase === 'speaking' && (
                <div className="terminal-card text-center mb-4">
                    <div className="text-[10px] text-terminal-text/40 uppercase mb-2">Teď mluv!</div>
                    {!isRecording ? (
                        <button onClick={startRecording} className="px-8 py-3 bg-red-500/20 border-2 border-red-500 text-red-400 font-bold rounded-full text-lg hover:bg-red-500/30 transition flex items-center gap-2 mx-auto">
                            <FaMicrophone /> Nahrávat
                        </button>
                    ) : (
                        <button onClick={stopRecording} className="px-8 py-3 bg-red-500 text-white font-bold rounded-full text-lg hover:bg-red-600 transition flex items-center gap-2 mx-auto animate-pulse">
                            <FaStop /> Zastavit
                        </button>
                    )}
                </div>
            )}

            {/* Recordings */}
            {recordings.length > 0 && (
                <div className="terminal-card mb-4">
                    <h3 className="text-xs text-terminal-text/50 mb-3">Nahrávky:</h3>
                    <div className="space-y-2">
                        {recordings.map((url, i) => (
                            <audio key={i} controls src={url} className="w-full" />
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                <button onClick={draw} className="px-6 py-2 bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90 transition flex items-center gap-2">
                    <FaRedo /> Nové losování
                </button>
            </div>
        </div>
    );
};

export default SimulatorPage;
