import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaHeart, FaRocket, FaRedo, FaSkull, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { generateGameContent } from '../utils/gameContentFactory';

const DopaminePage = () => {
    const requestRef = useRef();
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

    // Interaction State
    const dragRef = useRef(null); // { id: number, startX: number, startY: number }
    const [connectingTargetId, setConnectingTargetId] = useState(null); // ID of magnet-locked bubble

    // Constants
    const REPULSION_FORCE = 0.5;
    const MAGNET_DISTANCE = 150; // Distance to trigger magnetic snap

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
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
            case 'error':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'spawn':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'magnet': // Connection sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'levelUp':
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(880, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            default: break;
        }
    }, [soundEnabled]);

    // --- VISUAL FX ---
    const createExplosion = (x, y, color) => {
        const newParticles = [];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 5;
            newParticles.push({
                id: Math.random(),
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color: color || '#a855f7',
                size: Math.random() * 4 + 2
            });
        }
        // Shockwave
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

        const pair = allPairs[Math.floor(Math.random() * allPairs.length)];
        const pairId = Date.now() + Math.random();

        const spawnX = Math.random() * (window.innerWidth - 200) + 100;
        const spawnY = Math.random() * (window.innerHeight - 300) + 150;

        const qBubble = {
            id: pairId + '_q',
            pairId: pairId,
            text: pair.q,
            type: 'question',
            x: spawnX - 60,
            y: spawnY,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 65,
            color: 'border-purple-500 bg-purple-900/40 text-purple-100',
        };

        const aBubble = {
            id: pairId + '_a',
            pairId: pairId,
            text: pair.a,
            type: 'answer',
            x: spawnX + 60,
            y: spawnY,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 55,
            color: 'border-green-500 bg-green-900/40 text-green-100',
        };

        setBubbles(prev => [...prev, qBubble, aBubble]);
        playSfx('spawn');
    }, [allPairs, playSfx]);

    // --- PHYSICS ENGINE ---
    const updatePhysics = useCallback(() => {
        setBubbles(prev => {
            const nextBubbles = prev.map(b => ({ ...b }));

            // 1. Apply Repulsion (Anti-collision)
            for (let i = 0; i < nextBubbles.length; i++) {
                for (let j = i + 1; j < nextBubbles.length; j++) {
                    const b1 = nextBubbles[i];
                    const b2 = nextBubbles[j];

                    // Skip physics for dragged bubble
                    if (dragRef.current && (dragRef.current.id === b1.id || dragRef.current.id === b2.id)) {
                        // continue; // Or implement simpler push-away
                    }

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = b1.radius + b2.radius + 10;

                    if (dist < minDist && dist > 0) {
                        const force = (minDist - dist) * REPULSION_FORCE;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;

                        if (!dragRef.current || dragRef.current.id !== b1.id) {
                            b1.vx -= fx * 0.1;
                            b1.vy -= fy * 0.1;
                        }
                        if (!dragRef.current || dragRef.current.id !== b2.id) {
                            b2.vx += fx * 0.1;
                            b2.vy += fy * 0.1;
                        }
                    }
                }
            }

            // 2. Move & Wall Bounce
            return nextBubbles.map(b => {
                if (dragRef.current && dragRef.current.id === b.id) return b;

                let { x, y, vx, vy, radius } = b;

                vx *= 0.98;
                vy *= 0.98;

                vx += (Math.random() - 0.5) * 0.05;
                vy += (Math.random() - 0.5) * 0.05;

                x += vx;
                y += vy;

                // Margins
                if (x <= radius) { x = radius; vx = Math.abs(vx) * 0.5; }
                if (x >= window.innerWidth - radius) { x = window.innerWidth - radius; vx = -Math.abs(vx) * 0.5; }
                if (y <= 80 + radius) { y = 80 + radius; vy = Math.abs(vy) * 0.5; }
                if (y >= window.innerHeight - radius) { y = window.innerHeight - radius; vy = -Math.abs(vy) * 0.5; }

                return { ...b, x, y, vx, vy };
            });
        });

        // 3. Update Particles
        setParticles(prev => prev.map(p => {
            if (p.type === 'shockwave') {
                return { ...p, size: p.size + 15, life: p.life - 0.05 };
            }
            return { ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.02 };
        }).filter(p => p.life > 0));

        requestRef.current = requestAnimationFrame(updatePhysics);
    }, []);

    // --- GAME LOGIC ---

    // Dynamic Spawner Loop
    useEffect(() => {
        let timeoutId;

        const scheduleNextSpawn = () => {
            if (gameState !== 'playing') return;

            const currentBubbleCount = bubbles.length;
            const delay = 500 + (currentBubbleCount * 400);
            const maxBubbles = 10 + (level * 2);

            if (currentBubbleCount < maxBubbles) {
                timeoutId = setTimeout(() => {
                    spawnBubble();
                    scheduleNextSpawn();
                }, delay);
            } else {
                timeoutId = setTimeout(scheduleNextSpawn, 1000);
            }
        };

        if (gameState === 'playing') {
            scheduleNextSpawn();
        }

        return () => clearTimeout(timeoutId);
    }, [gameState, bubbles.length, level, spawnBubble]);

    const startGame = () => {
        setGameState('playing');
        setBubbles([]);
        setParticles([]);
        setScore(0);
        setLives(5);
        setCombo(0);
        setLevel(1);
        spawnBubble();
        if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    useEffect(() => {
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // --- INTERACTIONS ---
    const handlePointerDown = (e, bubbleId) => {
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
        if (!dragRef.current) return;

        const { id, startX, startY } = dragRef.current;
        const draggedBubble = bubbles.find(b => b.id === id);
        if (!draggedBubble) return;

        const newX = e.clientX - startX;
        const newY = e.clientY - startY;

        setBubbles(prev => prev.map(b =>
            b.id === id ? { ...b, x: newX, y: newY, vx: 0, vy: 0 } : b
        ));

        // Magnetic Detection
        const center1 = { x: newX + draggedBubble.radius, y: newY + draggedBubble.radius };
        let foundTarget = null;
        let minDistanceFound = Infinity;

        for (const b of bubbles) {
            if (b.id === id) continue;

            // Allow connecting only different types (Q to A)
            if (b.type === draggedBubble.type) continue;

            const center2 = { x: b.x + b.radius, y: b.y + b.radius };
            const dist = Math.hypot(center1.x - center2.x, center1.y - center2.y);

            // Check within magnet range
            if (dist < MAGNET_DISTANCE + b.radius) {
                if (dist < minDistanceFound) {
                    minDistanceFound = dist;
                    foundTarget = b.id;
                }
            }
        }

        if (foundTarget !== connectingTargetId) {
            setConnectingTargetId(foundTarget);
            if (foundTarget) playSfx('magnet');
        }
    };

    const handlePointerUp = (e) => {
        if (dragRef.current) {
            const draggedId = dragRef.current.id;
            dragRef.current = null;

            // Attempt Merge if Magnet Locked
            if (connectingTargetId) {
                const b1 = bubbles.find(b => b.id === draggedId);
                const b2 = bubbles.find(b => b.id === connectingTargetId);

                if (b1 && b2) {
                    if (b1.pairId === b2.pairId) {
                        handleMatch(b1, b2);
                    } else {
                        handleMismatch(b1, b2);
                    }
                }
            }
            setConnectingTargetId(null);
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

        createExplosion(midX, midY, '#ffd700');
    };

    const handleMismatch = (b1, b2) => {
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setGameState('gameover');
            return newLives;
        });
        setCombo(0);
        playSfx('error');

        // Strong Repulsion Kick
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const angle = Math.atan2(dy, dx);
        const kick = 20;

        setBubbles(prev => prev.map(b => {
            // Push dragged one back
            if (b.id === b1.id) return { ...b, vx: -Math.cos(angle) * kick, vy: -Math.sin(angle) * kick };
            // Push target one away
            if (b.id === b2.id) return { ...b, vx: Math.cos(angle) * kick, vy: Math.sin(angle) * kick };
            return b;
        }));

        createExplosion(b1.x + b1.radius, b1.y + b1.radius, '#ef4444');
    };

    // Helper for Font Scaling
    const getFontSize = (text) => {
        if (text.length < 10) return '1.2rem';
        if (text.length < 30) return '1rem';
        if (text.length < 60) return '0.85rem';
        return '0.75rem';
    };

    if (gameState === 'menu') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-terminal-bg text-terminal-text relative overflow-hidden">
                <div className="z-10 text-center max-w-lg p-8 terminal-card border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                    <FaRocket className="text-6xl text-purple-400 mx-auto mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">NEON LINK</h1>
                    <p className="text-xl text-terminal-text/60 mb-2">Magneticky spojuj bubliny.</p>
                    <p className="text-sm text-terminal-text/40 mb-8">Přetáhni bublinu k její dvojici. Nemusíš se trefit přesně, magnet to zařídí.</p>

                    <button onClick={startGame} className="w-full py-4 text-xl font-bold bg-purple-600 hover:bg-purple-500 text-white rounded shadow-lg shadow-purple-500/30 mt-8">
                        PLAY
                    </button>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="mt-4 text-terminal-text/40 flex items-center gap-2 justify-center mx-auto text-sm">
                        {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
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
                    <button onClick={() => setGameState('menu')} className="px-8 py-3 bg-terminal-accent/10 border border-terminal-accent/50 hover:bg-terminal-accent/20 text-terminal-accent rounded flex items-center gap-2 mx-auto">
                        <FaRedo /> Zpět do menu
                    </button>
                </div>
            </div>
        );
    }

    // Prepare Connection Beam coords
    let beamCoords = null;
    if (dragRef.current && connectingTargetId) {
        const b1 = bubbles.find(b => b.id === dragRef.current.id);
        const b2 = bubbles.find(b => b.id === connectingTargetId);
        if (b1 && b2) {
            beamCoords = {
                x1: b1.x + b1.radius, y1: b1.y + b1.radius,
                x2: b2.x + b2.radius, y2: b2.y + b2.radius
            };
        }
    }

    return (
        <div
            className="fixed inset-0 bg-terminal-bg overflow-hidden touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {/* HUD */}
            <div className="absolute top-20 left-4 right-4 flex justify-between items-start pointer-events-none select-none z-50">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-red-500 text-2xl">
                        {[...Array(lives)].map((_, i) => <FaHeart key={i} />)}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-4xl font-bold text-white font-mono">{score}</div>
                </div>
            </div>

            {/* Neon Beam Layer (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                {beamCoords && (
                    <line
                        x1={beamCoords.x1} y1={beamCoords.y1}
                        x2={beamCoords.x2} y2={beamCoords.y2}
                        stroke="#facc15" strokeWidth="4" strokeDasharray="10,5"
                        className="animate-pulse"
                    />
                )}
            </svg>

            {/* Particles */}
            {particles.map(p => (
                <div key={p.id} className="absolute rounded-full pointer-events-none"
                    style={{
                        left: p.type === 'shockwave' ? p.x - p.size / 2 : p.x,
                        top: p.type === 'shockwave' ? p.y - p.size / 2 : p.y,
                        width: p.size, height: p.size,
                        backgroundColor: p.type === 'shockwave' ? 'transparent' : p.color,
                        border: p.type === 'shockwave' ? '2px solid white' : 'none',
                        opacity: p.life, zIndex: 15
                    }}
                />
            ))}

            {/* Bubbles */}
            {bubbles.map(bubble => {
                const isConnecting = connectingTargetId === bubble.id;
                const isDragging = dragRef.current?.id === bubble.id;

                return (
                    <div
                        key={bubble.id}
                        onPointerDown={(e) => handlePointerDown(e, bubble.id)}
                        className={`absolute rounded-full flex items-center justify-center text-center p-4 cursor-grab active:cursor-grabbing select-none transition-transform shadow-lg backdrop-blur-sm border-2 ${bubble.color} ${isConnecting ? 'ring-4 ring-yellow-400 scale-105 shadow-[0_0_30px_#facc15]' : ''}`}
                        style={{
                            left: bubble.x, top: bubble.y,
                            width: bubble.radius * 2, height: bubble.radius * 2,
                            fontSize: getFontSize(bubble.text),
                            zIndex: isDragging ? 100 : 10,
                            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: isConnecting ? '0 0 30px #facc15' : '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div className="line-clamp-4 overflow-hidden text-ellipsis px-1">
                            {bubble.text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DopaminePage;
