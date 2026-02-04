
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaHeart, FaEye } from 'react-icons/fa';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const NotepadMode = ({ allPairs, onGameOver }) => {
    const containerRef = useRef(null);
    const [notes, setNotes] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [previewNote, setPreviewNote] = useState(null); // For long press modal

    // Initial Layout - Scatter random notes
    useEffect(() => {
        if (allPairs.length > 0) {
            const gamePairs = allPairs.slice(0, 5); // Start with 5 pairs (10 notes)
            const newNotes = [];

            gamePairs.forEach((pair, idx) => {
                newNotes.push({
                    id: `q_${idx}`,
                    text: pair.q,
                    type: 'question',
                    pairId: idx,
                    x: Math.random() * (window.innerWidth - 300) + 50,
                    y: Math.random() * (window.innerHeight - 300) + 150
                });
                newNotes.push({
                    id: `a_${idx}`,
                    text: pair.a,
                    type: 'answer',
                    pairId: idx,
                    x: Math.random() * (window.innerWidth - 300) + 50,
                    y: Math.random() * (window.innerHeight - 300) + 150
                });
            });
            setNotes(newNotes);
        }
    }, [allPairs]);

    // Setup GSAP Draggable
    useLayoutEffect(() => {
        if (notes.length === 0) return;

        const ctx = gsap.context(() => {
            Draggable.create(".note-card", {
                type: "x,y",
                bounds: containerRef.current,
                inertia: true,
                onDragStart: function () {
                    gsap.to(this.target, { scale: 1.1, zIndex: 100, boxShadow: "0 0 30px #facc15", duration: 0.2 });
                },
                onDragEnd: function () {
                    gsap.to(this.target, { scale: 1, zIndex: 1, boxShadow: "0 4px 6px rgba(0,0,0,0.3)", duration: 0.2 });
                    checkConnection(this.target);
                },
                onPress: function () {
                    // Potential for long press logic here if needed
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [notes]);

    const checkConnection = (targetInfo) => {
        const targetId = targetInfo.getAttribute('data-id');
        const targetPairId = parseInt(targetInfo.getAttribute('data-pair-id'));
        const targetRect = targetInfo.getBoundingClientRect();
        const targetCenter = { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 };

        // Find overlapping notes
        const overlapping = document.querySelectorAll('.note-card');
        let hit = null;

        overlapping.forEach(el => {
            if (el === targetInfo) return;

            const rect = el.getBoundingClientRect();
            // Simple AABB collision or distance check
            const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            const dist = Math.hypot(targetCenter.x - center.x, targetCenter.y - center.y);

            if (dist < 100) { // Threshold for "connection"
                hit = el;
            }
        });

        if (hit) {
            const hitPairId = parseInt(hit.getAttribute('data-pair-id'));

            if (targetPairId === hitPairId && targetInfo.getAttribute('data-type') !== hit.getAttribute('data-type')) {
                // Match!
                handleMatch(targetInfo, hit);
            } else {
                // Mistake
                handleMistake(targetInfo, hit);
            }
        }
    };

    const handleMatch = (el1, el2) => {
        // Animation
        const tl = gsap.timeline();
        tl.to([el1, el2], {
            scale: 0, opacity: 0, duration: 0.3, onComplete: () => {
                setNotes(prev => prev.filter(n => n.id !== el1.getAttribute('data-id') && n.id !== el2.getAttribute('data-id')));
                setScore(s => s + 100);

                // Check win/spawn new?
                if (notes.length <= 2) {
                    // Spawn more! logic would go here
                }
            }
        });
    };

    const handleMistake = (el1, el2) => {
        gsap.to([el1, el2], { x: "+=20", yoyo: true, repeat: 3, duration: 0.05, backgroundColor: "#ef4444" });
        gsap.to([el1, el2], { backgroundColor: "rgba(17, 24, 39, 0.8)", delay: 0.5 }); // reset color
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) onGameOver(score);
            return newLives;
        });
    };

    return (
        <div ref={containerRef} className="fixed inset-0 bg-gray-900 overflow-hidden">
            {/* HUD */}
            <div className="absolute top-20 left-4 right-4 flex justify-between items-start pointer-events-none select-none z-50">
                <div className="flex gap-1 text-red-500 text-2xl">
                    {[...Array(lives)].map((_, i) => <FaHeart key={i} />)}
                </div>
                <div className="text-4xl font-bold text-white font-mono">{score}</div>
            </div>

            {notes.map(note => (
                <div
                    key={note.id}
                    data-id={note.id}
                    data-pair-id={note.pairId}
                    data-type={note.type}
                    className={`note-card absolute w-64 p-4 rounded-lg border-l-4 cursor-grab active:cursor-grabbing backdrop-blur-md shadow-lg
                        ${note.type === 'question' ? 'bg-gray-800/90 border-cyan-500' : 'bg-gray-800/90 border-orange-500'}
                    `}
                    style={{ left: note.x, top: note.y }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold uppercase ${note.type === 'question' ? 'text-cyan-400' : 'text-orange-400'}`}>
                            {note.type === 'question' ? 'TERM' : 'DEF'}
                        </span>
                        <button
                            onPointerDown={(e) => { e.stopPropagation(); setPreviewNote(note); }}
                            className="text-gray-500 hover:text-white"
                        >
                            <FaEye />
                        </button>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-4 leading-relaxed pointer-events-none select-none">
                        {note.text}
                    </p>
                </div>
            ))}

            {/* Preview Modal for Long Text */}
            {previewNote && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-8 animte-fadeIn" onClick={() => setPreviewNote(null)}>
                    <div className="bg-gray-800 border-2 border-purple-500 p-8 rounded-xl max-w-2xl shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                        <h3 className="text-xl text-purple-400 font-bold mb-4 uppercase tracking-widest">Detail</h3>
                        <p className="text-xl text-white leading-relaxed">{previewNote.text}</p>
                        <p className="text-sm text-gray-500 mt-8 text-center">(Klikni kamkoliv pro zavření)</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotepadMode;
