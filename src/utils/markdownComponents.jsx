import { useMemo } from 'react';

// Helper to generate section ID from heading text
const generateSectionId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
};

// Parse alert type from blockquote content
const parseAlertType = (children) => {
  if (!children || !children[0]) return null;

  const firstChild = children[0];
  if (typeof firstChild === 'string') {
    const match = firstChild.match(/^\[!(TIP|IMPORTANT|WARNING|NOTE|CAUTION)\]/i);
    if (match) {
      return {
        type: match[1].toUpperCase(),
        content: firstChild.replace(/^\[!(TIP|IMPORTANT|WARNING|NOTE|CAUTION)\]\s*/i, '')
      };
    }
  }

  // Check if it's a React element with children
  if (firstChild?.props?.children) {
    const text = Array.isArray(firstChild.props.children)
      ? firstChild.props.children[0]
      : firstChild.props.children;

    if (typeof text === 'string') {
      const match = text.match(/^\[!(TIP|IMPORTANT|WARNING|NOTE|CAUTION)\]/i);
      if (match) {
        return {
          type: match[1].toUpperCase(),
          content: text.replace(/^\[!(TIP|IMPORTANT|WARNING|NOTE|CAUTION)\]\s*/i, '')
        };
      }
    }
  }

  return null;
};

// Alert box component
const AlertBox = ({ type, children }) => {
  const config = {
    TIP: {
      icon: '💡',
      label: 'TIP',
      classes: 'border-terminal-green bg-terminal-green/10'
    },
    IMPORTANT: {
      icon: '⚡',
      label: 'DŮLEŽITÉ',
      classes: 'border-yellow-500 bg-yellow-500/10'
    },
    WARNING: {
      icon: '⚠️',
      label: 'VAROVÁNÍ',
      classes: 'border-terminal-red bg-terminal-red/10'
    },
    NOTE: {
      icon: '📝',
      label: 'POZNÁMKA',
      classes: 'border-blue-400 bg-blue-400/10'
    },
    CAUTION: {
      icon: '🔴',
      label: 'POZOR',
      classes: 'border-orange-500 bg-orange-500/10'
    }
  };

  const { icon, label, classes } = config[type] || config.NOTE;

  return (
    <div className={`alert-box my-4 p-4 border-l-4 rounded-r ${classes}`}>
      <div className="flex items-center gap-2 mb-2 font-bold text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-terminal-text/90">
        {children}
      </div>
    </div>
  );
};

// Create custom components for ReactMarkdown
export const createMarkdownComponents = (keywords = []) => {
  // Create regex for keyword highlighting
  const keywordRegex = keywords.length > 0
    ? new RegExp(`\\b(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi')
    : null;

  // Helper to highlight keywords in text
  const highlightKeywords = (text) => {
    if (!keywordRegex || typeof text !== 'string') return text;

    const parts = text.split(keywordRegex);
    if (parts.length === 1) return text;

    return parts.map((part, i) => {
      if (keywordRegex.test(part)) {
        return <mark key={i} className="keyword-highlight">{part}</mark>;
      }
      return part;
    });
  };

  return {
    // Headings — amber autoscroll style with IDs for TOC
    h1: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h1 id={id} className="text-xl font-bold text-amber-400 mt-6 mb-2 pb-1 border-b border-amber-400/30 scroll-mt-20">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h2 id={id} className="text-lg font-bold text-amber-400 mt-5 mb-2 pb-1 border-b border-amber-400/20 scroll-mt-20">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h3 id={id} className="text-base font-bold text-amber-300 mt-4 mb-1 scroll-mt-20">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-sm font-bold text-amber-300/90 mt-3 mb-1">
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="text-sm leading-relaxed text-gray-200 mb-2">
        {Array.isArray(children) ? children.map((child, i) =>
          typeof child === 'string' ? highlightKeywords(child) : child
        ) : highlightKeywords(children)}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="mb-3 space-y-0.5">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 list-decimal ml-4 space-y-0.5">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-sm text-gray-200 mb-0.5 ml-4 list-disc leading-relaxed">
        {children}
      </li>
    ),

    // Strong/Bold
    strong: ({ children }) => (
      <strong className="text-amber-300 font-bold">
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ children }) => (
      <em className="text-amber-200/80 italic">
        {children}
      </em>
    ),

    // Code
    code: ({ inline, className, children }) => {
      if (inline) {
        return (
          <code className="text-amber-300 bg-amber-400/10 px-1 rounded text-xs font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={className}>
          {children}
        </code>
      );
    },

    // Code blocks
    pre: ({ children }) => (
      <pre className="bg-black/40 border border-amber-400/20 p-3 rounded text-xs text-gray-300 overflow-x-auto mb-2">
        {children}
      </pre>
    ),

    // Blockquotes (with alert support)
    blockquote: ({ children }) => {
      const alertInfo = parseAlertType(children?.props?.children || children);

      if (alertInfo) {
        return (
          <AlertBox type={alertInfo.type}>
            {alertInfo.content || children}
          </AlertBox>
        );
      }

      return (
        <blockquote className="border-l-2 border-amber-400/50 pl-3 my-2 text-gray-300 italic">
          {children}
        </blockquote>
      );
    },

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead>
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-gray-700/50">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="text-left text-amber-400 text-xs uppercase border-b border-amber-400/30 pb-1 pr-3 py-1">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="text-gray-200 py-1 pr-3 border-b border-gray-700/50 text-sm">
        {children}
      </td>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-amber-300 underline hover:text-amber-200 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="border-gray-700 my-4" />
    ),
  };
};

// Extract headings for Table of Contents
export const extractHeadings = (markdown) => {
  if (!markdown) return [];

  const headings = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    // Match ## or ### headings
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = generateSectionId(title);

      headings.push({
        level,
        title,
        id,
        // Extract number if present (e.g., "1. Section Name")
        number: title.match(/^(\d+)\./)?.[1] || null
      });
    }
  }

  return headings;
};

export default createMarkdownComponents;
