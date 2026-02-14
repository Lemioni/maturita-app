import React, { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ExperimentalContext = createContext();

export const useExperimental = () => {
    return useContext(ExperimentalContext);
};

export const ExperimentalProvider = ({ children }) => {
    // Persist experimental settings
    const [highlighterActive, setHighlighterActive] = useLocalStorage('exp-highlighter', false);
    const [frutigerAero, setFrutigerAero] = useLocalStorage('exp-frutiger-aero', false);

    const toggleHighlighter = () => {
        setHighlighterActive(prev => !prev);
    };

    const toggleFrutigerAero = () => {
        setFrutigerAero(prev => !prev);
    };

    // Apply/remove the frutiger-aero class on <html> element
    useEffect(() => {
        const root = document.documentElement;
        if (frutigerAero) {
            root.classList.add('frutiger-aero');
        } else {
            root.classList.remove('frutiger-aero');
        }
    }, [frutigerAero]);

    const value = {
        highlighterActive,
        toggleHighlighter,
        frutigerAero,
        toggleFrutigerAero,
    };

    return (
        <ExperimentalContext.Provider value={value}>
            <div className={highlighterActive ? 'experimental-highlighter-active' : ''}>
                {children}
            </div>
        </ExperimentalContext.Provider>
    );
};

export default ExperimentalContext;
