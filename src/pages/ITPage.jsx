import { useState } from 'react';
import { FaList, FaLayerGroup, FaQuestion, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import itQuestionsData from '../data/it-questions.json';
import QuestionList from '../components/it/QuestionList';
import FlashcardMode from '../components/it/FlashcardMode';
import QuizMode from '../components/it/QuizMode';

const ITPage = () => {
  const [mode, setMode] = useState('list');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('chronological');
  const [showFilters, setShowFilters] = useState(false);

  const modes = [
    { id: 'list', icon: FaList },
    { id: 'flashcard', icon: FaLayerGroup },
    { id: 'quiz', icon: FaQuestion },
  ];

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'IKT1', label: 'IKT1' },
    { id: 'IKT2', label: 'IKT2' },
    ...itQuestionsData.categories.map(cat => ({ id: cat, label: cat.substring(0, 4).toUpperCase() }))
  ];

  const sorts = [
    { id: 'chronological', label: 'CHR' },
    { id: 'exam', label: 'EXM' },
    { id: 'category', label: 'CAT' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="border-b border-terminal-border/20 pb-3">
        <h1 className="text-xl text-terminal-green tracking-wider">
          &gt; IT OTÁZKY
        </h1>
      </div>

      {/* Controls Bar */}
      <div className="terminal-card">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Selection - Icon only */}
          <div className="flex gap-1 border-r border-terminal-border/20 pr-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`icon-btn ${mode === m.id ? 'active' : ''}`}
                title={m.id}
              >
                <m.icon />
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`icon-btn ${showFilters ? 'active' : ''}`}
            title="Filtry"
          >
            <FaFilter />
          </button>

          {/* Filter Pills - Hidden by default */}
          {showFilters && (
            <>
              <div className="flex gap-1 flex-wrap">
                {filters.slice(0, 6).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`icon-btn text-xs px-2 ${filter === f.id ? 'active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 border-l border-terminal-border/20 pl-3">
                <FaSortAmountDown className="text-terminal-text/40 self-center" />
                {sorts.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={`icon-btn text-xs px-2 ${sort === s.id ? 'active' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {mode === 'list' && <QuestionList filter={filter} sort={sort} />}
        {mode === 'flashcard' && <FlashcardMode filter={filter} />}
        {mode === 'quiz' && <QuizMode filter={filter} />}
      </div>
    </div>
  );
};

export default ITPage;
