/**
 * CompactContent - Renders compact structured content
 * Uses same visual style as StructuredContent (full version)
 */
const CompactContent = ({ content }) => {
    if (!content || !content.sections) {
        return (
            <div className="text-terminal-text/50 italic text-sm">
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
                    <li key={index} className="mb-1 text-sm leading-relaxed">
                        <strong className="text-terminal-accent">{termDef[1].trim()}</strong>
                        <span className="text-terminal-text/80"> – {termDef[2].trim()}</span>
                    </li>
                );
            }

            return (
                <li key={index} className="mb-1 text-sm leading-relaxed text-terminal-text/85">
                    {item}
                </li>
            );
        }

        if (item.term) {
            return (
                <li key={index} className="mb-1 text-sm leading-relaxed">
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
            <section key={index} className="mb-5" id={section.title?.toLowerCase().replace(/\s+/g, '-')}>
                {section.title && (
                    <h2 className="text-sm font-bold text-terminal-accent mb-2 pb-1 border-b border-terminal-border/30">
                        {section.title}
                    </h2>
                )}

                {section.text && (
                    <p className="text-sm text-terminal-text/90 mb-2 leading-relaxed">
                        {section.text}
                    </p>
                )}

                {section.items && section.items.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 mb-2 text-sm text-terminal-text/85 ml-1">
                        {section.items.map(renderCompactItem)}
                    </ul>
                )}

                {section.numberedItems && section.numberedItems.length > 0 && (
                    <ol className="list-decimal list-inside space-y-0.5 mb-2 text-sm text-terminal-text/85 ml-1">
                        {section.numberedItems.map((item, i) => (
                            <li key={i} className="mb-1 text-sm leading-relaxed text-terminal-text/85">{item}</li>
                        ))}
                    </ol>
                )}

                {section.subsections && section.subsections.map((sub, subIndex) => (
                    <div key={subIndex} className="ml-2 mb-3" id={sub.title?.toLowerCase().replace(/\s+/g, '-')}>
                        {sub.title && (
                            <h3 className="text-sm font-semibold text-terminal-accent/90 mb-1">
                                {sub.title}
                            </h3>
                        )}
                        {sub.text && (
                            <p className="text-sm text-terminal-text/80 mb-1 leading-relaxed">
                                {sub.text}
                            </p>
                        )}
                        {sub.items && sub.items.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 text-terminal-text/80 ml-1">
                                {sub.items.map(renderCompactItem)}
                            </ul>
                        )}
                        {sub.numberedItems && sub.numberedItems.length > 0 && (
                            <ol className="list-decimal list-inside space-y-0.5 text-terminal-text/80 ml-1">
                                {sub.numberedItems.map((item, i) => (
                                    <li key={i} className="mb-1 text-sm leading-relaxed text-terminal-text/80">{item}</li>
                                ))}
                            </ol>
                        )}
                    </div>
                ))}
            </section>
        );
    };

    return (
        <div className="space-y-1">
            {content.sections.map(renderSection)}
        </div>
    );
};

export default CompactContent;
