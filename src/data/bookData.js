// Data source for books
import cjBooksData from './cj-books.json';

// Return books sorted by ID
export const books = cjBooksData.books.sort((a, b) => a.id - b.id);
export const periods = cjBooksData.periods;

export default {
    books,
    periods
};
