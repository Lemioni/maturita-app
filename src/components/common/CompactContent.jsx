/**
 * CompactContent - Renders compact structured content
 * Ultra-compact mobile-first layout with text-xs
 */
const CompactContent = ({ content }) => {
    if (!content || !content.sections) {
        return (
            <div className="text-terminal-text/50 italic text-xs">
                Zkrácená verze není k dispozici
            </div>
        );
    }

    // Render compact list item
    const renderCompactItem = (item, index) => {
        if (typeof item === 'string') {
            // Term – definition pattern
            const termDef = item.match(/^([^:]{2,80})\s[–-]\s(.+)$/);
            if (termDef) {
                return (
                    <li key={index} className="mb-0.5 text-xs leading-snug">
                        <strong className="text-terminal-accent">{termDef[1].trim()}</strong>
                        <span className="text-terminal-text/80"> – {termDef[2].trim()}</span>
                    </li>
                );
            }

            return (
                <li key={index} className="mb-0.5 text-xs leading-snug text-terminal-text/85">
                    {item}
                </li>
            );
        }

        if (item.term) {
            return (
                <li key={index} className="mb-0.5 text-xs leading-snug">
                    <strong className="text-terminal-accent">{item.term}</strong>
                    {item.definition && (
                        <span className="text-terminal-text/80"> – {item.definition}</span>
                    )}
                </li>
            );
        }

        return null;
    };

    // Render compact section
    const renderSection = (section, index) => {
        return (
            <section key={index} className="mb-3" id={section.title?.toLowerCase().replace(/\s+/g, '-')}>
                {section.title && (
                    <h2 className="text-xs font-bold text-terminal-accent mb-1 pb-0.5 border-b border-terminal-border/30 uppercase tracking-wide">
                        {section.title}
                    </h2>
                )}

                {section.text && (
                    <p className="text-xs text-terminal-text/90 mb-1 leading-snug">
                        {section.text}
                    </p>
                )}

                {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0 mb-1 text-xs text-terminal-text/85 ml-1">
                        {section.items.map(renderCompactItem)}
                    </ul>
                )}

                {section.numberedItems && section.numberedItems.length > 0 && (
                    <ol className="list-decimal list-inside space-y-0 mb-1 text-xs text-terminal-text/85 ml-1">
                        {section.numberedItems.map((item, i) => (
                            <li key={i} className="mb-0.5 text-xs leading-snug text-terminal-text/85">{item}</li>
                        ))}
                    </ol>
                )}

                {section.subsections && section.subsections.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-2 mb-2" id={sub.title?.toLowerCase().replace(/\s+/g, '-')}>
                        {sub.title && (
                            <h3 className="text-xs font-semibold text-terminal-accent/90 mb-0.5">
                                {sub.title}
                            </h3>
                        )}
                        {sub.text && (
                            <p className="text-xs text-terminal-text/80 mb-0.5 leading-snug">
                                {sub.text}
                            </p>
                        )}
                        {sub.items && sub.items.length > 0 && (
                            <ul className="list-disc list-inside space-y-0 text-terminal-text/80 ml-1">
                                {sub.items.map(renderCompactItem)}
                            </ul>
                        )}
                        {sub.numberedItems && sub.numberedItems.length > 0 && (
                            <ol className="list-decimal list-inside space-y-0 text-terminal-text/80 ml-1">
                                {sub.numberedItems.map((item, i) => (
                                    <li key={i} className="mb-0.5 text-xs leading-snug text-terminal-text/80">{item}</li>
                                ))}
                            </ol>
                        )}
                    </div>
                ))}
            </section>
        );
    };

    return (
        <div className="space-y-0.5">
            {content.sections.map(renderSection)}
        </div>
    );
};

export default CompactContent;
