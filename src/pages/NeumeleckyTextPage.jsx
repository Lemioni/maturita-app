import { useState } from 'react';
import { FaFileAlt, FaChevronDown, FaChevronUp, FaTable, FaQuoteLeft } from 'react-icons/fa';
import data from '../data/neumelecky-text.json';

const NeumeleckyTextPage = () => {
    const [expandedStyle, setExpandedStyle] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [showPostupy, setShowPostupy] = useState(false);

    const toggle = (id) => setExpandedStyle(expandedStyle === id ? null : id);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2 font-mono">
                    <FaFileAlt /> {data.title}
                </h1>
                <p className="text-xs text-terminal-text/40 font-mono mt-1">{data.subtitle}</p>
            </div>

            {/* Stylistika definition */}
            <div className="terminal-card">
                <h3 className="text-sm text-terminal-accent font-mono mb-2">Stylistika</h3>
                <p className="text-xs text-terminal-text/70 leading-relaxed mb-3">{data.stylistika.definice}</p>
                <div className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider mb-1.5">Objektivní stylotvorné faktory:</div>
                <ul className="space-y-0.5">
                    {data.stylistika.faktory.map((f, i) => (
                        <li key={i} className="text-xs text-terminal-text/60 flex items-start gap-2">
                            <span className="text-terminal-accent/50 mt-0.5">›</span> {f}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Slohové postupy */}
            <div className="terminal-card">
                <button
                    onClick={() => setShowPostupy(!showPostupy)}
                    className="w-full flex items-center justify-between"
                >
                    <h3 className="text-sm text-terminal-accent font-mono">Slohové postupy</h3>
                    {showPostupy ? <FaChevronUp className="text-terminal-text/30 text-xs" /> : <FaChevronDown className="text-terminal-text/30 text-xs" />}
                </button>
                {showPostupy && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.slohovePostupy.map((p, i) => (
                            <div key={i} className="bg-terminal-dim/50 border border-terminal-border/10 rounded p-2.5">
                                <div className="text-xs font-bold text-terminal-text/80 mb-0.5">{p.nazev}</div>
                                <div className="text-[11px] text-terminal-text/50 leading-snug mb-1">{p.popis}</div>
                                <div className="text-[10px] text-terminal-accent/50 font-mono">např. {p.priklad}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Funkční styly cards */}
            <div>
                <h2 className="text-sm text-terminal-text/60 mb-3 tracking-wider font-mono">
                    FUNKČNÍ STYLY
                </h2>
                <div className="space-y-2">
                    {data.funkcniStyley.map(styl => {
                        const isExpanded = expandedStyle === styl.id;
                        return (
                            <div
                                key={styl.id}
                                className="terminal-card overflow-hidden transition-all"
                                style={{ borderLeftColor: styl.barva, borderLeftWidth: '3px' }}
                            >
                                <button
                                    onClick={() => toggle(styl.id)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <div>
                                        <h3 className="text-sm font-bold font-mono" style={{ color: styl.barva }}>
                                            {styl.nazev}
                                        </h3>
                                        <p className="text-xs text-terminal-text/50 mt-0.5">{styl.funkce}</p>
                                    </div>
                                    {isExpanded
                                        ? <FaChevronUp className="text-terminal-text/30 text-xs flex-shrink-0" />
                                        : <FaChevronDown className="text-terminal-text/30 text-xs flex-shrink-0" />
                                    }
                                </button>

                                {isExpanded && (
                                    <div className="mt-4 space-y-4">
                                        {/* Znaky */}
                                        <div>
                                            <div className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider mb-1.5">Znaky:</div>
                                            <ul className="space-y-0.5">
                                                {styl.znaky.map((z, i) => (
                                                    <li key={i} className="text-xs text-terminal-text/60 flex items-start gap-2">
                                                        <span style={{ color: styl.barva }} className="mt-0.5 opacity-60">›</span> {z}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Jazykové prostředky */}
                                        <div>
                                            <div className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider mb-1.5">Jazykové prostředky:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {styl.jazykoveProstredky.map((jp, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] px-2 py-0.5 rounded-full border font-mono"
                                                        style={{
                                                            borderColor: styl.barva + '40',
                                                            backgroundColor: styl.barva + '10',
                                                            color: styl.barva,
                                                        }}
                                                    >
                                                        {jp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Slohové útvary */}
                                        <div>
                                            <div className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider mb-1.5">Slohové útvary:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {styl.slohoveUtvary.map((su, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 bg-terminal-dim border border-terminal-border/20 rounded text-terminal-text/60 font-mono">
                                                        {su}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Podtypy */}
                                        {styl.podtypy && (
                                            <div>
                                                <div className="text-[10px] text-terminal-text/40 font-mono uppercase tracking-wider mb-1.5">Podtypy:</div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                                    {styl.podtypy.map((pt, i) => (
                                                        <div key={i} className="bg-terminal-dim/50 border border-terminal-border/10 rounded p-2">
                                                            <div className="text-[11px] font-bold text-terminal-text/70">{pt.nazev}</div>
                                                            <div className="text-[10px] text-terminal-text/40">{pt.popis}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Příklad */}
                                        {styl.priklad && (
                                            <div className="bg-terminal-dim/30 border border-terminal-border/10 rounded p-3 mt-2">
                                                <div className="flex items-start gap-2">
                                                    <FaQuoteLeft className="text-[10px] mt-0.5 flex-shrink-0" style={{ color: styl.barva, opacity: 0.4 }} />
                                                    <p className="text-xs text-terminal-text/60 italic leading-relaxed whitespace-pre-line">
                                                        {styl.priklad}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick reference table */}
            <div className="terminal-card">
                <button
                    onClick={() => setShowTable(!showTable)}
                    className="w-full flex items-center justify-between"
                >
                    <h3 className="text-sm text-terminal-accent font-mono flex items-center gap-1.5">
                        <FaTable /> Přiřazení útvarů ke stylům
                    </h3>
                    {showTable ? <FaChevronUp className="text-terminal-text/30 text-xs" /> : <FaChevronDown className="text-terminal-text/30 text-xs" />}
                </button>
                {showTable && (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-xs font-mono">
                            <thead>
                                <tr className="border-b border-terminal-border/20">
                                    <th className="text-left py-1.5 pr-3 text-terminal-text/40 font-normal">Útvar</th>
                                    <th className="text-left py-1.5 text-terminal-text/40 font-normal">Funkční styl</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.prirazeniUtvaru.mapovani.map((m, i) => {
                                    const matchedStyl = data.funkcniStyley.find(s => s.nazev === m.styl);
                                    return (
                                        <tr key={i} className="border-b border-terminal-border/5">
                                            <td className="py-1.5 pr-3 text-terminal-text/60">{m.utvar}</td>
                                            <td className="py-1.5">
                                                <span
                                                    className="px-1.5 py-0.5 rounded text-[10px]"
                                                    style={{
                                                        backgroundColor: (matchedStyl?.barva || '#8b5cf6') + '15',
                                                        color: matchedStyl?.barva || '#8b5cf6',
                                                    }}
                                                >
                                                    {m.styl}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sources */}
            <div className="text-[10px] text-terminal-text/20 font-mono space-y-0.5">
                {data.zdroje.map((z, i) => (
                    <p key={i}>📎 {z}</p>
                ))}
            </div>
        </div>
    );
};

export default NeumeleckyTextPage;
