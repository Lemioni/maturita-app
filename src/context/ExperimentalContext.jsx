import React, { createContext, useContext } from 'react';

const ExperimentalContext = createContext();

export const useExperimental = () => {
    return useContext(ExperimentalContext);
};

// Simplified — Frutiger Aero and highlighter features removed.
// Kept as a stub so existing consumers don't break.
const stubValue = {
    highlighterActive: false,
    toggleHighlighter: () => {},
    frutigerAero: false,
    toggleFrutigerAero: () => {},
};

export const ExperimentalProvider = ({ children }) => {
    return (
        <ExperimentalContext.Provider value={stubValue}>
            {children}
        </ExperimentalContext.Provider>
    );
};

export default ExperimentalContext;
