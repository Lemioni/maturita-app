import { useState } from 'react';

const KnowledgeCheckbox = ({ questionId, initialKnown = false, onChange }) => {
  const [known, setKnown] = useState(initialKnown);

  const handleClick = (newValue) => {
    setKnown(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* NEZNÁM - červený čtvereček */}
      <button
        onClick={() => handleClick(false)}
        className={`w-8 h-8 border-2 transition-all duration-200 ${
          !known
            ? 'border-terminal-red bg-terminal-red/20 shadow-glow-red'
            : 'border-terminal-text/20 bg-transparent hover:border-terminal-red/50'
        }`}
        aria-label="Neznám"
      >
        {!known && (
          <div className="w-full h-full bg-terminal-red/60" />
        )}
      </button>

      {/* ZNÁM - zelený čtvereček */}
      <button
        onClick={() => handleClick(true)}
        className={`w-8 h-8 border-2 transition-all duration-200 ${
          known
            ? 'border-terminal-green bg-terminal-green/20 shadow-glow-green'
            : 'border-terminal-text/20 bg-transparent hover:border-terminal-green/50'
        }`}
        aria-label="Znám"
      >
        {known && (
          <div className="w-full h-full bg-terminal-green/60" />
        )}
      </button>
    </div>
  );
};

export default KnowledgeCheckbox;
