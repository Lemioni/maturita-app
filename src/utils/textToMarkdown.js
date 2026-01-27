/**
 * Utility to convert raw text extracted from documents into better Markdown.
 * This handles common issues like missing line breaks, lack of headers, and list formatting.
 */
export const cleanMappedText = (text) => {
    if (!text) return '';

    const lines = text.split('\n').filter(line => line.trim() !== '');
    let newLines = [];
    let inListContext = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // 1. HEADERS: Numbered lines (1. , 2.1 )
        if (line.match(/^(\d+(\.\d+)*)\.?\s+/)) {
            const dots = line.split('.').length - 1;
            const level = Math.min(Math.max(2, 2 + dots), 4); // H2 to H4
            newLines.push(`\n${'#'.repeat(level)} ${line}`);
            inListContext = false;
            continue;
        }

        // 2. SUB-HEADERS: Strong indicators
        // A) Ends with colon: "Typy napájecích zdrojů:"
        if (line.endsWith(':') && line.length < 100) {
            newLines.push(`\n### ${line}`);
            inListContext = true;
            continue;
        }

        // B) Strictly Uppercase (and not too short/long): "DDR5", "RAM"
        // We avoid very short ones (like "A") to not catch list markers, though we trimmed line so..
        if (line === line.toUpperCase() && line.length > 2 && line.length < 60 && !line.includes('.')) {
            newLines.push(`\n#### ${line}`); // Use H4 for these terms
            inListContext = true;
            continue;
        }

        // C) Term with parentheses: "LPCAMM (Low Power ...)" or "HBM (High Bandwidth...)"
        // Must start with Uppercase, have parens, and be short-ish
        if (line.match(/^[A-Z][a-zA-Z0-9\s]*\s+\(.*\)$/) && line.length < 80) {
            newLines.push(`\n#### ${line}`);
            inListContext = true;
            continue;
        }

        // 3. EXPLICIT LISTS: Already has bullet
        const bulletMatch = line.match(/^(\-|•|o|\+)\s+(.+)/);
        if (bulletMatch) {
            newLines.push(`- ${bulletMatch[2]}`);
            inListContext = true;
            continue;
        }

        // 4. KEY-VALUE PAIRS: "Term: Definition"
        // "AT: Starší, používal..."
        // "Funkce: Napájecí zdroj..."
        const colonMatch = line.match(/^([^:]+):\s+(.+)/);
        if (colonMatch) {
            const key = colonMatch[1].trim();
            const val = colonMatch[2].trim();

            // Heuristic: If key is reasonably short (< 40 chars), treat as list item
            if (key.length < 40) {
                newLines.push(`- **${key}**: ${val}`);
                inListContext = true;
                continue;
            }
        }

        // 5. IMPLICIT LIST ITEMS (Context dependent)
        // If we are in a list context, and this line is short-ish or looks like a continuation item
        if (inListContext) {
            // If it starts with upper case and isn't too long, arguably a list item
            // "80 PLUS Gold (min. 87% účinnost)"
            newLines.push(`- ${line}`);
            continue;
        }

        // Default: Regular paragraph
        newLines.push(`\n${line}`);
    }

    return newLines.join('\n');
};

export default cleanMappedText;
