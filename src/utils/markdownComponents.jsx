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
    // Headings with IDs for TOC navigation
    h1: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h1 id={id} className="text-2xl font-bold mt-8 mb-4 text-terminal-accent scroll-mt-20 border-b border-terminal-border/30 pb-2">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h2 id={id} className="text-xl font-bold mt-6 mb-3 text-terminal-accent scroll-mt-20">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const id = generateSectionId(text);
      return (
        <h3 id={id} className="text-lg font-semibold mt-5 mb-2 text-terminal-text scroll-mt-20">
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-base font-semibold mt-4 mb-2 text-terminal-text/90">
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="mb-3 text-terminal-text leading-relaxed">
        {Array.isArray(children) ? children.map((child, i) =>
          typeof child === 'string' ? highlightKeywords(child) : child
        ) : highlightKeywords(children)}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-1.5 text-terminal-text">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-1.5 text-terminal-text">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed text-terminal-text">
        {children}
      </li>
    ),

    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-bold text-terminal-accent">
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-terminal-text/80">
        {children}
      </em>
    ),

    // Code
    code: ({ inline, className, children }) => {
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 bg-terminal-dim border border-terminal-border/30 rounded text-sm font-mono text-terminal-accent">
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
      <pre className="bg-terminal-bg border border-terminal-border/30 rounded p-4 my-4 overflow-x-auto">
        <code className="text-sm font-mono text-terminal-text/90">
          {children}
        </code>
      </pre>
    ),

    // Blockquotes (with alert support)
    blockquote: ({ children }) => {
      // Check for alert syntax
      const alertInfo = parseAlertType(children?.props?.children || children);

      if (alertInfo) {
        return (
          <AlertBox type={alertInfo.type}>
            {alertInfo.content || children}
          </AlertBox>
        );
      }

      return (
        <blockquote className="border-l-4 border-terminal-border pl-4 my-4 text-terminal-text/80 italic">
          {children}
        </blockquote>
      );
    },

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-terminal-border/30">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-terminal-border/10">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-terminal-border/20 hover:bg-terminal-border/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="border border-terminal-border/30 px-4 py-2 text-left font-semibold text-terminal-accent">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-terminal-border/30 px-4 py-2 text-terminal-text">
        {children}
      </td>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-terminal-accent underline hover:text-terminal-glow transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="my-6 border-terminal-border/30" />
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
