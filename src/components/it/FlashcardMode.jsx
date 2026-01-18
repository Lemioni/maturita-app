import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRandom, FaRedo } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';

const FlashcardMode = ({ filter }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let filtered = [...itQuestionsData.questions];

    if (filter === 'IKT1' || filter === 'IKT2') {
      filtered = filtered.filter(q => q.exam === filter);
    } else if (filter !== 'all') {
      filtered = filtered.filter(q => q.category === filter);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filter]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markAsKnown = (known) => {
    if (!currentQuestion) return;
    
    setProgress(prev => ({
      ...prev,
      itQuestions: {
        ...(prev.itQuestions || {}),
        [currentQuestion.id]: {
          ...(prev.itQuestions?.[currentQuestion.id] || {}),
          known,
          lastReviewed: new Date().toISOString(),
        }
      }
    }));
    
    handleNext();
  };

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600">Žádné otázky k zobrazení</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-gray-600">
          Otázka {currentIndex + 1} z {questions.length}
        </div>
        <button
          onClick={handleShuffle}
          className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <FaRandom className="mr-2" />
          Zamíchat
        </button>
      </div>

      <div className="perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full bg-white rounded-2xl shadow-2xl cursor-pointer transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ minHeight: '400px' }}
        >
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden p-12 ${isFlipped ? 'hidden' : ''}`}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4 flex gap-2">
                <span className="px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-700">
                  {currentQuestion.category}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-700">
                  {currentQuestion.exam}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-4">#{currentQuestion.id}</div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {currentQuestion.question}
              </h2>
              <div className="mt-8 text-gray-400 text-sm">
                Klikni pro zobrazení odpovědi
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden p-12 ${!isFlipped ? 'hidden' : ''}`}>
            <div className="flex flex-col h-full">
              <div className="text-sm text-gray-500 mb-2">Odpověď:</div>
              <div className="flex-1 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentQuestion.answer}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Znáš tuto odpověď?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsKnown(false);
                    }}
                    className="flex-1 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  >
                    Neznám
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsKnown(true);
                    }}
                    className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                  >
                    Znám
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center px-6 py-3 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
        >
          <FaArrowLeft className="mr-2" />
          Předchozí
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
        >
          Další
          <FaArrowRight className="ml-2" />
        </button>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default FlashcardMode;
