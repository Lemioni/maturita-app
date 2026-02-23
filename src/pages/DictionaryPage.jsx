import React, { useState, useMemo } from 'react';
import { FaBookOpen, FaSearch } from 'react-icons/fa';
import dictionaryData from '../data/dictionary.json';

const sections = [
    { id: 'epochy', label: 'Epochy a směry', icon: '🏛️' },
    { id: 'autori', label: 'Autoři', icon: '✍️' },
    { id: 'zanry', label: 'Žánry', icon: '📖' }
];

const DictionaryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBySection = useMemo(() => {
        const result = {};
        for (const section of sections) {
            result[section.id] = dictionaryData.terms.filter(term => {
                const matchesCategory = term.category === section.id;
                if (!matchesCategory) return false;
                if (!searchTerm) return true;
                const s = searchTerm.toLowerCase();
                return term.term.toLowerCase().includes(s) || term.definition.toLowerCase().includes(s);
            });
        }
        return result;
    }, [searchTerm]);

    const totalResults = Object.values(filteredBySection).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-4">
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
                            <div className="overflow-x-auto">
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
                                            <tr
                                                key={term.id}
                                                className="hover:bg-terminal-border/10 transition-colors"
                                            >
                                                <td className="py-2 pr-4 text-xs text-terminal-text/40 align-top border-b border-terminal-border/10">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-2 pr-4 align-top border-b border-terminal-border/10">
                                                    <span className="font-bold text-sm text-terminal-accent">
                                                        {term.term}
                                                    </span>
                                                </td>
                                                <td className="py-2 text-sm text-terminal-text/80 leading-relaxed align-top border-b border-terminal-border/10">
                                                    {term.definition}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
