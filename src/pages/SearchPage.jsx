import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import itQuestionsData from '../data/it-questions.json';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Initialize Fuse.js
    const options = {
      keys: ['question', 'answer', 'keywords', 'category'],
      threshold: 0.4,
      includeScore: true,
    };
    const fuseInstance = new Fuse(itQuestionsData.questions, options);
    setFuse(fuseInstance);
  }, []);

  useEffect(() => {
    if (searchTerm && fuse) {
      const searchResults = fuse.search(searchTerm);
      setResults(searchResults.map(r => r.item));
    } else {
      setResults([]);
    }
  }, [searchTerm, fuse]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vyhledávání</h1>
        <p className="text-gray-600 dark:text-gray-400">Najdi otázky a materiály</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hledej otázky, klíčová slova, kategorie..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Results */}
      {searchTerm && (
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          Nalezeno {results.length} {results.length === 1 ? 'výsledek' : results.length < 5 ? 'výsledky' : 'výsledků'}
        </div>
      )}

      <div className="space-y-4">
        {results.map((question) => (
          <div key={question.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">#{question.id}</span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {question.category}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {question.exam}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {question.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {question.answer}
                </p>
              </div>
            </div>
            
            {question.keywords && question.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {question.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Link
                to={`/it/question/${question.id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
              >
                Zobrazit detail →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {searchTerm && results.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
          <div className="text-gray-400 dark:text-gray-600 mb-2">
            <FaSearch className="text-5xl mx-auto mb-4" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Nenalezeny žádné výsledky pro "{searchTerm}"
          </p>
        </div>
      )}

      {!searchTerm && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
          <FaSearch className="text-4xl text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Začni psát a vyhledávej
          </h3>
          <p className="text-blue-700 dark:text-blue-400">
            Můžeš hledat otázky, klíčová slova, kategorie nebo cokoliv jiného
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
