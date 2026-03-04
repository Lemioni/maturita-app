import React, { useState, useMemo, useDeferredValue } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaBookOpen, FaSearch } from 'react-icons/fa';
import dictionaryData from '../data/dictionary.json';

const sections = [
    { id: 'epochy', label: 'Epochy a směry', icon: '🏛️' },
    { id: 'autori', label: 'Autoři', icon: '✍️' },
    { id: 'zanry', label: 'Žánry', icon: '📖' }
];

const DictionaryPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const initialTerm = searchParams.get('term') || '';
    const [searchTerm, setSearchTerm] = useState(initialTerm);
    const deferredSearch = useDeferredValue(searchTerm);
    const fromPath = location.state?.from || null;
    const fromLabel = location.state?.fromLabel || 'zpět';

    const filteredBySection = useMemo(() => {
        const result = {};
        for (const section of sections) {
            result[section.id] = dictionaryData.terms.filter(term => {
                const matchesCategory = term.category === section.id;
                if (!matchesCategory) return false;
                if (!deferredSearch) return true;
                const s = deferredSearch.toLowerCase();
                return term.term.toLowerCase().includes(s) || term.definition.toLowerCase().includes(s);
            });
        }
        return result;
    }, [deferredSearch]);

    const totalResults = Object.values(filteredBySection).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            {fromPath && (
                <div>
                    <Link
                        to={fromPath}
                        className="inline-flex items-center gap-2 text-xs text-terminal-accent hover:underline"
                    >
                        <FaArrowLeft /> {fromLabel}
                    </Link>
                </div>
            )}
            {/* Header */}
            <div className="border-b border-terminal-border/20 pb-3">
                <h1 className="text-xl text-terminal-accent tracking-wider flex items-center gap-2">
                    <FaBookOpen /> LITERÁRNÍ SLOVNÍK
                </h1>
            </div>

            {/* Search */}
            <div className="terminal-card">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-terminal-text/40" />
                    </div>
                    <input
                        type="text"
                        placeholder="Hledat termín nebo definici..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Hledat v slovníku"
                        className="w-full pl-10 pr-4 py-2.5 bg-terminal-bg border border-terminal-border/30 text-terminal-text placeholder-terminal-text/40 outline-none focus:border-terminal-accent transition-colors text-sm"
                    />
                </div>
                {searchTerm && (
                    <div className="text-xs text-terminal-text/50 mt-2">
                        Nalezeno {totalResults} výsledků pro "{searchTerm}"
                    </div>
                )}
            </div>

            {/* Sections with Tables */}
            {sections.map(section => {
                const terms = filteredBySection[section.id];
                if (terms.length === 0 && searchTerm) return null;

                return (
                    <div key={section.id} className="terminal-card">
                        {/* Section Header */}
                        <div className="text-xs text-terminal-accent mb-3 pb-2 border-b border-terminal-border/20 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-terminal-accent/20 border border-terminal-accent/30">
                                {section.icon}
                            </span>
                            <span className="uppercase tracking-wider">{section.label}</span>
                            <span className="text-terminal-text/40 ml-auto">{terms.length} pojmů</span>
                        </div>

                        {/* Table */}
                        {terms.length > 0 ? (
                            <>
                                {/* Mobile: Card layout */}
                                <div className="md:hidden space-y-2">
                                    {terms.map((term, idx) => (
                                        <div key={term.id} className="p-2.5 border border-terminal-border/15 rounded bg-terminal-bg/50">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-[10px] text-terminal-text/30">{idx + 1}.</span>
                                                <span className="font-bold text-sm text-terminal-accent">{term.term}</span>
                                            </div>
                                            <p className="text-xs text-terminal-text/75 leading-relaxed">{term.definition}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: Table layout */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="text-xs text-terminal-text/50 uppercase tracking-wider pb-2 pr-4 w-8 border-b border-terminal-border/20">#</th>
                                                <th className="text-xs text-terminal-text/50 uppercase tracking-wider pb-2 pr-4 whitespace-nowrap border-b border-terminal-border/20" style={{ minWidth: '140px' }}>Pojem</th>
                                                <th className="text-xs text-terminal-text/50 uppercase tracking-wider pb-2 border-b border-terminal-border/20">Definice</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {terms.map((term, idx) => (
                                                <tr key={term.id} className="hover:bg-terminal-border/10 transition-colors">
                                                    <td className="py-2 pr-4 text-xs text-terminal-text/40 align-top border-b border-terminal-border/10">{idx + 1}</td>
                                                    <td className="py-2 pr-4 align-top border-b border-terminal-border/10">
                                                        <span className="font-bold text-sm text-terminal-accent">{term.term}</span>
                                                    </td>
                                                    <td className="py-2 text-sm text-terminal-text/80 leading-relaxed align-top border-b border-terminal-border/10">{term.definition}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6 text-terminal-text/40 text-sm">
                                Žádné pojmy v této kategorii.
                            </div>
                        )}
                    </div>
                );
            })}

            {/* No results at all */}
            {totalResults === 0 && searchTerm && (
                <div className="terminal-card text-center py-8">
                    <div className="text-3xl mb-3 opacity-30">🔍</div>
                    <h3 className="text-lg text-terminal-accent mb-1">Nenalezeny žádné pojmy</h3>
                    <p className="text-terminal-text/50 text-sm">Zkuste upravit hledaný výraz.</p>
                </div>
            )}
        </div>
    );
};

export default DictionaryPage;
