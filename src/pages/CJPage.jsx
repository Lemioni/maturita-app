import { useState } from 'react';
import { FaList, FaQuestion, FaCheck, FaTimes, FaBook, FaGraduationCap, FaStream } from 'react-icons/fa';
import BookList from '../components/cj/BookList';
import QuizMode from '../components/cj/QuizMode';
import MockExamMode from '../components/cj/MockExamMode';
import TimelineMode from '../components/cj/TimelineMode';

const CJPage = () => {
  const [mode, setMode] = useState('list');
  const [filter, setFilter] = useState('all');

  const modes = [
    { id: 'list', icon: FaList, label: 'Seznam' },
    { id: 'quiz', icon: FaQuestion, label: 'Kvíz' },

    { id: 'mock', icon: FaGraduationCap, label: 'Potítko' },
    { id: 'timeline', icon: FaStream, label: 'Časová osa' },
  ];

  const filters = [
    { id: 'all', icon: FaBook, label: 'VŠE' },
    { id: 'known', icon: FaCheck, label: 'UMÍM' },
    { id: 'unknown', icon: FaTimes, label: 'NEUMÍM' },
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
                <m.icon />
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
                <f.icon />
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
