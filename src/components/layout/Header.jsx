import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaLayerGroup, FaChartLine, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import useLocalStorage from '../../hooks/useLocalStorage';

const Header = () => {
  const location = useLocation();
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
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [maturityDate]);

  const handleDateChange = (e) => {
    setMaturityDate(e.target.value);
    setIsEditing(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'HOME' },
    { path: '/it', icon: FaLaptopCode, label: 'IT' },
    { path: '/cj', icon: FaBook, label: 'CJ' },
    { path: '/search', icon: FaSearch, label: 'SRCH' },
  ];

  return (
    <header className="bg-terminal-bg border-b border-terminal-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-terminal-accent font-bold tracking-wider">
            &gt; MATURITA
          </Link>

          {/* Countdown - Center */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => !isEditing && setIsEditing(true)}
            title="Klikni pro změnu data"
          >
            <FaCalendarAlt className="text-terminal-border text-sm group-hover:text-terminal-accent transition-colors" />
            {isEditing ? (
              <input
                type="date"
                value={maturityDate}
                onChange={handleDateChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="bg-terminal-dim border border-terminal-border/50 px-2 py-0.5 text-xs rounded-sm focus:outline-none focus:border-terminal-accent w-28"
              />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-terminal-accent">{daysLeft > 0 ? daysLeft : 0}</span>
                <span className="text-xs text-terminal-text/60 hidden sm:inline">dní</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Icon only */}
          <nav className="hidden md:flex space-x-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`icon-btn ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <item.icon className="text-lg" />
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`icon-btn ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <item.icon className="text-sm" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

