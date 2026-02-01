/**
 * CompactContent - Renders ultra-compact mobile-first content 
 * Optimized for minimal scrolling on mobile devices
 * Uses bullet points, bold terms, short lines
 */
const CompactContent = ({ content, keywords = [] }) => {
    if (!content || !content.sections) {
        return (
            <div className="text-terminal-text/50 italic text-sm">
                Zkrácená verze není k dispozici
            </div>
        );
    }

    // Highlight keywords in text
    const highlightKeywords = (text) => {
        if (!keywords.length || !text) return text;

        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) => {
            if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
                return (
                    <span key={i} className="text-terminal-accent font-semibold">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    // Render compact list item
    const renderCompactItem = (item, index) => {
        if (typeof item === 'string') {
            return (
                <li key={index} className="text-xs leading-tight">
                    {highlightKeywords(item)}
                </li>
            );
        }

        if (item.term) {
            return (
                <li key={index} className="text-xs leading-tight">
                    <strong className="text-terminal-accent">{item.term}</strong>
                    {item.definition && (
                        <span className="text-terminal-text/70"> – {highlightKeywords(item.definition)}</span>
                    )}
                </li>
            );
        }

        return null;
    };

    // Render compact section
    const renderSection = (section, index) => {
        return (
            <div key={index} className="mb-3">
                {section.title && (
                    <h3 className="text-xs font-bold text-terminal-accent mb-1 uppercase tracking-wide">
                        {section.title}
                    </h3>
                )}

                {section.text && (
                    <p className="text-xs text-terminal-text/80 mb-1 leading-tight">
                        {highlightKeywords(section.text)}
                    </p>
                )}

                {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0 text-terminal-text/80 ml-1">
                        {section.items.map(renderCompactItem)}
                    </ul>
                )}

                {section.numberedItems && section.numberedItems.length > 0 && (
                    <ol className="list-decimal list-inside space-y-0 text-terminal-text/80 ml-1">
                        {section.numberedItems.map((item, i) => (
                            <li key={i} className="text-xs leading-tight">{item}</li>
                        ))}
                    </ol>
                )}

                {section.subsections && section.subsections.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-2 mt-1">
                        {sub.title && (
                            <span className="text-xs font-semibold text-terminal-text/90">
                                {sub.title}:
                            </span>
                        )}
                        {sub.items && sub.items.length > 0 && (
                            <ul className="list-disc list-inside space-y-0 text-terminal-text/70 ml-1">
                                {sub.items.map(renderCompactItem)}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="compact-content text-xs space-y-2">
            <div className="text-[10px] text-terminal-accent/60 uppercase tracking-widest mb-2 pb-1 border-b border-terminal-border/20">
                📱 Mobilní zkrácená verze
            </div>
            {content.sections.map(renderSection)}
        </div>
    );
};

export default CompactContent;
