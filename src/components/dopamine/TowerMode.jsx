
import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaArrowUp } from 'react-icons/fa';

const TowerMode = ({ allPairs, onGameOver }) => {
    const [stack, setStack] = useState([]); // Array of stacked blocks
    const [currentPair, setCurrentPair] = useState(null);
    const [options, setOptions] = useState([]); // { id, text, isCorrect }
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gamePhase, setGamePhase] = useState('falling'); // falling, landed

    const nextRound = useCallback(() => {
        const pair = allPairs[Math.floor(Math.random() * allPairs.length)];
        setCurrentPair(pair);

        // Generate Distractors
        const distractors = [];
        while (distractors.length < 2) {
            const d = allPairs[Math.floor(Math.random() * allPairs.length)];
            if (d.q !== pair.q && !distractors.includes(d)) distractors.push(d);
        }

        const newOptions = [
            { id: 'correct', text: pair.a, isCorrect: true },
            { id: 'd1', text: distractors[0].a, isCorrect: false },
            { id: 'd2', text: distractors[1].a, isCorrect: false }
        ].sort(() => Math.random() - 0.5);

        setOptions(newOptions);
        setGamePhase('falling');
    }, [allPairs]);

    // Initial Start
    useEffect(() => {
        if (allPairs.length > 0 && stack.length === 0) {
            nextRound();
        }
    }, [allPairs, stack.length, nextRound]);

    const handleSelect = (option) => {
        if (gamePhase !== 'falling') return;

        if (option.isCorrect) {
            // Correct! Stack it.
            setStack(prev => [...prev, {
                id: Date.now(),
                question: currentPair.q,
                answer: currentPair.a,
                color: ['bg-cyan-500', 'bg-purple-500', 'bg-pink-500'][prev.length % 3]
            }]);
            setScore(s => s + 50);
            setGamePhase('landed');

            setTimeout(() => {
                nextRound();
            }, 1000);
        } else {
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) onGameOver(score);
                return newLives;
            });
            // Shake effect or red flash (simplified here)
        }
    };

    // Scroll effect
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [stack]);

    if (!currentPair) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-end pb-20 overflow-hidden">

            {/* HUD */}
            <div className="absolute top-20 left-4 right-4 flex justify-between z-50">
                <div className="flex gap-1 text-red-500 text-2xl">
                    {[...Array(lives)].map((_, i) => <FaHeart key={i} />)}
                </div>
                <div className="text-4xl font-bold text-white font-mono">{score}</div>
            </div>

            {/* Tower Container */}
            <div ref={containerRef} className="w-full max-w-md h-[60vh] overflow-y-auto no-scrollbar flex flex-col-reverse items-center gap-1 transition-all">
                {/* Active Question Block (Being built) */}
                <div className="animate-bounce mb-8">
                    <div className="bg-white text-black font-bold px-6 py-3 rounded shadow-[0_0_20px_white]">
                        {currentPair.q}
                    </div>
                    <FaArrowUp className="mx-auto text-white mt-2 animate-pulse" />
                </div>

                {/* Stacked Blocks */}
                {[...stack].reverse().map(block => (
                    <div key={block.id} className={`w-64 h-16 ${block.color} flex items-center justify-center text-white font-bold rounded shadow-lg border-b-4 border-black/20`}>
                        <div className="truncate px-2 text-sm text-center">
                            <div className="opacity-50 text-[10px] uppercase">{block.question}</div>
                            {block.answer}
                        </div>
                    </div>
                ))}

                {/* Base */}
                <div className="w-80 h-4 bg-gray-700 rounded-full mt-2"></div>
            </div>

            {/* Option Buttons */}
            <div className="absolute bottom-0 w-full bg-gray-800/90 p-6 rounded-t-3xl border-t border-purple-500/30 flex flex-col gap-3">
                {options.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        className="w-full bg-gray-700 hover:bg-purple-600 text-white p-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg border border-gray-600"
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TowerMode;
