import React, { useState } from 'react';
import { FaFlask, FaTimes, FaHighlighter } from 'react-icons/fa';
import { useExperimental } from '../../context/ExperimentalContext';
import { usePodcast } from '../../context/PodcastContext';

const ExperimentalMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { highlighterActive, toggleHighlighter } = useExperimental();
    const { playerVisible } = usePodcast();

    // Only show when podcast player is collapsed
    if (playerVisible) return null;

    return (
        <div className="fixed bottom-0 right-16 z-50 flex flex-col items-end">
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
                className={`px-3 py-1.5 flex items-center gap-1.5 bg-terminal-bg/95 border border-b-0 border-terminal-border/30 backdrop-blur-md transition-all ${isOpen || highlighterActive
                    ? 'text-terminal-accent'
                    : 'text-terminal-text/40 hover:text-terminal-accent'
                    }`}
            >
                {isOpen ? <FaTimes className="text-xs" /> : <FaFlask className="text-xs" />}
            </button>
        </div>
    );
};

export default ExperimentalMenu;

