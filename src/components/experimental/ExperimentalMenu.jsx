import React, { useState } from 'react';
import { FaFlask, FaTimes, FaHighlighter } from 'react-icons/fa';
import { useExperimental } from '../../context/ExperimentalContext';

const ExperimentalMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { highlighterActive, toggleHighlighter } = useExperimental();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {/* Menu Content */}
            {isOpen && (
                <div className="bg-terminal-card border border-terminal-accent/30 rounded-lg p-3 shadow-lg shadow-terminal-accent/10 mb-2 w-48 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-terminal-border/20">
                        <span className="text-xs font-bold text-terminal-accent flex items-center gap-1">
                            <FaFlask /> EXPERIMENTAL
                        </span>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={toggleHighlighter}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${highlighterActive
                                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                                    : 'text-terminal-text/70 hover:bg-terminal-border/20'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <FaHighlighter /> Highlighter
                            </span>
                            <span className={`w-2 h-2 rounded-full ${highlighterActive ? 'bg-yellow-400 animate-pulse' : 'bg-terminal-border'}`}></span>
                        </button>
                    </div>

                    <div className="mt-3 pt-2 text-[0.6rem] text-terminal-text/30 border-t border-terminal-border/10">
                        Functions may be unstable.
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen || highlighterActive
                        ? 'bg-terminal-accent text-terminal-bg shadow-terminal-accent/20 rotate-0'
                        : 'bg-terminal-card border border-terminal-border/50 text-terminal-text/50 hover:text-terminal-accent hover:border-terminal-accent'
                    }`}
                title="Experimental Features"
            >
                {isOpen ? <FaTimes /> : <FaFlask />}
            </button>
        </div>
    );
};

export default ExperimentalMenu;
