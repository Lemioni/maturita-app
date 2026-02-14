import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCompress, FaExpand } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import itQuestionsData from '../data/it-questions.json';
import useLocalStorage from '../hooks/useLocalStorage';
import { extractHeadings } from '../utils/markdownComponents';
import KnowledgeCheckbox from '../components/common/KnowledgeCheckbox';
import TableOfContents from '../components/common/TableOfContents';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import StructuredContent from '../components/common/StructuredContent';
import CompactContent from '../components/common/CompactContent';
import IsoOsiModal from '../components/common/IsoOsiModal';
import { FaLayerGroup } from 'react-icons/fa';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [isCompactMode, setIsCompactMode] = useLocalStorage('compact-mode', false);
  const [isIsoModalOpen, setIsIsoModalOpen] = useState(false);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const questionId = parseInt(id);
  const question = itQuestionsData.questions.find(q => q.id === questionId);

  // Format the answer
  // We only need to strip the redundant title since the content is now pre-formatted Markdown
  const formattedAnswer = useMemo(() => {
    if (!question) return '';
    let answerText = question.answer;

    // Get the first line and normalize it for comparison
    const firstLineMatch = answerText.match(/^([^\n]+)/);
    if (firstLineMatch) {
      const firstLine = firstLineMatch[1];

      // Normalize strings: remove numbers, punctuation, extra spaces, and convert to lowercase
      const distinctChars = (str) => str.toLowerCase().replace(/[0-9.]/g, '').replace(/[^a-z0-9]/g, '');
      const normalizedTitle = distinctChars(question.question);
      const normalizedFirstLine = distinctChars(firstLine);

      // Check for strong similarity (if the title is contained in the first line or vice versa)
      if (normalizedFirstLine.includes(normalizedTitle) || normalizedTitle.includes(normalizedFirstLine)) {
        answerText = answerText.replace(/^.*\n+/, '');
      }
      // Fallback for the explicit ID pattern
      else {
        const titleRegex = new RegExp(`^${question.id}\\.\\s+.*`);
        if (titleRegex.test(answerText)) {
          answerText = answerText.replace(/^.*\n+/, '');
        }
      }
    }

    return answerText;
  }, [question]);

  // Extract table of contents from formatted answer
  const tableOfContents = useMemo(() => {
    if (!formattedAnswer) return [];
    return extractHeadings(formattedAnswer);
  }, [formattedAnswer]);

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="terminal-card border-l-4 border-terminal-red">
          <h2 className="text-lg font-bold text-terminal-red mb-2">ERROR: QUESTION NOT FOUND</h2>
          <p className="text-terminal-text/60 mb-4">Question #{id} does not exist.</p>
          <Link to="/it" className="text-terminal-accent hover:underline">
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
    <div className="container mx-auto px-2 py-3 sm:p-4 max-w-4xl">
      <Link to="/it" className="inline-flex items-center text-terminal-accent hover:text-terminal-border mb-6 transition-colors">
        <FaArrowLeft className="w-5 h-5 mr-2" />
        BACK TO LIST
      </Link>

      <div className="terminal-card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-terminal-text/60">#{question.id}</span>
              <span className="text-xs px-2 py-1 border border-terminal-border/30 text-terminal-text/80">
                {question.category}
              </span>
              <span className="text-xs px-2 py-1 border border-terminal-text/20 text-terminal-text/60">
                {question.exam}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-terminal-accent mt-2">{question.question}</h1>
          </div>

        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-terminal-text/80">STATUS:</span>
          <KnowledgeCheckbox
            questionId={questionId}
            initialKnown={isKnown}
            onChange={toggleKnown}
          />
        </div>
      </div>

      {/* Answer Content */}
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-terminal-border/20">
          <span className="text-xs text-terminal-text/80">ANSWER</span>

          <div className="flex gap-2">
            {/* ISO/OSI Modal Trigger */}
            {question.id >= 11 && question.id <= 20 && (
              <button
                onClick={() => setIsIsoModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-terminal-border/30 text-terminal-text/70 hover:text-terminal-accent hover:border-terminal-accent/50 transition-all"
              >
                <FaLayerGroup className="w-3 h-3" />
                <span className="hidden sm:inline">ISO/OSI</span>
              </button>
            )}

            {/* Compact mode toggle - only for questions with compactContent */}
            {question.compactContent && (
              <button
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded border transition-all ${isCompactMode
                  ? 'bg-terminal-accent/20 text-terminal-accent border-terminal-accent/50'
                  : 'text-terminal-text/60 border-terminal-border/30 hover:border-terminal-accent/50'
                  }`}
              >
                {isCompactMode ? <FaExpand className="w-3 h-3" /> : <FaCompress className="w-3 h-3" />}
                {isCompactMode ? 'Plná verze' : 'Zkrátit'}
              </button>
            )}
          </div>
        </div>

        {/* Table of Contents - only for markdown content in full mode */}
        {!isCompactMode && !question.content && tableOfContents.length > 0 && (
          <TableOfContents sections={tableOfContents} />
        )}

        {/* Render content - compact, structured, or markdown */}
        {isCompactMode && question.compactContent ? (
          <CompactContent
            content={question.compactContent}
            keywords={question.keywords}
          />
        ) : question.content ? (
          <StructuredContent
            content={question.content}
            keywords={question.keywords}
          />
        ) : (
          <MarkdownRenderer
            content={formattedAnswer}
            keywords={question.keywords}
          />
        )}

        {/* Keywords */}
        {question.keywords && question.keywords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-terminal-border/20">
            <div className="text-xs text-terminal-text/60 mb-2">KEYWORDS</div>
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

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
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


        <IsoOsiModal
          isOpen={isIsoModalOpen}
          onClose={() => setIsIsoModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default QuestionDetailPage;
