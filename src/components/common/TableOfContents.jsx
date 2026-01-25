import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const TableOfContents = ({ sections }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!sections || sections.length === 0) {
    return null;
  }

  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="terminal-card mb-4 border-l-4 border-terminal-accent">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="text-xs text-terminal-accent font-bold tracking-wider">
          &gt; OBSAH
        </div>
        <button className="icon-btn p-1">
          {isCollapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
        </button>
      </div>

      {/* TOC List */}
      {!isCollapsed && (
        <div className="mt-3 space-y-1.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`block w-full text-left text-sm text-terminal-text/80 hover:text-terminal-accent hover:pl-2 transition-all duration-150 ${section.level === 3 ? 'pl-4 text-xs' : ''
                }`}
            >
              {section.number && (
                <span className="text-terminal-accent/60 mr-2">{section.number}.</span>
              )}
              {section.title.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>
      )}

      {/* Collapsed state indicator */}
      {isCollapsed && (
        <div className="mt-1 text-xs text-terminal-text/40">
          {sections.length} {sections.length === 1 ? 'sekce' : sections.length < 5 ? 'sekce' : 'sekcí'}
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
