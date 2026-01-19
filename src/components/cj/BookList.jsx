import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cjBooksData from '../../data/cj-books.json';
import useLocalStorage from '../../hooks/useLocalStorage';
import KnowledgeCheckbox from '../common/KnowledgeCheckbox';

const BookList = ({ filter, sort }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let filtered = [...cjBooksData.books];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(b => b.period === filter);
    }

    // Apply sort
    if (sort === 'author') {
      filtered.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sort === 'period') {
      const periodOrder = cjBooksData.periods;
      filtered.sort((a, b) => {
        const aIndex = periodOrder.indexOf(a.period);
        const bIndex = periodOrder.indexOf(b.period);
        if (aIndex === bIndex) return a.id - b.id;
        return aIndex - bIndex;
      });
    } else if (sort === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setBooks(filtered);
  }, [filter, sort]);

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
            <div className="flex items-start justify-between gap-4">
              <Link
                to={`/cj/book/${book.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-terminal-text/60">#{book.id}</span>
                  <span className="text-xs px-1 border border-terminal-text/20 text-terminal-text/60">
                    {book.period.substring(0, 15)}...
                  </span>
                  <span className="text-xs text-terminal-text/40">{book.year}</span>
                </div>
                <h3 className="text-sm text-terminal-text group-hover:text-terminal-accent transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-terminal-accent/70 mt-1">
                  {book.author}
                </p>

                {book.keywords && book.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {book.keywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-1 text-xs text-terminal-text/40"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
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
