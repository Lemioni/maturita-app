import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ExperimentalContext = createContext();

export const useExperimental = () => {
    return useContext(ExperimentalContext);
};

export const ExperimentalProvider = ({ children }) => {
    // Persist experimental settings
    const [highlighterActive, setHighlighterActive] = useLocalStorage('exp-highlighter', false);

    const toggleHighlighter = () => {
        setHighlighterActive(prev => !prev);
    };

    const value = {
        highlighterActive,
        toggleHighlighter
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
