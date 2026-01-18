import { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';

const QuestionList = ({ filter, sort }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let filtered = [...itQuestionsData.questions];

    // Apply filter
    if (filter === 'IKT1' || filter === 'IKT2') {
      filtered = filtered.filter(q => q.exam === filter);
    } else if (filter !== 'all') {
      filtered = filtered.filter(q => q.category === filter);
    }

    // Apply sort
    if (sort === 'exam') {
      filtered.sort((a, b) => {
        if (a.exam === b.exam) return a.id - b.id;
        return a.exam.localeCompare(b.exam);
      });
    } else if (sort === 'category') {
      filtered.sort((a, b) => {
        if (a.category === b.category) return a.id - b.id;
        return a.category.localeCompare(b.category);
      });
    }
    // chronological is already sorted by id

    setQuestions(filtered);
  }, [filter, sort]);

  const toggleKnown = (questionId) => {
    setProgress(prev => ({
      ...prev,
      itQuestions: {
        ...(prev.itQuestions || {}),
        [questionId]: {
          ...(prev.itQuestions?.[questionId] || {}),
          known: !(prev.itQuestions?.[questionId]?.known || false),
          lastReviewed: new Date().toISOString(),
        }
      }
    }));
  };

  const isKnown = (questionId) => {
    return progress.itQuestions?.[questionId]?.known || false;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Hardware': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Operační systémy': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Počítačové sítě': { bg: 'bg-green-100', text: 'text-green-700' },
      'Programování': { bg: 'bg-orange-100', text: 'text-orange-700' },
      'Databázové systémy': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Zobrazeno {questions.length} otázek. Klikni na otázku pro zobrazení detailu.
        </p>
      </div>

      {questions.map((question) => {
        const known = isKnown(question.id);
        const color = getCategoryColor(question.category);

        return (
          <Link
            key={question.id}
            to={`/it/question/${question.id}`}
            className={`block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border-2 ${
              known ? 'border-green-300 dark:border-green-700' : 'border-transparent dark:border-gray-700'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      #{question.id}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${color.bg} ${color.text}`}>
                      {question.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {question.exam}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {question.question}
                  </h3>
                </div>
                
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    toggleKnown(question.id);
                  }}
                  className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    known
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {known ? (
                    <>
                      <FaCheck className="mr-2" />
                      Znám
                    </>
                  ) : (
                    <>
                      <FaTimes className="mr-2" />
                      Neznám
                    </>
                  )}
                </div>
              </div>

              {question.keywords && question.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.keywords.slice(0, 5).map((keyword, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                  {question.keywords.length > 5 && (
                    <span className="px-2 py-1 text-gray-500 dark:text-gray-500 text-xs">
                      +{question.keywords.length - 5} dalších
                    </span>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                Klikni pro zobrazení odpovědi →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuestionList;
