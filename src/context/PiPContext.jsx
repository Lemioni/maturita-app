// Lazy-load the module components (only fetched when PiP is actually opened)
import React, { createContext, useContext, useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';

const PiPContext = createContext();
export const usePiP = () => useContext(PiPContext);

// Modules available in PiP
export const PIP_MODULES = {
    flashcards: { id: 'flashcards', label: 'Kartičky', icon: '🧠', desc: 'SRS Flashcards' },
    quiz: { id: 'quiz', label: 'Kvíz', icon: '❓', desc: 'Mini Quiz' },
    autoscroll: { id: 'autoscroll', label: 'Čtení', icon: '📜', desc: 'Autoscroll' },
    podcast: { id: 'podcast', label: 'Podcast', icon: '🎧', desc: 'Podcast' },
    exam: { id: 'exam', label: 'ZKŠK', icon: '🎲', desc: 'Zkouška' },
};

export const PiPProvider = ({ children }) => {
    const [isPiPOpen, setIsPiPOpen] = useState(false);
    const [activeModule, setActiveModule] = useState(null);
    const [pipWindow, setPipWindow] = useState(null);
    const [pipContainer, setPipContainer] = useState(null);
    const pipWindowRef = useRef(null);

    const isSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

    // Copy all stylesheets from main document into PiP window
    const injectStyles = useCallback((pipDoc) => {
        // Copy link stylesheets
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => {
            pipDoc.head.appendChild(el.cloneNode(true));
        });

        // Add PiP-specific base styles
        const pipStyle = pipDoc.createElement('style');
        pipStyle.textContent = `
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
                background: #0a0a0f;
                color: #e0e0e0;
                overflow-x: hidden;
                min-height: 100vh;
            }
            #pip-root { min-height: 100vh; display: flex; flex-direction: column; }
            button { cursor: pointer; }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 4px; }
        `;
        pipDoc.head.appendChild(pipStyle);
    }, []);

    const openPiP = useCallback(async (moduleId) => {
        if (!isSupported) return;

        // Close existing PiP if open
        if (pipWindowRef.current) {
            pipWindowRef.current.close();
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 420,
                height: 520,
            });

            pipWindowRef.current = pip;
            setPipWindow(pip);

            // Inject styles
            injectStyles(pip.document);

            // Create root container
            const container = pip.document.createElement('div');
            container.id = 'pip-root';
            pip.document.body.appendChild(container);
            setPipContainer(container);

            setActiveModule(moduleId);
            setIsPiPOpen(true);

            // Handle window close
            pip.addEventListener('pagehide', () => {
                pipWindowRef.current = null;
                setPipWindow(null);
                setPipContainer(null);
                setActiveModule(null);
                setIsPiPOpen(false);
            });
        } catch (err) {
            console.error('Failed to open PiP window:', err);
        }
    }, [isSupported, injectStyles]);

    const closePiP = useCallback(() => {
        if (pipWindowRef.current) {
            pipWindowRef.current.close();
        }
        pipWindowRef.current = null;
        setPipWindow(null);
        setPipContainer(null);
        setActiveModule(null);
        setIsPiPOpen(false);
    }, []);

    const switchModule = useCallback((moduleId) => {
        setActiveModule(moduleId);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pipWindowRef.current) {
                pipWindowRef.current.close();
            }
        };
    }, []);

    const value = {
        isSupported,
        isPiPOpen,
        activeModule,
        pipWindow,
        openPiP,
        closePiP,
        switchModule,
    };

    return (
        <PiPContext.Provider value={value}>
            {children}
            {/* Portal into PiP window */}
            {isPiPOpen && pipContainer && activeModule && (
                <PiPPortal container={pipContainer} moduleId={activeModule} switchModule={switchModule} closePiP={closePiP} />
            )}
        </PiPContext.Provider>
    );
};

// Lazy-load the module components — only fetched when PiP is opened
const PiPFlashcards = lazy(() => import('../components/pip/PiPFlashcards'));
const PiPQuiz = lazy(() => import('../components/pip/PiPQuiz'));
const PiPAutoscroll = lazy(() => import('../components/pip/PiPAutoscroll'));
const PiPPodcast = lazy(() => import('../components/pip/PiPPodcast'));
const PiPExam = lazy(() => import('../components/pip/PiPExam'));

const MODULE_COMPONENTS = {
    flashcards: PiPFlashcards,
    quiz: PiPQuiz,
    autoscroll: PiPAutoscroll,
    podcast: PiPPodcast,
    exam: PiPExam,
};

const PiPPortal = ({ container, moduleId, switchModule, closePiP }) => {
    const ModuleComponent = MODULE_COMPONENTS[moduleId];
    const activeMod = PIP_MODULES[moduleId];

    return createPortal(
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f' }}>
            {/* Top header — minimal, shows current module */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 14px', background: 'linear-gradient(180deg, rgba(20,20,35,0.98) 0%, rgba(12,12,20,0.95) 100%)',
                borderBottom: '1px solid rgba(139,92,246,0.12)', flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{activeMod?.icon}</span>
                    <span style={{
                        fontSize: '13px', fontWeight: '600', color: '#a78bfa',
                        letterSpacing: '0.5px',
                    }}>{activeMod?.label}</span>
                    <span style={{
                        fontSize: '9px', color: 'rgba(224,224,224,0.3)', background: 'rgba(139,92,246,0.08)',
                        padding: '2px 6px', borderRadius: '8px', letterSpacing: '0.5px',
                    }}>PiP</span>
                </div>
            </div>

            {/* Module content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '12px', paddingBottom: '60px' }}>
                <Suspense fallback={<p style={{ color: '#a78bfa', textAlign: 'center', marginTop: '40px' }}>Načítání...</p>}>
                    {ModuleComponent ? <ModuleComponent /> : <p>Module not found</p>}
                </Suspense>
            </div>

            {/* Bottom navigation bar — sleek icon-based */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                padding: '6px 4px 8px',
                background: 'linear-gradient(180deg, rgba(15,15,25,0.95) 0%, rgba(8,8,15,0.98) 100%)',
                borderTop: '1px solid rgba(139,92,246,0.1)',
                backdropFilter: 'blur(12px)',
                flexShrink: 0,
            }}>
                {Object.values(PIP_MODULES).map(mod => {
                    const isActive = mod.id === moduleId;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => switchModule(mod.id)}
                            title={mod.label}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '3px', padding: '4px 8px', border: 'none', borderRadius: '8px',
                                background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                                cursor: 'pointer', transition: 'all 0.2s ease',
                                position: 'relative', minWidth: '48px',
                            }}
                        >
                            {/* Active glow dot */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)',
                                    width: '16px', height: '3px', borderRadius: '2px',
                                    background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                                    boxShadow: '0 0 8px rgba(139,92,246,0.6)',
                                }} />
                            )}
                            <span style={{
                                fontSize: '18px',
                                filter: isActive ? 'drop-shadow(0 0 4px rgba(139,92,246,0.5))' : 'none',
                                transition: 'filter 0.2s',
                            }}>{mod.icon}</span>
                            <span style={{
                                fontSize: '9px', fontWeight: isActive ? '700' : '400',
                                color: isActive ? '#a78bfa' : 'rgba(224,224,224,0.35)',
                                letterSpacing: '0.3px',
                                transition: 'color 0.2s',
                            }}>{mod.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>,
        container
    );
};

export default PiPContext;
