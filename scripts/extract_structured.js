import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '../src/data/it-questions.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Style map to detect Word heading styles
const styleMap = [
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "p[style-name='Nadpis 1'] => h1:fresh",
    "p[style-name='Nadpis 2'] => h2:fresh",
    "p[style-name='Nadpis 3'] => h3:fresh"
];

async function extractStructured(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    // First get HTML to see the structure
    const { value: html } = await mammoth.convertToHtml({
        path: filePath,
        styleMap: styleMap
    });

    // Parse the HTML to extract structure
    const sections = [];
    let currentSection = null;
    let currentSubsection = null;

    // Simple regex-based parsing of the HTML
    // Split by headings
    const lines = html.split(/<\/?(?:h[123]|p|ul|ol|li)[^>]*>/gi);
    const tags = html.match(/<(?:h[123]|p|ul|ol|li)[^>]*>/gi) || [];

    let i = 0;
    for (const tag of tags) {
        const content = lines[i + 1]?.trim().replace(/<[^>]+>/g, '').trim();
        i++;

        if (!content) continue;

        // Skip "Obrazec" placeholders
        if (content === 'Obrazec') continue;

        if (tag.match(/<h1/i)) {
            // Main title - skip (we use question title)
            continue;
        }

        if (tag.match(/<h2/i)) {
            // New section
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: content,
                items: []
            };
            currentSubsection = null;
        }
        else if (tag.match(/<h3/i)) {
            // Subsection
            if (currentSection) {
                if (!currentSection.subsections) {
                    currentSection.subsections = [];
                }
                currentSubsection = {
                    title: content,
                    items: []
                };
                currentSection.subsections.push(currentSubsection);
            }
        }
        else if (tag.match(/<p/i)) {
            // Paragraph text
            const target = currentSubsection || currentSection;
            if (target) {
                if (!target.text) {
                    target.text = content;
                } else {
                    target.text += ' ' + content;
                }
            } else {
                // Create intro section
                currentSection = {
                    title: '',
                    text: content,
                    items: []
                };
            }
        }
        else if (tag.match(/<li/i)) {
            // List item
            const target = currentSubsection || currentSection;
            if (target) {
                // Check if it's a term:definition pattern
                const termMatch = content.match(/^([^:–-]+)[:\-–]\s*(.+)$/);
                if (termMatch) {
                    target.items.push({
                        term: termMatch[1].trim(),
                        definition: termMatch[2].trim()
                    });
                } else {
                    target.items.push(content);
                }
            }
        }
    }

    if (currentSection) {
        sections.push(currentSection);
    }

    return { sections };
}

async function main() {
    console.log("Reading questions...");
    const data = JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf8'));
    let updatedCount = 0;

    for (const question of data.questions) {
        // Only process Počítačové sítě questions 11-20
        if (question.category === "Počítačové sítě" && question.id >= 11 && question.id <= 20) {
            const relativePath = question.sourceFile;

            // Skip non-docx
            if (!relativePath || !relativePath.endsWith('.docx')) {
                console.log(`Skipping Q${question.id} (Not .docx): ${relativePath}`);
                continue;
            }

            const absolutePath = path.join(PUBLIC_DIR, relativePath);

            try {
                console.log(`Processing Q${question.id}: ${relativePath}...`);
                const content = await extractStructured(absolutePath);

                // Only add if we got meaningful sections
                if (content.sections.length > 0) {
                    question.content = content;
                    updatedCount++;
                    console.log(`  > Added ${content.sections.length} sections`);
                } else {
                    console.log(`  > No sections found`);
                }
            } catch (err) {
                console.error(`  > Error: ${err.message}`);
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
