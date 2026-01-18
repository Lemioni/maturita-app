import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect } from 'react';
import itQuestionsData from '../data/it-questions.json';
import useLocalStorage from '../hooks/useLocalStorage';
import formatAnswer from '../utils/formatAnswer';
import KnowledgeCheckbox from '../components/common/KnowledgeCheckbox';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const questionId = parseInt(id);
  const question = itQuestionsData.questions.find(q => q.id === questionId);
  
  if (!question) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="terminal-card border-l-4 border-terminal-red">
          <h2 className="text-lg font-bold text-terminal-red mb-2">ERROR: QUESTION NOT FOUND</h2>
          <p className="text-terminal-text/60 mb-4">Question #{id} does not exist.</p>
          <Link to="/it" className="text-terminal-green hover:underline">
            ← BACK TO LIST
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
  
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/it')}
        className="flex items-center text-terminal-green hover:text-terminal-border transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        BACK
      </button>
      
      {/* Question Header */}
      <div className="terminal-card">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-terminal-text/60">#{question.id}</span>
          <span className="text-xs px-2 py-1 border border-terminal-border/30 text-terminal-text/80">
            {question.category}
          </span>
          <span className="text-xs px-2 py-1 border border-terminal-text/20 text-terminal-text/60">
            {question.exam}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-terminal-green mb-4">
          {question.question}
        </h1>
        
        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-terminal-text/60">STATUS:</span>
          <KnowledgeCheckbox
            questionId={questionId}
            initialKnown={isKnown}
            onChange={toggleKnown}
          />
        </div>
      </div>
      
      {/* Answer Content */}
      <div className="terminal-card">
        <div className="text-xs text-terminal-text/60 mb-3 pb-2 border-b border-terminal-border/20">
          &gt; ANSWER
        </div>
        
        <div 
          className="prose prose-invert prose-sm max-w-none text-terminal-text/90"
          dangerouslySetInnerHTML={{ __html: formatAnswer(question.answer) }}
        />
        
        {/* Keywords */}
        {question.keywords && question.keywords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-terminal-border/20">
            <div className="text-xs text-terminal-text/60 mb-2">&gt; KEYWORDS</div>
            <div className="flex flex-wrap gap-2">
              {question.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2 py-1 border border-terminal-text/20 text-xs text-terminal-text/70"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        {prevQuestion ? (
          <Link
            to={`/it/question/${prevQuestion.id}`}
            className="icon-btn flex items-center gap-2"
          >
            <FaChevronLeft />
            <span className="text-xs">#{prevQuestion.id}</span>
          </Link>
        ) : (
          <div></div>
        )}
        
        {nextQuestion ? (
          <Link
            to={`/it/question/${nextQuestion.id}`}
            className="icon-btn flex items-center gap-2"
          >
            <span className="text-xs">#{nextQuestion.id}</span>
            <FaChevronRight />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
