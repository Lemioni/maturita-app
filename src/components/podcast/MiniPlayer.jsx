import React, { useState, useCallback } from 'react';
import { usePodcast } from '../../context/PodcastContext';
import { FaPlay, FaPause, FaChevronDown, FaChevronUp, FaSpinner, FaMusic, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaRedo, FaStepForward } from 'react-icons/fa';
import { books } from '../../data/bookData';
import { hasPodcast } from '../../data/podcastData';
import { useExperimental } from '../../context/ExperimentalContext';

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Books that have podcasts
const podcastBooks = books.filter(b => hasPodcast(b.id));

const MiniPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
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

    const { frutigerAero } = useExperimental();
    const [showList, setShowList] = useState(false);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Collapsed: just a small tab to reopen
    if (!playerVisible) {
        return (
            <button
                onClick={() => setPlayerVisible(true)}
                className="fixed bottom-0 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-terminal-bg/95 border border-b-0 border-terminal-border/30 text-terminal-accent hover:bg-terminal-accent/10 transition-colors backdrop-blur-md"
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            >
                <FaChevronUp className="text-[10px]" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Podcast list dropdown */}
            {showList && (
                <div className={`bg-terminal-bg/98 backdrop-blur-md border-t border-x border-terminal-border/30 max-h-64 overflow-y-auto custom-scrollbar ${frutigerAero ? 'bg-[#c0c0c0] border-gray-400 text-black' : ''}`}>
                    <div className="container mx-auto px-4 py-2">
                        {!frutigerAero && (
                            <p className="text-[10px] text-terminal-text/40 uppercase tracking-wider mb-2 font-bold">Vyber podcast</p>
                        )}
                        <div className={`space-y-0.5 ${frutigerAero ? 'frutiger-podcast-list flex flex-col gap-1 p-2' : ''}`}>
                            {podcastBooks.map(book => {
                                const isActive = currentTrack?.bookId === book.id;
                                if (frutigerAero) {
                                    return (
                                        <button
                                            key={book.id}
                                            onClick={() => {
                                                play(book.id, book.title, book.author);
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
                                            play(book.id, book.title, book.author);
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
                    </div>
                </div>
            )}

            <div className={`bg-terminal-bg/95 backdrop-blur-md border-t border-terminal-border/10 ${frutigerAero ? 'bg-[#d4d0c8] border-t-2 border-white border-b-2 border-[#808080] p-1' : ''}`}>
                <div
                    className="container mx-auto px-4 py-1 flex items-center gap-3"
                    onClick={frutigerAero ? undefined : () => setShowList(!showList)}
                >
                    {/* Integrated Slider & Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-1" onClick={() => setShowList(!showList)}>
                            {currentTrack ? (
                                <div className="flex items-baseline gap-2 cursor-pointer">
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
                                <p className={`text-xs cursor-pointer ${frutigerAero ? 'text-blue-800 underline font-serif' : 'text-terminal-text/40'}`}>
                                    {frutigerAero ? 'Vybrat...' : 'Vyber podcast k poslechu'}
                                </p>
                            )}
                            {currentTrack && (
                                <span className={`text-[10px] font-mono ${frutigerAero ? 'text-black' : 'text-terminal-text/40'}`}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            )}
                        </div>

                        {/* Integrated Progress Bar */}
                        {currentTrack && (
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="1"
                                value={currentTime}
                                onChange={(e) => seek(parseFloat(e.target.value))}
                                className="w-full h-1 accent-terminal-accent bg-terminal-border/20 rounded appearance-none cursor-pointer"
                                style={{ accentColor: frutigerAero ? '#008000' : 'var(--color-terminal-accent, #8b5cf6)', height: frutigerAero ? '2px' : '4px' }}
                                onClick={e => e.stopPropagation()}
                            />
                        )}
                    </div>

                    {/* Playback controls */}
                    {currentTrack && (
                        <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={togglePlayPause}
                                className={`w-8 h-8 flex items-center justify-center transition-colors ${frutigerAero ? 'text-black border border-gray-400 bg-[#e0e0e0]' : 'text-terminal-accent hover:bg-terminal-accent/20'}`}
                                aria-label={isPlaying ? 'Pauza' : 'Přehrát'}
                            >
                                {isLoading ? (
                                    <FaSpinner className="text-sm animate-spin" />
                                ) : isPlaying ? (
                                    <FaPause className="text-sm" />
                                ) : (
                                    <FaPlay className="text-sm" />
                                )}
                            </button>
                            <button
                                onClick={toggleLoop}
                                className={`w-6 h-6 flex items-center justify-center transition-colors ${loopEnabled
                                    ? 'text-terminal-accent'
                                    : 'text-terminal-text/30 hover:text-terminal-text/50'
                                    } ${frutigerAero ? 'text-black opacity-60' : ''}`}
                                aria-label={loopEnabled ? 'Loop zapnutý' : 'Loop vypnutý'}
                            >
                                <FaRedo className="text-[10px]" />
                            </button>
                            <button
                                onClick={toggleAutoplay}
                                className={`w-6 h-6 flex items-center justify-center transition-colors ${autoplayEnabled
                                    ? 'text-terminal-accent'
                                    : 'text-terminal-text/30 hover:text-terminal-text/50'
                                    } ${frutigerAero ? 'text-black opacity-60' : ''}`}
                                aria-label={autoplayEnabled ? 'Další: ON' : 'Další: OFF'}
                            >
                                <FaStepForward className="text-[10px]" />
                            </button>
                        </div>
                    )}

                    {/* Volume control - Hidden on mobile, visible on desktop */}
                    {currentTrack && (
                        <div className="hidden sm:flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                                className={`w-6 h-6 flex items-center justify-center transition-colors ${frutigerAero ? 'text-black' : 'text-terminal-text/40 hover:text-terminal-accent'}`}
                                aria-label="Mute"
                            >
                                {volume === 0 ? <FaVolumeMute className="text-[10px]" /> :
                                    volume < 0.5 ? <FaVolumeDown className="text-[10px]" /> :
                                        <FaVolumeUp className="text-[10px]" />}
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
                            />
                        </div>
                    )}

                    {/* Collapse button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setPlayerVisible(false); setShowList(false); }}
                        className={`w-6 h-6 flex items-center justify-center transition-colors ${frutigerAero ? 'text-black' : 'text-terminal-text/30 hover:text-terminal-text/60'}`}
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
