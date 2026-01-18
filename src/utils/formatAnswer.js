// Helper to format answer text with tables, lists, and sections

export const formatAnswer = (text) => {
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
    
    // Section headers (lines ending with : or starting with numbers like "1. ")
    if (line.match(/^\d+\.\s+.+/) && line.length < 100) {
      formattedHTML += `<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">${escapeHtml(line)}</h3>`;
      continue;
    }
    
    // Subsection headers (lines with ## or similar patterns)
    if (line.match(/^#{1,3}\s+/) || (line.match(/^[A-Z][a-z]+.*:$/))) {
      const cleanLine = line.replace(/^#{1,3}\s+/, '');
      formattedHTML += `<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">${escapeHtml(cleanLine)}</h4>`;
      continue;
    }
    
    // Bullet points (lines starting with • or -)
    if (line.match(/^[•\-\*]\s+/)) {
      const content = line.replace(/^[•\-\*]\s+/, '');
      formattedHTML += `<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300">${escapeHtml(content)}</li>`;
      continue;
    }
    
    // Bold text detection (**text** or __text__)
    let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processedLine = processedLine.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Regular paragraphs
    formattedHTML += `<p class="mb-2 text-gray-700 dark:text-gray-300">${processedLine}</p>`;
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
  
  let html = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">';
  
  rows.forEach((row, index) => {
    const cells = row.split('|').filter(cell => cell.trim() !== '');
    
    // Skip separator rows (rows with only dashes and pipes)
    if (row.match(/^[\|\-\s]+$/)) return;
    
    const isHeader = index === 0;
    const tag = isHeader ? 'th' : 'td';
    const className = isHeader 
      ? 'border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-gray-100'
      : 'border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300';
    
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
