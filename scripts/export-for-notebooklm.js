/**
 * Export book analyses as text files for Google NotebookLM
 * 
 * Usage: node scripts/export-for-notebooklm.js
 * Output: exported-books/ folder with one .txt per book
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const booksData = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'cj-books.json'), 'utf-8'));
const booksData2 = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'cj-books-2.json'), 'utf-8'));

// Merge & deduplicate by ID
const seen = new Set();
const allBooks = [];
for (const b of [...booksData.books, ...(booksData2.books || [])]) {
    if (!seen.has(b.id)) {
        seen.add(b.id);
        allBooks.push(b);
    }
}

const outputDir = join(__dirname, '..', 'exported-books');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

function exportBook(book) {
    const a = book.analysis || {};
    const lines = [];

    const hr = '═'.repeat(60);
    const hr2 = '─'.repeat(40);

    // Header
    lines.push(hr);
    lines.push(`MATURITNÍ ROZBOR: ${book.title}`);
    lines.push(`Autor: ${book.author}`);
    lines.push(`Rok vydání: ${book.year}`);
    lines.push(`Žánr: ${book.genre} | Literární forma: ${book.literaryForm}`);
    lines.push(`Období: ${book.period}`);
    lines.push(hr);
    lines.push('');

    // I. ČÁST
    lines.push('I. ČÁST – ANALÝZA UMĚLECKÉHO TEXTU');
    lines.push(hr2);

    if (a.titleAnalysis) {
        lines.push('');
        lines.push('ANALÝZA NÁZVU:');
        lines.push(a.titleAnalysis);
    }

    if (a.plot) {
        lines.push('');
        lines.push('DĚJ:');
        lines.push(a.plot.replace(/\\n/g, '\n'));
    }

    if (a.themes) {
        lines.push('');
        lines.push('TÉMA:');
        lines.push(`Hlavní téma: ${a.themes.main}`);
        if (a.themes.motifs) {
            lines.push(`Motivy: ${a.themes.motifs.join(', ')}`);
        }
    }

    if (a.setting) {
        lines.push('');
        lines.push('PROSTŘEDÍ:');
        lines.push(`Místo: ${a.setting.place}`);
        lines.push(`Čas: ${a.setting.time}`);
    }

    if (a.composition) {
        lines.push('');
        lines.push('KOMPOZICE:');
        if (a.composition.structure) lines.push(`Struktura: ${a.composition.structure}`);
        if (a.composition.timeline) lines.push(`Časová linie: ${a.composition.timeline}`);
        if (a.composition.rhyme) lines.push(`Rým: ${a.composition.rhyme}`);
    }

    if (book.genre || book.literaryForm) {
        lines.push('');
        lines.push('DRUH A ŽÁNR:');
        lines.push(`Literární druh: ${book.literaryForm}`);
        lines.push(`Žánr: ${book.genre}`);
    }

    // II. ČÁST
    lines.push('');
    lines.push('');
    lines.push('II. ČÁST – POSTAVY A VYPRAVĚČ');
    lines.push(hr2);

    if (a.narration) {
        lines.push('');
        lines.push('VYPRAVĚČ:');
        lines.push(`Typ: ${a.narration.narrator}`);
        lines.push(`Styl: ${a.narration.style}`);
    }

    if (a.characters && a.characters.length > 0) {
        lines.push('');
        lines.push('POSTAVY:');
        a.characters.forEach(c => {
            const main = c.isMain ? ' [HLAVNÍ POSTAVA]' : '';
            lines.push(`\n• ${c.name}${main}`);
            if (c.traits) {
                Object.entries(c.traits).forEach(([k, v]) => {
                    lines.push(`  ${k}: ${v}`);
                });
            }
            if (c.description) {
                lines.push(`  ${c.description}`);
            }
        });
    }

    // III. ČÁST
    lines.push('');
    lines.push('');
    lines.push('III. ČÁST – JAZYKOVÉ A LITERÁRNÍ PROSTŘEDKY');
    lines.push(hr2);

    if (a.languageDevices && a.languageDevices.length > 0) {
        lines.push('');
        lines.push('JAZYKOVÉ PROSTŘEDKY:');
        a.languageDevices.forEach(d => lines.push(`• ${d}`));
    }

    if (a.literaryDevices && a.literaryDevices.length > 0) {
        lines.push('');
        lines.push('TROPY A FIGURY:');
        a.literaryDevices.forEach(d => {
            lines.push(`• ${d.name}: ${d.example}`);
        });
    }

    // Ukázka
    if (a.excerpt) {
        lines.push('');
        lines.push('');
        lines.push('UKÁZKA Z TEXTU:');
        lines.push(hr2);
        lines.push(`"${a.excerpt.text}"`);
        if (a.excerpt.context) lines.push(`\nKontext: ${a.excerpt.context}`);
    }

    // Kontext
    lines.push('');
    lines.push('');
    lines.push('LITERÁRNĚHISTORICKÝ KONTEXT');
    lines.push(hr2);

    if (a.authorContext) {
        lines.push('');
        lines.push('KONTEXT AUTOROVY TVORBY:');
        if (a.authorContext.bio) lines.push(a.authorContext.bio);
        if (a.authorContext.life) {
            lines.push('\nŽivot:');
            a.authorContext.life.forEach(l => lines.push(`• ${l}`));
        }
        if (a.authorContext.style) {
            lines.push(`\nStyl: ${a.authorContext.style}`);
        }
        if (a.authorContext.workPosition) {
            lines.push(`\nZařazení díla: ${a.authorContext.workPosition}`);
        }
        if (a.authorContext.otherWorks) {
            lines.push('\nDalší díla:');
            a.authorContext.otherWorks.forEach(w => {
                let line = `• ${w.title} (${w.year})`;
                if (w.note) line += ` – ${w.note}`;
                lines.push(line);
            });
        }
    }

    if (a.literaryContext) {
        lines.push('');
        lines.push('LITERÁRNÍ A KULTURNÍ KONTEXT:');
        lines.push(`Směr: ${a.literaryContext.movement}${a.literaryContext.period ? ' (' + a.literaryContext.period + ')' : ''}`);
        if (a.literaryContext.description) lines.push(a.literaryContext.description);
        if (a.literaryContext.characteristics) {
            lines.push('\nCharakteristika směru:');
            a.literaryContext.characteristics.forEach(c => lines.push(`• ${c}`));
        }
        if (a.literaryContext.otherAuthors) {
            lines.push('\nDalší autoři směru:');
            a.literaryContext.otherAuthors.forEach(auth => {
                let line = `• ${auth.name}`;
                if (auth.years) line += ` (${auth.years})`;
                if (auth.note) line += ` – ${auth.note}`;
                if (auth.works) line += ` | Díla: ${auth.works.join(', ')}`;
                lines.push(line);
            });
        }
    }

    // Additional info
    if (a.additionalInfo) {
        lines.push('');
        lines.push('');
        lines.push('DALŠÍ INFORMACE:');
        lines.push(hr2);
        if (a.additionalInfo.dominantStyle) lines.push(`Slohový postup: ${a.additionalInfo.dominantStyle}`);
        if (a.additionalInfo.relevance) lines.push(`Aktuálnost: ${a.additionalInfo.relevance}`);
        if (a.additionalInfo.audience) lines.push(`Cílová skupina: ${a.additionalInfo.audience}`);
        if (a.additionalInfo.purpose) lines.push(`Smysl díla: ${a.additionalInfo.purpose}`);
    }

    // Stories (e.g. Poe)
    if (a.stories && a.stories.length > 0) {
        lines.push('');
        lines.push('');
        lines.push('JEDNOTLIVÉ PŘÍBĚHY / BÁSNĚ:');
        lines.push(hr2);
        a.stories.forEach((story, i) => {
            lines.push(`\n${'─'.repeat(30)}`);
            lines.push(`PŘÍBĚH ${i + 1}: ${story.title}`);
            lines.push('─'.repeat(30));
            if (story.titleAnalysis) lines.push(`Název: ${story.titleAnalysis}`);
            if (story.plot) lines.push(`\nDěj:\n${story.plot.replace(/\\n/g, '\n')}`);
            if (story.themes) {
                lines.push(`\nTéma: ${story.themes.main}`);
                if (story.themes.motifs) lines.push(`Motivy: ${story.themes.motifs.join(', ')}`);
            }
            if (story.setting) {
                lines.push(`\nMísto: ${story.setting.place}`);
                lines.push(`Čas: ${story.setting.time}`);
            }
            if (story.characters) {
                lines.push('\nPostavy:');
                story.characters.forEach(c => {
                    const m = c.isMain ? ' [HLAVNÍ]' : '';
                    lines.push(`• ${c.name}${m}`);
                    if (c.traits) Object.entries(c.traits).forEach(([k, v]) => lines.push(`  ${k}: ${v}`));
                    if (c.description) lines.push(`  ${c.description}`);
                });
            }
            if (story.narration) {
                lines.push(`\nVypravěč: ${story.narration.narrator}`);
                lines.push(`Styl: ${story.narration.style}`);
            }
            if (story.languageDevices) {
                lines.push('\nJazykové prostředky:');
                story.languageDevices.forEach(d => lines.push(`• ${d}`));
            }
            if (story.literaryDevices) {
                lines.push('\nTropy a figury:');
                story.literaryDevices.forEach(d => lines.push(`• ${d.name}: ${d.example}`));
            }
            if (story.excerpt) {
                lines.push(`\nUkázka: "${story.excerpt.text}"`);
                if (story.excerpt.context) lines.push(`Kontext: ${story.excerpt.context}`);
            }
        });
    }

    return lines.join('\n');
}

// Export all books
let count = 0;
allBooks.forEach(book => {
    const content = exportBook(book);
    const safeName = `${String(book.id).padStart(2, '0')}_${book.title.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_')}`;
    const filePath = join(outputDir, `${safeName}.txt`);
    writeFileSync(filePath, content, 'utf-8');
    count++;
    console.log(`✓ ${book.id}. ${book.title} → ${safeName}.txt`);
});

console.log(`\n✅ Exportováno ${count} knih do složky: exported-books/`);
console.log('Tyto soubory nahraj do Google NotebookLM jako zdroje.');
