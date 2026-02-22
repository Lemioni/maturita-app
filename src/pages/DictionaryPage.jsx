import React, { useState, useMemo } from 'react';
import { useExperimental } from '../context/ExperimentalContext';
import { FaBookOpen, FaSearch } from 'react-icons/fa';
import dictionaryData from '../data/dictionary.json';

const DictionaryPage = () => {
    const { frutigerAero } = useExperimental();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('vse');

    const tabs = [
        { id: 'vse', label: 'Vše' },
        { id: 'epochy', label: 'Epochy a směry' },
        { id: 'autori', label: 'Autoři' },
        { id: 'zanry', label: 'Žánry' }
    ];

    const filteredTerms = useMemo(() => {
        return dictionaryData.terms.filter(term => {
            const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.definition.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === 'vse' || term.category === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchTerm, activeTab]);

    return (
        <div className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-500 ${frutigerAero
                ? 'bg-gradient-to-br from-[#d4f0ff] via-[#e6f7ff] to-[#b3e0ff] text-[#005580]'
                : 'bg-[#111] text-gray-200'
            }`}>
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className={`mb-8 p-6 rounded-2xl border transition-all ${frutigerAero
                        ? 'bg-white/60 border-white/80 shadow-[0_8px_32px_rgba(0,120,255,0.15)] backdrop-blur-md'
                        : 'bg-[#1a1a1a] border-[#333]'
                    }`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-xl ${frutigerAero
                                ? 'bg-gradient-to-br from-[#00a2ff] to-[#0066cc] text-white shadow-lg'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                            <FaBookOpen className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Literární slovník</h1>
                            <p className={`mt-1 ${frutigerAero ? 'text-[#0066cc]/80' : 'text-gray-400'}`}>
                                Pojmy, autoři a žánry pro rychlé opakovávní.
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className={frutigerAero ? 'text-[#00a2ff]' : 'text-gray-400'} />
                        </div>
                        <input
                            type="text"
                            placeholder="Hledat termín nebo definici..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all text-lg ${frutigerAero
                                    ? 'bg-white/80 border border-[#b3e0ff] focus:border-[#00a2ff] focus:ring-4 focus:ring-[#00a2ff]/20 text-[#005580] placeholder-[#005580]/50'
                                    : 'bg-[#222] border border-[#333] focus:border-red-500 text-white placeholder-gray-500'
                                }`}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                                        ? frutigerAero
                                            ? 'bg-gradient-to-r from-[#00a2ff] to-[#0066cc] text-white shadow-md'
                                            : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                        : frutigerAero
                                            ? 'bg-white/50 text-[#005580] hover:bg-white/80 hover:shadow'
                                            : 'bg-[#222] text-gray-400 hover:text-white hover:bg-[#333]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dictionary Terms Grid */}
                <div className="grid gap-4">
                    {filteredTerms.length > 0 ? (
                        filteredTerms.map((term, idx) => (
                            <div
                                key={term.id}
                                className={`p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${frutigerAero
                                        ? 'bg-white/70 border-white/80 shadow-sm hover:shadow-lg hover:shadow-[#00a2ff]/10 backdrop-blur-sm'
                                        : 'bg-[#1a1a1a] border-[#333] hover:border-red-500/50'
                                    }`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className={`text-xl font-bold ${frutigerAero ? 'text-[#005580]' : 'text-white'
                                        }`}>
                                        {term.term}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${frutigerAero
                                            ? 'bg-[#e6f7ff] text-[#00a2ff] border border-[#b3e0ff]'
                                            : 'bg-[#333] text-gray-300'
                                        }`}>
                                        {tabs.find(t => t.id === term.category)?.label}
                                    </span>
                                </div>
                                <p className={`leading-relaxed ${frutigerAero ? 'text-[#005580]/80' : 'text-gray-400'}`}>
                                    {term.definition}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className={`p-12 rounded-2xl text-center border ${frutigerAero ? 'bg-white/50 border-white/80' : 'bg-[#1a1a1a] border-[#333]'
                            }`}>
                            <div className={`inline-flex p-4 rounded-full mb-4 ${frutigerAero ? 'bg-[#e6f7ff] text-[#00a2ff]' : 'bg-[#333] text-gray-500'
                                }`}>
                                <FaSearch className="text-3xl" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${frutigerAero ? 'text-[#005580]' : 'text-white'}`}>
                                Nenalezeny žádné pojmy
                            </h3>
                            <p className={frutigerAero ? 'text-[#005580]/70' : 'text-gray-500'}>
                                Zkuste upravit hledaný výraz nebo vybrat jinou kategorii.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DictionaryPage;
