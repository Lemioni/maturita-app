import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLaptopCode, FaBook, FaLayerGroup, FaChartLine, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import useDarkMode from '../../hooks/useDarkMode';

const Header = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/it', icon: FaLaptopCode, label: 'IT Otázky' },
    { path: '/cj', icon: FaBook, label: 'Čeština' },
    { path: '/flashcards', icon: FaLayerGroup, label: 'Flashcards' },
    { path: '/progress', icon: FaChartLine, label: 'Pokrok' },
    { path: '/search', icon: FaSearch, label: 'Hledat' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Maturita App
          </Link>
          
          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="ml-4 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </nav>
          
          <div className="md:hidden flex items-center gap-2">
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
            
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4 grid grid-cols-3 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="text-xl mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
