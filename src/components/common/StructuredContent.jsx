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

        const escapedKeywords = keywords
            .filter(Boolean)
            .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        if (!escapedKeywords.length) return text;

        const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) => {
            if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
                return (
                    <span key={i} className="bg-terminal-accent/20 text-terminal-accent px-1 rounded-sm font-medium">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    const renderSmartString = (value) => {
        const headingLike = value.match(/^([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0-9\s\/().,+-]{3,80}):$/);
        if (headingLike) {
            return <span className="font-semibold text-terminal-accent tracking-wide">{headingLike[1]}</span>;
        }

        const termDefinition = value.match(/^([^:]{2,80})\s[–-]\s(.+)$/);
        if (termDefinition) {
            return (
                <>
                    <strong className="text-terminal-accent">{termDefinition[1].trim()}</strong>
                    <span className="text-terminal-text/80"> – {highlightKeywords(termDefinition[2].trim())}</span>
                </>
            );
        }

        return highlightKeywords(value);
    };

    const isMarkerItem = (value) => {
        if (typeof value !== 'string') return false;
        const trimmed = value.trim();
        if (!trimmed) return false;

        const withYearOrParens = /^[A-Z0-9ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][A-Z0-9ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s./+-]{1,50}\s*\([^)]{2,24}\)$/.test(trimmed);
        const shortUpperMarker = /^[A-Z0-9][A-Z0-9./+-]{1,12}$/.test(trimmed);

        return withYearOrParens || shortUpperMarker;
    };

    // Render a list item (bullet or numbered)
    const renderListItem = (item, index) => {
        if (typeof item === 'string') {
            if (isMarkerItem(item)) {
                return (
                    <li
                        key={index}
                        className="list-none mt-3 mb-1 -ml-1 pl-2 border-l-2 border-terminal-accent/45 text-terminal-accent font-semibold tracking-wide"
                    >
                        {highlightKeywords(item)}
                    </li>
                );
            }

            return <li key={index} className="mb-1 text-sm leading-relaxed">{renderSmartString(item)}</li>;
        }

        // Item with term and definition
        if (item.term) {
            return (
                <li key={index} className="mb-1 text-sm leading-relaxed">
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
        const isTipSection = /tip\s*k\s*maturit/i.test(section?.title || '');

        return (
            <section
                key={index}
                className={`mb-6 ${isTipSection ? 'border border-terminal-accent/30 bg-terminal-accent/5 p-3 rounded-sm' : ''}`}
                id={section.title?.toLowerCase().replace(/\s+/g, '-')}
            >
                {/* Section Title */}
                {section.title && (
                    <h2 className={`text-sm sm:text-base font-bold mb-2 pb-1 border-b ${isTipSection ? 'text-terminal-accent border-terminal-accent/30' : 'text-terminal-accent border-terminal-border/30'}`}>
                        {section.title}
                    </h2>
                )}

                {/* Section Text */}
                {section.text && (
                    <p className="text-sm text-terminal-text/90 mb-2 leading-relaxed">
                        {highlightKeywords(section.text)}
                    </p>
                )}

                {/* Bullet Items */}
                {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 mb-2 text-sm text-terminal-text/85 ml-1">
                        {section.items.map(renderListItem)}
                    </ul>
                )}

                {/* Numbered Items */}
                {section.numberedItems && section.numberedItems.length > 0 && (
                    <ol className="list-decimal list-inside space-y-0.5 mb-2 text-sm text-terminal-text/85 ml-1">
                        {section.numberedItems.map(renderListItem)}
                    </ol>
                )}

                {/* Subsections */}
                {section.subsections && section.subsections.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-2 mb-3" id={sub.title?.toLowerCase().replace(/\s+/g, '-')}>
                        {sub.title && (
                            <h3 className="text-sm font-semibold text-terminal-accent/90 mb-1">
                                {sub.title}
                            </h3>
                        )}

                        {sub.text && (
                            <p className="text-sm text-terminal-text/85 mb-1 leading-relaxed">
                                {highlightKeywords(sub.text)}
                            </p>
                        )}

                        {sub.items && sub.items.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 mb-1 text-sm text-terminal-text/75 ml-1">
                                {sub.items.map(renderListItem)}
                            </ul>
                        )}

                        {sub.numberedItems && sub.numberedItems.length > 0 && (
                            <ol className="list-decimal list-inside space-y-0.5 mb-1 text-sm text-terminal-text/75 ml-1">
                                {sub.numberedItems.map(renderListItem)}
                            </ol>
                        )}
                    </div>
                ))}
            </section>
        );
    };

    return (
        <div className="structured-content text-sm space-y-2">
            {content.sections.map(renderSection)}
        </div>
    );
};

export default StructuredContent;

