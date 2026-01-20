import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaSearch } from 'react-icons/fa';
import useLocalStorage from '../../hooks/useLocalStorage';

const Header = () => {
  const location = useLocation();
  const [maturityDate, setMaturityDate] = useLocalStorage('maturity-date', '2026-05-05');
  const [isEditing, setIsEditing] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [totalDays, setTotalDays] = useState(365); // Total days from start to maturita

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const target = new Date(maturityDate);
      const diff = target - today;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);

      // Calculate total days (assume started ~1 year before maturita)
      const startDate = new Date(target);
      startDate.setFullYear(startDate.getFullYear() - 1);
      const totalDiff = target - startDate;
      setTotalDays(Math.ceil(totalDiff / (1000 * 60 * 60 * 24)));
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

  // Calculate progress percentage (how much time has passed)
  const progressPercent = Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100));

  return (
    <header className="bg-terminal-bg border-b border-terminal-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Countdown XP Bar - Left side */}
          <div
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
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
              <div className="flex items-center gap-2">
                {/* Date */}
                <span className="text-xs text-terminal-text/50 hidden sm:inline">
                  {new Date(maturityDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
                </span>

                {/* Minecraft XP Bar */}
                <div className="relative">
                  {/* Bar background */}
                  <div className="w-20 sm:w-32 h-2.5 bg-gray-900 rounded-sm border border-purple-900/50 overflow-hidden">
                    {/* Bar fill - gradient purple like minecraft */}
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-400 transition-all duration-500 relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                  </div>

                  {/* Days number on top of bar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {daysLeft}
                    </span>
                  </div>
                </div>

                {/* "dní" label */}
                <span className="text-xs text-purple-400/70 hidden sm:inline">dní</span>
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
