import { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaLaptop } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import cjBooksData from '../data/bookData.js';
import itQuestionsData from '../data/it-questions.json';
import { useExperimental } from '../context/ExperimentalContext';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [fuseCJ, setFuseCJ] = useState(null);
  const [fuseIT, setFuseIT] = useState(null);
  const { frutigerAero } = useExperimental();

  useEffect(() => {
    // Initialize Fuse.js for CJ books
    const cjOptions = {
      keys: ['title', 'author', 'keywords', 'period', 'genre'],
      threshold: 0.4,
      includeScore: true,
    };
    setFuseCJ(new Fuse(cjBooksData.books, cjOptions));

    // Initialize Fuse.js for IT questions
    const itOptions = {
      keys: ['question', 'answer', 'keywords', 'category'],
      threshold: 0.4,
      includeScore: true,
    };
    setFuseIT(new Fuse(itQuestionsData.questions, itOptions));
  }, []);

  useEffect(() => {
    if (searchTerm && fuseCJ && fuseIT) {
      const cjResults = fuseCJ.search(searchTerm).map(r => ({ ...r.item, type: 'cj', score: r.score }));
      const itResults = fuseIT.search(searchTerm).map(r => ({ ...r.item, type: 'it', score: r.score }));

      // Combine and sort by score
      const combined = [...cjResults, ...itResults].sort((a, b) => a.score - b.score);
      setResults(combined);
    } else {
      setResults([]);
    }
  }, [searchTerm, fuseCJ, fuseIT]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="border-b border-terminal-border/20 pb-3 flex items-center gap-2">
        {frutigerAero && <img src="/aero-icons/vista_search_globe.ico" alt="" className="w-8 h-8" />}
        <h1 className="text-xl text-terminal-accent tracking-wider">
          VYHLEDÁVÁNÍ
        </h1>
      </div>

      {/* Search Bar */}
      <div className="terminal-card">
        <div className="flex items-center gap-3">
          {frutigerAero ? (
            <img src="/aero-icons/search_icon_1771111945520.png" alt="" className="w-5 h-5 opacity-60" />
          ) : (
            <FaSearch className="text-terminal-accent/60" />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hledej knihy, autory, otázky..."
            className="flex-1 bg-transparent border-none outline-none text-terminal-text placeholder-terminal-text/40"
            autoFocus
          />
          {searchTerm && (
            <span className="text-xs text-terminal-text/40">
              {results.length} výsledků
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((item, index) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={item.type === 'cj' ? `/cj/book/${item.id}` : `/it/question/${item.id}`}
            className="terminal-card block group"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 ${item.type === 'cj' ? 'text-terminal-accent' : 'text-blue-400'}`}>
                {frutigerAero ? (
                  <img
                    src={item.type === 'cj' ? "/aero-icons/vista_book_1.ico" : "/aero-icons/vista_pc_1.ico"}
                    alt=""
                    className="w-5 h-5"
                  />
                ) : (
                  item.type === 'cj' ? <FaBook /> : <FaLaptop />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-terminal-text/40">#{item.id}</span>
                  <span className={`text-xs px-1 border ${item.type === 'cj' ? 'border-terminal-accent/30 text-terminal-accent/70' : 'border-blue-400/30 text-blue-400/70'}`}>
                    {item.type === 'cj' ? 'ČJ' : 'IT'}
                  </span>
                  {item.type === 'cj' && (
                    <span className="text-xs text-terminal-text/40">{item.year}</span>
                  )}
                  {item.type === 'it' && (
                    <span className="text-xs text-terminal-text/40">{item.category}</span>
                  )}
                </div>
                <h3 className="text-terminal-text group-hover:text-terminal-accent transition-colors">
                  {item.type === 'cj' ? item.title : item.question}
                </h3>
                <p className="text-xs text-terminal-accent/70 mt-1">
                  {item.type === 'cj' ? item.author : item.exam}
                </p>
                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.keywords.slice(0, 4).map((kw, i) => (
                      <span key={i} className="text-xs text-terminal-text/40">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No results */}
      {searchTerm && results.length === 0 && (
        <div className="terminal-card text-center py-8">
          <FaSearch className="text-3xl text-terminal-text/20 mx-auto mb-3" />
          <p className="text-terminal-text/40">
            Žádné výsledky pro "{searchTerm}"
          </p>
        </div>
      )}

      {/* Empty state */}
      {!searchTerm && (
        <div className="terminal-card text-center py-8">
          <FaSearch className="text-3xl text-terminal-accent/30 mx-auto mb-3" />
          <p className="text-terminal-text/60 mb-2">
            Začni psát a vyhledávej
          </p>
          <p className="text-xs text-terminal-text/40">
            Prohledává knihy, autory, IT otázky a klíčová slova
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
