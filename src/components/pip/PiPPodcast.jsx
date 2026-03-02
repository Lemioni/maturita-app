import React from 'react';
import { usePodcast } from '../../context/PodcastContext';
import { books } from '../../data/bookData';
import { hasPodcast, psiPodcastIds, psiQuestionTitles } from '../../data/podcastData';

const podcastBooks = books.filter(b => hasPodcast(b.id));
const psiPodcasts = psiPodcastIds.map(id => ({
    id, title: psiQuestionTitles[id] || `Otázka ${id}`, subtitle: `PSI – Otázka ${id}`,
}));

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const s = {
    now: {
        padding: '12px', background: 'rgba(20,20,30,0.8)', borderRadius: '8px',
        border: '1px solid rgba(139,92,246,0.2)', marginBottom: '10px',
    },
    nowLabel: { fontSize: '9px', color: 'rgba(224,224,224,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
    nowTitle: { fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '2px' },
    nowAuthor: { fontSize: '11px', color: 'rgba(224,224,224,0.45)' },
    seekBar: {
        width: '100%', height: '4px', appearance: 'none', background: 'rgba(139,92,246,0.15)',
        borderRadius: '2px', cursor: 'pointer', outline: 'none', marginTop: '10px',
        accentColor: '#8b5cf6',
    },
    timeRow: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(224,224,224,0.35)', marginTop: '4px' },
    controls: { display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' },
    ctrlBtn: (active) => ({
        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid', borderColor: active ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.15)',
        borderRadius: '50%', background: active ? 'rgba(139,92,246,0.25)' : 'rgba(20,20,30,0.6)',
        color: active ? '#a78bfa' : 'rgba(224,224,224,0.6)', fontSize: '16px', cursor: 'pointer',
    }),
    playBtn: (playing) => ({
        width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: '50%',
        background: playing ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.3)',
        color: '#fff', fontSize: '18px', cursor: 'pointer', transition: 'all 0.15s',
    }),
    listSection: { fontSize: '10px', color: 'rgba(224,224,224,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', marginTop: '6px' },
    listItem: (active) => ({
        display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px',
        borderRadius: '4px', cursor: 'pointer', transition: 'background 0.15s',
        background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
        borderLeft: active ? '2px solid #8b5cf6' : '2px solid transparent',
    }),
    listTitle: (active) => ({
        fontSize: '11px', color: active ? '#a78bfa' : 'rgba(224,224,224,0.65)',
        fontWeight: active ? '600' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
    }),
    listId: { fontSize: '9px', color: 'rgba(224,224,224,0.25)', fontFamily: 'monospace', width: '18px', textAlign: 'right', flexShrink: 0 },
    empty: { textAlign: 'center', color: 'rgba(224,224,224,0.4)', padding: '20px 16px', fontSize: '12px' },
    tabs: { display: 'flex', gap: '2px', marginBottom: '8px' },
    tab: (active) => ({
        flex: 1, padding: '6px', border: 'none', borderRadius: '4px',
        background: active ? 'rgba(139,92,246,0.2)' : 'transparent',
        color: active ? '#a78bfa' : 'rgba(224,224,224,0.4)',
        fontSize: '11px', fontWeight: active ? '700' : '400', cursor: 'pointer',
    }),
};

const PiPPodcast = () => {
    const {
        currentTrack, isPlaying, isLoading, currentTime, duration,
        togglePlayPause, play, seek, volume, setVolume,
        loopEnabled, toggleLoop, autoplayEnabled, toggleAutoplay,
    } = usePodcast();

    const [tab, setTab] = React.useState('knizky');
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div>
            {/* Now playing */}
            <div style={s.now}>
                <div style={s.nowLabel}>Právě hraje</div>
                {currentTrack ? (
                    <>
                        <div style={s.nowTitle}>{currentTrack.title}</div>
                        <div style={s.nowAuthor}>{currentTrack.author}</div>
                        <input
                            type="range"
                            min="0" max={duration || 0} step="1" value={currentTime}
                            onChange={(e) => seek(parseFloat(e.target.value))}
                            style={s.seekBar}
                        />
                        <div style={s.timeRow}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </>
                ) : (
                    <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.4)' }}>Vyber podcast…</div>
                )}
            </div>

            {/* Controls */}
            <div style={s.controls}>
                <button style={s.ctrlBtn(loopEnabled)} onClick={toggleLoop} title="Loop">🔁</button>
                <button style={s.playBtn(isPlaying)} onClick={togglePlayPause}>
                    {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
                </button>
                <button style={s.ctrlBtn(autoplayEnabled)} onClick={toggleAutoplay} title="Autoplay">⏭</button>
            </div>

            {/* Track list */}
            <div style={s.tabs}>
                <button style={s.tab(tab === 'knizky')} onClick={() => setTab('knizky')}>📚 Knížky</button>
                <button style={s.tab(tab === 'psi')} onClick={() => setTab('psi')}>🌐 PSI</button>
            </div>

            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {tab === 'knizky' && podcastBooks.map(book => {
                    const active = currentTrack?.bookId === book.id && currentTrack?.type !== 'psi';
                    return (
                        <div
                            key={book.id}
                            style={s.listItem(active)}
                            onClick={() => play(book.id, book.title, book.author, 'book')}
                        >
                            <span style={s.listId}>{book.id}</span>
                            <span style={s.listTitle(active)}>{book.title}</span>
                            {active && isPlaying && <span style={{ fontSize: '10px', color: '#a78bfa' }}>♫</span>}
                        </div>
                    );
                })}
                {tab === 'psi' && psiPodcasts.map(item => {
                    const active = currentTrack?.bookId === item.id && currentTrack?.type === 'psi';
                    return (
                        <div
                            key={item.id}
                            style={s.listItem(active)}
                            onClick={() => play(item.id, item.title, 'PSI', 'psi')}
                        >
                            <span style={s.listId}>{item.id}</span>
                            <span style={s.listTitle(active)}>{item.title}</span>
                            {active && isPlaying && <span style={{ fontSize: '10px', color: '#a78bfa' }}>♫</span>}
                        </div>
                    );
                })}

                {tab === 'knizky' && podcastBooks.length === 0 && <div style={s.empty}>Žádné podcasty</div>}
                {tab === 'psi' && psiPodcasts.length === 0 && <div style={s.empty}>Žádné podcasty</div>}
            </div>
        </div>
    );
};

export default PiPPodcast;
