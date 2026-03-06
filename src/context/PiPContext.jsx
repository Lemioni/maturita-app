import React, { createContext, useContext, useState, useCallback, useRef, useEffect, Component } from 'react';
import { createPortal } from 'react-dom';
import PiPFlashcards from '../components/pip/PiPFlashcards';
import PiPQuiz from '../components/pip/PiPQuiz';
import PiPAutoscroll from '../components/pip/PiPAutoscroll';
import PiPPodcast from '../components/pip/PiPPodcast';
import PiPExam from '../components/pip/PiPExam';

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
                font-family: Consolas, Monaco, 'Courier New', monospace;
                background: #0a0a0a;
                color: #e0e0e0;
                overflow-x: hidden;
                min-height: 100vh;
            }
            #pip-root { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
            button { cursor: pointer; font-family: inherit; }
            ::-webkit-scrollbar { width: 3px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.15); }
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

const MODULE_COMPONENTS = {
    flashcards: PiPFlashcards,
    quiz: PiPQuiz,
    autoscroll: PiPAutoscroll,
    podcast: PiPPodcast,
    exam: PiPExam,
};

// ── Error Boundary for PiP modules ──
class PiPErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#ff3333', marginBottom: '8px' }}>Chyba modulu</div>
                    <div style={{ fontSize: '10px', color: 'rgba(224,224,224,0.2)', marginBottom: '16px', lineHeight: '1.5' }}>
                        {this.state.error?.message || 'Neznámá chyba'}
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            padding: '6px 16px', background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(224,224,224,0.4)',
                            fontSize: '10px', cursor: 'pointer', borderRadius: '2px',
                        }}
                    >Zkusit znovu</button>
                </div>
            );
        }
        return this.props.children;
    }
}

const PiPPortal = ({ container, moduleId, switchModule, closePiP }) => {
    const ModuleComponent = MODULE_COMPONENTS[moduleId];
    const activeMod = PIP_MODULES[moduleId];

    return createPortal(
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            background: '#0a0a0a', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', padding: '8px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
            }}>
                <span style={{ fontSize: '13px', marginRight: '6px' }}>{activeMod?.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#e0e0e0', letterSpacing: '0.3px' }}>
                    {activeMod?.label}
                </span>
            </div>

            {/* Content */}
            <div style={{
                flex: 1, padding: '10px', paddingBottom: '48px',
                display: 'flex', flexDirection: 'column', minHeight: 0,
            }}>
                <PiPErrorBoundary key={moduleId}>
                    {ModuleComponent
                        ? <ModuleComponent />
                        : <p style={{ color: 'rgba(224,224,224,0.4)', fontSize: '11px' }}>Modul nenalezen</p>}
                </PiPErrorBoundary>
            </div>

            {/* Bottom nav — icons only, underline indicator */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                padding: '6px 0 8px', background: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                {Object.values(PIP_MODULES).map(mod => {
                    const active = mod.id === moduleId;
                    return (
                        <button key={mod.id} onClick={() => switchModule(mod.id)} title={mod.label}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                padding: '4px 12px', border: 'none', background: 'transparent',
                                cursor: 'pointer', position: 'relative',
                            }}
                        >
                            <span style={{
                                fontSize: '16px', opacity: active ? 1 : 0.3,
                                transition: 'opacity 0.15s',
                            }}>{mod.icon}</span>
                            {active && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '14px', height: '2px', background: '#8b5cf6',
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>,
        container
    );
};

export default PiPContext;
