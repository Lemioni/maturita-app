import React, { useState, useRef, useEffect } from 'react';
import { usePiP, PIP_MODULES } from '../../context/PiPContext';

const PiPLauncher = () => {
    const { isSupported, isPiPOpen, openPiP, closePiP } = usePiP();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hidden, setHidden] = useState(false);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    if (!isSupported) return null;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    const handleModuleClick = (moduleId) => {
        openPiP(moduleId);
        setMenuOpen(false);
    };

    // Hidden state — show a tiny reveal tab
    if (hidden && !isPiPOpen) {
        return (
            <button
                onClick={() => setHidden(false)}
                style={{
                    position: 'fixed', bottom: isDesktop ? '8px' : '72px', left: '0px', zIndex: 25,
                    padding: '6px 8px 6px 4px', border: 'none',
                    borderRadius: '0 8px 8px 0',
                    background: 'rgba(139,92,246,0.15)',
                    color: 'rgba(139,92,246,0.5)',
                    fontSize: '12px', cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                }}
                title="Zobrazit Mini Player"
            >🚀</button>
        );
    }

    return (
        <div ref={menuRef} style={{
            position: 'fixed', bottom: isDesktop ? '12px' : '80px', left: '16px', zIndex: 25,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
        }}>
            {/* Module selector menu */}
            {menuOpen && !isPiPOpen && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(15,15,30,0.97) 0%, rgba(20,15,40,0.97) 100%)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: '16px', padding: '8px', backdropFilter: 'blur(20px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.03)',
                    minWidth: '200px',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '6px 10px 8px', marginBottom: '4px',
                        borderBottom: '1px solid rgba(139,92,246,0.08)',
                    }}>
                        <div style={{
                            fontSize: '11px', fontWeight: '700', color: '#a78bfa',
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                        }}>Mini Player</div>
                        <div style={{
                            fontSize: '10px', color: 'rgba(224,224,224,0.3)', marginTop: '2px',
                        }}>Studuj v plovoucím okně</div>
                    </div>

                    {/* Module options */}
                    {Object.values(PIP_MODULES).map(mod => {
                        const isHovered = hoveredItem === mod.id;
                        return (
                            <button
                                key={mod.id}
                                onClick={() => handleModuleClick(mod.id)}
                                onMouseEnter={() => setHoveredItem(mod.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    width: '100%', padding: '10px 12px', border: 'none', borderRadius: '10px',
                                    background: isHovered
                                        ? 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,60,200,0.1) 100%)'
                                        : 'transparent',
                                    color: isHovered ? '#c4b5fd' : '#e0e0e0',
                                    cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                                    transform: isHovered ? 'translateX(3px)' : 'none',
                                }}
                            >
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isHovered ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.06)',
                                    fontSize: '16px', transition: 'all 0.15s',
                                    boxShadow: isHovered ? '0 0 12px rgba(139,92,246,0.2)' : 'none',
                                }}>{mod.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '13px', fontWeight: '500', lineHeight: '1.2',
                                    }}>{mod.label}</div>
                                    <div style={{
                                        fontSize: '10px', color: 'rgba(224,224,224,0.35)', marginTop: '1px',
                                    }}>{mod.desc}</div>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: isHovered ? 'rgba(139,92,246,0.6)' : 'rgba(224,224,224,0.15)',
                                    transition: 'all 0.15s',
                                }}>→</div>
                            </button>
                        );
                    })}

                    {/* Hide button */}
                    <button
                        onClick={() => { setMenuOpen(false); setHidden(true); }}
                        style={{
                            width: '100%', padding: '8px', border: 'none', borderRadius: '8px',
                            background: 'transparent', color: 'rgba(224,224,224,0.25)',
                            fontSize: '10px', cursor: 'pointer', marginTop: '4px',
                            borderTop: '1px solid rgba(139,92,246,0.06)',
                            transition: 'all 0.15s',
                        }}
                    >Skrýt tlačítko</button>
                </div>
            )}

            {/* FAB button + hide option */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                    onClick={() => isPiPOpen ? closePiP() : setMenuOpen(!menuOpen)}
                    title={isPiPOpen ? 'Zavřít PiP' : 'Mini Player'}
                    style={{
                        width: '48px', height: '48px', borderRadius: '14px',
                        background: isPiPOpen
                            ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                            : menuOpen
                                ? 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)'
                                : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', color: '#fff', transition: 'all 0.2s ease',
                        boxShadow: isPiPOpen
                            ? '0 4px 20px rgba(239,68,68,0.4), 0 0 0 2px rgba(239,68,68,0.15)'
                            : '0 4px 20px rgba(139,92,246,0.35), 0 0 0 2px rgba(139,92,246,0.1)',
                        position: 'relative',
                        transform: menuOpen && !isPiPOpen ? 'rotate(45deg)' : 'none',
                    }}
                >
                    {isPiPOpen ? '✕' : '🚀'}
                    {isPiPOpen && (
                        <div style={{
                            position: 'absolute', top: '-2px', right: '-2px',
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: '#22c55e', border: '2px solid #0a0a0f',
                            boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                        }} />
                    )}
                </button>

                {/* Quick hide on long press / right click context */}
                {!isPiPOpen && !menuOpen && (
                    <button
                        onClick={() => setHidden(true)}
                        title="Skrýt"
                        style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            border: '1px solid rgba(139,92,246,0.1)', background: 'rgba(15,15,25,0.8)',
                            color: 'rgba(224,224,224,0.2)', fontSize: '10px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                    >✕</button>
                )}
            </div>
        </div>
    );
};

export default PiPLauncher;
