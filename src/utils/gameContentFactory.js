import itQuestionsData from '../data/it-questions.json';


import cjBooksData from '../data/cj-books.json';

const generateITContent = (selectedIds) => {
    const pairs = [];
    const usedTerms = new Set();
    const questionsToUse = selectedIds && selectedIds.length > 0
        ? itQuestionsData.questions.filter(q => selectedIds.includes(q.id))
        : itQuestionsData.questions;

    questionsToUse.forEach(q => {
        if (!q.compactContent || !q.compactContent.sections) return;

        q.compactContent.sections.forEach(section => {
            if (!section.items) return;

            section.items.forEach(item => {
                if (!item || typeof item.term !== 'string' || typeof item.definition !== 'string') return;

                const term = item.term.trim();
                let def = item.definition.trim();

                if (!term || !def) return;
                if (def.length > 80) def = def.substring(0, 77) + '...';

                if (usedTerms.has(term)) return;
                usedTerms.add(term);

                pairs.push({
                    q: term,
                    a: def,
                    sourceId: q.id,
                    type: 'IT'
                });
            });
        });
    });
    return pairs;
};

const generateCJContent = (selectedIds) => {
    const pairs = [];
    const booksToUse = selectedIds && selectedIds.length > 0
        ? cjBooksData.books.filter(b => selectedIds.includes(b.id))
        : cjBooksData.books;

    booksToUse.forEach(book => {
        // Author <-> Book
        pairs.push({
            q: book.title,
            a: book.author,
            sourceId: book.id,
            type: 'CJ'
        });

        // Genre <-> Book
        pairs.push({
            q: book.title + " (Žánr)",
            a: book.genre,
            sourceId: book.id,
            type: 'CJ'
        });

        // Era <-> Book
        pairs.push({
            q: book.title + " (Období)",
            a: book.period,
            sourceId: book.id,
            type: 'CJ'
        });

        if (book.analysis) {
            // Characters
            if (book.analysis.characters) {
                book.analysis.characters.forEach(char => {
                    if (char.description) {
                        pairs.push({
                            q: char.name,
                            a: char.description.length > 80 ? char.description.substring(0, 77) + '...' : char.description,
                            sourceId: book.id,
                            type: 'CJ'
                        });
                    } else if (char.traits) {
                        const traitKeys = Object.keys(char.traits);
                        if (traitKeys.length > 0) {
                            const firstTrait = char.traits[traitKeys[0]];
                            pairs.push({
                                q: char.name,
                                a: firstTrait.length > 80 ? firstTrait.substring(0, 77) + '...' : firstTrait,
                                sourceId: book.id,
                                type: 'CJ'
                            });
                        }
                    }
                });
            }

            // Literary Devices
            if (book.analysis.literaryDevices) {
                book.analysis.literaryDevices.forEach(dev => {
                    pairs.push({
                        q: `${dev.name} (${book.title})`,
                        a: dev.example.length > 80 ? dev.example.substring(0, 77) + '...' : dev.example,
                        sourceId: book.id,
                        type: 'CJ'
                    });
                });
            }
        }
    });
    return pairs;
};


export const generateGameContent = (category = 'IT', selectedIds = []) => {
    let pairs = [];

    try {
        if (category === 'IT') {
            pairs = generateITContent(selectedIds);
        } else if (category === 'CJ') {
            pairs = generateCJContent(selectedIds);
        }

        console.log(`Dopamine: Loaded ${pairs.length} pairs for ${category}.`);

        // Shuffle
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

    } catch (e) {
        console.error('Dopamine: Error generating content', e);
    }

    // Fallback if empty (Demo Mode)
    if (pairs.length === 0) {
        return [
            { q: "Demo: Žádná data", a: "Vyber více témat/knížek", sourceId: 0 },
        ];
    }

    return pairs;
};
