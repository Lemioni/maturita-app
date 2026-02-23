import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildBookTerms } from '../src/utils/bookTerms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booksPath = path.join(__dirname, '../src/data/cj-books.json');
const dictionaryPath = path.join(__dirname, '../src/data/dictionary.json');
const outputPath = path.join(__dirname, '../src/data/cj-book-terms.generated.json');

const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
const dictionaryData = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

const generated = {
    generatedAt: new Date().toISOString(),
    books: booksData.books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        terms: buildBookTerms(book, dictionaryData.terms),
    })),
};

fs.writeFileSync(outputPath, JSON.stringify(generated, null, 2), 'utf8');

console.log(`Generated ${generated.books.length} book term sets into ${outputPath}`);
