import { useState } from 'react';
import { FaBalanceScale, FaPlus, FaTimes } from 'react-icons/fa';
import cjBooks from '../data/cj-books.json';

const BookComparatorPage = () => {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleBook = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        } else if (selectedIds.length < 3) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const selectedBooks = selectedIds.map(id => cjBooks.books.find(b => b.id === id)).filter(Boolean);

    const rows = [
        { label: 'Autor', get: b => b.author },
        { label: 'Žánr', get: b => b.genre || '—' },
        { label: 'Literární druh', get: b => b.literaryForm || '—' },
        { label: 'Období', get: b => b.period || '—' },
        { label: 'Rok', get: b => b.year || '—' },
        { label: 'Literární směr', get: b => b.analysis?.literaryContext?.movement || '—' },
        { label: 'Hlavní téma', get: b => b.analysis?.themes?.main || '—' },
        { label: 'Motivy', get: b => b.analysis?.themes?.motifs?.join(', ') || '—' },
        { label: 'Místo', get: b => b.analysis?.setting?.place || '—' },
        { label: 'Čas', get: b => b.analysis?.setting?.time || '—' },
        { label: 'Vypravěč', get: b => b.analysis?.narration?.narrator || '—' },
        { label: 'Styl', get: b => b.analysis?.narration?.style || '—' },
        { label: 'Kompozice', get: b => b.analysis?.composition?.structure || '—' },
        { label: 'Počet postav', get: b => b.analysis?.characters?.length?.toString() || '—' },
    ];

    // Find similarities
    const findSimilarities = () => {
        if (selectedBooks.length < 2) return [];
        const sims = [];
        rows.forEach(r => {
            const vals = selectedBooks.map(b => r.get(b));
            if (vals.every(v => v === vals[0] && v !== '—')) {
                sims.push(`${r.label}: ${vals[0]}`);
            }
        });
        return sims;
    };

    const similarities = findSimilarities();

    return (
        <div className="max-w-5xl mx-auto mt-4">
            <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 mb-6">
                <FaBalanceScale /> Porovnávač knih
            </h1>

            {/* Book selector */}
            <div className="terminal-card mb-6">
                <h2 className="text-sm text-terminal-text/50 mb-3">Vyber 2–3 knihy k porovnání:</h2>
                <div className="flex flex-wrap gap-2">
                    {cjBooks.books.map(b => (
                        <button
                            key={b.id}
                            onClick={() => toggleBook(b.id)}
                            className={`px-3 py-1.5 text-xs rounded border transition-all ${selectedIds.includes(b.id)
                                    ? 'bg-terminal-accent text-terminal-bg border-terminal-accent font-bold'
                                    : 'text-terminal-text/60 border-terminal-border/30 hover:border-terminal-accent/50'
                                } ${selectedIds.length >= 3 && !selectedIds.includes(b.id) ? 'opacity-30 cursor-not-allowed' : ''}`}
                            disabled={selectedIds.length >= 3 && !selectedIds.includes(b.id)}
                        >
                            {b.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comparison table */}
            {selectedBooks.length >= 2 && (
                <>
                    {similarities.length > 0 && (
                        <div className="terminal-card mb-4 border-l-2 border-yellow-500/50">
                            <h3 className="text-xs text-yellow-500 font-bold mb-2">✨ Podobnosti</h3>
                            <div className="flex flex-wrap gap-2">
                                {similarities.map((s, i) => (
                                    <span key={i} className="compact-pill text-yellow-400">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="terminal-card overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-terminal-border/20">
                                    <th className="text-left text-terminal-text/50 py-2 pr-4 w-32">Vlastnost</th>
                                    {selectedBooks.map(b => (
                                        <th key={b.id} className="text-left text-terminal-accent py-2 px-2 font-bold">
                                            {b.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => {
                                    const vals = selectedBooks.map(b => r.get(b));
                                    const allSame = vals.every(v => v === vals[0] && v !== '—');
                                    return (
                                        <tr key={i} className={`border-b border-terminal-border/10 ${allSame ? 'bg-yellow-500/5' : ''}`}>
                                            <td className="py-2 pr-4 text-terminal-text/50 font-medium whitespace-nowrap">{r.label}</td>
                                            {selectedBooks.map(b => (
                                                <td key={b.id} className={`py-2 px-2 text-terminal-text/80 ${allSame ? 'text-yellow-400' : ''}`}>
                                                    {r.get(b)}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {selectedBooks.length < 2 && (
                <div className="terminal-card text-center py-12 text-terminal-text/30">
                    <FaBalanceScale className="text-4xl mx-auto mb-3 opacity-30" />
                    <p>Vyber alespoň 2 knihy k porovnání</p>
                </div>
            )}
        </div>
    );
};

export default BookComparatorPage;
