import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import itQuestionsData from '../data/it-questions.json';
import useLocalStorage from '../hooks/useLocalStorage';
import formatAnswer from '../utils/formatAnswer';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  
  const questionId = parseInt(id);
  const question = itQuestionsData.questions.find(q => q.id === questionId);
  
  if (!question) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Otázka nenalezena</h2>
          <p className="text-red-700 dark:text-red-400">Otázka #{id} neexistuje.</p>
          <Link to="/it" className="mt-4 inline-block text-red-600 dark:text-red-400 hover:underline">
            ← Zpět na seznam otázek
          </Link>
        </div>
      </div>
    );
  }
  
  const currentIndex = itQuestionsData.questions.findIndex(q => q.id === questionId);
  const prevQuestion = currentIndex > 0 ? itQuestionsData.questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < itQuestionsData.questions.length - 1 ? itQuestionsData.questions[currentIndex + 1] : null;
  
  const isKnown = progress.itQuestions?.[questionId]?.known || false;
  
  const toggleKnown = (known) => {
    setProgress(prev => ({
      ...prev,
      itQuestions: {
        ...(prev.itQuestions || {}),
        [questionId]: {
          ...(prev.itQuestions?.[questionId] || {}),
          known,
          lastReviewed: new Date().toISOString(),
        }
      }
    }));
  };
  
  const getCategoryColor = (category) => {
    const colors = {
      'Hardware': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300' },
      'Operační systémy': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300' },
      'Počítačové sítě': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300' },
      'Programování': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300' },
      'Databázové systémy': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300' },
    };
    return colors[category] || { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' };
  };
  
  const color = getCategoryColor(question.category);
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/it')}
        className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Zpět na seznam otázek
      </button>
      
      {/* Question Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-transparent dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">#{question.id}</span>
          <span className={`px-3 py-1 text-sm font-medium rounded ${color.bg} ${color.text}`}>
            {question.category}
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {question.exam}
          </span>
          {question.difficulty && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {question.difficulty}
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {question.question}
        </h1>
        
        {/* Know/Don't Know Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => toggleKnown(false)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isKnown === false
                ? 'bg-red-500 text-white'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
            }`}
          >
            <FaTimes className="mr-2" />
            Neznám
          </button>
          <button
            onClick={() => toggleKnown(true)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isKnown === true
                ? 'bg-green-500 text-white'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
          >
            <FaCheck className="mr-2" />
            Znám
          </button>
        </div>
      </div>
      
      {/* Answer Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6 border border-transparent dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          Odpověď
        </h2>
        
        <div 
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formatAnswer(question.answer) }}
        />
        
        {/* Keywords */}
        {question.keywords && question.keywords.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Klíčová slova:</h3>
            <div className="flex flex-wrap gap-2">
              {question.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        {prevQuestion ? (
          <Link
            to={`/it/question/${prevQuestion.id}`}
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-lg transition-all border border-transparent dark:border-gray-700"
          >
            <FaChevronLeft className="mr-2" />
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-400">Předchozí</div>
              <div className="font-medium">Otázka #{prevQuestion.id}</div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
        
        {nextQuestion ? (
          <Link
            to={`/it/question/${nextQuestion.id}`}
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-lg transition-all border border-transparent dark:border-gray-700"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Další</div>
              <div className="font-medium">Otázka #{nextQuestion.id}</div>
            </div>
            <FaChevronRight className="ml-2" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
