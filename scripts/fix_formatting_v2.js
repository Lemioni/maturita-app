
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/it-questions.json');

// Regex to identify code-like lines
const isCodeLine = (line) => {
    const codeIndicators = [
        '{', '}', 'class ', 'int ', 'void ', 'string ', 'double ', 'float ',
        'return ', 'cout', 'cin', '#include', 'using namespace',
        '<!DOCTYPE', '<html', '<body', '<head', '<div', '<script', '<meta', '<title', '<link',
        'import ', 'export ', 'const ', 'let ', 'var ', 'function', '=>',
        'struct ', 'public:', 'private:', 'protected:'
    ];
    // Allow indentation
    const trimmed = line.trim();
    return codeIndicators.some(ind => trimmed.startsWith(ind) || trimmed.includes(ind + ' '));
};

// Heuristic to detect if a line is a list item describing code (e.g., "- <html> - root element")
const isListDescription = (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) return false;

    // Check if it has a second separator or looks like a sentence
    // e.g. "- <html> - je kořenový prvek"
    // e.g. "- <h1> až <h6>"
    if (trimmed.match(/^-\s*<[^>]+>\s*[-–]/)) return true; // "- <tag> - description"
    if (trimmed.match(/^-\s*\*\*[^*]+\*\*/)) return false; // "- **Bold**..." (keep as list)

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
            // Empty line: if in code buffer, keep it (unless it's the start). If not, push.
            if (codeBuffer.length > 0) {
                codeBuffer.push(line);
            } else {
                newLines.push(line);
            }
            continue;
        }

        // Special handling for HTML list items which were broken before
        // e.g. "- <html> - root element"
        // We want to format this as: "- `<html>` - root element"
        if (isListDescription(line)) {
            flushBuffer();
            // Try to wrap the tag in backticks if not already
            let processed = line.replace(/(<[^>]+>)/, '`$1`');
            newLines.push(processed);
            continue;
        }

        // Headers check (restore logic from previous script roughly, but less aggressive)
        if (trimmed.startsWith('###') || trimmed.startsWith('####')) {
            flushBuffer();
            newLines.push(line);
            continue;
        }

        // Code block detection
        const looksLikeCode = isCodeLine(line);
        const startsWithDashMap = trimmed.startsWith('- ') || trimmed.startsWith('– ');

        // If it starts with a dash, but is clearly code logic (like "- cin >> vek;"), it might have been a bullet point wrapping code.
        // We generally prefer code blocks for code content. 
        // But if it's "- <img src...>", that is code.

        if (looksLikeCode) {
            // If it starts with dash, strip it for the code block
            let cleanLine = line;
            if (startsWithDashMap) {
                cleanLine = line.replace(/^[-–]\s+/, '');
            }
            codeBuffer.push(cleanLine);
        } else {
            // Not code
            // But check if it's a "context" line for code (e.g. "}")
            const isContext = (trimmed === '}' || trimmed === '{' || trimmed.startsWith('//') || trimmed.startsWith('/*'));

            if (isContext && codeBuffer.length > 0) {
                codeBuffer.push(line.replace(/^[-–]\s+/, ''));
            } else {
                flushBuffer();
                newLines.push(line);
            }
        }
    }
    flushBuffer();

    // Final pass to clean up empty lines inside code blocks or excessive escaped blocks
    return newLines.join('\n');
};

try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Processing ${data.questions.length} questions...`);

    let updatedCount = 0;
    // Process only first 50 questions as requested (IT section mostly)
    for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        if (q.id <= 50 && q.answer) {
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
