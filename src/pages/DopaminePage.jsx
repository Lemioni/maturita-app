import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaHeart, FaRocket, FaRedo, FaSkull, FaShieldAlt, FaFlask, FaCheck, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { generateGameContent } from '../utils/gameContentFactory';

const DopaminePage = () => {
    const containerRef = useRef(null);
    const requestRef = useRef();

    // Audio Context
    const audioCtxRef = useRef(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Initial Data Load
    const allPairs = useMemo(() => generateGameContent(), []);

    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [combo, setCombo] = useState(0);
    const [level, setLevel] = useState(1);
    const [particles, setParticles] = useState([]);

    // Drag State
    const dragRef = useRef(null); // { id: number, startX: number, startY: number }

    // Initialize Audio
    useEffect(() => {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        return () => {
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const playSfx = useCallback((type) => {
        if (!soundEnabled || !audioCtxRef.current) return;
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'match':
                // Happy Ding (High C -> E -> G)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;

            case 'error':
                // Sad Buzz (Sawtooth drop)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'spawn':
                // Subtle Pop
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'levelUp':
                // Powerup
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554, now + 0.1);
                osc.frequency.setValueAtTime(659, now + 0.2);
                osc.frequency.setValueAtTime(880, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;

            default:
                break;
        }
    }, [soundEnabled]);


    // --- VISUAL FX ---
    const createExplosion = (x, y, color) => {
        const newParticles = [];
        const particleCount = 20;

        // Sparks/Debris
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 5;
            newParticles.push({
                id: Math.random(),
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color: color || (Math.random() > 0.5 ? '#a855f7' : '#22c55e'), // Purple or Green
                size: Math.random() * 4 + 2
            });
        }

        // Shockwave
        /* We can simulate a shockwave by adding a special 'particle' that grows */
        newParticles.push({
            id: Math.random() + '_shock',
            x, y,
            type: 'shockwave',
            life: 1.0,
            size: 10,
            color: 'white'
        });

        setParticles(prev => [...prev, ...newParticles]);
    };

    const spawnBubble = useCallback(() => {
        if (allPairs.length === 0) return;

        // Pick random pair from allPairs
        const pair = allPairs[Math.floor(Math.random() * allPairs.length)];
        // Create distinct objects for Q and A with linking ID
        const pairId = Date.now() + Math.random();

        // Spawn Q
        const qBubble = {
            id: pairId + '_q',
            pairId: pairId,
            text: pair.q,
            type: 'question',
            x: Math.random() * (window.innerWidth - 150),
            y: Math.random() * (window.innerHeight - 300) + 100,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: 60,
            color: 'border-purple-500 bg-purple-900/40 text-purple-100',
        };

        // Spawn A
        const aBubble = {
            id: pairId + '_a',
            pairId: pairId,
            text: pair.a,
            type: 'answer',
            x: Math.random() * (window.innerWidth - 150),
            y: Math.random() * (window.innerHeight - 300) + 100,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: 50,
            color: 'border-green-500 bg-green-900/40 text-green-100',
        };

        setBubbles(prev => [...prev, qBubble, aBubble]);
        playSfx('spawn');
    }, [allPairs, playSfx]);

    const updatePhysics = useCallback(() => {
        // 1. Update Bubbles
        setBubbles(prev => {
            return prev.map(b => {
                if (dragRef.current && dragRef.current.id === b.id) return b;

                let { x, y, vx, vy, radius } = b;
                x += vx;
                y += vy;

                if (x <= 0 || x + radius * 2 >= window.innerWidth) vx = -vx;
                if (y <= 64 || y + radius * 2 >= window.innerHeight) vy = -vy;

                if (x < 0) x = 0;
                if (x > window.innerWidth - radius * 2) x = window.innerWidth - radius * 2;
                if (y < 64) y = 64;
                if (y > window.innerHeight - radius * 2) y = window.innerHeight - radius * 2;

                return { ...b, x, y, vx, vy };
            });
        });

        // 2. Update Particles
        setParticles(prev => {
            if (prev.length === 0) return prev;

            return prev
                .map(p => {
                    if (p.type === 'shockwave') {
                        return {
                            ...p,
                            size: p.size + 15, // Expand fast
                            life: p.life - 0.05
                        };
                    }

                    return {
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        vy: p.vy + 0.2, // Gravity
                        life: p.life - 0.02
                    };
                })
                .filter(p => p.life > 0);
        });

        requestRef.current = requestAnimationFrame(updatePhysics);
    }, []);

    // --- GAME LOGIC ---

    const startGame = () => {
        setGameState('playing');
        setBubbles([]);
        setParticles([]); // Clear fx
        setScore(0);
        setLives(5);
        setCombo(0);
        setLevel(1);

        // Initial Spawn Delay to avoid instant noise
        setTimeout(() => {
            for (let i = 0; i < 3; i++) spawnBubble();
        }, 100);

        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    // Periodic Spawner
    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                if (bubbles.length < 10 + level * 2) {
                    spawnBubble();
                }
            }, 4000 - Math.min(level * 300, 3000)); // Spawn faster as levels go up
        }
        return () => clearInterval(interval);
    }, [gameState, level, bubbles.length, spawnBubble]);

    // Clean up animation frame
    useEffect(() => {
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // --- INTERACTIONS ---

    const handlePointerDown = (e, bubbleId) => {
        // Only Laptops/Desktops usually, but works for touch if standard events
        const bubble = bubbles.find(b => b.id === bubbleId);
        if (bubble) {
            dragRef.current = {
                id: bubbleId,
                startX: e.clientX - bubble.x,
                startY: e.clientY - bubble.y
            };
        }
    };

    const handlePointerMove = (e) => {
        if (dragRef.current) {
            const { id, startX, startY } = dragRef.current;
            setBubbles(prev => prev.map(b => {
                if (b.id === id) {
                    return { ...b, x: e.clientX - startX, y: e.clientY - startY, vx: 0, vy: 0 };
                }
                return b;
            }));
        }
    };

    const handlePointerUp = (e) => {
        if (dragRef.current) {
            const draggedId = dragRef.current.id;
            const draggedBubble = bubbles.find(b => b.id === draggedId);
            dragRef.current = null;

            if (draggedBubble) {
                // Check collision with other bubbles
                checkMerge(draggedBubble);
            }
        }
    };

    const checkMerge = (dragged) => {
        const center1 = { x: dragged.x + dragged.radius, y: dragged.y + dragged.radius };

        // Find closest intersecting bubble
        const target = bubbles.find(b => {
            if (b.id === dragged.id) return false;
            const center2 = { x: b.x + b.radius, y: b.y + b.radius };
            const dist = Math.hypot(center1.x - center2.x, center1.y - center2.y);
            return dist < (dragged.radius + b.radius);
        });

        if (target) {
            // Collision!
            if (target.pairId === dragged.pairId && target.type !== dragged.type) {
                // MATCH!
                handleMatch(dragged, target);
            } else {
                // MISMATCH - Push away slightly? Or penalty?
                // Only penalty if types are opposite (Q vs A) but wrong pair
                if (target.type !== dragged.type) {
                    handleMismatch(dragged); // Pass dragged for location
                }
            }
        }
    };

    const handleMatch = (b1, b2) => {
        const midX = (b1.x + b2.x) / 2 + b1.radius;
        const midY = (b1.y + b2.y) / 2 + b1.radius;

        setBubbles(prev => prev.filter(b => b.id !== b1.id && b.id !== b2.id));
        setScore(prev => prev + 100 + (combo * 20));
        setCombo(prev => prev + 1);

        if ((score + 100) > level * 500) {
            setLevel(prev => prev + 1);
            playSfx('levelUp');
        } else {
            playSfx('match');
        }

        createExplosion(midX, midY, '#ffd700'); // Gold explosion
    };

    const handleMismatch = (bubble) => {
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setGameState('gameover');
            return newLives;
        });
        setCombo(0);
        playSfx('error');
        // Red explosion on mismatch?
        if (bubble) {
            createExplosion(bubble.x + bubble.radius, bubble.y + bubble.radius, '#ef4444');
        }
    };


    // --- RENDERING ---

    if (gameState === 'menu') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-text overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

                <div className="z-10 text-center max-w-lg p-8 terminal-card border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                    <FaRocket className="text-6xl text-purple-400 mx-auto mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">NEON LINK</h1>
                    <p className="text-xl text-terminal-text/60 mb-2">Spojuj bubliny. Přežij. Získej Dopamin.</p>
                    {allPairs.length > 0 ? (
                        <p className="text-xs text-terminal-text/40 mb-8">Nalezeno {allPairs.length} herních dvojic</p>
                    ) : (
                        <p className="text-xs text-red-400 mb-8">⚠️ Nenalezena žádná data metodou compactContent. Hra použije záložní režim (Demo).</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-left text-sm mb-8 bg-black/20 p-4 rounded">
                        <div>
                            <span className="text-purple-400 font-bold">OTÁZKA</span>
                            <div className="w-8 h-8 rounded-full border border-purple-500 bg-purple-900/50 mt-1"></div>
                        </div>
                        <div className="text-right">
                            <span className="text-green-400 font-bold">ODPOVĚĎ</span>
                            <div className="w-6 h-6 rounded-full border border-green-500 bg-green-900/50 mt-1 ml-auto"></div>
                        </div>
                        <div className="col-span-2 text-center text-gray-400 mt-2">
                            Chytni bublinu a hoď ju na správnou dvojici!
                        </div>
                    </div>

                    <button
                        onClick={startGame}
                        className="w-full py-4 text-xl font-bold bg-purple-600 hover:bg-purple-500 text-white rounded transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
                    >
                        PLAY
                    </button>

                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="mt-4 text-terminal-text/40 hover:text-white flex items-center gap-2 justify-center mx-auto text-sm"
                    >
                        {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />} Zvuky: {soundEnabled ? 'ZAP' : 'VYP'}
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-text">
                <div className="text-center terminal-card p-10 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                    <FaSkull className="text-6xl text-red-500 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
                    <div className="text-6xl font-mono font-bold text-white my-6">{score}</div>

                    <div className="flex justify-center gap-4 mb-8">
                        <div className="text-center">
                            <div className="text-sm text-gray-500">COMBO</div>
                            <div className="text-xl text-yellow-500 font-bold">{combo}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500">LEVEL</div>
                            <div className="text-xl text-blue-500 font-bold">{level}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setGameState('menu')}
                        className="px-8 py-3 bg-terminal-accent/10 border border-terminal-accent/50 hover:bg-terminal-accent/20 text-terminal-accent rounded flex items-center gap-2 mx-auto"
                    >
                        <FaRedo /> Zpět do menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-terminal-bg overflow-hidden touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* HUD */}
            <div className="absolute top-20 left-4 right-4 flex justify-between items-start pointer-events-none select-none z-50">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-red-500 text-2xl">
                        {[...Array(lives)].map((_, i) => <FaHeart key={i} />)}
                    </div>
                    <div className="text-blue-400 text-sm mt-1 font-mono">LEVEL {level}</div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-4xl font-bold text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {score}
                    </div>
                    {combo > 1 && (
                        <div className="text-yellow-400 font-bold text-xl animate-bounce">
                            {combo}x COMBO
                        </div>
                    )}
                </div>
            </div>

            {/* PARTICLES LAYER (Behind bubbles or on top? On top usually looks better for sparks) */}
            {particles.map(p => {
                if (p.type === 'shockwave') {
                    return (
                        <div
                            key={p.id}
                            className="absolute rounded-full border-2 border-white pointer-events-none"
                            style={{
                                left: p.x - p.size / 2,
                                top: p.y - p.size / 2,
                                width: p.size,
                                height: p.size,
                                opacity: p.life,
                                zIndex: 5
                            }}
                        />
                    );
                }
                return (
                    <div
                        key={p.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: p.x,
                            top: p.y,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            opacity: p.life,
                            zIndex: 20
                        }}
                    />
                );
            })}

            {/* BUBBLES AREA */}
            {bubbles.map(bubble => (
                <div
                    key={bubble.id}
                    onPointerDown={(e) => handlePointerDown(e, bubble.id)}
                    className={`absolute rounded-full flex items-center justify-center text-center p-4 cursor-grab active:cursor-grabbing select-none transition-transform hover:scale-105 shadow-lg backdrop-blur-sm border-2 ${bubble.color}`}
                    style={{
                        left: bubble.x,
                        top: bubble.y,
                        width: bubble.radius * 2,
                        height: bubble.radius * 2,
                        fontSize: bubble.type === 'question' ? '0.85rem' : '0.75rem',
                        lineHeight: '1.2',
                        zIndex: dragRef.current?.id === bubble.id ? 100 : 10,
                        boxShadow: dragRef.current?.id === bubble.id ? '0 0 20px rgba(255,255,255,0.3)' : '',
                        transform: dragRef.current?.id === bubble.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                >
                    {bubble.text}
                </div>
            ))}

            <div className="absolute bottom-4 left-0 w-full text-center text-terminal-text/20 text-xs pointer-events-none">
                Spojuj pojmy s definicemi • Databáze: {allPairs.length} párů
            </div>
        </div>
    );
};

export default DopaminePage;
