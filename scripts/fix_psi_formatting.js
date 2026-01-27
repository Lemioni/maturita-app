import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');

function formatText(text) {
    if (!text) return '';
    let markdown = text;

    // 1. Fix bold tags with internal spaces: ** text ** -> **text**
    markdown = markdown.replace(/\*\*\s+([^\n*]+?)\s+\*\*/g, '**$1**');
    markdown = markdown.replace(/\*\*\s+([^\n*]+?)\*\*/g, '**$1**');
    markdown = markdown.replace(/\*\*([^\n*]+?)\s+\*\*/g, '**$1**');

    // 2. Add space after dash if missing: -**text -> - **text
    markdown = markdown.replace(/^-\*\*/gm, '- **');
    markdown = markdown.replace(/\n-\*\*/g, '\n- **');

    // 3. Add newline before numbered list items that are stuck to text
    // Pattern: text1. -> text\n\n1.
    markdown = markdown.replace(/([^\n\d])(\d+\.)/g, '$1\n\n$2');

    // 4. Add newline before dash bullets stuck to text
    // Pattern: text- -> text\n\n-
    markdown = markdown.replace(/([^\n\-–])(-\s)/g, '$1\n\n$2');

    // 5. Convert main question titles to H2 headings
    // Pattern: **11. Some title** at start
    markdown = markdown.replace(/^\*\*(\d+)\.\s*([^*]+)\*\*/m, '## $1. $2');
    markdown = markdown.replace(/\n\*\*(\d+)\.\s*([^*\n]+)\*\*/g, '\n\n## $1. $2');

    // 6. Convert section headers to H3 headings
    const sectionHeaders = [
        'Funkce', 'Pozice v modelu', 'Princip činnosti', 'Dělení', 'Historie',
        'Protokoly', 'Adresace', 'Směrování', 'Síťové prvky', 'Kabeláž',
        'Druhy', 'Typy', 'Shrnutí', 'Závěr', 'Parametry', 'Topologie',
        'Podvrstvy', 'Vlastnosti', 'Přístupové metody', 'Komponenty',
        'Bloky dat', 'Modulace', 'Kódování', 'Značení', 'Spektrum',
        'Adresy', 'Propojení', 'Přenos', 'Účel', 'Bloky'
    ];

    for (const header of sectionHeaders) {
        // Match **Header:** or **Header name:** patterns
        const regex = new RegExp(`\\*\\*(${header}[^*:]*):\\*\\*`, 'g');
        markdown = markdown.replace(regex, '\n\n### $1:\n\n');

        const regex2 = new RegExp(`\\*\\*(${header}[^*]*)\\*\\*(?=\\s*$)`, 'gm');
        markdown = markdown.replace(regex2, '\n\n### $1\n\n');
    }

    // 7. Add newline after section-like bold text ending with :
    // Pattern: **Something:** followed by text -> **Something:**\n\ntext
    markdown = markdown.replace(/(\*\*[^*]+:\*\*)([^\n])/g, '$1\n\n$2');

    // 8. Fix numbered list formatting - ensure proper structure
    // Pattern: 1.**text** -> 1. **text**
    markdown = markdown.replace(/(\d+)\.\*\*/g, '$1. **');

    // 9. Remove excessive newlines (more than 3)
    markdown = markdown.replace(/\n{4,}/g, '\n\n\n');

    // 10. Remove "Obrazec" placeholder lines
    markdown = markdown.replace(/^Obrazec$/gm, '');
    markdown = markdown.replace(/\nObrazec\n/g, '\n');

    // 11. Ensure lists have proper spacing
    // Add blank line before list if preceded by text
    markdown = markdown.replace(/([^\n])\n([-–•]\s)/g, '$1\n\n$2');
    markdown = markdown.replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2');

    // 12. Clean up any double spaces
    markdown = markdown.replace(/  +/g, ' ');

    // 13. Trim leading/trailing whitespace from lines but preserve structure
    const lines = markdown.split('\n');
    markdown = lines.map(l => l.trimEnd()).join('\n');

    // 14. Final cleanup - remove leading newlines
    markdown = markdown.replace(/^\n+/, '');

    return markdown;
}

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
    let updatedCount = 0;

    for (const question of data.questions) {
        // Target Počítačové sítě category (questions 11-20)
        if (question.category === 'Počítačové sítě' && question.id >= 11 && question.id <= 20) {
            console.log(`Processing Q${question.id}: ${question.question.substring(0, 40)}...`);
            const original = question.answer;
            const formatted = formatText(original);

            if (original !== formatted) {
                question.answer = formatted;
                updatedCount++;
                console.log(`  > Fixed formatting`);
            } else {
                console.log(`  > No changes needed`);
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(QUESTIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\nUpdated ${updatedCount} questions. Saved to it-questions.json.`);
    } else {
        console.log("\nNo changes made.");
    }
}

main();
