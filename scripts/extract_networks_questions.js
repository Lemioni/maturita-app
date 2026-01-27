import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function extractContent(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const { value: rawText } = await mammoth.convertToMarkdown({ path: filePath });
    let markdown = rawText;

    // --- APPLY FORMATTING REFINEMENTS ---

    // 1. Fix list items (• to -)
    markdown = markdown.replace(/•\t/g, '- ');
    markdown = markdown.replace(/• /g, '- ');

    // 2. Fix split lines in lists (heuristic)
    markdown = markdown.replace(/([^\n])\n- /g, '$1\n\n- ');

    // 3. Fix double spacing
    markdown = markdown.replace(/\n\n\n/g, '\n\n');

    // 4. Detect and wrap SQL commands (Compact Multi-line)
    const sqlKeywords = ['CREATE', 'DROP', 'SELECT', 'INSERT', 'UPDATE', 'ALTER'];
    const multiLineSqlRegex = new RegExp(`^(${sqlKeywords.join('|')})[\\s\\S]*?;`, 'gm');

    markdown = markdown.replace(multiLineSqlRegex, (match) => {
        let compacted = match.replace(/\n\s*\n/g, '\n');
        compacted = compacted.replace(/\\_/g, '_');
        return '```sql\n' + compacted + '\n```';
    });

    // --- NEW FIXES FOR USER REPORTED ISSUES ---

    // 5. Convert __bold__ to **bold** (mammoth uses __ for strong)
    // We strictly look for double underscores with content in between
    markdown = markdown.replace(/__([^\n_]+)__/g, '**$1**');

    // Fix padding spaces inside bold: ** Text ** -> **Text**
    // Using \s+ to catch newlines or non-breaking spaces too
    // We run this loop to ensure we catch all instances
    markdown = markdown.replace(/\*\*\s+([^\n*]+?)\s+\*\*/g, '**$1**');

    // Fix leading space: ** Text** -> **Text**
    markdown = markdown.replace(/\*\*\s+([^\n*]+?)\*\*/g, '**$1**');

    // Fix trailing space: **Text ** -> **Text**
    markdown = markdown.replace(/\*\*([^\n*]+?)\s+\*\*/g, '**$1**');

    // 6. Remove unnecessary backslash escapes for dots (mammoth sometimes outputs \.)
    markdown = markdown.replace(/\\\./g, '.');

    // 7. Remove weird "image placeholders" if any (mammoth sometimes leaves [Image])
    // The user mentioned "Obrazec" in Q19/Q20, but Q13-18 (docx) might have them too?
    markdown = markdown.replace(/\nObrazec\n/g, '\n');
    markdown = markdown.replace(/^Obrazec$/gm, '');

    // 8. Collapse multiple newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown;
}

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
    let updatedCount = 0;
    let skippedCount = 0;

    for (const question of data.questions) {
        if (question.category === "Počítačové sítě") {
            const relativePath = question.sourceFile;

            // Skip non-docx
            if (!relativePath.endsWith('.docx')) {
                console.log(`Skipping Q${question.id} (Not .docx): ${relativePath}`);
                skippedCount++;
                continue;
            }

            const absolutePath = path.join(PUBLIC_DIR, relativePath);

            try {
                console.log(`Processing Q${question.id}: ${relativePath}...`);
                const newAnswer = await extractContent(absolutePath);

                // Update the question
                question.answer = newAnswer;
                updatedCount++;
                console.log(`  > Success!`);
            } catch (err) {
                console.error(`  > Error processing Q${question.id}: ${err.message}`);
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\nUpdated ${updatedCount} questions. Skipped ${skippedCount}. Saved to it-questions.json.`);
    } else {
        console.log("\nNo questions were updated.");
    }
}

main();
