import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaSignOutAlt, FaSync, FaCheck, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

// Map Firebase error codes to user-friendly Czech messages
const getErrorMessage = (errorCode) => {
    const errorMap = {
        'auth/api-key-not-valid': 'Přihlášení není k dispozici.',
        'auth/popup-closed-by-user': 'Přihlášení bylo zrušeno.',
        'auth/network-request-failed': 'Chyba sítě. Zkontrolujte připojení.',
        'auth/unauthorized-domain': 'Tato doména není autorizována pro přihlášení.',
        'auth/cancelled-popup-request': 'Přihlášení bylo přerušeno.',
        'auth/operation-not-allowed': 'Tato přihlašovací metoda není povolena.',
    };
    return errorMap[errorCode] || 'Nastala neočekávaná chyba. Zkuste to znovu.';
};

const LoginPage = () => {
    const { user, signInWithGoogle, signOut, loading, isConfigured } = useAuth();
    const { syncStatus, lastSyncTime } = useSync();
    const [error, setError] = useState(null);
    const [signingIn, setSigningIn] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            setSigningIn(true);
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            // Use user-friendly message if it's a known Firebase error
            const message = err.code ? getErrorMessage(err.code) : (err.message || 'Přihlášení selhalo');
            setError(message);
        } finally {
            setSigningIn(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const handleContinueWithoutLogin = () => {
        navigate('/');
    };

    const syncIcon = () => {
        switch (syncStatus) {
            case 'syncing': return <FaSync className="animate-spin text-yellow-400" />;
            case 'synced': return <FaCheck className="text-green-400" />;
            case 'error': return <FaExclamationTriangle className="text-red-400" />;
            case 'offline': return <FaExclamationTriangle className="text-terminal-text/30" />;
            default: return <FaSync className="text-terminal-text/30" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-terminal-accent font-mono animate-pulse text-lg">Načítání...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] relative overflow-hidden">
            {/* Balatro wavy background - toned down */}
            <div className="balatro-bg" />

            {/* Dark overlay for terminal feel */}
            <div className="terminal-overlay" />

            {/* CRT scanlines overlay - more subtle */}
            <div className="scanlines" />

            {/* Main card */}
            <div className="balatro-card relative z-10 w-full max-w-md mx-4">
                {/* Card inner glow border */}
                <div className="balatro-card-inner">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-2">🃏</div>
                        <h1 className="font-mono text-2xl font-bold tracking-wider text-terminal-accent">
                            MATURITA
                        </h1>
                        <div className="font-mono text-xs tracking-[0.3em] mt-1 text-terminal-text/60">
                            {user ? 'PROFILE' : 'SIGN IN'}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="balatro-divider" />

                    {/* Warning banner when Firebase is not configured */}
                    {!isConfigured && (
                        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                            <div className="flex items-start gap-2">
                                <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-mono text-xs text-yellow-400">
                                        Přihlášení není dostupné — Firebase konfigurace chybí.
                                    </p>
                                    <p className="font-mono text-[10px] text-terminal-text/50 mt-1">
                                        Data zůstanou uložena pouze lokálně.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!user ? (
                        /* ── LOGGED OUT STATE ── */
                        <div className="space-y-5 mt-6">
                            <p className="font-mono text-xs text-center leading-relaxed text-terminal-text/60">
                                Přihlas se pro synchronizaci dat<br />
                                mezi všemi zařízeními.
                            </p>

                            {/* Google Sign-in button — Balatro arcade style */}
                            <button
                                onClick={handleSignIn}
                                disabled={signingIn || !isConfigured}
                                className="balatro-btn w-full group"
                            >
                                <div className="balatro-btn-inner flex items-center justify-center gap-3">
                                    {signingIn ? (
                                        <FaSync className="animate-spin" />
                                    ) : (
                                        <FaGoogle />
                                    )}
                                    <span className="font-mono font-bold tracking-wider text-sm">
                                        {signingIn ? 'CONNECTING...' : 'GOOGLE LOGIN'}
                                    </span>
                                </div>
                            </button>

                            {/* Continue without login button */}
                            <button
                                onClick={handleContinueWithoutLogin}
                                className="w-full py-2 px-4 rounded-lg border border-terminal-accent/20 text-terminal-text/60
                                         hover:bg-terminal-accent/5 hover:text-terminal-accent transition-all duration-200
                                         flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft className="text-xs" />
                                <span className="font-mono text-xs">Pokračovat bez přihlášení</span>
                            </button>

                            {error && (
                                <div className="font-mono text-xs text-center px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400">
                                    ⚠ {error}
                                </div>
                            )}

                            {/* Offline note */}
                            <div className="font-mono text-[10px] text-center text-terminal-text/40">
                                Bez přihlášení data zůstanou jen v tomto prohlížeči.
                            </div>
                        </div>
                    ) : (
                        /* ── LOGGED IN STATE ── */
                        <div className="space-y-5 mt-6">
                            {/* User info */}
                            <div className="flex items-center gap-4">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt=""
                                        className="w-14 h-14 rounded-full border-2 border-terminal-accent/50"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold font-mono
                                                  bg-terminal-card border-2 border-terminal-accent/50 text-terminal-accent">
                                        {user.displayName?.[0] || '?'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-mono text-sm font-bold truncate text-terminal-accent">
                                        {user.displayName || 'Anonym'}
                                    </p>
                                    <p className="font-mono text-[10px] truncate text-terminal-text/60">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Sync status card */}
                            <div className="rounded-lg px-4 py-3 bg-terminal-card border border-terminal-border">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-terminal-text/60">
                                        Synchronizace
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {syncIcon()}
                                        <span className={`font-mono text-[10px] ${
                                            syncStatus === 'synced' ? 'text-green-400' :
                                            syncStatus === 'syncing' ? 'text-yellow-400' :
                                            syncStatus === 'error' ? 'text-red-400' :
                                            syncStatus === 'offline' ? 'text-terminal-text/40' :
                                            'text-terminal-text/40'
                                        }`}>
                                            {syncStatus === 'synced' ? 'SYNCED' :
                                                syncStatus === 'syncing' ? 'SYNCING...' :
                                                syncStatus === 'error' ? 'ERROR' :
                                                syncStatus === 'offline' ? 'OFFLINE' : 'IDLE'}
                                        </span>
                                    </div>
                                </div>
                                {lastSyncTime && (
                                    <p className="font-mono text-[9px] mt-1 text-terminal-text/40">
                                        Naposledy: {lastSyncTime.toLocaleTimeString('cs-CZ')}
                                    </p>
                                )}
                            </div>

                            {/* What syncs */}
                            <div className="space-y-1.5">
                                <p className="font-mono text-[10px] tracking-wider uppercase text-terminal-text/60">
                                    Synchronizovaná data:
                                </p>
                                {[
                                    '📊 Scheduler priority & sessions',
                                    '🧠 SRS flashcard progress',
                                    '✅ Question progress & checkboxy',
                                    '🔥 Study streak',
                                ].map(item => (
                                    <div key={item} className="font-mono text-[10px] flex items-center gap-2 text-green-400/80">
                                        <span>✓</span> <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Sign out button */}
                            <button
                                onClick={handleSignOut}
                                className="balatro-btn-secondary w-full"
                            >
                                <div className="flex items-center justify-center gap-2 font-mono text-xs tracking-wider">
                                    <FaSignOutAlt /> ODHLÁSIT SE
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Balatro styles */}
            <style>{`
                .balatro-bg {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    background: 
                        radial-gradient(ellipse at 30% 20%, rgba(88,28,135,0.25) 0%, transparent 60%),
                        radial-gradient(ellipse at 70% 80%, rgba(30,58,138,0.25) 0%, transparent 60%),
                        radial-gradient(ellipse at 50% 50%, rgba(20,20,40,1) 0%, rgba(10,10,25,1) 100%);
                    animation: balatro-shift 12s ease-in-out infinite alternate;
                }
                @keyframes balatro-shift {
                    0% { filter: hue-rotate(0deg); }
                    50% { filter: hue-rotate(10deg); }
                    100% { filter: hue-rotate(-5deg); }
                }
                .terminal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1;
                    background: rgba(0,0,0,0.6);
                    pointer-events: none;
                }
                .scanlines {
                    position: fixed;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.04) 2px,
                        rgba(0,0,0,0.04) 4px
                    );
                }
                .balatro-card {
                    position: relative;
                }
                .balatro-card-inner {
                    background: linear-gradient(145deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.98) 100%);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow:
                        0 0 30px rgba(139,92,246,0.08),
                        0 0 60px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.05),
                        0 20px 60px -10px rgba(0,0,0,0.6);
                    backdrop-filter: blur(10px);
                }
                .balatro-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    margin: 0.5rem 0;
                }
                .balatro-btn {
                    position: relative;
                    border-radius: 12px;
                    padding: 2px;
                    background: linear-gradient(145deg, rgba(139,92,246,0.8), rgba(124,58,237,0.6));
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .balatro-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 20px rgba(139,92,246,0.25);
                }
                .balatro-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                .balatro-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    transform: none;
                }
                .balatro-btn-inner {
                    background: linear-gradient(145deg, rgba(30,30,45,0.95), rgba(20,20,35,0.98));
                    color: rgba(255,255,255,0.9);
                    border-radius: 10px;
                    padding: 0.75rem 1.5rem;
                }
                .balatro-btn-secondary {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 10px;
                    padding: 0.65rem 1.5rem;
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .balatro-btn-secondary:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.25);
                    color: rgba(255,255,255,0.8);
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
