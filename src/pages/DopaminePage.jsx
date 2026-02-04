
import { useState, useRef, useCallback } from 'react';
import { FaRocket, FaRedo, FaSkull, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { generateGameContent } from '../utils/gameContentFactory';
import DopamineConfig from '../components/dopamine/DopamineConfig';
import BubbleMode from '../components/dopamine/BubbleMode';
import NotepadMode from '../components/dopamine/NotepadMode';
import TowerMode from '../components/dopamine/TowerMode';

const DopaminePage = () => {
    // Game State
    const [appMode, setAppMode] = useState('menu'); // menu (config), playing, gameover
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeGameMode, setActiveGameMode] = useState('bubbles');
    const [allPairs, setAllPairs] = useState([]);
    const [finalScore, setFinalScore] = useState(0);

    const handleStartGame = (category, ids, mode) => {
        setActiveCategory(category);
        setActiveGameMode(mode);
        const pairs = generateGameContent(category, ids);
        setAllPairs(pairs);
        setAppMode('playing');
    };

    const handleGameOver = (score) => {
        setFinalScore(score);
        setAppMode('gameover');
    };

    const stopGame = () => {
        setAppMode('menu');
    };

    if (appMode === 'menu') {
        return (
            <div className="min-h-screen flex flex-col items-center pt-20 bg-terminal-bg text-terminal-text relative overflow-hidden">
                <div className="z-10 w-full max-w-4xl px-4">
                    <div className="text-center mb-8">
                        <FaRocket className="text-6xl text-purple-400 mx-auto mb-6 animate-pulse" />
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">NEON LINK</h1>
                        <p className="text-xl text-terminal-text/60 mb-8">Trénuj mozek spojováním souvislostí</p>
                    </div>

                    <DopamineConfig onStartGame={handleStartGame} />
                </div>
            </div>
        );
    }

    if (appMode === 'gameover') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-text">
                <div className="text-center terminal-card p-10 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                    <FaSkull className="text-6xl text-red-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
                    <div className="text-6xl font-mono font-bold text-white my-6">{finalScore}</div>
                    <button onClick={stopGame} className="px-8 py-3 bg-terminal-accent/10 border border-terminal-accent/50 hover:bg-terminal-accent/20 text-terminal-accent rounded flex items-center gap-2 mx-auto">
                        <FaRedo /> Zpět do menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-terminal-bg">
            <button onClick={stopGame} className="absolute top-4 right-4 z-[100] text-white/30 hover:text-white pointer-events-auto">Exit</button>

            {activeGameMode === 'bubbles' && <BubbleMode allPairs={allPairs} onGameOver={handleGameOver} />}
            {activeGameMode === 'notepad' && <NotepadMode allPairs={allPairs} onGameOver={handleGameOver} />}
            {activeGameMode === 'tower' && <TowerMode allPairs={allPairs} onGameOver={handleGameOver} />}
        </div>
    );
};

export default DopaminePage;
