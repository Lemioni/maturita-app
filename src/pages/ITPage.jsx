import { useState } from 'react';
import { FaList, FaQuestion, FaCheck, FaTimes, FaLaptop } from 'react-icons/fa';
import QuestionList from '../components/it/QuestionList';
import { useExperimental } from '../context/ExperimentalContext';

import QuizMode from '../components/it/QuizMode';
import itQuestionsData from '../data/it-questions.json';
import useLocalStorage from '../hooks/useLocalStorage';

const ITPage = () => {
  const [mode, setMode] = useState('list');
  const [filter, setFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useLocalStorage('it-subject-filter', 'all');
  const { frutigerAero } = useExperimental();

  const modes = [
    { id: 'list', icon: FaList, label: 'Seznam', imgSrc: '/aero-icons/vista_console.ico' },
    { id: 'quiz', icon: FaQuestion, label: 'Kvíz', imgSrc: '/aero-icons/minecraft2.ico' },
  ];

  const filters = [
    { id: 'all', icon: FaLaptop, label: 'VŠE', imgSrc: '/aero-icons/vista_pc_1.ico' },
    { id: 'known', icon: FaCheck, label: 'UMÍM', imgSrc: '/aero-icons/vista_firewall_status_1.ico' },
    { id: 'unknown', icon: FaTimes, label: 'NEUMÍM', imgSrc: '/aero-icons/vista_firewall_status_3.ico' },
  ];

  const subjects = ['all', ...itQuestionsData.categories];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="border-b border-terminal-border/20 pb-3">
        <h1 className="text-xl text-terminal-accent tracking-wider">
          IT OTÁZKY
        </h1>
      </div>

      {/* Controls Bar */}
      <div className="terminal-card space-y-3">
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

        {/* Subject Filter */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-terminal-border/20">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-3 py-1 text-xs border transition-colors ${subjectFilter === s
                ? 'bg-terminal-accent/10 border-terminal-accent text-terminal-accent'
                : 'border-terminal-border/30 text-terminal-text/60 hover:border-terminal-text/30'
                }`}
            >
              {s === 'all' ? 'Všechny předměty' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {mode === 'list' && <QuestionList filter={filter} subjectFilter={subjectFilter} />}

        {mode === 'quiz' && <QuizMode filter={filter} subjectFilter={subjectFilter} />}
      </div>
    </div>
  );
};

export default ITPage;
