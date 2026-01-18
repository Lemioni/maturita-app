import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRandom, FaBook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import flashcardsData from '../../data/flashcards-data.json';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';

const FlashcardMode = ({ filter }) => {
  const [progress, setProgress] = useLocalStorage('maturita-flashcard-progress', {});
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let filtered = [...flashcardsData.flashcards];

    // Filter by exam or category
    if (filter === 'IKT1' || filter === 'IKT2') {
      filtered = filtered.filter(card => {
        const question = itQuestionsData.questions.find(q => q.id === card.questionId);
        return question?.exam === filter;
      });
    } else if (filter !== 'all') {
      filtered = filtered.filter(card => {
        const question = itQuestionsData.questions.find(q => q.id === card.questionId);
        return question?.category === filter;
      });
    }

    setFlashcards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filter]);

  const currentFlashcard = flashcards[currentIndex];
  const parentQuestion = currentFlashcard 
    ? itQuestionsData.questions.find(q => q.id === currentFlashcard.questionId)
    : null;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markAsKnown = (known) => {
    if (!currentFlashcard) return;
    
    setProgress(prev => ({
      ...prev,
      [currentFlashcard.id]: {
        ...(prev[currentFlashcard.id] || {}),
        known,
        lastReviewed: new Date().toISOString(),
      }
    }));
    
    handleNext();
  };

  if (flashcards.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Žádné flashcards k zobrazení pro tento filtr
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Flashcards jsou zatím dostupné pouze pro některé otázky. 
          Zkus zvolit "Všechny otázky" nebo jiný filtr.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-gray-600 dark:text-gray-400">
          Flashcard {currentIndex + 1} z {flashcards.length}
        </div>
        <button
          onClick={handleShuffle}
          className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
        >
          <FaRandom className="mr-2" />
          Zamíchat
        </button>
      </div>

      {/* Parent Question Info */}
      {parentQuestion && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBook className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Z otázky #{parentQuestion.id}: {parentQuestion.question}
              </span>
            </div>
            <Link 
              to={`/it/question/${parentQuestion.id}`}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Zobrazit celou otázku →
            </Link>
          </div>
        </div>
      )}

      <div className="perspective-1000">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl cursor-pointer transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ minHeight: '400px' }}
        >
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden p-12 ${isFlipped ? 'hidden' : ''}`}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-4 uppercase tracking-wider">
                Otázka
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                {currentFlashcard.front}
              </h2>
              <div className="mt-8 text-gray-400 dark:text-gray-500 text-sm">
                Klikni pro zobrazení odpovědi
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden p-12 ${!isFlipped ? 'hidden' : ''}`}>
            <div className="flex flex-col h-full">
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-4 uppercase tracking-wider">
                Odpověď
              </div>
              <div className="flex-1 overflow-y-auto">
                <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {currentFlashcard.back}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Znáš tuto odpověď?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsKnown(false);
                    }}
                    className="flex-1 px-6 py-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors font-medium"
                  >
                    Neznám
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsKnown(true);
                    }}
                    className="flex-1 px-6 py-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors font-medium"
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
          className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow text-gray-700 dark:text-gray-300"
        >
          <FaArrowLeft className="mr-2" />
          Předchozí
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow text-gray-700 dark:text-gray-300"
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
