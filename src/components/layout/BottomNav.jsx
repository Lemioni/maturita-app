import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaLaptopCode, FaBook, FaSearch,
  FaDice, FaScroll, FaBookOpen, FaTimes, FaBars,
  FaBrain, FaGraduationCap, FaBalanceScale, FaMicrophone,
  FaGamepad, FaTrophy, FaChevronUp, FaChevronDown
} from 'react-icons/fa';

const primaryNav = [
  { path: '/', icon: FaHome, label: 'Domů' },
  { path: '/it', icon: FaLaptopCode, label: 'IT' },
  { path: '/cj', icon: FaBook, label: 'Lit' },
  { path: '/autoscroll', icon: FaScroll, label: 'Scroll' },
  { path: '/search', icon: FaSearch, label: 'Hledat' },
];

const moreNav = [
  { path: '/srs', icon: FaBrain, label: 'Kartičky' },
  { path: '/simulator', icon: FaGraduationCap, label: 'Simulátor' },
  { path: '/autoscroll', icon: FaScroll, label: 'Autoscroll' },
  { path: '/dictionary', icon: FaBookOpen, label: 'Slovník' },
  { path: '/exam-practice', icon: FaDice, label: 'Zkouška' },
  { path: '/compare', icon: FaBalanceScale, label: 'Porovnat' },
  { path: '/speech', icon: FaMicrophone, label: 'Mluvení' },
  { path: '/bingo', icon: FaGamepad, label: 'Bingo' },
  { path: '/achievements', icon: FaTrophy, label: 'Odznaky' },
];

// Routes where bottom nav is hidden by default
const hiddenNavRoutes = ['/exam-practice'];

const BottomNav = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  const isHiddenRoute = hiddenNavRoutes.some(r => location.pathname === r || location.pathname.startsWith(r + '/'));
  const navHidden = isHiddenRoute && !forceShow;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isMoreActive = moreNav.some(item => isActive(item.path));

  // Hidden mode: show a small pull-up tab
  if (navHidden) {
    return (
      <button
        onClick={() => setForceShow(true)}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 md:hidden
          flex items-center gap-1.5 px-4 py-1.5 bg-terminal-bg/90 backdrop-blur-sm
          border border-b-0 border-terminal-border/30 rounded-t-lg
          text-terminal-text/40 hover:text-terminal-accent transition-all"
      >
        <FaChevronUp className="text-[10px]" />
        <span className="text-[10px] tracking-wide">Menu</span>
      </button>
    );
  }

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu drawer */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
          showMore ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="bg-terminal-bg border-t border-terminal-border/30 px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {moreNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMore(false)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded border transition-all active:scale-95 ${
                  isActive(item.path)
                    ? 'border-terminal-border bg-terminal-border/10 text-terminal-accent'
                    : 'border-terminal-border/20 text-terminal-text/60 hover:border-terminal-border/40 hover:text-terminal-text'
                }`}
              >
                <item.icon className="text-lg" />
                <span className="text-[10px] tracking-wide">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-terminal-bg border-t border-terminal-border/20 safe-area-bottom">
        <div className="flex items-stretch h-16">
          {primaryNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:bg-terminal-border/10 ${
                isActive(item.path)
                  ? 'text-terminal-accent border-t-2 border-terminal-accent'
                  : 'text-terminal-text/50 border-t-2 border-transparent'
              }`}
            >
              <item.icon className="text-lg" />
              <span className="text-[9px] tracking-wider">{item.label}</span>
            </Link>
          ))}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all active:bg-terminal-border/10 ${
              isMoreActive || showMore
                ? 'text-terminal-accent border-t-2 border-terminal-accent'
                : 'text-terminal-text/50 border-t-2 border-transparent'
            }`}
          >
            {showMore ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            <span className="text-[9px] tracking-wider">Více</span>
          </button>

          {/* Hide nav button — only on hidden routes when force-shown */}
          {isHiddenRoute && forceShow && (
            <button
              onClick={() => { setForceShow(false); setShowMore(false); }}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all active:bg-terminal-border/10
                text-terminal-text/50 border-t-2 border-transparent"
            >
              <FaChevronDown className="text-lg" />
              <span className="text-[9px] tracking-wider">Skrýt</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
