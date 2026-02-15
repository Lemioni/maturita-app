import { useState } from 'react';
import { useExperimental } from '../../context/ExperimentalContext';

const KnowledgeCheckbox = ({ questionId, initialKnown = false, onChange }) => {
  const [known, setKnown] = useState(initialKnown);
  const { frutigerAero } = useExperimental();

  const handleClick = (newValue) => {
    setKnown(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  if (frutigerAero) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => handleClick(!known)}
          title={known ? "Mark as Unknown" : "Mark as Known"}
          className="hover:scale-110 transition-transform"
        >
          {known ? (
            <img src="/aero-icons/vista_firewall_status_1.ico" alt="Known" className="w-6 h-6" />
          ) : (
            <img src="/aero-icons/vista_warning.ico" alt="Unknown" className="w-6 h-6 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* NEZNÁM - červený čtvereček */}
      <button
        onClick={() => handleClick(false)}
        className={`w-8 h-8 border-2 transition-all duration-200 ${!known
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
        className={`w-8 h-8 border-2 transition-all duration-200 ${known
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
