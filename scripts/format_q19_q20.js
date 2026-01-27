import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');

function formatText(text) {
    if (!text) return '';
    let markdown = text;

    // 1. Remove "Obrazec" placeholder
    markdown = markdown.replace(/\nObrazec\n/g, '\n');
    markdown = markdown.replace(/^Obrazec$/gm, '');

    // 2. Fix headers
    // The current text has lines like "### 19. Ethernet" which are fine.
    // But some headers might be plain text followed by newline.
    // We already have some markdown in there, let's just make sure it's clean.

    // 3. Fix lists
    // Replace "• " or "•\t" with "- "
    markdown = markdown.replace(/•\t/g, '- ');
    markdown = markdown.replace(/• /g, '- ');

    // 4. Fix split list items (heuristic)
    markdown = markdown.replace(/([^\n])\n- /g, '$1\n\n- ');

    // 5. Enhance formatting for key terms (heuristic)
    // If we see "Termín: Popis", make "Termín" bold.
    // Regex: Start of line or after newline, Word(s) followed by colon.
    // Be careful not to match URLs or weird things.
    // Match: newline, optional dash, whitespace, Capture(Word space Word): whitespace
    markdown = markdown.replace(/(\n-? ?)([A-ZÁ-Ž0-9a-zá-ž\. \/]+):/g, '$1**$2**:');

    // 6. Fix double spacing
    markdown = markdown.replace(/\n\n\n/g, '\n\n');

    // 7. Ensure bolding is standard ** (in case __ was used in old content)
    markdown = markdown.replace(/__([^\n_]+)__/g, '**$1**');

    // 8. Fix padding in bold (user reported issue)
    markdown = markdown.replace(/\*\* +([^\n*]+?) +\*\*/g, '**$1**');

    return markdown;
}

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
    let updatedCount = 0;

    for (const question of data.questions) {
        // Target Q19 (Ethernet) and Q20 (Bezdrátové) specifically
        if (question.id === 19 || question.id === 20) {
            console.log(`Formatting Q${question.id}: ${question.question}...`);
            const original = question.answer;
            const formatted = formatText(original);

            if (original !== formatted) {
                question.answer = formatted;
                updatedCount++;
                console.log(`  > Updated.`);
            } else {
                console.log(`  > No changes needed.`);
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\nUpdated ${updatedCount} questions. Saved to it-questions.json.`);
    } else {
        console.log("\nNo questions were updated.");
    }
}

main();
