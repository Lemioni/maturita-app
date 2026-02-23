import { useState, useMemo } from 'react';
import { FaGamepad, FaRedo, FaTrophy } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';

const generateTasks = () => {
    const tasks = [];
    const books = cjBooks.books;

    books.forEach(b => {
        tasks.push(`Řekni autora "${b.title}"`);
        tasks.push(`Řekni žánr "${b.title}"`);
    });
    tasks.push('Jmenuj 3 motivy z Babičky');
    tasks.push('Porovnej 2 díla stejného směru');
    tasks.push('Řekni 3 jazykové prostředky');
    tasks.push('Vyjmenuj 5 literárních směrů');
    tasks.push('Popsat kompozici libovolné knihy');
    tasks.push('Řekni 3 tropy/figury s příkladem');
    tasks.push('Jmenuj 2 autory romantismu');
    tasks.push('Popsat chronotop libovolného díla');
    tasks.push('Řekni vypravěče 3 různých knih');
    tasks.push('Přeříct stručně děj libovolné knihy');
    tasks.push('Jmenuj divadelní adaptaci knihy');
    tasks.push('Popsat literární kontext díla');
    tasks.push('Řekni hlavní postavu 3 knih');
    tasks.push('Vysvětli rozdíl epika vs. lyrika');

    // Shuffle and pick 25
    for (let i = tasks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
    }
    return tasks.slice(0, 25);
};

const BingoPage = () => {
    const [tasks, setTasks] = useState(() => generateTasks());
    const [completed, setCompleted] = useState(new Set());

    const toggleCell = (idx) => {
        const next = new Set(completed);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        setCompleted(next);
    };

    const reset = () => {
        setTasks(generateTasks());
        setCompleted(new Set());
    };

    // Check for bingo
    const hasBingo = useMemo(() => {
        const grid = Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => completed.has(r * 5 + c))
        );
        // Rows
        for (let r = 0; r < 5; r++) if (grid[r].every(Boolean)) return true;
        // Columns
        for (let c = 0; c < 5; c++) if (grid.every(row => row[c])) return true;
        // Diagonals
        if ([0, 1, 2, 3, 4].every(i => grid[i][i])) return true;
        if ([0, 1, 2, 3, 4].every(i => grid[i][4 - i])) return true;
        return false;
    }, [completed]);

    return (
        <div className="max-w-3xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaGamepad /> Book Bingo
                </h1>
                <div className="flex gap-3 items-center">
                    <span className="text-xs text-terminal-text/50">{completed.size}/25 splněno</span>
                    <button onClick={reset} className="px-3 py-1 text-xs text-terminal-text/50 border border-terminal-border/30 rounded hover:border-terminal-accent/50 transition">
                        <FaRedo className="inline mr-1" /> Nové
                    </button>
                </div>
            </div>

            {hasBingo && (
                <div className="terminal-card text-center mb-6 border-l-2 border-yellow-500/50 py-4 animate-pulse">
                    <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-yellow-500">BINGO! 🎉</h2>
                    <p className="text-sm text-terminal-text/60">Máš celou řadu! Skvělá práce!</p>
                </div>
            )}

            {/* 5x5 Grid */}
            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                {tasks.map((task, idx) => (
                    <button
                        key={idx}
                        onClick={() => toggleCell(idx)}
                        className={`aspect-square p-1.5 md:p-2 border rounded text-[9px] md:text-[11px] leading-tight text-center transition-all flex items-center justify-center ${completed.has(idx)
                                ? 'bg-terminal-accent/20 border-terminal-accent/50 text-terminal-accent font-bold'
                                : 'bg-terminal-bg/50 border-terminal-border/20 text-terminal-text/60 hover:border-terminal-accent/30'
                            }`}
                    >
                        {completed.has(idx) ? '✓' : task}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BingoPage;
