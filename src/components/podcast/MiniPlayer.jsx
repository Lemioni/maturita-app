import React, { useState, useCallback } from 'react';
import { usePodcast } from '../../context/PodcastContext';
import { FaPlay, FaPause, FaChevronDown, FaChevronUp, FaSpinner, FaMusic, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaRedo, FaStepForward } from 'react-icons/fa';
import { books } from '../../data/bookData';
import { hasPodcast } from '../../data/podcastData';

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
                <div className="bg-terminal-bg/98 backdrop-blur-md border-t border-x border-terminal-border/30 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="container mx-auto px-4 py-2">
                        <p className="text-[10px] text-terminal-text/40 uppercase tracking-wider mb-2 font-bold">Vyber podcast</p>
                        <div className="space-y-0.5">
                            {podcastBooks.map(book => {
                                const isActive = currentTrack?.bookId === book.id;
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

            {/* Seek slider */}
            {currentTrack && (
                <div className="bg-terminal-bg/95 backdrop-blur-md border-t border-terminal-border/30 px-4 pt-2 pb-0" onClick={e => e.stopPropagation()}>
                    <div className="container mx-auto flex items-center gap-2">
                        <span className="text-[10px] text-terminal-text/40 font-mono w-10 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="1"
                            value={currentTime}
                            onChange={(e) => seek(parseFloat(e.target.value))}
                            className="flex-1 h-1 accent-terminal-accent bg-terminal-border/20 rounded appearance-none cursor-pointer"
                            style={{ accentColor: 'var(--color-terminal-accent, #8b5cf6)' }}
                        />
                        <span className="text-[10px] text-terminal-text/40 font-mono w-10">{formatTime(duration)}</span>
                    </div>
                </div>
            )}

            <div className="bg-terminal-bg/95 backdrop-blur-md border-t border-terminal-border/10">
                <div
                    className="container mx-auto px-4 py-2 flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowList(!showList)}
                >
                    {/* Title & time or placeholder */}
                    <div className="flex-1 min-w-0">
                        {currentTrack ? (
                            <>
                                <p className="text-xs text-terminal-text truncate font-medium">
                                    {currentTrack.title}
                                </p>
                                <p className="text-[10px] text-terminal-text/50">
                                    {currentTrack.author}
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-terminal-text/40">Vyber podcast k poslechu</p>
                        )}
                    </div>

                    {/* Playback controls */}
                    {currentTrack && (
                        <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={togglePlayPause}
                                className="w-9 h-9 flex items-center justify-center text-terminal-accent hover:bg-terminal-accent/20 transition-colors"
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
                                className={`w-7 h-7 flex items-center justify-center transition-colors ${loopEnabled
                                        ? 'text-terminal-accent'
                                        : 'text-terminal-text/30 hover:text-terminal-text/50'
                                    }`}
                                aria-label={loopEnabled ? 'Loop zapnutý' : 'Loop vypnutý'}
                                title={loopEnabled ? 'Opakovat: ON' : 'Opakovat: OFF'}
                            >
                                <FaRedo className="text-[10px]" />
                            </button>
                            <button
                                onClick={toggleAutoplay}
                                className={`w-7 h-7 flex items-center justify-center transition-colors ${autoplayEnabled
                                        ? 'text-terminal-accent'
                                        : 'text-terminal-text/30 hover:text-terminal-text/50'
                                    }`}
                                aria-label={autoplayEnabled ? 'Další: ON' : 'Další: OFF'}
                                title={autoplayEnabled ? 'Přehrát další: ON' : 'Přehrát další: OFF'}
                            >
                                <FaStepForward className="text-[10px]" />
                            </button>
                        </div>
                    )}

                    {/* Volume control */}
                    {currentTrack && (
                        <div className="hidden sm:flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                                className="w-6 h-6 flex items-center justify-center text-terminal-text/40 hover:text-terminal-accent transition-colors"
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
                                style={{ accentColor: 'var(--color-terminal-accent, #8b5cf6)' }}
                            />
                        </div>
                    )}

                    {/* Collapse button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setPlayerVisible(false); setShowList(false); }}
                        className="w-7 h-7 flex items-center justify-center text-terminal-text/30 hover:text-terminal-text/60 transition-colors"
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
