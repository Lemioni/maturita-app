import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaDesktop, FaBook, FaCheck, FaTimes, FaLayerGroup } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';
import cjBooksData from '../../data/bookData.js';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useExperimental } from '../../context/ExperimentalContext';

const QuestionGrid = () => {
  const [progress] = useLocalStorage('maturita-progress', {});
  const [viewMode, setViewMode] = useState('all'); // 'all', 'it', 'cj'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'known', 'unknown'
  const [itQuestions, setItQuestions] = useState([]);
  const [cjBooks, setCjBooks] = useState([]);
  const { frutigerAero } = useExperimental();

  useEffect(() => {
    setItQuestions([...itQuestionsData.questions]);
    setCjBooks([...cjBooksData.books]);
  }, []);

  const getItQuestionStatus = (questionId) => {
    return progress.itQuestions?.[questionId]?.known || false;
  };

  const getCjBookStatus = (bookId) => {
    return progress.cjBooks?.[bookId]?.known || false;
  };

  // Filter by status
  const filteredItQuestions = itQuestions.filter(q => {
    if (statusFilter === 'known') return getItQuestionStatus(q.id);
    if (statusFilter === 'unknown') return !getItQuestionStatus(q.id);
    return true;
  });

  const filteredCjBooks = cjBooks.filter(b => {
    if (statusFilter === 'known') return getCjBookStatus(b.id);
    if (statusFilter === 'unknown') return !getCjBookStatus(b.id);
    return true;
  });

  const itStats = {
    total: itQuestions.length,
    known: itQuestions.filter(q => getItQuestionStatus(q.id)).length,
    unknown: itQuestions.filter(q => !getItQuestionStatus(q.id)).length,
  };

  const cjStats = {
    total: cjBooks.length,
    known: cjBooks.filter(b => getCjBookStatus(b.id)).length,
    unknown: cjBooks.filter(b => !getCjBookStatus(b.id)).length,
  };

  const totalStats = {
    total: itStats.total + cjStats.total,
    known: itStats.known + cjStats.known,
    unknown: itStats.unknown + cjStats.unknown,
  };

  const getCurrentStats = () => {
    if (viewMode === 'it') return itStats;
    if (viewMode === 'cj') return cjStats;
    return totalStats;
  };

  const stats = getCurrentStats();

  return (
    <div className="terminal-card">
      {/* View Mode Switcher */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-terminal-border/20">
        <div className="flex gap-2">
          {/* Subject filter */}
          <div className="flex gap-1 border-r border-terminal-border/20 pr-2">
            <button
              onClick={() => setViewMode('all')}
              className={`icon-btn ${viewMode === 'all' ? 'active' : ''}`}
              title="Vše (IT + ČJ)"
            >
              {frutigerAero ? <img src="/aero-icons/vista_collab.ico" alt="All" className="w-5 h-5" /> : <FaLayerGroup />}
            </button>
            <button
              onClick={() => setViewMode('it')}
              className={`icon-btn ${viewMode === 'it' ? 'active' : ''}`}
              title="IT"
            >
              {frutigerAero ? <img src="/aero-icons/minecraft1.ico" alt="IT" className="w-5 h-5" /> : <FaDesktop />}
            </button>
            <button
              onClick={() => setViewMode('cj')}
              className={`icon-btn ${viewMode === 'cj' ? 'active' : ''}`}
              title="ČJ"
            >
              {frutigerAero ? <img src="/aero-icons/vista_book_3.ico" alt="CJ" className="w-5 h-5" /> : <FaBook />}
            </button>
          </div>

          {/* Status filter */}
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`icon-btn ${statusFilter === 'all' ? 'active' : ''}`}
              title="VŠE"
            >
              {frutigerAero ? <img src="/aero-icons/vista_accessibility.ico" alt="All" className="w-5 h-5" /> : <FaLayerGroup />}
            </button>
            <button
              onClick={() => setStatusFilter('known')}
              className={`icon-btn ${statusFilter === 'known' ? 'active' : ''}`}
              title="UMÍM"
            >
              {frutigerAero ? <img src="/aero-icons/vista_firewall_status_1.ico" alt="Known" className="w-5 h-5" /> : <FaCheck />}
            </button>
            <button
              onClick={() => setStatusFilter('unknown')}
              className={`icon-btn ${statusFilter === 'unknown' ? 'active' : ''}`}
              title="NEUMÍM"
            >
              {frutigerAero ? <img src="/aero-icons/vista_firewall_status_3.ico" alt="Unknown" className="w-5 h-5" /> : <FaTimes />}
            </button>
          </div>
        </div>

        {/* Stats in corner */}
        {/* Stats in corner - 2000s Style */}
        <div className="flex items-center gap-2">
          {frutigerAero ? (
            <div className="flex items-center bg-black border-2 border-gray-600 rounded p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] font-mono text-xs">
              {/* Known */}
              <div className="flex items-center px-2 border-r border-gray-700">
                <img src="/aero-icons/vista_firewall_status_1.ico" className="w-3 h-3 mr-1" alt="ok" />
                <span className="text-[#00ff00] text-shadow-neon">{String(stats.known).padStart(3, '0')}</span>
              </div>
              {/* Unknown */}
              <div className="flex items-center px-2 border-r border-gray-700">
                <img src="/aero-icons/vista_firewall_status_3.ico" className="w-3 h-3 mr-1" alt="bad" />
                <span className="text-[#ff0000] text-shadow-neon">{String(stats.unknown).padStart(3, '0')}</span>
              </div>
              {/* Total */}
              <div className="flex items-center px-2">
                <span className="text-gray-400">/</span>
                <span className="text-[#00ffff] ml-1">{String(stats.total).padStart(3, '0')}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-terminal-text/60">
              <span className="text-terminal-green">{stats.known}</span>
              <span className="mx-1">/</span>
              <span className="text-terminal-red">{stats.unknown}</span>
              <span className="mx-1">/</span>
              <span>{stats.total}</span>
            </div>
          )}
        </div>
      </div>

      {/* IT Questions Grid */}
      {(viewMode === 'all' || viewMode === 'it') && filteredItQuestions.length > 0 && (
        <div className="mb-4">
          {viewMode === 'all' && (
            <div className="flex items-center gap-2 mb-2 text-xs text-terminal-text/60">
              {frutigerAero ? <img src="/aero-icons/minecraft1.ico" alt="IT" className="w-4 h-4" /> : <FaDesktop />}
              <span>IT ({filteredItQuestions.length})</span>
            </div>
          )}
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-1">
            {filteredItQuestions.map((question) => {
              const known = getItQuestionStatus(question.id);
              return (
                <Link
                  key={`it-${question.id}`}
                  to={`/it/question/${question.id}`}
                  className={`aspect-square border transition-all duration-200 hover:scale-110 ${known
                    ? 'border-terminal-green bg-terminal-green/30 hover:bg-terminal-green/50'
                    : 'border-terminal-red bg-terminal-red/30 hover:bg-terminal-red/50'
                    }`}
                  title={`IT #${question.id}: ${question.question}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* CJ Books Grid */}
      {(viewMode === 'all' || viewMode === 'cj') && filteredCjBooks.length > 0 && (
        <div>
          {viewMode === 'all' && (
            <div className="flex items-center gap-2 mb-2 text-xs text-terminal-text/60 mt-4 pt-3 border-t border-terminal-border/20">
              {frutigerAero ? <img src="/aero-icons/vista_book_3.ico" alt="CJ" className="w-4 h-4" /> : <FaBook />}
              <span>ČJ ({filteredCjBooks.length})</span>
            </div>
          )}
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-10 gap-1">
            {filteredCjBooks.map((book) => {
              const known = getCjBookStatus(book.id);
              return (
                <Link
                  key={`cj-${book.id}`}
                  to={`/cj/book/${book.id}`}
                  className={`aspect-square border transition-all duration-200 hover:scale-110 flex items-center justify-center text-xs font-mono ${known
                    ? 'border-terminal-green bg-terminal-green/30 hover:bg-terminal-green/50 text-terminal-green'
                    : 'border-terminal-red bg-terminal-red/30 hover:bg-terminal-red/50 text-terminal-red'
                    }`}
                  title={`ČJ #${book.id}: ${book.title} - ${book.author}`}
                >
                  {book.id}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredItQuestions.length === 0 && filteredCjBooks.length === 0 && (
        <div className="text-center py-8 text-terminal-text/40">
          Žádné položky odpovídající filtru
        </div>
      )}
    </div>
  );
};

export default QuestionGrid;
