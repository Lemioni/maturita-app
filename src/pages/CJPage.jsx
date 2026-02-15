import { useState } from 'react';
import { FaList, FaQuestion, FaCheck, FaTimes, FaBook, FaGraduationCap, FaStream } from 'react-icons/fa';
import BookList from '../components/cj/BookList';
import QuizMode from '../components/cj/QuizMode';
import MockExamMode from '../components/cj/MockExamMode';
import TimelineMode from '../components/cj/TimelineMode';
import { useExperimental } from '../context/ExperimentalContext';

const CJPage = () => {
  const [mode, setMode] = useState('list');
  const [filter, setFilter] = useState('all');
  const { frutigerAero } = useExperimental();

  const modes = [
    { id: 'list', icon: FaList, label: 'Seznam', imgSrc: '/aero-icons/vista_book_2.ico' },
    { id: 'quiz', icon: FaQuestion, label: 'Kvíz', imgSrc: '/aero-icons/vista_photo_gallery.ico' },
    { id: 'mock', icon: FaGraduationCap, label: 'Potítko', imgSrc: '/aero-icons/vista_warning.ico' },
    { id: 'timeline', icon: FaStream, label: 'Časová osa', imgSrc: '/aero-icons/vista_cal_1.ico' },
  ];

  const filters = [
    { id: 'all', icon: FaBook, label: 'VŠE', imgSrc: '/aero-icons/vista_book_3.ico' },
    { id: 'known', icon: FaCheck, label: 'UMÍM', imgSrc: '/aero-icons/vista_firewall_status_1.ico' },
    { id: 'unknown', icon: FaTimes, label: 'NEUMÍM', imgSrc: '/aero-icons/vista_firewall_status_3.ico' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="border-b border-terminal-border/20 pb-3">
        <h1 className="text-xl text-terminal-accent tracking-wider">
          ČESKÁ LITERATURA
        </h1>
      </div>

      {/* Controls Bar */}
      <div className="terminal-card">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selection */}
          <div className="flex gap-1 border-r border-terminal-border/20 pr-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`icon-btn ${mode === m.id ? 'active' : ''}`}
                title={m.label}
              >
                {frutigerAero ? <img src={m.imgSrc} alt={m.label} className="w-5 h-5" /> : <m.icon />}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`icon-btn ${filter === f.id ? 'active' : ''}`}
                title={f.label}
              >
                {frutigerAero ? <img src={f.imgSrc} alt={f.label} className="w-5 h-5" /> : <f.icon />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {mode === 'list' && <BookList filter={filter} />}

        {mode === 'quiz' && <QuizMode filter={filter} />}
        {mode === 'mock' && <MockExamMode filter={filter} />}
        {mode === 'timeline' && <TimelineMode filter={filter} />}
      </div>
    </div>
  );
};

export default CJPage;
