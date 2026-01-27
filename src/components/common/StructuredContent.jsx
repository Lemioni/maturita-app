/**
 * StructuredContent - Renders structured question content with proper HTML elements
 * 
 * Supports:
 * - Sections with titles (h2)
 * - Subsections (h3)
 * - Text paragraphs
 * - Bullet lists
 * - Numbered lists
 * - Term/definition pairs
 */
const StructuredContent = ({ content, keywords = [] }) => {
    if (!content || !content.sections) {
        return (
            <div className="text-terminal-text/50 italic">
                Zatím není vyplněno
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
                    <span key={i} className="bg-terminal-accent/20 text-terminal-accent px-0.5 sm:px-1 rounded">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    // Render a list item (bullet or numbered)
    const renderListItem = (item, index) => {
        if (typeof item === 'string') {
            return <li key={index} className="mb-0.5 sm:mb-1">{highlightKeywords(item)}</li>;
        }

        // Item with term and definition
        if (item.term) {
            return (
                <li key={index} className="mb-1 sm:mb-2">
                    <strong className="text-terminal-accent">{item.term}</strong>
                    {item.definition && (
                        <span className="text-terminal-text/80"> – {highlightKeywords(item.definition)}</span>
                    )}
                </li>
            );
        }

        return null;
    };

    // Render a section
    const renderSection = (section, index) => {
        return (
            <section key={index} className="mb-4 sm:mb-6" id={section.title?.toLowerCase().replace(/\s+/g, '-')}>
                {/* Section Title */}
                {section.title && (
                    <h2 className="text-base sm:text-xl font-bold text-terminal-accent mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-terminal-border/30">
                        {section.title}
                    </h2>
                )}

                {/* Section Text */}
                {section.text && (
                    <p className="text-sm sm:text-base text-terminal-text/90 mb-2 sm:mb-4 leading-relaxed">
                        {highlightKeywords(section.text)}
                    </p>
                )}

                {/* Bullet Items */}
                {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-4 text-sm sm:text-base text-terminal-text/80 ml-1 sm:ml-2">
                        {section.items.map(renderListItem)}
                    </ul>
                )}

                {/* Numbered Items */}
                {section.numberedItems && section.numberedItems.length > 0 && (
                    <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-4 text-sm sm:text-base text-terminal-text/80 ml-1 sm:ml-2">
                        {section.numberedItems.map(renderListItem)}
                    </ol>
                )}

                {/* Subsections */}
                {section.subsections && section.subsections.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-2 sm:ml-4 mb-2 sm:mb-4" id={sub.title?.toLowerCase().replace(/\s+/g, '-')}>
                        {sub.title && (
                            <h3 className="text-sm sm:text-lg font-semibold text-terminal-text mb-1 sm:mb-2">
                                {sub.title}
                            </h3>
                        )}

                        {sub.text && (
                            <p className="text-sm sm:text-base text-terminal-text/80 mb-2 sm:mb-3 leading-relaxed">
                                {highlightKeywords(sub.text)}
                            </p>
                        )}

                        {sub.items && sub.items.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3 text-sm sm:text-base text-terminal-text/70 ml-1 sm:ml-2">
                                {sub.items.map(renderListItem)}
                            </ul>
                        )}

                        {sub.numberedItems && sub.numberedItems.length > 0 && (
                            <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3 text-sm sm:text-base text-terminal-text/70 ml-1 sm:ml-2">
                                {sub.numberedItems.map(renderListItem)}
                            </ol>
                        )}
                    </div>
                ))}
            </section>
        );
    };

    return (
        <div className="structured-content text-sm sm:text-base">
            {content.sections.map(renderSection)}
        </div>
    );
};

export default StructuredContent;

