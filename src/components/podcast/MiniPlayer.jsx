import React, { useState, useCallback } from 'react';
import { usePodcast, usePodcastPlayback } from '../../context/PodcastContext';
import { FaPlay, FaPause, FaChevronDown, FaChevronUp, FaSpinner, FaMusic, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaRedo, FaStepForward, FaNetworkWired, FaBook } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { books } from '../../data/bookData';
import { hasPodcast, psiPodcastIds, psiQuestionTitles } from '../../data/podcastData';
import { useExperimental } from '../../context/ExperimentalContext';

const hiddenNavRoutes = ['/exam-practice'];

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Books that have podcasts
const podcastBooks = books.filter(b => hasPodcast(b.id));

// PSI podcast items for the list
const psiPodcasts = psiPodcastIds.map(id => ({
    id,
    title: psiQuestionTitles[id] || `Otázka ${id}`,
    subtitle: `PSI – Otázka ${id}`,
}));

const MiniPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        isLoading,
        togglePlayPause,
        play,
        seek,
        playerVisible,
        setPlayerVisible,
        volume,
        setVolume,
        loopEnabled,
        toggleLoop,
        autoplayEnabled,
        toggleAutoplay,
    } = usePodcast();

    const { currentTime, duration } = usePodcastPlayback();

    const { frutigerAero } = useExperimental();
    const [showList, setShowList] = useState(false);
    const [listTab, setListTab] = useState('knizky'); // 'knizky' | 'psi'

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const location = useLocation();
    const navHidden = hiddenNavRoutes.includes(location.pathname);

    // Collapsed: improved visibility with music icon and pulse indicator
    if (!playerVisible) {
        return (
            <button
                onClick={() => setPlayerVisible(true)}
                className={`fixed ${navHidden ? 'bottom-0' : 'bottom-16'} md:bottom-0 right-4 z-40 flex items-center gap-2 px-4 py-2 
                    bg-terminal-bg/95 border border-b-0 border-terminal-border/30 text-terminal-accent 
                    hover:bg-terminal-accent/10 transition-colors backdrop-blur-md pb-safe
                    shadow-lg shadow-black/20`}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            >
                <div className="flex items-center gap-2">
                    {isPlaying && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-accent"></span>
                        </span>
                    )}
                    <FaMusic className={`text-sm ${isPlaying ? 'animate-pulse' : ''}`} />
                    {currentTrack && (
                        <span className="text-xs font-mono truncate max-w-[120px] hidden sm:inline">
                            {currentTrack.title}
                        </span>
                    )}
                </div>
                <FaChevronUp className="text-xs" />
            </button>
        );
    }

    return (
        <div className={`fixed ${navHidden ? 'bottom-0' : 'bottom-16'} md:bottom-0 left-0 right-0 z-40`}>
            {/* Podcast list dropdown */}
            {showList && (
                <div className={`bg-terminal-bg/98 backdrop-blur-md border-t border-x border-terminal-border/30 max-h-72 overflow-y-auto custom-scrollbar ${frutigerAero ? 'bg-[#c0c0c0] border-gray-400 text-black' : ''}`}>
                    <div className="container mx-auto px-4 py-2">
                        {/* Category tabs */}
                        <div className="flex gap-1 mb-2">
                            <button
                                onClick={() => setListTab('knizky')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${listTab === 'knizky'
                                        ? (frutigerAero ? 'bg-white text-black font-bold border border-gray-400' : 'bg-terminal-accent/20 text-terminal-accent font-medium border border-terminal-accent/30')
                                        : (frutigerAero ? 'bg-[#d4d0c8] text-black border border-gray-400' : 'text-terminal-text/50 hover:text-terminal-text/70 hover:bg-terminal-border/10')
                                    }`}
                            >
                                <FaBook className="text-[10px]" />
                                Knížky
                            </button>
                            <button
                                onClick={() => setListTab('psi')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${listTab === 'psi'
                                        ? (frutigerAero ? 'bg-white text-black font-bold border border-gray-400' : 'bg-terminal-accent/20 text-terminal-accent font-medium border border-terminal-accent/30')
                                        : (frutigerAero ? 'bg-[#d4d0c8] text-black border border-gray-400' : 'text-terminal-text/50 hover:text-terminal-text/70 hover:bg-terminal-border/10')
                                    }`}
                            >
                                <FaNetworkWired className="text-[10px]" />
                                PSI
                            </button>
                        </div>

                        {/* Books list */}
                        {listTab === 'knizky' && (
                            <div className={`space-y-0.5 ${frutigerAero ? 'frutiger-podcast-list flex flex-col gap-1 p-2' : ''}`}>
                                {podcastBooks.map(book => {
                                    const isActive = currentTrack?.bookId === book.id && currentTrack?.type !== 'psi';
                                    if (frutigerAero) {
                                        return (
                                            <button
                                                key={book.id}
                                                onClick={() => {
                                                    play(book.id, book.title, book.author, 'book');
                                                    setShowList(false);
                                                }}
                                                className={isActive ? 'active-track' : ''}
                                            >
                                                {book.title} ({book.author})
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={book.id}
                                            onClick={() => {
                                                play(book.id, book.title, book.author, 'book');
                                                setShowList(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${isActive
                                                ? 'bg-terminal-accent/15 border-l-2 border-terminal-accent'
                                                : 'hover:bg-terminal-border/10 border-l-2 border-transparent'
                                                }`}
                                        >
                                            <span className="text-[10px] text-terminal-text/30 font-mono w-5 text-right flex-shrink-0">{book.id}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs truncate ${isActive ? 'text-terminal-accent font-medium' : 'text-terminal-text/80'}`}>
                                                    {book.title}
                                                </p>
                                                <p className="text-[10px] text-terminal-text/40 truncate">{book.author}</p>
                                            </div>
                                            {isActive && isPlaying && (
                                                <FaMusic className="text-terminal-accent text-[10px] animate-pulse flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* PSI list */}
                        {listTab === 'psi' && (
                            <div className={`space-y-0.5 ${frutigerAero ? 'frutiger-podcast-list flex flex-col gap-1 p-2' : ''}`}>
                                {psiPodcasts.map(item => {
                                    const isActive = currentTrack?.bookId === item.id && currentTrack?.type === 'psi';
                                    if (frutigerAero) {
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    play(item.id, item.title, 'PSI', 'psi');
                                                    setShowList(false);
                                                }}
                                                className={isActive ? 'active-track' : ''}
                                            >
                                                {item.id}. {item.title}
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                play(item.id, item.title, 'PSI', 'psi');
                                                setShowList(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${isActive
                                                ? 'bg-terminal-accent/15 border-l-2 border-terminal-accent'
                                                : 'hover:bg-terminal-border/10 border-l-2 border-transparent'
                                                }`}
                                        >
                                            <span className="text-[10px] text-terminal-text/30 font-mono w-5 text-right flex-shrink-0">{item.id}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs truncate ${isActive ? 'text-terminal-accent font-medium' : 'text-terminal-text/80'}`}>
                                                    {item.title}
                                                </p>
                                                <p className="text-[10px] text-terminal-text/40 truncate">{item.subtitle}</p>
                                            </div>
                                            {isActive && isPlaying && (
                                                <FaMusic className="text-terminal-accent text-[10px] animate-pulse flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={`relative bg-terminal-bg/95 backdrop-blur-md border-t border-terminal-border/10 pb-safe ${frutigerAero ? 'bg-[#d4d0c8] border-t-2 border-white border-b-2 border-[#808080] p-1' : ''}`}>
                {/* Global Mobile Progress Bar - Improved with visible thumb */}
                {currentTrack && !frutigerAero && (
                    <div className="absolute top-0 left-0 right-0 h-[6px] bg-terminal-border/20 sm:hidden cursor-pointer group"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            seek(pos * duration);
                        }}>
                        <div className="h-full bg-terminal-accent relative" style={{ width: `${progress}%` }}>
                            {/* Visible thumb indicator */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-terminal-accent rounded-full shadow-md border-2 border-terminal-bg"></div>
                        </div>
                    </div>
                )}

                <div
                    className="container mx-auto px-2 sm:px-4 py-1.5 sm:py-1 flex items-center gap-2 sm:gap-3 pt-3 sm:pt-1.5"
                >
                    {/* Integrated Slider & Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Title Row - clickable to toggle list */}
                        <div className="flex items-center justify-between mb-1">
                            {currentTrack ? (
                                <div 
                                    className="flex items-baseline gap-2 cursor-pointer"
                                    onClick={() => setShowList(!showList)}
                                >
                                    {/* Track type icon */}
                                    {!frutigerAero && currentTrack.type === 'psi' && (
                                        <FaNetworkWired className="text-[10px] text-terminal-accent/60" />
                                    )}
                                    {!frutigerAero && currentTrack.type === 'book' && (
                                        <FaBook className="text-[10px] text-terminal-accent/60" />
                                    )}
                                    {!frutigerAero && currentTrack.type === 'psi' && (
                                        <span className="text-[9px] text-terminal-accent/60 bg-terminal-accent/10 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">PSI</span>
                                    )}
                                    <p className={`text-xs truncate font-medium ${frutigerAero ? 'text-black font-serif' : 'text-terminal-text'}`}>
                                        {currentTrack.title}
                                    </p>
                                    {!frutigerAero && (
                                        <p className="text-[10px] text-terminal-text/50">
                                            {currentTrack.author}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p 
                                    className={`text-xs cursor-pointer ${frutigerAero ? 'text-blue-800 underline font-serif' : 'text-terminal-text/40'}`}
                                    onClick={() => setShowList(!showList)}
                                >
                                    {frutigerAero ? 'Vybrat...' : 'Vyber podcast k poslechu'}
                                </p>
                            )}
                            {currentTrack && (
                                <span className={`text-[10px] font-mono ${frutigerAero ? 'text-black' : 'text-terminal-text/40'}`}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            )}
                        </div>

                        {/* Integrated Progress Bar - Hidden on mobile */}
                        {currentTrack && (
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="1"
                                value={currentTime}
                                onChange={(e) => seek(parseFloat(e.target.value))}
                                className="hidden sm:block w-full h-1 accent-terminal-accent bg-terminal-border/20 rounded appearance-none cursor-pointer"
                                style={{ accentColor: frutigerAero ? '#008000' : 'var(--color-terminal-accent, #8b5cf6)', height: frutigerAero ? '2px' : '4px' }}
                                onClick={e => e.stopPropagation()}
                                aria-label="Přetočit"
                            />
                        )}
                    </div>

                    {/* Playback controls */}
                    {currentTrack && (
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
                            <button
                                onClick={togglePlayPause}
                                onTouchEnd={(e) => { e.preventDefault(); togglePlayPause(); }}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all ${frutigerAero
                                        ? 'text-black border border-gray-400 bg-[#e0e0e0]'
                                        : isPlaying
                                            ? 'bg-terminal-accent text-terminal-bg hover:bg-terminal-accent/80'
                                            : 'bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/40 hover:bg-terminal-accent/30'
                                    }`}
                                aria-label={isPlaying ? 'Pauza' : 'Přehrát'}
                            >
                                {isLoading ? (
                                    <FaSpinner className="text-xs sm:text-sm animate-spin" />
                                ) : isPlaying ? (
                                    <FaPause className="text-xs sm:text-sm" />
                                ) : (
                                    <FaPlay className="text-xs sm:text-sm ml-0.5" />
                                )}
                            </button>
                            <button
                                onClick={toggleLoop}
                                onTouchEnd={(e) => { e.preventDefault(); toggleLoop(); }}
                                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${loopEnabled
                                    ? (frutigerAero ? 'text-black bg-white border border-gray-400' : 'text-terminal-accent bg-terminal-accent/15 border border-terminal-accent/30')
                                    : (frutigerAero ? 'text-black opacity-40' : 'text-terminal-text/30 hover:text-terminal-text/50 hover:bg-terminal-border/10')
                                    }`}
                                aria-label={loopEnabled ? 'Loop zapnutý' : 'Loop vypnutý'}
                                title={loopEnabled ? 'Loop: ON' : 'Loop: OFF'}
                            >
                                <FaRedo className="text-xs" />
                            </button>
                            <button
                                onClick={toggleAutoplay}
                                onTouchEnd={(e) => { e.preventDefault(); toggleAutoplay(); }}
                                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${autoplayEnabled
                                    ? (frutigerAero ? 'text-black bg-white border border-gray-400' : 'text-terminal-accent bg-terminal-accent/15 border border-terminal-accent/30')
                                    : (frutigerAero ? 'text-black opacity-40' : 'text-terminal-text/30 hover:text-terminal-text/50 hover:bg-terminal-border/10')
                                    }`}
                                aria-label={autoplayEnabled ? 'Další: ON' : 'Další: OFF'}
                                title={autoplayEnabled ? 'Autoplay: ON' : 'Autoplay: OFF'}
                            >
                                <FaStepForward className="text-xs" />
                            </button>
                        </div>
                    )}

                    {/* Volume control - Hidden on mobile, visible on desktop */}
                    {currentTrack && (
                        <div className="hidden sm:flex items-center gap-1" onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
                            <button
                                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${frutigerAero ? 'text-black' : 'text-terminal-text/40 hover:text-terminal-accent hover:bg-terminal-border/10'}`}
                                aria-label="Mute"
                            >
                                {volume === 0 ? <FaVolumeMute className="text-xs" /> :
                                    volume < 0.5 ? <FaVolumeDown className="text-xs" /> :
                                        <FaVolumeUp className="text-xs" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-16 h-1 accent-terminal-accent bg-terminal-border/20 rounded appearance-none cursor-pointer"
                                style={{ accentColor: frutigerAero ? '#008000' : 'var(--color-terminal-accent, #8b5cf6)' }}
                                aria-label="Hlasitost"
                            />
                        </div>
                    )}

                    {/* Collapse button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setPlayerVisible(false); setShowList(false); }}
                        onTouchEnd={(e) => { e.preventDefault(); setPlayerVisible(false); setShowList(false); }}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${frutigerAero ? 'text-black' : 'text-terminal-text/30 hover:text-terminal-text/60 hover:bg-terminal-border/10'}`}
                        aria-label="Skrýt přehrávač"
                    >
                        <FaChevronDown className="text-xs" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
