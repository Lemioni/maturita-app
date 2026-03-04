import React, { useState, useRef, useEffect } from 'react';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { usePiP, PIP_MODULES } from '../../context/PiPContext';
import { usePodcast } from '../../context/PodcastContext';

const PiPLauncher = () => {
    const { isSupported, isPiPOpen, openPiP, closePiP } = usePiP();
    const { playerVisible } = usePodcast();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
    const menuRef = useRef(null);

    // Reactive isDesktop with resize listener
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    if (!isSupported) return null;

    const handleModuleClick = (moduleId) => {
        openPiP(moduleId);
        setMenuOpen(false);
    };

    // Calculate bottom position based on player visibility and desktop/mobile
    const getBottomOffset = () => {
        if (isDesktop) {
            return playerVisible ? 'bottom-[60px]' : 'bottom-2';
        } else {
            // Mobile: account for BottomNav (64px) and MiniPlayer (~48px)
            const baseOffset = 80; // bottom-[80px] matches non-hidden state
            const extraOffset = playerVisible ? 48 : 0;
            return `bottom-[${baseOffset + extraOffset}px]`;
        }
    };

    // Hidden state — slim reveal tab
    if (hidden && !isPiPOpen) {
        return (
            <button
                onClick={() => setHidden(false)}
                className={`fixed ${isDesktop ? (playerVisible ? 'bottom-[60px]' : 'bottom-2') : (playerVisible ? 'bottom-[128px]' : 'bottom-[80px]')} left-0 z-40 
                    px-2 py-3 border border-l-0 border-terminal-border/20 
                    bg-terminal-bg/90 backdrop-blur-sm
                    text-terminal-accent/40 hover:text-terminal-accent/70 
                    hover:bg-terminal-accent/5 transition-all
                    rounded-r-lg font-mono text-xs`}
                title="Zobrazit PiP"
            >
                <div className="flex items-center gap-1">
                    <FaExternalLinkAlt className="text-[10px]" />
                    <span className="text-[10px]">PiP</span>
                </div>
            </button>
        );
    }

    return (
        <div ref={menuRef} className={`fixed ${isDesktop ? (playerVisible ? 'bottom-[60px]' : 'bottom-3') : (playerVisible ? 'bottom-[128px]' : 'bottom-[80px]')} left-4 z-40 flex flex-col items-start gap-2`}>
            {/* Terminal-style dropdown menu */}
            {menuOpen && !isPiPOpen && (
                <div className="bg-terminal-bg/98 backdrop-blur-md border border-terminal-border/30 rounded-md overflow-hidden shadow-lg shadow-black/40 min-w-[200px]">
                    {/* Header */}
                    <div className="px-3 py-1.5 border-b border-terminal-border/20 bg-terminal-accent/5">
                        <span className="text-[10px] font-mono text-terminal-accent/70 tracking-widest uppercase">
                            PiP Moduly
                        </span>
                    </div>

                    {/* Module options */}
                    <div className="py-1">
                        {Object.values(PIP_MODULES).map(mod => (
                            <button
                                key={mod.id}
                                onClick={() => handleModuleClick(mod.id)}
                                className="w-full text-left px-3 py-2 flex items-center gap-3 
                                    text-terminal-text/60 hover:text-terminal-accent hover:bg-terminal-accent/5 
                                    transition-all font-mono text-xs group"
                            >
                                <span className="text-terminal-accent/30 group-hover:text-terminal-accent transition-colors">{'>'}</span>
                                <span className="text-sm">{mod.icon}</span>
                                <div className="flex-1">
                                    <span className="group-hover:text-terminal-accent">{mod.label}</span>
                                    <span className="text-[9px] text-terminal-text/25 ml-2">{mod.desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Hide option */}
                    <div className="border-t border-terminal-border/10">
                        <button
                            onClick={() => { setMenuOpen(false); setHidden(true); }}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-mono text-terminal-text/25 hover:text-terminal-text/40 transition-colors"
                        >
                            skrýt
                        </button>
                    </div>
                </div>
            )}

            {/* Main button — icon style with tooltip */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => isPiPOpen ? closePiP() : setMenuOpen(!menuOpen)}
                    title={isPiPOpen ? 'Zavřít PiP' : 'Mini Player'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono text-xs transition-all
                        ${isPiPOpen
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                            : menuOpen
                                ? 'bg-terminal-accent/15 border-terminal-accent/30 text-terminal-accent'
                                : 'bg-terminal-bg/90 border-terminal-border/20 text-terminal-text/40 hover:text-terminal-accent hover:border-terminal-accent/30 hover:bg-terminal-accent/5'
                        } backdrop-blur-sm`}
                >
                    {isPiPOpen && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                    <FaExternalLinkAlt className="text-xs" />
                    <span className="tracking-wider">
                        {isPiPOpen ? 'PiP' : 'PiP'}
                    </span>
                </button>

                {/* Quick hide button */}
                {!isPiPOpen && !menuOpen && (
                    <button
                        onClick={() => setHidden(true)}
                        title="Skrýt"
                        className="w-6 h-6 rounded border border-terminal-border/10 bg-terminal-bg/80 
                            text-terminal-text/25 hover:text-terminal-text/40 
                            text-xs font-mono flex items-center justify-center transition-all"
                    >
                        <FaTimes className="text-xs" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PiPLauncher;
