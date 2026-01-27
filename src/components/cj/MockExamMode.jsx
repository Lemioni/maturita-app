import { useState, useEffect, useMemo } from 'react';
import { FaClock, FaCheck, FaTimes, FaPlay, FaGraduationCap, FaPen, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

// Section Component for Exam/Eval - Moved outside
const ExamSection = ({ title, color, children }) => (
    <div className={`border border-terminal-border/30 rounded-lg overflow-hidden mb-6`}>
        <div className={`px-4 py-2 ${color} border-b border-terminal-border/20 font-bold text-sm tracking-widest text-terminal-bg flex justify-between items-center`}>
            {title}
        </div>
        <div className="p-4 space-y-4 bg-terminal-bg/30">
            {children}
        </div>
    </div>
);

// Input Component - Moved outside
const InputField = ({ id, label, placeholder, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs text-terminal-text/80 font-bold block uppercase">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            className="w-full bg-terminal-bg border border-terminal-border/30 rounded p-2 text-sm text-terminal-text focus:border-terminal-accent focus:outline-none min-h-[60px] resize-y"
            placeholder={placeholder || "Tvoje poznámky..."}
        />
    </div>
);

// Eval Row Component - Moved outside
const EvalRow = ({ id, label, userVal, correctContent, onCheck, isChecked }) => (
    <div className="border border-terminal-border/30 rounded-lg overflow-hidden transition-all hover:border-terminal-accent/30">
        <button
            onClick={() => onCheck(id)}
            className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors ${isChecked ? 'bg-green-900/10 border-b border-green-500/20' : 'bg-terminal-surface border-b border-terminal-border/10'}`}
        >
            <span className="font-bold text-sm text-terminal-text uppercase">{label}</span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isChecked ? 'bg-green-500 text-terminal-bg' : 'bg-terminal-border/20 text-terminal-text/40'}`}>
                {isChecked ? <><FaCheck /> SPLNĚNO</> : <><FaTimes /> NESPLNĚNO</>}
            </div>
        </button>

        <div className="grid md:grid-cols-2 text-sm divide-y md:divide-y-0 md:divide-x divide-terminal-border/20">
            {/* User Input */}
            <div className="p-4 bg-terminal-bg/50">
                <div className="text-xs text-terminal-text/40 uppercase mb-2 font-bold flex items-center gap-1"><FaPen className="text-[10px]" /> Tvoje poznámky</div>
                <p className={`whitespace-pre-wrap ${userVal ? 'text-terminal-text/90' : 'text-terminal-text/30 italic'}`}>
                    {userVal || 'Bez poznámek'}
                </p>
            </div>
            {/* Official Data */}
            <div className="p-4 bg-terminal-accent/5">
                <div className="text-xs text-terminal-accent/60 uppercase mb-2 font-bold flex items-center gap-1"><FaCheck className="text-[10px]" /> Správné řešení</div>
                <div className="whitespace-pre-line text-terminal-text/90 leading-relaxed">
                    {correctContent || <span className="text-red-400 italic">Data nejsou k dispozici</span>}
                </div>
            </div>
        </div>
    </div>
);

const MockExamMode = ({ filter }) => {
    const [phase, setPhase] = useState('intro');
    const [currentBook, setCurrentBook] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    // STRUCTURED NOTES based on the Maturita Exam Table
    const [notes, setNotes] = useState({
        // I. Část - Analýza
        excerptContext: '',
        excerptSituation: '',
        titleSignificance: '',
        timeSpace: '',
        formGenre: '',

        // II. Část - Postavy a vypravěč
        narrator: '',
        mainChar: '',
        otherChars: '',

        // III. Část - Jazyk
        languageDevices: '',

        // Literárněhistorický kontext
        authorContext: '',
        literaryContext: ''
    });

    // Evaluation toggle state
    const [checklist, setChecklist] = useState({
        excerptContext: false,
        excerptSituation: false,
        titleSignificance: false,
        timeSpace: false,
        formGenre: false,
        narrator: false,
        mainChar: false,
        otherChars: false,
        languageDevices: false,
        authorContext: false,
        literaryContext: false
    });

    const availableBooks = useMemo(() => cjBooksData.books.filter(b =>
        (filter === 'all' || b.period === filter) &&
        b.analysis?.excerpt?.text
    ), [filter]);

    useEffect(() => {
        let interval;
        if (phase === 'exam' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && phase === 'exam') {
            handleFinishExam();
        }
        return () => clearInterval(interval);
    }, [phase, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const startExam = () => {
        if (availableBooks.length === 0) return;
        const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
        setCurrentBook(randomBook);
        setPhase('exam');
        setTimeLeft(15 * 60);

        // Reset inputs
        const emptyNotes = {};
        Object.keys(notes).forEach(k => emptyNotes[k] = '');
        setNotes(emptyNotes);

        const emptyCheck = {};
        Object.keys(checklist).forEach(k => emptyCheck[k] = false);
        setChecklist(emptyCheck);
    };

    const handleFinishExam = () => setPhase('eval');

    const handleNoteChange = (id, value) => {
        setNotes(prev => ({ ...prev, [id]: value }));
    };

    const handleCheckToggle = (id) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Renders ---

    if (phase === 'intro') {
        return (
            <div className="max-w-2xl mx-auto terminal-card p-8 text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-terminal-accent/10 flex items-center justify-center border-2 border-terminal-accent/30 animate-pulse">
                        <FaGraduationCap className="text-5xl text-terminal-accent" />
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-terminal-text mb-2">Maturitní "Potítko"</h2>
                    <p className="text-terminal-text/60 max-w-md mx-auto">
                        Simulace reálné zkoušky. Dostaneš "ostrý" pracovní list (strukturu ústní zkoušky) a 15 minut na přípravu.
                    </p>
                </div>

                <div className="bg-terminal-bg/50 p-6 border border-terminal-border/30 rounded text-left space-y-4">
                    <h3 className="font-bold text-terminal-accent border-b border-terminal-border/20 pb-2">Struktura úkolů (podle CERMAT):</h3>

                    <div className="grid grid-cols-[1fr_3fr] gap-4 text-sm">
                        <div className="text-terminal-text/60">I. Část</div>
                        <div className="text-terminal-text/80">Analýza uměleckého textu (téma, čas, prostor, druh, žánr)</div>

                        <div className="text-terminal-text/60">II. Část</div>
                        <div className="text-terminal-text/80">Charakteristika vypravěče a postav</div>

                        <div className="text-terminal-text/60">III. Část</div>
                        <div className="text-terminal-text/80">Jazykové prostředky ve výňatku</div>

                        <div className="text-terminal-text/60">Historie</div>
                        <div className="text-terminal-text/80">Literárněhistorický kontext autora a díla</div>
                    </div>
                </div>

                <button
                    onClick={startExam}
                    disabled={availableBooks.length === 0}
                    className="w-full py-4 bg-terminal-accent text-terminal-bg font-bold text-lg hover:opacity-90 transition-all rounded shadow-[0_0_20px_rgba(0,255,150,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {availableBooks.length > 0 ? 'ROZDAT ZADÁNÍ A SPUSTIT ČASOMÍRU' : 'Žádné knihy s úryvky'}
                </button>
            </div>
        );
    }

    if (phase === 'exam') {
        const cleanExcerpt = currentBook.analysis.excerpt.text.split('\\n').join('\n');

        return (
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Sticky Header with Timer */}
                <div className={`sticky top-2 z-50 terminal-card p-3 flex justify-between items-center shadow-lg transition-colors border-b-4 ${timeLeft < 60 ? 'border-red-500 bg-red-900/90' : 'border-terminal-accent bg-terminal-bg/95 backdrop-blur'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-terminal-surface flex items-center justify-center border border-terminal-border/30">
                            <FaClock className={`${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-terminal-accent'}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-terminal-text/40 font-bold tracking-wider">Zbývá času</span>
                            <span className={`font-mono text-xl font-bold leading-none ${timeLeft < 60 ? 'text-red-500' : 'text-terminal-text'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                    <div className="text-center hidden md:block">
                        <span className="text-xs text-terminal-text/40 uppercase tracking-widest">Pracovní list pro dílo</span>
                        <h2 className="text-terminal-text font-bold">{currentBook.title}</h2>
                    </div>
                    <button
                        onClick={handleFinishExam}
                        className="px-4 py-2 bg-terminal-text/10 hover:bg-terminal-text/20 text-terminal-text border border-terminal-text/20 text-xs font-bold rounded uppercase tracking-wide transition-colors"
                    >
                        Odevzdat a vyhodnotit
                    </button>
                </div>

                <div className="grid lg:grid-cols-[40%_60%] gap-6 items-start">
                    {/* LEFT COLUMN: Excerpt (ALWAYS VISIBLE) */}
                    <div className="lg:sticky lg:top-24 space-y-4">
                        <div className="terminal-card border-terminal-accent/30 shadow-none">
                            <div className="text-xs text-terminal-accent uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                                <FaEye /> Výňatek z uměleckého textu
                            </div>
                            <div className="font-mono text-sm leading-relaxed whitespace-pre-line max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                                {cleanExcerpt}
                            </div>
                        </div>
                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded text-xs text-yellow-500/80">
                            💡 Tip: Kývej se na židli, ať to vypadá, že přemýšlíš.
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Exam Structure Input */}
                    <div className="space-y-1 pb-20">

                        {/* I. ČÁST */}
                        <ExamSection title="I. ČÁST: Analýza uměleckého textu" color="bg-cyan-600">
                            <InputField id="excerptContext" label="• Zasadit výňatek do kontextu díla" placeholder="Kde se to odehrává? Co tomu předcházelo?" value={notes.excerptContext} onChange={handleNoteChange} />
                            <InputField id="excerptSituation" label="• Analyzovat situaci ve výňatku" placeholder="Co se tam právě děje?" value={notes.excerptSituation} onChange={handleNoteChange} />
                            <InputField id="titleSignificance" label="• Významotvorná funkce názvu" placeholder="Proč se to tak jmenuje?" value={notes.titleSignificance} onChange={handleNoteChange} />
                            <InputField id="timeSpace" label="• Čas a prostor díla" placeholder="Kde a kdy?" value={notes.timeSpace} onChange={handleNoteChange} />
                            <InputField id="formGenre" label="• Literární druh a žánr" placeholder="Epika/Lyrika/Drama? Román/Povídka...?" value={notes.formGenre} onChange={handleNoteChange} />
                        </ExamSection>

                        {/* II. ČÁST */}
                        <ExamSection title="II. ČÁST: Postavy a vyprávění" color="bg-purple-600">
                            <InputField id="narrator" label="• Vypravěč / Lyrický subjekt" placeholder="Ich-forma/Er-forma? Kdo mluví?" value={notes.narrator} onChange={handleNoteChange} />
                            <InputField id="mainChar" label="• Charakteristika hlavní postavy" placeholder="Kdo to je? Jaký je?" value={notes.mainChar} onChange={handleNoteChange} />
                            <InputField id="otherChars" label="• Další postavy" placeholder="Kdo další je důležitý?" value={notes.otherChars} onChange={handleNoteChange} />
                        </ExamSection>

                        {/* III. ČÁST */}
                        <ExamSection title="III. ČÁST: Jazykové prostředky" color="bg-pink-600">
                            <InputField id="languageDevices" label="• Jazykové prostředky ve výňatku" placeholder="Hledej v textu vlevo: metafory, slang, spisovnost..." value={notes.languageDevices} onChange={handleNoteChange} />
                        </ExamSection>

                        {/* KONTEXT */}
                        <ExamSection title="Literárněhistorický kontext" color="bg-orange-600">
                            <InputField id="authorContext" label="• Kontext tvorby autora" placeholder="Kdo to byl? Kdy žil? Co dalšího napsal?" value={notes.authorContext} onChange={handleNoteChange} />
                            <InputField id="literaryContext" label="• Kontext české/světové literatury" placeholder="Jaký směr? Kdo tvořil ve stejné době?" value={notes.literaryContext} onChange={handleNoteChange} />
                        </ExamSection>

                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'eval') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-24">
                <div className="text-center terminal-card">
                    <h2 className="text-2xl font-bold text-terminal-text mb-2">Vyhodnocení: {currentBook.title}</h2>
                    <p className="text-terminal-text/60">Prodi si bod po bodu a upřímně si odškrtni, co jsi trefil.</p>
                </div>

                <div className="space-y-8">
                    {/* I. ČÁST */}
                    <div className="space-y-4">
                        <h3 className="text-cyan-500 font-bold border-b border-cyan-500/30 pb-1">I. ČÁST</h3>
                        <EvalRow id="excerptContext" label="Kontext výňatku" userVal={notes.excerptContext}
                            correctContent={currentBook.analysis.excerpt.context} onCheck={handleCheckToggle} isChecked={checklist.excerptContext} />
                        <EvalRow id="excerptSituation" label="Situace ve výňatku" userVal={notes.excerptSituation}
                            correctContent="Viz text úryvku - kontrola pochopení obsahu." onCheck={handleCheckToggle} isChecked={checklist.excerptSituation} />
                        <EvalRow id="titleSignificance" label="Význam názvu" userVal={notes.titleSignificance}
                            correctContent={currentBook.analysis.titleAnalysis} onCheck={handleCheckToggle} isChecked={checklist.titleSignificance} />
                        <EvalRow id="timeSpace" label="Čas a prostor" userVal={notes.timeSpace}
                            correctContent={`Místo: ${currentBook.analysis.setting.place}\nČas: ${currentBook.analysis.setting.time}`} onCheck={handleCheckToggle} isChecked={checklist.timeSpace} />
                        <EvalRow id="formGenre" label="Druh a žánr" userVal={notes.formGenre}
                            correctContent={`${currentBook.literaryForm}, ${currentBook.genre}`} onCheck={handleCheckToggle} isChecked={checklist.formGenre} />
                    </div>

                    {/* II. ČÁST */}
                    <div className="space-y-4">
                        <h3 className="text-purple-500 font-bold border-b border-purple-500/30 pb-1">II. ČÁST</h3>
                        <EvalRow id="narrator" label="Vypravěč" userVal={notes.narrator}
                            correctContent={`${currentBook.analysis.narration.narrator}\n${currentBook.analysis.narration.style || ''}`} onCheck={handleCheckToggle} isChecked={checklist.narrator} />
                        <EvalRow id="mainChar" label="Hlavní postava" userVal={notes.mainChar}
                            correctContent={currentBook.analysis.characters.filter(c => c.isMain).map(c => `• ${c.name}: ${c.traits?.Povaha || c.description}`).join('\n')} onCheck={handleCheckToggle} isChecked={checklist.mainChar} />
                        <EvalRow id="otherChars" label="Další postavy" userVal={notes.otherChars}
                            correctContent={currentBook.analysis.characters.filter(c => !c.isMain).map(c => `• ${c.name}: ${c.traits?.Role || c.description}`).join('\n')} onCheck={handleCheckToggle} isChecked={checklist.otherChars} />
                    </div>

                    {/* III. ČÁST */}
                    <div className="space-y-4">
                        <h3 className="text-pink-500 font-bold border-b border-pink-500/30 pb-1">III. ČÁST</h3>
                        <EvalRow id="languageDevices" label="Jazykové prostředky" userVal={notes.languageDevices}
                            correctContent={[...currentBook.analysis.languageDevices, ...(currentBook.analysis.literaryDevices?.map(d => `${d.name}: ${d.example}`) || [])].join('\n• ')} onCheck={handleCheckToggle} isChecked={checklist.languageDevices} />
                    </div>

                    {/* HISTORIE */}
                    <div className="space-y-4">
                        <h3 className="text-orange-500 font-bold border-b border-orange-500/30 pb-1">LITERÁRNÍ HISTORIE</h3>
                        <EvalRow id="authorContext" label="Kontext autora" userVal={notes.authorContext}
                            correctContent={currentBook.analysis.authorContext.shortBio.info.join('\n• ') + '\n\n' + currentBook.analysis.authorContext.workPosition} onCheck={handleCheckToggle} isChecked={checklist.authorContext} />
                        <EvalRow id="literaryContext" label="Kontext literatury" userVal={notes.literaryContext}
                            correctContent={`${currentBook.analysis.literaryContext.movement} (${currentBook.analysis.literaryContext.period})\n\nDalší autoři:\n` + currentBook.analysis.literaryContext.otherAuthors.map(a => `• ${a.name}`).join('\n')} onCheck={handleCheckToggle} isChecked={checklist.literaryContext} />
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="fixed bottom-0 left-0 right-0 bg-terminal-bg/90 backdrop-blur border-t border-terminal-border/20 p-4 flex justify-center gap-4 z-50">
                    <button onClick={() => setPhase('intro')} className="px-6 py-3 border border-terminal-border/30 rounded text-terminal-text/60 hover:text-terminal-text transition-colors">
                        Zrušit
                    </button>
                    <button onClick={() => setPhase('result')} className="px-8 py-3 bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90 shadow-lg shadow-terminal-accent/20">
                        Zobrazit výsledek
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        const score = Object.values(checklist).filter(Boolean).length;
        const total = Object.keys(checklist).length;
        const percentage = Math.round((score / total) * 100);

        return (
            <div className="max-w-xl mx-auto terminal-card text-center p-12 space-y-6 mt-10">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-terminal-accent/20 flex items-center justify-center relative">
                    <span className="text-3xl font-bold text-terminal-accent">{percentage}%</span>
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-terminal-border/10" />
                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-terminal-accent" strokeDasharray={`${percentage * 3.77} 377`} />
                    </svg>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-terminal-text mb-2">
                        {percentage >= 80 ? 'Skvělá práce! 🎓' : percentage >= 50 ? 'Jde to, ale zaber. 😐' : 'Tohle by neprošlo. 💀'}
                    </h2>
                    <p className="text-terminal-text/60">
                        Splnil jsi <b>{score}</b> z <b>{total}</b> bodů struktury zkoušky.
                    </p>
                </div>

                <div className="flex gap-4 pt-6">
                    <button onClick={startExam} className="flex-1 py-3 bg-terminal-accent text-terminal-bg font-bold rounded hover:opacity-90">
                        Zkusit jiné dílo
                    </button>
                    <button onClick={() => setPhase('intro')} className="flex-1 py-3 border border-terminal-border/30 text-terminal-text/70 rounded hover:bg-terminal-surface">
                        Menu
                    </button>
                </div>
            </div>
        );
    }
    return null;
};

export default MockExamMode;
