import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaLayerGroup, FaChartLine, FaSearch } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'HOME' },
    { path: '/it', icon: FaLaptopCode, label: 'IT' },
    { path: '/cj', icon: FaBook, label: 'CJ' },
    { path: '/flashcards', icon: FaLayerGroup, label: 'FLASH' },
    { path: '/progress', icon: FaChartLine, label: 'PROG' },
    { path: '/search', icon: FaSearch, label: 'SRCH' },
  ];

  return (
    <header className="bg-terminal-bg border-b border-terminal-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-terminal-green font-bold tracking-wider">
            &gt; MATURITA
          </Link>
          
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
