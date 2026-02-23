import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Amber autoscroll-style markdown components — identical to AutoscrollPage
const mdComponents = {
    h1: ({ children }) => <h1 className="text-xl font-bold text-amber-400 mt-6 mb-2 pb-1 border-b border-amber-400/30">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold text-amber-400 mt-5 mb-2 pb-1 border-b border-amber-400/20">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold text-amber-300 mt-4 mb-1">{children}</h3>,
    h4: ({ children }) => <h4 className="text-sm font-bold text-amber-300/90 mt-3 mb-1">{children}</h4>,
    p: ({ children }) => <p className="text-sm leading-relaxed text-gray-200 mb-2">{children}</p>,
    strong: ({ children }) => <strong className="text-amber-300 font-bold">{children}</strong>,
    em: ({ children }) => <em className="text-amber-200/80 italic">{children}</em>,
    li: ({ children }) => <li className="text-sm text-gray-200 mb-0.5 ml-4 list-disc leading-relaxed">{children}</li>,
    ul: ({ children }) => <ul className="mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal ml-4">{children}</ol>,
    code: ({ inline, children }) => inline
        ? <code className="text-amber-300 bg-amber-400/10 px-1 rounded text-xs font-mono">{children}</code>
        : <pre className="bg-black/40 border border-amber-400/20 p-3 rounded text-xs text-gray-300 overflow-x-auto mb-2 font-mono"><code>{children}</code></pre>,
    table: ({ children }) => <table className="w-full text-sm mb-3 border-collapse">{children}</table>,
    thead: ({ children }) => <thead>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="text-left text-amber-400 text-xs uppercase border-b border-amber-400/30 pb-1 pr-3 py-1">{children}</th>,
    td: ({ children }) => <td className="text-gray-200 py-1 pr-3 border-b border-gray-700/50 text-sm">{children}</td>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-amber-400/50 pl-3 my-2 text-gray-300 italic">{children}</blockquote>,
    hr: () => <hr className="border-gray-700 my-4" />,
    a: ({ href, children }) => <a href={href} className="text-amber-300 underline hover:text-amber-200 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
};

const MarkdownRenderer = ({ content }) => {
    if (!content) {
        return (
            <div className="text-gray-500 italic text-sm">
                Zatím není vyplněno - doplníš odpověď později
            </div>
        );
    }

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;

