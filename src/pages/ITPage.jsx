import { useState, useEffect } from 'react';
import { FaList, FaLayerGroup, FaQuestion } from 'react-icons/fa';
import itQuestionsData from '../data/it-questions.json';
import QuestionList from '../components/it/QuestionList';
import FlashcardMode from '../components/it/FlashcardMode';
import QuizMode from '../components/it/QuizMode';

const ITPage = () => {
  const [mode, setMode] = useState('list'); // 'list', 'flashcard', 'quiz'
  const [filter, setFilter] = useState('all'); // 'all', 'IKT1', 'IKT2', or category name
  const [sort, setSort] = useState('chronological'); // 'chronological', 'exam', 'category'

  const modes = [
    { id: 'list', icon: FaList, label: 'Seznam otázek', 
      activeClass: 'border-blue-500 bg-blue-50 text-blue-700' },
    { id: 'flashcard', icon: FaLayerGroup, label: 'Flashcard režim', 
      activeClass: 'border-green-500 bg-green-50 text-green-700' },
    { id: 'quiz', icon: FaQuestion, label: 'Kvíz', 
      activeClass: 'border-orange-500 bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">IT Otázky</h1>
        <p className="text-gray-600 dark:text-gray-400">47 maturitních otázek z IKT</p>
      </div>

      {/* Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Režim učení</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                mode === m.id
                  ? m.activeClass
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <m.icon className="mr-3 text-xl" />
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filtrovat
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Všechny otázky</option>
              <option value="IKT1">IKT 1 (Hardware, OS, Sítě)</option>
              <option value="IKT2">IKT 2 (Programování, DB)</option>
              <optgroup label="Kategorie">
                {itQuestionsData.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seřadit podle
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="chronological">Chronologicky (1-47)</option>
              <option value="exam">Podle zkoušky (IKT 1/2)</option>
              <option value="category">Podle kategorie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content based on mode */}
      <div>
        {mode === 'list' && <QuestionList filter={filter} sort={sort} />}
        {mode === 'flashcard' && <FlashcardMode filter={filter} />}
        {mode === 'quiz' && <QuizMode filter={filter} />}
      </div>
    </div>
  );
};

export default ITPage;
