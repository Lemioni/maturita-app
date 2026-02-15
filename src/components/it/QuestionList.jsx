import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itQuestionsData from '../../data/it-questions.json';
import useLocalStorage from '../../hooks/useLocalStorage';
import KnowledgeCheckbox from '../common/KnowledgeCheckbox';
import { useExperimental } from '../../context/ExperimentalContext';

const QuestionList = ({ filter, subjectFilter }) => {
  const [progress, setProgress] = useLocalStorage('maturita-progress', {});
  const [questions, setQuestions] = useState([]);
  const { frutigerAero } = useExperimental();

  useEffect(() => {
    let filtered = [...itQuestionsData.questions];

    // Apply subject filter
    if (subjectFilter && subjectFilter !== 'all') {
      filtered = filtered.filter(q => q.category === subjectFilter);
    }

    // Apply filter based on known status
    if (filter === 'known') {
      filtered = filtered.filter(q => progress.itQuestions?.[q.id]?.known === true);
    } else if (filter === 'unknown') {
      filtered = filtered.filter(q => !progress.itQuestions?.[q.id]?.known);
    }

    setQuestions(filtered);
  }, [filter, subjectFilter, progress]);

  const updateKnowledge = (questionId, known) => {
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

  const isKnown = (questionId) => {
    return progress.itQuestions?.[questionId]?.known || false;
  };

  if (frutigerAero) {
    return (
      <div className="space-y-1 pl-2">
        {questions.map((question) => {
          const known = isKnown(question.id);
          return (
            <div key={question.id} className="flex items-center gap-2 text-sm font-serif">
              <img src="/aero-icons/vista_pc_1.ico" alt="PC" className="w-4 h-4" />
              <Link
                to={`/it/question/${question.id}`}
                className="text-blue-700 underline hover:text-blue-900 truncate max-w-[70%]"
                title={question.question}
              >
                {question.question}
              </Link>

              <div className="ml-auto pr-2">
                <KnowledgeCheckbox
                  questionId={question.id}
                  initialKnown={known}
                  onChange={(newValue) => updateKnowledge(question.id, newValue)}
                />
              </div>
            </div>
          );
        })}
        {questions.length === 0 && <p className="text-gray-500 italic">No questions found.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-terminal-text/60 border-l-2 border-terminal-border/30 pl-3">
        {questions.length} QUESTIONS
      </div>

      {questions.map((question) => {
        const known = isKnown(question.id);

        return (
          <div
            key={question.id}
            className="terminal-card group"
          >
            <div className="flex items-start justify-between gap-4">
              <Link
                to={`/it/question/${question.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-terminal-text/60">#{question.id}</span>
                  <span className="text-xs px-1 border border-terminal-text/20 text-terminal-text/60">
                    {question.category.substring(0, 10)}
                  </span>
                  <span className="text-xs text-terminal-text/40">{question.exam}</span>
                </div>
                <h3 className="text-sm text-terminal-text group-hover:text-terminal-accent transition-colors">
                  {question.question}
                </h3>

                {question.keywords && question.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {question.keywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-1 text-xs text-terminal-text/40"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </Link>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0"
              >
                <KnowledgeCheckbox
                  questionId={question.id}
                  initialKnown={known}
                  onChange={(newValue) => updateKnowledge(question.id, newValue)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
