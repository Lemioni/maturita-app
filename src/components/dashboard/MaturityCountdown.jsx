import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import useLocalStorage from '../../hooks/useLocalStorage';

const MaturityCountdown = () => {
  const [maturityDate, setMaturityDate] = useLocalStorage('maturity-date', '2026-05-05');
  const [isEditing, setIsEditing] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const target = new Date(maturityDate);
      const diff = target - today;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [maturityDate]);

  const handleDateChange = (e) => {
    setMaturityDate(e.target.value);
    setIsEditing(false);
  };

  return (
    <div className="terminal-card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FaCalendarAlt className="text-terminal-border text-2xl" />
        <div>
          <div className="text-3xl font-bold text-terminal-green">
            {daysLeft > 0 ? daysLeft : 0}
          </div>
          <div className="text-xs text-terminal-text/60">DNÍ DO MATURITY</div>
        </div>
      </div>

      {isEditing ? (
        <input
          type="date"
          value={maturityDate}
          onChange={handleDateChange}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="bg-terminal-dim border border-terminal-border/50 px-2 py-1 text-sm rounded-sm focus:outline-none focus:border-terminal-border"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="icon-btn text-xs"
          title="Změnit datum"
        >
          {new Date(maturityDate).toLocaleDateString('cs-CZ')}
        </button>
      )}
    </div>
  );
};

export default MaturityCountdown;
