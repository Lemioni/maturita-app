// Helper to format answer text with tables, lists, and sections

// Extract table of contents sections from text
export const extractTableOfContents = (text) => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const sections = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match numbered sections like "1. Section Name"
    const match = line.match(/^(\d+)\.\s+(.+)/);
    if (match && line.length < 100) {
      sections.push({
        number: match[1],
        title: match[2],
        id: `section-${match[1]}`
      });
    }
  }
  
  return sections;
};

// Auto-bold important terms (technical acronyms, keywords)
const autoBoldImportantTerms = (text, keywords = []) => {
  let result = text;
  
  // Bold technical acronyms (2-6 uppercase letters, optionally with numbers/slashes)
  result = result.replace(/\b([A-Z]{2,6}(?:\/[A-Z]{2,6})?)\b/g, '<strong>$1</strong>');
  
  // Bold keywords if provided
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    result = result.replace(regex, '<strong>$1</strong>');
  });
  
  return result;
};

export const formatAnswer = (text, keywords = []) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  let formattedHTML = '';
  let inTable = false;
  let tableRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect table rows (lines with | character)
    if (line.includes('|') && line.split('|').length > 2) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      // End of table, render it
      formattedHTML += renderTable(tableRows);
      inTable = false;
      tableRows = [];
    }
    
    // Empty lines
    if (line === '') {
      formattedHTML += '<br />';
      continue;
    }
    
    // Section headers (lines starting with numbers like "1. ")
    const sectionMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (sectionMatch && line.length < 100) {
      const sectionId = `section-${sectionMatch[1]}`;
      formattedHTML += `<h3 id="${sectionId}" class="text-xl font-bold mt-6 mb-3 text-terminal-green scroll-mt-20">${escapeHtml(line)}</h3>`;
      continue;
    }
    
    // Subsection headers (lines with ## or similar patterns)
    if (line.match(/^#{1,3}\s+/) || (line.match(/^[A-Z][a-z]+.*:$/))) {
      const cleanLine = line.replace(/^#{1,3}\s+/, '');
      formattedHTML += `<h4 class="text-lg font-semibold mt-4 mb-2 text-terminal-text">${escapeHtml(cleanLine)}</h4>`;
      continue;
    }
    
    // Bullet points (lines starting with • or -)
    if (line.match(/^[•\-\*]\s+/)) {
      const content = line.replace(/^[•\-\*]\s+/, '');
      const boldedContent = autoBoldImportantTerms(content, keywords);
      formattedHTML += `<li class="ml-4 mb-1 text-terminal-text/90">${boldedContent}</li>`;
      continue;
    }
    
    // Bold text detection (**text** or __text__)
    let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processedLine = processedLine.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Auto-bold important terms in regular paragraphs
    processedLine = autoBoldImportantTerms(processedLine, keywords);
    
    // Regular paragraphs
    formattedHTML += `<p class="mb-2 text-terminal-text/90">${processedLine}</p>`;
  }
  
  // Close any remaining table
  if (inTable) {
    formattedHTML += renderTable(tableRows);
  }
  
  return formattedHTML;
};

// Render table from array of row strings
const renderTable = (rows) => {
  if (rows.length === 0) return '';
  
  let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-terminal-border/30">';
  
  rows.forEach((row, index) => {
    const cells = row.split('|').filter(cell => cell.trim() !== '');
    
    // Skip separator rows (rows with only dashes and pipes)
    if (row.match(/^[\|\-\s]+$/)) return;
    
    const isHeader = index === 0;
    const tag = isHeader ? 'th' : 'td';
    const className = isHeader 
      ? 'border border-terminal-border/30 px-4 py-2 bg-terminal-border/10 font-semibold text-terminal-green'
      : 'border border-terminal-border/30 px-4 py-2 text-terminal-text/90';
    
    html += '<tr>';
    cells.forEach(cell => {
      html += `<${tag} class="${className}">${escapeHtml(cell.trim())}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</table></div>';
  return html;
};

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export default formatAnswer;
