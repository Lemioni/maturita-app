import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaRedo } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';

const QuizMode = ({ filter }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let filtered = [...itQuestionsData.questions];

    if (filter === 'IKT1' || filter === 'IKT2') {
      filtered = filtered.filter(q => q.exam === filter);
    } else if (filter !== 'all') {
      filtered = filtered.filter(q => q.category === filter);
    }

    // Shuffle questions
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  }, [filter]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    setShowAnswer(true);
  };

  const handleNext = (wasCorrect) => {
    setScore(prev => ({
      correct: prev.correct + (wasCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (!currentQuestion) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Žádné otázky k zobrazení</p>
      </div>
    );
  }

  const isFinished = currentIndex >= questions.length - 1 && showAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Otázka {currentIndex + 1} z {questions.length}</span>
          <span>
            Skóre: {score.correct} / {score.total} 
            {score.total > 0 && ` (${Math.round((score.correct / score.total) * 100)}%)`}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {currentQuestion.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {currentQuestion.exam}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h2>
          </div>

          {!showAnswer ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tvoje odpověď:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Napiš, co víš o této otázce..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="6"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 w-full px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
              >
                Zobrazit správnou odpověď
              </button>
            </div>
          ) : (
            <div>
              {userAnswer && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tvoje odpověď:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{userAnswer}</p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Správná odpověď:</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentQuestion.answer}</p>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <p className="text-center text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  Odpověděl/a jsi správně?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleNext(false)}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors font-medium"
                  >
                    <FaTimes className="mr-2" />
                    Ne, neznám
                  </button>
                  <button
                    onClick={() => handleNext(true)}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors font-medium"
                  >
                    <FaCheck className="mr-2" />
                    Ano, znám
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {score.correct / score.total >= 0.8 ? '🎉' : score.correct / score.total >= 0.5 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Kvíz dokončen!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tvoje skóre: {score.correct} z {score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{score.correct}</div>
              <div className="text-sm text-green-600 dark:text-green-500">Správně</div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{score.total - score.correct}</div>
              <div className="text-sm text-red-600 dark:text-red-500">Špatně</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {Math.round((score.correct / score.total) * 100)}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-500">Úspěšnost</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center mx-auto px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
          >
            <FaRedo className="mr-2" />
            Zkusit znovu
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizMode;
