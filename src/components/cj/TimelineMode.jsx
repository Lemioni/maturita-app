import { useState, useMemo } from 'react';
import { FaBookmark } from 'react-icons/fa';
import cjBooksData from '../../data/bookData.js';

const TimelineMode = ({ filter }) => {

    const timelineGroups = useMemo(() => {
        // 1. Filter books
        const filtered = cjBooksData.books.filter(b =>
            filter === 'all' || b.period === filter
        );

        // 2. Define known movements and their metadata (chronological order)
        const MOVEMENT_ORDER = [
            { id: 'Renesance', label: 'RENESANCE A HUMANISMUS', desc: 'Návrat k antice, důraz na člověka, rozum a pozemský život.', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' },
            { id: 'Klasicismus', label: 'KLASICISMUS', desc: 'Řád, pravidla, rozum, inspirace antikou. Přednost povinnosti před citem.', color: 'text-blue-400', border: 'border-blue-400', bg: 'bg-blue-400/10' },
            { id: 'Osvícenství', label: 'OSVÍCENSTVÍ', desc: 'Důvěra v rozum, vědu a pokrok. Kritika absolutismu a církve.', color: 'text-amber-300', border: 'border-amber-300', bg: 'bg-amber-300/10' },
            { id: 'Preromantismus', label: 'PREROMANTISMUS', desc: 'Důraz na cit, přírodu a lidovou slovesnost.', color: 'text-green-400', border: 'border-green-400', bg: 'bg-green-400/10' },
            { id: 'Národní obrození', label: 'NÁRODNÍ OBROZENÍ', desc: 'Formování novodobého českého národa. Vlastenectví, zájem o jazyk a historii.', color: 'text-red-400', border: 'border-red-400', bg: 'bg-red-400/10' },
            { id: 'Romantismus', label: 'ROMANTISMUS', desc: 'Cit, individualita, tajemno, únik do snu či minulosti. Hrdina na okraji společnosti.', color: 'text-purple-400', border: 'border-purple-400', bg: 'bg-purple-400/10' },
            { id: 'Realismus', label: 'REALISMUS', desc: 'Pravdivé a objektivní zobrazení skutečnosti. Kritika společenských nedostatků.', color: 'text-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-400/10' },
            { id: 'Naturalismus', label: 'NATURALISMUS', desc: 'Člověk je determinován dědičností a prostředím. Drastické stránky života.', color: 'text-red-400', border: 'border-red-400', bg: 'bg-red-400/10' },
            { id: 'Moderna', label: 'LITERÁRNÍ MODERNA', desc: 'Přerod 19. a 20. století. Symbolismus, Dekadence, Impresionismus.', color: 'text-pink-400', border: 'border-pink-400', bg: 'bg-pink-400/10' },
            { id: 'Generace buřičů', label: 'GENERACE BUŘIČŮ', desc: 'Anarchismus, antimilitarismus, civilismus. Odpor ke společnosti.', color: 'text-orange-500', border: 'border-orange-500', bg: 'bg-orange-500/10' },
            { id: 'Meziválečná literatura', label: 'MEZIVÁLEČNÁ LITERATURA', desc: 'Reakce na 1. sv. válku. Ztracená generace, Legionářská literatura, Expresionismus.', color: 'text-indigo-400', border: 'border-indigo-400', bg: 'bg-indigo-400/10' },
            { id: 'Světová lit. 2. pol. 20. st.', label: 'SVĚTOVÁ LIT. 2. POL. 20. ST.', desc: 'Reakce na válku, existencialismus, neorealismus, beatnici.', color: 'text-emerald-400', border: 'border-emerald-400', bg: 'bg-emerald-400/10' },
            { id: 'Česká lit. 2. pol. 20. st.', label: 'ČESKÁ LIT. 2. POL. 20. ST.', desc: 'Oficiální, samizdatová a exilová literatura.', color: 'text-teal-400', border: 'border-teal-400', bg: 'bg-teal-400/10' },
            { id: 'Ostatní', label: 'OSTATNÍ SMĚRY', desc: 'Díla nezapadající do hlavních kategorií nebo přechodová období.', color: 'text-gray-400', border: 'border-gray-400', bg: 'bg-gray-400/10' },
        ];

        // 3. Group books
        const groups = {};

        // Helper to normalize movement string
        const normalize = (m) => {
            if (!m) return 'Ostatní';
            const s = m.toLowerCase();
            if (s.includes('renesance')) return 'Renesance';
            if (s.includes('klasicismus')) return 'Klasicismus';
            if (s.includes('osvícenství')) return 'Osvícenství';
            if (s.includes('preromantismus')) return 'Preromantismus';
            if (s.includes('obrození')) return 'Národní obrození';
            if (s.includes('romantismus')) return 'Romantismus';
            if (s.includes('realismus')) return 'Realismus';
            if (s.includes('naturalismus')) return 'Naturalismus';
            if (s.includes('moderna') || s.includes('symbolismus') || s.includes('dekadence')) return 'Moderna';
            if (s.includes('buřič')) return 'Generace buřičů';
            if (s.includes('ztracená') || s.includes('válečná') || s.includes('legionář')) return 'Meziválečná literatura';
            if (s.includes('beatnici') || s.includes('existenc')) return 'Světová lit. 2. pol. 20. st.';
            if (s.includes('disent') || s.includes('exil')) return 'Česká lit. 2. pol. 20. st.';
            return 'Ostatní';
        };

        filtered.forEach(book => {
            const movementRaw = book.analysis?.literaryContext?.movement || '';
            const key = normalize(movementRaw);
            if (!groups[key]) groups[key] = [];
            groups[key].push(book);
        });

        // 4. Map back to ordered array
        return MOVEMENT_ORDER.map(m => ({
            ...m,
            books: groups[m.id] ? groups[m.id].sort((a, b) => parseInt(a.year) - parseInt(b.year)) : []
        })).filter(g => g.books.length > 0); // Only show eras with books

    }, [filter]);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 relative space-y-16 pb-32">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-terminal-accent tracking-wider mb-2">LITERÁRNÍ ČASOVÁ OSA</h2>
                <p className="text-terminal-text/60">Chronologický přehled literárních směrů a děl</p>
            </div>

            <div className="absolute left-6 top-32 bottom-0 w-1 bg-terminal-border/20 z-0"></div>

            {timelineGroups.map((group, idx) => (
                <div key={group.id} className="relative z-10 pl-16">
                    {/* Era Marker */}
                    <div className="absolute left-3 top-0 transform -translate-x-1/2 w-7 h-7 bg-terminal-bg rounded-full border-4 border-terminal-border flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full bg-current ${group.color}`}></div>
                    </div>

                    {/* Era Header */}
                    <div className="mb-6">
                        <h3 className={`text-2xl font-bold uppercase tracking-widest ${group.color} mb-1 inline-block border-b border-dashed ${group.border}/50 pb-1`}>
                            {group.label}
                        </h3>
                        <p className="text-terminal-text/70 text-sm max-w-2xl border-l-2 border-terminal-border/30 pl-3">
                            {group.desc}
                        </p>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.books.map(book => (
                            <div key={book.id} className={`terminal-card p-4 border-l-4 ${group.border} bg-terminal-bg/40 hover:bg-terminal-accent/5 transition-all group`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className={`text-4xl font-bold opacity-20 font-mono -mb-4 -ml-1 ${group.color}`}>
                                            {book.year}
                                        </span>
                                        <h4 className="text-lg font-bold text-terminal-text group-hover:text-terminal-highlight relative z-10 mt-2">
                                            {book.title}
                                        </h4>
                                    </div>
                                    <div className="p-2 rounded bg-terminal-bg border border-terminal-border/20">
                                        <FaBookmark className={`${group.color}`} />
                                    </div>
                                </div>

                                <p className="text-sm text-terminal-text/60 mt-1 font-medium">{book.author}</p>

                                <div className="mt-3 pt-3 border-t border-terminal-border/10 text-xs text-terminal-text/50 italic">
                                    {book.analysis?.themes?.main || "Hlavní myšlenka díla..."}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {timelineGroups.length === 0 && (
                <div className="text-center text-terminal-text/40 py-20 pl-0">
                    Žádná díla k zobrazení pro tento filtr.
                </div>
            )}

            {/* End Cap */}
            <div className="flex justify-start pl-16 mt-12 relative z-10">
                <div className="px-6 py-2 bg-terminal-bg border border-terminal-border/30 rounded-full text-terminal-text/40 text-xs font-mono">
                    SOUČASNOST
                </div>
            </div>
        </div>
    );
};

export default TimelineMode;
