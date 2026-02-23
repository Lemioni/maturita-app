import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import dictionaryData from '../../data/dictionary.json';

const DictionaryTooltip = ({ word, termId, priority = 'work' }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const location = useLocation();

    const returnPath = useMemo(() => `${location.pathname}${location.search}`, [location.pathname, location.search]);

    // Find term either by explicit ID or by matching the word (case-insensitive)
    const entry = dictionaryData.terms.find(
        t => t.id === termId || t.term.toLowerCase() === word.toLowerCase()
    );

    if (!entry) {
        return <span>{word}</span>;
    }

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
            }}
        >
            <mark className={`keyword-highlight cursor-pointer ${priority === 'author' ? 'ring-1 ring-terminal-accent/30' : ''}`}>
                {word}
            </mark>

            {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 md:w-72 bg-terminal-bg border border-terminal-accent shadow-[0_4px_15px_rgba(0,0,0,0.5)] shadow-terminal-accent/20 p-3 rounded-md animate-fadeIn text-left">
                    <div className="text-sm font-bold text-terminal-accent mb-1 border-b border-terminal-accent/30 pb-1 flex justify-between items-start">
                        <span>{entry.term}</span>
                        <span className="text-[9px] uppercase tracking-wider text-terminal-text/40 pt-1">
                            {priority === 'author' ? 'AUTOR/KONTEXT' : 'POJEM'}
                        </span>
                    </div>
                    <div className="text-xs text-terminal-text/90 leading-relaxed mb-2">
                        {entry.definition}
                    </div>
                    {entry.examples && entry.examples.length > 0 && (
                        <div className="text-[10px] text-terminal-text/60 italic border-t border-terminal-border/20 pt-1 mt-1">
                            Např.: {entry.examples.join(', ')}
                        </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-terminal-border/20">
                        <Link
                            to={`/dictionary?term=${encodeURIComponent(entry.term)}`}
                            state={{ from: returnPath, fromLabel: 'zpět na materiál' }}
                            className="text-[11px] text-terminal-accent hover:underline"
                            onClick={() => setShowTooltip(false)}
                        >
                            Otevřít ve slovníku →
                        </Link>
                    </div>
                    {/* Triangle pointer */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-terminal-accent"></div>
                </div>
            )}
        </span>
    );
};

export default DictionaryTooltip;
