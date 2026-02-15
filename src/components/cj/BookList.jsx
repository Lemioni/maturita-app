import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cjBooksData from '../../data/bookData.js';
import useLocalStorage from '../../hooks/useLocalStorage';
import KnowledgeCheckbox from '../common/KnowledgeCheckbox';
import { useExperimental } from '../../context/ExperimentalContext';

const BookList = ({ filter }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [books, setBooks] = useState([]);
  const { frutigerAero } = useExperimental();

  useEffect(() => {
    let filtered = [...cjBooksData.books];

    // Apply filter based on known status
    if (filter === 'known') {
      filtered = filtered.filter(b => progress.cjBooks?.[b.id]?.known === true);
    } else if (filter === 'unknown') {
      filtered = filtered.filter(b => !progress.cjBooks?.[b.id]?.known);
    }

    setBooks(filtered);
  }, [filter, progress]);

  const updateKnowledge = (bookId, known) => {
    setProgress(prev => ({
      ...prev,
      cjBooks: {
        ...(prev.cjBooks || {}),
        [bookId]: {
          ...(prev.cjBooks?.[bookId] || {}),
          known,
          lastReviewed: new Date().toISOString(),
        }
      }
    }));
  };

  const isKnown = (bookId) => {
    return progress.cjBooks?.[bookId]?.known || false;
  };

  if (frutigerAero) {
    return (
      <div className="space-y-1 pl-2">
        {books.map((book) => {
          const known = isKnown(book.id);
          return (
            <div key={book.id} className="flex items-center gap-2 text-sm font-serif">
              <img src="/aero-icons/vista_book_1.ico" alt="Book" className="w-4 h-4" />
              <Link
                to={`/cj/book/${book.id}`}
                className="text-blue-700 underline hover:text-blue-900"
              >
                {book.title}
              </Link>
              <span className="text-black">- {book.author}</span>

              <div className="ml-auto pr-2">
                <KnowledgeCheckbox
                  questionId={`cj-${book.id}`}
                  initialKnown={known}
                  onChange={(newValue) => updateKnowledge(book.id, newValue)}
                />
              </div>
            </div>
          );
        })}
        {books.length === 0 && <p className="text-gray-500 italic">No books found.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-terminal-text/60 border-l-2 border-terminal-border/30 pl-3">
        {books.length} BOOKS
      </div>

      {books.map((book) => {
        const known = isKnown(book.id);

        return (
          <div
            key={book.id}
            className="terminal-card group"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                to={`/cj/book/${book.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] text-terminal-text/40 font-mono">#{book.id}</span>
                  <h3 className="text-sm font-bold text-terminal-text group-hover:text-terminal-accent transition-colors truncate">
                    {book.title}
                  </h3>
                </div>
                <p className="text-xs text-terminal-accent/80 mb-1.5">
                  {book.author}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] px-1.5 py-0.5 border border-terminal-border/25 text-terminal-text/50">
                    {book.genre}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 border border-terminal-border/25 text-terminal-text/50">
                    {book.literaryForm}
                  </span>
                  <span className="text-[11px] text-terminal-text/30">
                    {book.year}
                  </span>
                </div>
              </Link>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0"
              >
                <KnowledgeCheckbox
                  questionId={`cj-${book.id}`}
                  initialKnown={known}
                  onChange={(newValue) => updateKnowledge(book.id, newValue)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;
