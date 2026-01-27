
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/materialy/ICT2/PRG/22. Indexy a omezení v relačních databázích.docx');
const outputPath = path.join(__dirname, 'debug_extraction.md');

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
turndownService.use(gfm);

mammoth.convertToHtml({ path: filePath })
    .then(function (result) {
        const html = result.value;
        let markdown = turndownService.turndown(html);

        // Post-processing to fix formatting issues
        // 1. Replace "• " with "\n- " to create proper lists
        markdown = markdown.replace(/• /g, '\n- ');

        // 2. Ensure clear separation between headers and lists/text
        markdown = markdown.replace(/\*\*(.*?)\*\*\n- /g, '**$1**\n\n- ');

        // 3. Fix double spacing if any
        markdown = markdown.replace(/\n\n\n/g, '\n\n');

        // 4. Detect and wrap SQL commands (multi-line compaction)
        const sqlKeywords = ['CREATE', 'DROP', 'SELECT', 'INSERT', 'UPDATE', 'ALTER'];
        // Match from a keyword line, across newlines, until a line ending with ;
        // We use [\s\S]*? to match across lines (non-greedy)
        // We need to be careful not to match too much. 
        // Heuristic: SQL statements in these docs seem to end with ; and are somewhat continuous.

        // This regex looks for a start keyword, then swallows lines that might be separated by \n\n, ending with ;
        // We will match paragraph-separated lines.
        const multiLineSqlRegex = new RegExp(`^(${sqlKeywords.join('|')})[\\s\\S]*?;`, 'gm');

        markdown = markdown.replace(multiLineSqlRegex, (match) => {
            // Compact the match: remove extra newlines between lines
            // The match currently has "CREATE ...\n\n\nid ...\n\n\n);"
            // We want "CREATE ...\nid ...\n);"
            let compacted = match.replace(/\n\s*\n/g, '\n');

            // Unescape underscores
            compacted = compacted.replace(/\\_/g, '_');

            return '```sql\n' + compacted + '\n```';
        });

        fs.writeFileSync(outputPath, markdown);
        console.log(`Markdown written to ${outputPath}`);
    })
    .catch(function (error) {
        console.error(error);
    });
