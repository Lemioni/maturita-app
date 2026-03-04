import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaSearch, FaFire, FaDice, FaScroll, FaBookOpen, FaCalendarAlt, FaFileAlt, FaUser } from 'react-icons/fa';
import useLocalStorage from '../../hooks/useLocalStorage';
import useStreak from '../../hooks/useStreak';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';

const Header = () => {
  const location = useLocation();
  const [maturityDate, setMaturityDate] = useLocalStorage('maturity-date', '2026-05-05');
  const [isEditing, setIsEditing] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { currentStreak, longestStreak } = useStreak();
  const { user } = useAuth();
  const { syncStatus } = useSync();

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
    { path: '/autoscroll', icon: FaScroll, label: 'ASCR' },
    { path: '/dictionary', icon: FaBookOpen, label: 'SLVN' },
    { path: '/exam-practice', icon: FaDice, label: 'ZKŠK' },
    { path: '/scheduler', icon: FaCalendarAlt, label: 'PLÁN' },
    { path: '/neumelecky', icon: FaFileAlt, label: 'NUT' },
    { path: '/search', icon: FaSearch, label: 'SRCH' },
  ];

  return (
    <header className="bg-terminal-bg border-b border-terminal-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12 md:h-14 gap-3 relative">
          {/* App title - mobile only */}
          <span className="md:hidden text-xs tracking-widest text-terminal-text/40 font-bold uppercase">
            MATURITA
          </span>

          {/* Streak Counter */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded" title={`Nejdelší série: ${longestStreak} dní`}>
              <FaFire className="text-orange-500 text-sm" />
              <span className="text-sm font-bold text-orange-400 tabular-nums">{currentStreak}</span>
            </div>
          )}

          {/* Countdown - Center on desktop, right-aligned on mobile */}
          <div
            className="cursor-pointer group ml-auto md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2"
            onClick={() => !isEditing && setIsEditing(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Klikni pro změnu data"
          >
            {isEditing ? (
              <input
                type="date"
                value={maturityDate}
                onChange={handleDateChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="bg-terminal-dim border border-terminal-accent/50 px-2 py-0.5 text-xs focus:outline-none focus:border-terminal-accent w-28"
                aria-label="Datum maturity"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className={`transition-all duration-300 hidden md:block ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <FaFire className="text-orange-500 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-terminal-text tabular-nums">
                    {daysLeft}
                  </span>
                  <span className="text-xs text-terminal-text/50">dní</span>
                </div>
                <div className={`transition-all duration-300 hidden md:block ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <FaFire className="text-orange-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Right */}
          <nav className="hidden md:flex items-center ml-auto">
            {/* Main nav items */}
            <div className="flex space-x-2">
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
            </div>

            {/* Vertical divider */}
            <div className="w-px h-8 bg-terminal-border/20 mx-3" />

            {/* User Avatar / Login */}
            <Link
              to="/login"
              className={`icon-btn relative ${isActive('/login') ? 'active' : ''}`}
              title={user ? user.displayName || 'Profil' : 'Přihlásit se'}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <FaUser className="text-lg" />
              )}
              {user && syncStatus === 'synced' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-terminal-bg" />
              )}
              {user && syncStatus === 'syncing' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full border border-terminal-bg animate-pulse" />
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
