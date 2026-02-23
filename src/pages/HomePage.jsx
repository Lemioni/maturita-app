import { Link } from 'react-router-dom';
import { FaBolt, FaTrophy, FaBrain, FaBalanceScale, FaGraduationCap, FaMicrophone, FaGamepad } from 'react-icons/fa';
import QuestionGrid from '../components/dashboard/QuestionGrid';

const studyTools = [
  { path: '/drill', icon: FaBolt, label: 'Random Drill', desc: 'Kvíz z knih + IT', color: '#f59e0b' },
  { path: '/srs', icon: FaBrain, label: 'Kartičky', desc: 'Spaced Repetition', color: '#8b5cf6' },
  { path: '/simulator', icon: FaGraduationCap, label: 'Simulátor', desc: 'Losování + příprava', color: '#ef4444' },
  { path: '/speech', icon: FaMicrophone, label: 'Mluvení', desc: 'Speech-to-Text', color: '#ec4899' },
  { path: '/compare', icon: FaBalanceScale, label: 'Porovnávač', desc: '2–3 knihy vedle sebe', color: '#3b82f6' },
  { path: '/bingo', icon: FaGamepad, label: 'Bingo', desc: '5×5 literární výzvy', color: '#f97316' },
  { path: '/achievements', icon: FaTrophy, label: 'Achievementy', desc: 'Odznaky za pokrok', color: '#eab308' },
];

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Question Grid */}
      <div>
        <h2 className="text-sm text-terminal-text/60 mb-3 tracking-wider">
          MATURITA
        </h2>
        <QuestionGrid />
      </div>

      {/* Study Tools */}
      <div>
        <h2 className="text-sm text-terminal-text/60 mb-3 tracking-wider">
          STUDIJNÍ NÁSTROJE
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {studyTools.map(tool => (
            <Link
              key={tool.path}
              to={tool.path}
              className="terminal-card group hover:border-terminal-accent/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <tool.icon className="text-base" style={{ color: tool.color }} />
                <span className="text-sm font-bold text-terminal-text group-hover:text-terminal-accent transition-colors">{tool.label}</span>
              </div>
              <p className="text-[11px] text-terminal-text/40 leading-snug">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
