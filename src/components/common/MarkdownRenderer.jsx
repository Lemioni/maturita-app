import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import createMarkdownComponents from '../../utils/markdownComponents';

const MarkdownRenderer = ({ content, keywords = [] }) => {
    // Memoize components to prevent re-creation on every render
    const components = useMemo(
        () => createMarkdownComponents(keywords),
        [keywords]
    );

    if (!content) {
        return (
            <div className="text-terminal-text/50 italic">
                Zatím není vyplněno - doplníš odpověď později
            </div>
        );
    }

    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
