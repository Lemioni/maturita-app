
import { useState, useRef, useCallback } from 'react';
import { FaRocket, FaRedo, FaSkull, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useExperimental } from '../context/ExperimentalContext';
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

    const { frutigerAero } = useExperimental();

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
            <div className={`min-h-screen flex items-center justify-center pt-10 ${frutigerAero ? 'bg-black/90' : 'bg-terminal-bg relative overflow-hidden'}`}>
                {/* Adobe Flash Player Container */}
                <div className="w-full max-w-5xl bg-black border-4 border-gray-700 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Flash Header Bar */}
                    <div className="h-8 bg-gradient-to-b from-gray-800 to-black border-b border-gray-700 flex items-center justify-center relative">
                        <span className="text-gray-400 font-sans text-xs font-bold tracking-wide">Adobe Flash Player 9</span>
                        <div className="absolute right-2 flex gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Game Content Area */}
                    <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-8 bg-[url('/aero-icons/vista_bench.ico')] bg-repeat opacity-90">
                        <div className="absolute inset-0 bg-black/80"></div>

                        <div className="z-10 text-center w-full max-w-2xl">
                            <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter" style={{ textShadow: '0 0 10px white' }}>
                                NEON LINK
                            </h1>

                            <div className="mb-12">
                                <button
                                    className="text-4xl font-bold text-white hover:scale-110 transition-transform cursor-pointer"
                                    style={{ textShadow: '0 0 20px white' }}
                                    onClick={() => document.getElementById('config-start-btn')?.click()}
                                >
                                    Play
                                </button>
                                {/* Hidden trigger for actual start */}
                            </div>

                            <div className="bg-black/60 border border-gray-600 p-6 rounded backdrop-blur">
                                <DopamineConfig onStartGame={handleStartGame} />
                            </div>

                            <div className="mt-8 flex justify-center gap-8 opacity-50">
                                <img src="/aero-icons/roblox1.ico" className="w-16 h-8 object-contain grayscale" />
                                <div className="text-white font-mono text-xs pt-2">MAX GAMES</div>
                            </div>
                        </div>
                    </div>
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
