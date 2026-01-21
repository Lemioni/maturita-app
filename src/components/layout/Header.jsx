import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaSearch } from 'react-icons/fa';
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
      setDaysLeft(days > 0 ? days : 0);
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
        <div className="flex items-center justify-between h-14 gap-3 relative">
          {/* Countdown - Left on mobile, Center on desktop */}
          <div
            className="cursor-pointer group md:absolute md:left-1/2 md:-translate-x-1/2"
            onClick={() => !isEditing && setIsEditing(true)}
            title="Klikni pro změnu data"
          >
            {isEditing ? (
              <input
                type="date"
                value={maturityDate}
                onChange={handleDateChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="bg-terminal-dim border border-purple-500/50 px-2 py-0.5 text-xs rounded-sm focus:outline-none focus:border-purple-400 w-28"
              />
            ) : (
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Main display */}
                <div className="relative flex items-baseline gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-950/50 to-fuchsia-950/50 border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 tabular-nums">
                    {daysLeft}
                  </span>
                  <span className="text-xs text-purple-300/70 font-medium">dní</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation - Right */}
          <nav className="md:hidden flex space-x-2 ml-auto">
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

          {/* Desktop Navigation - Right */}
          <nav className="hidden md:flex space-x-2 items-center ml-auto">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
