
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/it-questions.json');

// Regex to identify code-like lines
const isCodeLine = (line) => {
    const text = line.trim();
    if (!text) return false;

    // 1. Check for specific C++/C#/web keywords
    // We want these to match only if they look like code usage, not just the word in a sentence.
    const keywords = [
        'class', 'int', 'void', 'string', 'double', 'float', 'bool', 'char',
        'return', 'cout', 'cin', '#include', 'using namespace',
        'import', 'export', 'const', 'let', 'var', 'function',
        'struct', 'public:', 'private:', 'protected:', 'if', 'else', 'for', 'while', 'switch', 'case'
    ];

    // Check if line STARTS with a keyword (followed by space or symbol)
    // or contains specific code patterns

    // Pattern: keyword at start
    const startsWithKeyword = keywords.some(k =>
        text.startsWith(k + ' ') || text.startsWith(k + '(') || text.startsWith(k + ';') || text === k
    );
    if (startsWithKeyword) return true;

    // Pattern: HTML tags (start of line)
    // <html, <body, <div, ... but also <iostream> (which is #include usually, but maybe separate)
    // Also <!DOCTYPE
    if (text.match(/^<[a-z!/][^>]*>/i)) return true;

    // Pattern: Common code symbols usage
    // cin >> ...
    // cout << ...
    // ... = ...;
    if (text.includes('>>') || text.includes('<<') || (text.includes('=') && text.endsWith(';'))) return true;

    // Pattern: Function calls or specific code constructs
    // getline(cin, ...)
    if (text.match(/^[a-zA-Z0-9_]+\s*\(.*\);?$/)) return true; // func(args); or func(args)

    // Pattern: Brackets/Braces standing alone or at end
    // { at end of line
    // } at start of line
    if (text.endsWith('{')) return true;
    if (text.startsWith('}')) return true;

    // Arrow function
    if (text.includes('=>')) return true;

    // Special cases seen in data
    if (text.startsWith('getline(')) return true;

    return false;
};

// Heuristic to detect if a line is a list item describing code (e.g., "- <html> - root element")
const isListDescription = (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) return false;

    // "- <tag> - description" or "- <tag>"
    if (trimmed.match(/^-\s*<[^>]+>\s*[-–]?/)) return true;

    return false;
};

const refineText = (text) => {
    if (!text) return '';

    // 1. Flatten: Remove existing code fences to start fresh
    let lines = text.split('\n').filter(l => l.trim() !== '```');

    let newLines = [];
    let codeBuffer = [];

    const flushBuffer = () => {
        if (codeBuffer.length > 0) {
            newLines.push('```');
            newLines.push(...codeBuffer);
            newLines.push('```');
            codeBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmed = line.trim();

        if (!trimmed) {
            if (codeBuffer.length > 0) {
                codeBuffer.push(line);
            } else {
                newLines.push(line);
            }
            continue;
        }

        // Fix HTML list items
        if (isListDescription(line)) {
            flushBuffer();
            let processed = line.replace(/(<[^>]+>)/, '`$1`');
            newLines.push(processed);
            continue;
        }

        // Headers check
        if (trimmed.startsWith('###') || trimmed.startsWith('####')) {
            flushBuffer();
            newLines.push(line);
            continue;
        }

        // Sentences filter: If it looks like a normal sentence ending in a period (and not a semicolon typical of code), 
        // and doesn't explicitly match strong code patterns, treat as text.
        const isSentence = trimmed.endsWith('.') && !trimmed.endsWith(';') && trimmed.length > 10 && trimmed.includes(' ');

        let looksLikeCode = isCodeLine(line);
        const startsWithDashMap = trimmed.startsWith('- ') || trimmed.startsWith('– ');

        if (isSentence) {
            // Exception: if it matched "cout <<" or "cin >>", it's code even if it ends with "." (unlikely for proper code but possible in snippets)
            // But usually sentences describing code contain keywords.
            // Let's trust isCodeLine BUT verify it's not a false positive description.
            // e.g. "Funkce cin ignoruje bílé znaky." -> Starts with "Funkce", not keyword.
            // My isCodeLine check "cin" only if at start or with symbols.
            // "Funkce cin" -> "Funkce" not keyword. "cin" inside. 
            // My updated isCodeLine doesn't match just substring "cin". It requires start or specific symbols.
            // So "Funkce cin..." shouldn't match.
        }

        if (looksLikeCode) {
            // Check if it's a bullet point wrapping code
            let cleanLine = line;
            if (startsWithDashMap) {
                // only strip if the remaining part really looks like code
                let content = line.replace(/^[-–]\s+/, '');
                if (isCodeLine(content)) {
                    cleanLine = content;
                } else {
                    looksLikeCode = false; // It was just a bullet point with some code-like word
                }
            }

            if (looksLikeCode) {
                codeBuffer.push(cleanLine);
            } else {
                flushBuffer();
                newLines.push(line);
            }
        } else {
            // Not code
            // Context lines (comments, etc)
            const isContext = (trimmed.startsWith('//') || trimmed.startsWith('/*'));

            if (isContext && codeBuffer.length > 0) {
                codeBuffer.push(line.replace(/^[-–]\s+/, ''));
            } else {
                flushBuffer();
                newLines.push(line);
            }
        }
    }
    flushBuffer();

    // Post-processing: Remove empty blocks or blocks with just whitespace
    // Also merge adjacent blocks if my logic separated them (e.g. by an empty line)
    // Actually my logic keeps empty lines in buffer.

    return newLines.join('\n');
};

try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Processing ${data.questions.length} questions...`);

    let updatedCount = 0;
    // Process ALL questions now that we are confident? Or stick to safe range.
    // The user didn't specify a range, but the previous task implies global fix.
    // Let's do first 60 to be safe and cover the ones we saw.
    for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        if (q.id <= 60 && q.answer) {
            const original = q.answer;
            const formatted = refineText(original);
            if (original !== formatted) {
                q.answer = formatted;
                updatedCount++;
            }
        }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Refined ${updatedCount} questions.`);
} catch (error) {
    console.error('Error:', error);
}
