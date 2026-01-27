import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import flashcardsData from '../../data/flashcards-data.json';
import itQuestionsData from '../../data/it-questions.json';

const FlashcardMode = ({ filter, subjectFilter }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let filtered = [...flashcardsData.flashcards];

    // Apply subject filter
    if (subjectFilter && subjectFilter !== 'all') {
      filtered = filtered.filter(card => {
        const question = itQuestionsData.questions.find(q => q.id === card.questionId);
        return question && question.category === subjectFilter;
      });
    }

    // Get progress from localStorage
    const progressData = JSON.parse(localStorage.getItem('maturita-progress') || '{}');

    // Filter by known/unknown status
    if (filter === 'known') {
      filtered = filtered.filter(card => {
        const question = itQuestionsData.questions.find(q => q.id === card.questionId);
        return question && progressData.itQuestions?.[question.id]?.known === true;
      });
    } else if (filter === 'unknown') {
      filtered = filtered.filter(card => {
        const question = itQuestionsData.questions.find(q => q.id === card.questionId);
        return question && !progressData.itQuestions?.[question.id]?.known;
      });
    }

    setFlashcards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filter, subjectFilter]);

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

  if (flashcards.length === 0) {
    return (
      <div className="terminal-card text-center">
        <p className="text-terminal-text/60 mb-2">
          NO FLASHCARDS FOR THIS FILTER
        </p>
        <p className="text-xs text-terminal-text/40">
          Flashcards available only for specific questions
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-terminal-text/60">
          {currentIndex + 1} / {flashcards.length}
        </div>
        <button
          onClick={handleShuffle}
          className="icon-btn"
          title="Shuffle"
        >
          <FaRandom />
        </button>
      </div>

      {/* Parent Question Link */}
      {parentQuestion && (
        <Link
          to={`/it/question/${parentQuestion.id}`}
          className="block text-xs text-terminal-accent hover:text-terminal-border transition-colors border-l-2 border-terminal-border/30 pl-2"
        >
          &gt; FROM Q#{parentQuestion.id}: {parentQuestion.question}
        </Link>
      )}

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="terminal-card cursor-pointer transition-all duration-300"
      >
        {/* Question */}
        <div className="p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-terminal-accent/60 mb-4 tracking-wider">
              &gt; QUESTION
            </div>
            <h2 className="text-xl text-center text-terminal-text">
              {currentFlashcard.front}
            </h2>
            {!isFlipped && (
              <div className="mt-6 text-xs text-terminal-text/40">
                [ CLICK TO REVEAL ]
              </div>
            )}
          </div>
        </div>

        {/* Answer - Slide down */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${isFlipped ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="border-t border-terminal-border/30 p-8">
            <div className="text-xs text-terminal-accent/60 mb-3 tracking-wider">
              &gt; ANSWER
            </div>
            <p className="text-sm text-terminal-text/90 whitespace-pre-wrap">
              {currentFlashcard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          className="icon-btn flex items-center gap-2"
        >
          <FaArrowLeft />
          <span className="text-xs">PREV</span>
        </button>
        <button
          onClick={handleNext}
          className="icon-btn flex items-center gap-2"
        >
          <span className="text-xs">NEXT</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;
