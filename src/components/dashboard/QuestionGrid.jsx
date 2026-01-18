import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';

const QuestionGrid = () => {
  const [progress] = useLocalStorage('maturita-progress', {});
  const [viewMode, setViewMode] = useState('all'); // 'all', 'category', 'activity'
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let processedQuestions = [...itQuestionsData.questions];

    if (viewMode === 'category') {
      // Group by category
      processedQuestions.sort((a, b) => a.category.localeCompare(b.category));
    } else if (viewMode === 'activity') {
      // Sort by most recently reviewed
      processedQuestions.sort((a, b) => {
        const aTime = progress.itQuestions?.[a.id]?.lastReviewed || 0;
        const bTime = progress.itQuestions?.[b.id]?.lastReviewed || 0;
        return new Date(bTime) - new Date(aTime);
      });
    }

    setQuestions(processedQuestions);
  }, [viewMode, progress]);

  const getQuestionStatus = (questionId) => {
    return progress.itQuestions?.[questionId]?.known || false;
  };

  const stats = {
    total: questions.length,
    known: questions.filter(q => getQuestionStatus(q.id)).length,
    unknown: questions.filter(q => !getQuestionStatus(q.id)).length,
  };

  return (
    <div className="terminal-card">
      {/* View Mode Switcher */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-terminal-border/20">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`icon-btn text-xs px-3 ${viewMode === 'all' ? 'active' : ''}`}
          >
            ALL
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`icon-btn text-xs px-3 ${viewMode === 'category' ? 'active' : ''}`}
          >
            CAT
          </button>
          <button
            onClick={() => setViewMode('activity')}
            className={`icon-btn text-xs px-3 ${viewMode === 'activity' ? 'active' : ''}`}
          >
            ACT
          </button>
        </div>

        {/* Stats in corner */}
         <div className="text-xs text-terminal-text/60">
           <span className="text-terminal-accent">{stats.known}</span>
           <span className="mx-1">/</span>
           <span className="text-terminal-red">{stats.unknown}</span>
          <span className="mx-1">/</span>
          <span>{stats.total}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-1">
        {questions.map((question) => {
          const known = getQuestionStatus(question.id);
          return (
            <Link
              key={question.id}
              to={`/it/question/${question.id}`}
              className={`aspect-square border transition-all duration-200 hover:scale-110 ${
                known
                  ? 'border-terminal-green bg-terminal-green/30 hover:bg-terminal-green/50'
                  : 'border-terminal-red bg-terminal-red/30 hover:bg-terminal-red/50'
              }`}
              title={`#${question.id}: ${question.question}`}
            />
          );
        })}
      </div>

      {/* Category legend if in category mode */}
      {viewMode === 'category' && (
        <div className="mt-4 pt-3 border-t border-terminal-border/20">
          <div className="text-xs text-terminal-text/60 space-y-1">
            {[...new Set(questions.map(q => q.category))].map((cat, i) => {
              const count = questions.filter(q => q.category === cat).length;
              return (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-terminal-border/50" />
                  <span>{cat} ({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionGrid;
