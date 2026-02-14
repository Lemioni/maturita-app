import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { getPodcastUrl, hasPodcast, podcastBookIds } from '../data/podcastData';
import { books } from '../data/bookData';

const PodcastContext = createContext();

export const usePodcast = () => useContext(PodcastContext);

export const PodcastProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(null); // { bookId, title, author }
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [playerVisible, setPlayerVisible] = useState(true);
    const [volume, setVolumeState] = useState(() => {
        try { return parseFloat(localStorage.getItem('podcast-volume')) || 1; } catch { return 1; }
    });
    const [loopEnabled, setLoopEnabled] = useState(() => {
        try { return localStorage.getItem('podcast-loop') !== 'false'; } catch { return true; }
    });
    const [autoplayEnabled, setAutoplayEnabled] = useState(() => {
        try { return localStorage.getItem('podcast-autoplay') !== 'false'; } catch { return true; }
    });

    // Restore last listened track from localStorage on mount
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('podcast-last-track'));
            if (saved?.bookId && saved?.title) {
                setCurrentTrack({ bookId: saved.bookId, title: saved.title, author: saved.author });
            }
        } catch { }
    }, []);

    // Save current track + position to localStorage
    useEffect(() => {
        if (currentTrack) {
            localStorage.setItem('podcast-last-track', JSON.stringify({
                bookId: currentTrack.bookId,
                title: currentTrack.title,
                author: currentTrack.author,
                time: currentTime,
            }));
        }
    }, [currentTrack, Math.floor(currentTime / 5)]); // save every ~5 seconds

    // Ref for playNext so the audio 'ended' listener always has the latest
    const playNextRef = useRef(null);

    // Create audio element once on mount
    useEffect(() => {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.volume = volume;
        audioRef.current = audio;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration || 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => { setIsPlaying(false); setCurrentTime(0); playNextRef.current(); };
        const onWaiting = () => setIsLoading(true);
        const onCanPlay = () => setIsLoading(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('durationchange', onDurationChange);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('canplay', onCanPlay);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('durationchange', onDurationChange);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('canplay', onCanPlay);
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Media Session API for lock screen controls
    const updateMediaSession = useCallback((track) => {
        if ('mediaSession' in navigator && track) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.author || 'Maturita Podcast',
                album: 'Maturita CJ',
            });

            navigator.mediaSession.setActionHandler('play', () => {
                audioRef.current?.play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                audioRef.current?.pause();
            });
            navigator.mediaSession.setActionHandler('seekbackward', () => {
                if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
                if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
            });
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (audioRef.current && details.seekTime != null) {
                    audioRef.current.currentTime = details.seekTime;
                }
            });
        }
    }, []);

    const play = useCallback((bookId, title, author) => {
        const url = getPodcastUrl(bookId);
        if (!url) return;

        const audio = audioRef.current;
        if (!audio) return;

        // If same track, just resume
        if (currentTrack?.bookId === bookId && audio.src.includes(encodeURIComponent(url.split('/').pop()))) {
            audio.play();
            return;
        }

        // New track
        const track = { bookId, title, author };
        setCurrentTrack(track);
        setIsLoading(true);
        setCurrentTime(0);
        setDuration(0);

        audio.src = url;
        audio.load();
        audio.play().catch(() => {
            // Autoplay might be blocked, user needs to tap play
            setIsPlaying(false);
            setIsLoading(false);
        });

        updateMediaSession(track);
    }, [currentTrack, updateMediaSession]);

    // Auto-play next track
    const playNext = useCallback(() => {
        if (!currentTrack || !autoplayEnabled) return;
        const idx = podcastBookIds.indexOf(currentTrack.bookId);
        const nextIdx = idx + 1;
        // If we're at the end, only continue if loop is enabled
        if (nextIdx >= podcastBookIds.length) {
            if (!loopEnabled) return;
        }
        const wrappedIdx = nextIdx % podcastBookIds.length;
        const nextBookId = podcastBookIds[wrappedIdx];
        const nextBook = books.find(b => b.id === nextBookId);
        if (nextBook) {
            setTimeout(() => play(nextBookId, nextBook.title, nextBook.author), 300);
        }
    }, [currentTrack, play, autoplayEnabled, loopEnabled]);

    // Keep ref in sync for the onEnded listener
    useEffect(() => {
        playNextRef.current = playNext;
    }, [playNext]);

    const pause = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    const resume = useCallback(() => {
        audioRef.current?.play();
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [isPlaying, pause, resume]);

    const seek = useCallback((time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }, []);

    const stop = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        setCurrentTrack(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }, []);

    const skipForward = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 15);
        }
    }, []);

    const skipBackward = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
        }
    }, []);

    const setVolume = useCallback((v) => {
        const val = Math.max(0, Math.min(1, v));
        setVolumeState(val);
        if (audioRef.current) audioRef.current.volume = val;
        localStorage.setItem('podcast-volume', val.toString());
    }, []);

    const toggleLoop = useCallback(() => {
        setLoopEnabled(prev => {
            const next = !prev;
            localStorage.setItem('podcast-loop', next.toString());
            return next;
        });
    }, []);

    const toggleAutoplay = useCallback(() => {
        setAutoplayEnabled(prev => {
            const next = !prev;
            localStorage.setItem('podcast-autoplay', next.toString());
            return next;
        });
    }, []);

    const value = {
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        play,
        pause,
        resume,
        togglePlayPause,
        seek,
        stop,
        skipForward,
        skipBackward,
        hasPodcast,
        playerVisible,
        setPlayerVisible,
        volume,
        setVolume,
        loopEnabled,
        toggleLoop,
        autoplayEnabled,
        toggleAutoplay,
    };

    return (
        <PodcastContext.Provider value={value}>
            {children}
        </PodcastContext.Provider>
    );
};

export default PodcastContext;
