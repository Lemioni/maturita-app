// Utility to merge book data from multiple JSON files
import cjBooksData1 from './cj-books.json';
import cjBooksData2 from './cj-books-2.json';

// Merge books from both files, with cj-books-2 taking priority for updates
const mergeBooks = () => {
    const booksMap = new Map();

    // Add all books from first file
    cjBooksData1.books.forEach(book => {
        booksMap.set(book.id, book);
    });

    // Override/add books from second file (these have the updated analyses)
    cjBooksData2.books.forEach(book => {
        booksMap.set(book.id, book);
    });

    // Convert back to array and sort by id
    return Array.from(booksMap.values()).sort((a, b) => a.id - b.id);
};

export const books = mergeBooks();
export const periods = cjBooksData1.periods;

export default {
    books,
    periods
};
