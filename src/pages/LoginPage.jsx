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
        <div className="max-w-md mx-auto px-4 pt-6 pb-20">
            <div className="terminal-card">
                <div className="text-center mb-5">
                    <h1 className="font-mono text-2xl font-bold tracking-wide text-terminal-accent">Účet</h1>
                    <p className="font-mono text-xs mt-1 text-terminal-text/50">
                        {user ? 'Správa profilu a synchronizace' : 'Přihlášení pro synchronizaci mezi zařízeními'}
                    </p>
                </div>

                {!isConfigured && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-mono text-xs text-yellow-400">
                                    Přihlášení není dostupné — Firebase konfigurace chybí.
                                </p>
                                <p className="font-mono text-[10px] text-terminal-text/50 mt-1">
                                    Data zůstanou uložená pouze lokálně.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!user ? (
                    <div className="space-y-4">
                        <button
                            onClick={handleSignIn}
                            disabled={signingIn || !isConfigured}
                            className="w-full py-3 bg-terminal-accent text-terminal-bg rounded-lg font-mono text-sm font-bold
                                hover:bg-terminal-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2"
                        >
                            {signingIn ? <FaSync className="animate-spin" /> : <FaGoogle />}
                            {signingIn ? 'Přihlašování...' : 'Přihlásit přes Google'}
                        </button>

                        <button
                            onClick={handleContinueWithoutLogin}
                            className="w-full py-2 px-4 rounded-lg border border-terminal-accent/20 text-terminal-text/70
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

                        <div className="font-mono text-[10px] text-center text-terminal-text/40">
                            Bez přihlášení zůstanou data jen v tomto zařízení.
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt=""
                                    className="w-12 h-12 rounded-full border border-terminal-accent/40"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-mono
                                    bg-terminal-card border border-terminal-accent/40 text-terminal-accent">
                                    {user.displayName?.[0] || '?'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-mono text-sm font-bold truncate text-terminal-accent">
                                    {user.displayName || 'Anonym'}
                                </p>
                                <p className="font-mono text-[10px] truncate text-terminal-text/60">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg px-4 py-3 bg-terminal-card border border-terminal-border">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-terminal-text/60">Synchronizace</span>
                                <div className="flex items-center gap-2">
                                    {syncIcon()}
                                    <span className={`font-mono text-[10px] ${
                                        syncStatus === 'synced' ? 'text-green-400' :
                                        syncStatus === 'syncing' ? 'text-yellow-400' :
                                        syncStatus === 'error' ? 'text-red-400' :
                                        'text-terminal-text/40'
                                    }`}>
                                        {syncStatus === 'synced' ? 'Hotovo' :
                                            syncStatus === 'syncing' ? 'Probíhá...' :
                                            syncStatus === 'error' ? 'Chyba' :
                                                syncStatus === 'offline' ? 'Offline' : 'Nečinné'}
                                    </span>
                                </div>
                            </div>
                            {lastSyncTime && (
                                <p className="font-mono text-[9px] mt-1 text-terminal-text/40">
                                    Naposledy: {lastSyncTime.toLocaleTimeString('cs-CZ')}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <p className="font-mono text-[10px] tracking-wider uppercase text-terminal-text/60">
                                Co se synchronizuje:
                            </p>
                            {[
                                'Plánovač studia',
                                'Postup v otázkách',
                                'Flashcards a streak',
                            ].map(item => (
                                <div key={item} className="font-mono text-[10px] flex items-center gap-2 text-green-400/80">
                                    <span>✓</span> <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full py-2.5 border border-terminal-border/30 rounded-lg text-terminal-text/70
                                hover:border-terminal-accent/40 hover:text-terminal-accent transition-all
                                flex items-center justify-center gap-2 font-mono text-xs"
                        >
                            <FaSignOutAlt /> Odhlásit se
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
