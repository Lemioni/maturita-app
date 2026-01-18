import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';

const QuestionList = ({ filter, sort }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [expandedId, setExpandedId] = useState(null);
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
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          Zobrazeno {questions.length} otázek
        </p>
      </div>

      {questions.map((question) => {
        const known = isKnown(question.id);
        const expanded = expandedId === question.id;
        const color = getCategoryColor(question.category);

        return (
          <div
            key={question.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
              known ? 'border-2 border-green-300' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-500">
                      #{question.id}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${color.bg} ${color.text}`}>
                      {question.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                      {question.exam}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {question.question}
                  </h3>
                </div>
                
                <button
                  onClick={() => toggleKnown(question.id)}
                  className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    known
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                </button>
              </div>

              <button
                onClick={() => setExpandedId(expanded ? null : question.id)}
                className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center font-medium"
              >
                {expanded ? (
                  <>
                    <FaChevronUp className="mr-2" />
                    Skrýt odpověď
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-2" />
                    Zobrazit odpověď
                  </>
                )}
              </button>

              {expanded && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Odpověď:</h4>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {question.answer}
                  </div>
                  
                  {question.keywords && question.keywords.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Klíčová slova:</h5>
                      <div className="flex flex-wrap gap-2">
                        {question.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white text-gray-600 text-xs rounded border border-gray-200"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
