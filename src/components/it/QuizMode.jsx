import { useState, useEffect, useRef } from 'react';
import { FaCheck, FaTimes, FaRedo, FaChevronDown, FaRandom, FaMinus, FaPlus } from 'react-icons/fa';
import itQuestionsData from '../../data/it-questions.json';

const QuizMode = ({ filter, subjectFilter }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [revealedQuestions, setRevealedQuestions] = useState(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const questionRefs = useRef({});

  useEffect(() => {
    let filtered = [...itQuestionsData.questions];

    // Apply subject filter
    if (subjectFilter && subjectFilter !== 'all') {
      filtered = filtered.filter(q => q.category === subjectFilter);
    }

    // Get progress from localStorage
    const progressData = JSON.parse(localStorage.getItem('maturita-progress') || '{}');

    // Filter by known/unknown status
    if (filter === 'known') {
      filtered = filtered.filter(q => progressData.itQuestions?.[q.id]?.known === true);
    } else if (filter === 'unknown') {
      filtered = filtered.filter(q => !progressData.itQuestions?.[q.id]?.known);
    }

    // Shuffle
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setAllQuestions(shuffled);
    resetQuiz(shuffled, questionCount);
  }, [filter, subjectFilter]);

  const resetQuiz = (questions, count) => {
    setQuizQuestions(questions.slice(0, count));
    setCurrentIndex(0);
    setRevealedQuestions(new Set());
    setAnsweredQuestions(new Set());
    setScore({ correct: 0, wrong: 0 });
  };

  const handleQuestionCountChange = (delta) => {
    const newCount = Math.max(1, Math.min(20, questionCount + delta));
    setQuestionCount(newCount);
    resetQuiz(allQuestions, newCount);
  };

  const handleShuffle = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setAllQuestions(shuffled);
    resetQuiz(shuffled, questionCount);
  };

  const handleReveal = (questionId) => {
    setRevealedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleAnswer = (questionId, isCorrect) => {
    setAnsweredQuestions(prev => new Set([...prev, questionId]));
    setScore(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1)
    }));

    // Scroll to next question
    setTimeout(() => {
      const nextIndex = answeredQuestions.size + 1;
      if (nextIndex < quizQuestions.length) {
        const nextQuestion = quizQuestions[nextIndex];
        if (nextQuestion && questionRefs.current[nextQuestion.id]) {
          questionRefs.current[nextQuestion.id].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }, 100);
  };

  const isQuizComplete = answeredQuestions.size === quizQuestions.length && quizQuestions.length > 0;
  const currentQuestionIndex = answeredQuestions.size;

  if (allQuestions.length === 0) {
    return (
      <div className="terminal-card text-center">
        <p className="text-terminal-text/60 mb-2">
          ŽÁDNÉ OTÁZKY PRO TENTO FILTR
        </p>
        <p className="text-xs text-terminal-text/40">
          Vyber jiný filtr
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-terminal-text/60">
          {quizQuestions.length} otázek
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => handleQuestionCountChange(-1)} className="icon-btn p-1">
              <FaMinus className="text-xs" />
            </button>
            <span className="text-xs text-terminal-text/60 w-4 text-center">{questionCount}</span>
            <button onClick={() => handleQuestionCountChange(1)} className="icon-btn p-1">
              <FaPlus className="text-xs" />
            </button>
          </div>
          <button onClick={handleShuffle} className="icon-btn" title="Zamíchat">
            <FaRandom />
          </button>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="terminal-card">
        {/* Header */}
        <div className="p-4 border-b border-terminal-border/30 text-center">
          <div className="text-xs text-terminal-accent/60 tracking-wider">
            KVÍZ
          </div>
        </div>

        {/* Questions */}
        <div>
          {quizQuestions.map((q, index) => {
            const isRevealed = revealedQuestions.has(q.id);
            const isAnswered = answeredQuestions.has(q.id);
            const isActive = index === currentQuestionIndex;
            const isFuture = index > currentQuestionIndex;

            if (isFuture) return null;

            return (
              <div
                key={q.id}
                ref={el => questionRefs.current[q.id] = el}
                className={`border-b border-terminal-border/20 last:border-b-0 transition-all duration-300 ${isActive ? '' : 'opacity-60'
                  }`}
              >
                {/* Question */}
                <div
                  className={`p-4 ${!isRevealed && isActive ? 'cursor-pointer hover:bg-terminal-accent/5' : ''}`}
                  onClick={() => !isRevealed && isActive && handleReveal(q.id)}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-terminal-accent/60">
                      {index + 1}.
                    </span>
                    <span className="text-terminal-text text-center">
                      {q.question}
                    </span>
                    {!isRevealed && isActive && (
                      <FaChevronDown className="text-terminal-text/40" />
                    )}
                    {isAnswered && (
                      <span className="text-xs text-terminal-accent">✓</span>
                    )}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="text-xs px-1 border border-terminal-text/20 text-terminal-text/40">
                      {q.category}
                    </span>
                    <span className="text-xs text-terminal-text/30">{q.exam}</span>
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${isRevealed ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-4 pb-4 text-center">
                    <div className="bg-terminal-bg/50 p-4 border border-terminal-border/30">
                      <div className="text-xs text-terminal-accent/60 mb-2">
                        ODPOVĚĎ
                      </div>
                      <p className="text-terminal-text/90 whitespace-pre-line text-sm text-left">
                        {q.answer}
                      </p>

                      {!isAnswered && (
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAnswer(q.id, true); }}
                            className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Umím"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAnswer(q.id, false); }}
                            className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Neumím"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiz Complete Summary */}
        {isQuizComplete && (
          <div className="p-6 text-center border-t border-terminal-accent/30 bg-terminal-accent/5">
            <div className="text-xs text-terminal-accent mb-4 tracking-wider">
              VÝSLEDEK
            </div>
            <div className="flex justify-center gap-8 mb-4">
              <div>
                <div className="text-3xl font-bold text-green-400">{score.correct}</div>
                <div className="text-xs text-terminal-text/50">Správně</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">{score.wrong}</div>
                <div className="text-xs text-terminal-text/50">Špatně</div>
              </div>
            </div>
            <div className="text-lg text-terminal-accent mb-4">
              {Math.round((score.correct / quizQuestions.length) * 100)}%
            </div>
            <button
              onClick={() => resetQuiz(allQuestions, questionCount)}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 border border-terminal-accent/30 text-terminal-accent hover:bg-terminal-accent/10 transition-colors"
            >
              <FaRedo />
              <span className="text-sm">Zkusit znovu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
