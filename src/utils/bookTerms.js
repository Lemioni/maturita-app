const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toStringSafe = (value) => (typeof value === 'string' ? value : '');

const normalizeTermKey = (value) =>
    toStringSafe(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const addUnique = (list, seen, value, priority = 'work') => {
    const trimmed = toStringSafe(value).trim();
    if (!trimmed) return;
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (trimmed.length > 52 || wordCount > 6) return;
    if (/[.!?"„“]/.test(trimmed)) return;

    const normalized = normalizeTermKey(trimmed);
    if (!normalized || normalized.length < 3 || seen.has(normalized)) return;
    seen.add(normalized);
    list.push({ term: trimmed, priority });
};

const collectBookCandidateTerms = (book) => {
    const candidates = [];
    const seen = new Set();
    const analysis = book?.analysis || {};

    addUnique(candidates, seen, book?.author, 'author');
    addUnique(candidates, seen, book?.title, 'work');
    addUnique(candidates, seen, book?.genre, 'work');
    addUnique(candidates, seen, book?.literaryForm, 'work');
    addUnique(candidates, seen, book?.period, 'author');

    (book?.keywords || []).forEach((keyword) => addUnique(candidates, seen, keyword, 'work'));
    (analysis?.themes?.motifs || []).forEach((motif) => addUnique(candidates, seen, motif, 'work'));
    (analysis?.languageDevices || []).forEach((device) => addUnique(candidates, seen, device, 'work'));

    (analysis?.characters || []).forEach((character) => {
        addUnique(candidates, seen, character?.name, 'work');
    });

    addUnique(candidates, seen, analysis?.literaryContext?.movement, 'author');
    addUnique(candidates, seen, analysis?.literaryContext?.period, 'author');

    (analysis?.literaryContext?.otherAuthors || []).forEach((author) => {
        addUnique(candidates, seen, author?.name, 'author');
    });

    if (analysis?.authorContext?.shortBio?.name) {
        addUnique(candidates, seen, analysis.authorContext.shortBio.name, 'author');
    }

    (analysis?.authorContext?.otherWorks || []).forEach((work) => {
        addUnique(candidates, seen, work?.title, 'author');
    });

    return candidates;
};

const getBookCorpus = (book) => {
    const analysis = book?.analysis || {};
    const snippets = [
        book?.title,
        book?.author,
        book?.period,
        book?.genre,
        book?.literaryForm,
        analysis?.titleAnalysis,
        analysis?.plot,
        analysis?.themes?.main,
        analysis?.setting?.place,
        analysis?.setting?.time,
        analysis?.composition?.structure,
        analysis?.composition?.timeline,
        analysis?.narration?.narrator,
        analysis?.narration?.style,
        analysis?.excerpt?.text,
        analysis?.excerpt?.context,
        analysis?.authorContext?.bio,
        analysis?.authorContext?.workPosition,
        analysis?.literaryContext?.movement,
        analysis?.literaryContext?.description,
    ];

    const characters = (analysis?.characters || []).flatMap((character) => {
        if (!character?.traits) return [character?.name, character?.description];
        return [character?.name, ...Object.values(character.traits)];
    });

    const lists = [
        ...(analysis?.themes?.motifs || []),
        ...(analysis?.languageDevices || []),
        ...(analysis?.authorContext?.shortBio?.info || []),
        ...(analysis?.authorContext?.life || []),
        ...(analysis?.literaryContext?.characteristics || []),
        ...(analysis?.literaryContext?.otherAuthors || []).flatMap((author) => [author?.name, ...(author?.works || [])]),
        ...(analysis?.authorContext?.otherWorks || []).flatMap((work) => [work?.title, work?.note]),
    ];

    return normalizeTermKey([...snippets, ...characters, ...lists].filter(Boolean).join(' '));
};

export const buildBookTerms = (book, dictionaryTerms = [], preGeneratedTerms = null) => {
    if (!book) return [];

    if (Array.isArray(preGeneratedTerms) && preGeneratedTerms.length > 0) {
        return [...preGeneratedTerms].sort((a, b) => {
            if ((a.priority || 'work') !== (b.priority || 'work')) {
                return (a.priority || 'work') === 'author' ? -1 : 1;
            }
            return (b.term || '').length - (a.term || '').length;
        });
    }

    if (Array.isArray(book.generatedTerms) && book.generatedTerms.length > 0) {
        return [...book.generatedTerms].sort((a, b) => {
            if ((a.priority || 'work') !== (b.priority || 'work')) {
                return (a.priority || 'work') === 'author' ? -1 : 1;
            }
            return (b.term || '').length - (a.term || '').length;
        });
    }

    const fromBook = collectBookCandidateTerms(book);
    const corpus = getBookCorpus(book);
    const foundDictionaryTerms = [];

    dictionaryTerms.forEach((entry) => {
        if (!entry?.term) return;
        const normalized = normalizeTermKey(entry.term);
        if (!normalized || normalized.length < 4) return;
        if (corpus.includes(normalized)) {
            foundDictionaryTerms.push({
                term: entry.term,
                termId: entry.id,
                priority: entry.category === 'autori' || entry.category === 'epochy' ? 'author' : 'work',
            });
        }
    });

    const merged = [...fromBook, ...foundDictionaryTerms];
    const dedup = new Map();

    merged.forEach((item) => {
        const key = normalizeTermKey(item.term);
        if (!key || key.length < 3) return;
        if (!dedup.has(key)) {
            dedup.set(key, {
                term: item.term,
                termId: item.termId || null,
                priority: item.priority || 'work',
            });
            return;
        }

        const current = dedup.get(key);
        if (!current.termId && item.termId) current.termId = item.termId;
        if (current.priority !== 'author' && item.priority === 'author') current.priority = 'author';
    });

    return Array.from(dedup.values()).sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === 'author' ? -1 : 1;
        return b.term.length - a.term.length;
    });
};

const TERM_BOUNDARY = String.raw`(?<![\p{L}\p{N}])`;
const TERM_BOUNDARY_END = String.raw`(?![\p{L}\p{N}])`;

export const annotateTextByTerms = (text, terms = []) => {
    if (typeof text !== 'string' || !text.trim() || !terms.length) {
        return [{ text, match: null }];
    }

    const uniqueTerms = [];
    const seen = new Set();

    terms.forEach((item) => {
        const term = item?.term?.trim();
        if (!term) return;
        const key = normalizeTermKey(term);
        if (!key || key.length < 3 || seen.has(key)) return;
        seen.add(key);
        uniqueTerms.push(item);
    });

    if (!uniqueTerms.length) {
        return [{ text, match: null }];
    }

    const sortedTerms = [...uniqueTerms].sort((a, b) => b.term.length - a.term.length);
    const regex = new RegExp(
        `${TERM_BOUNDARY}(${sortedTerms.map((item) => escapeRegExp(item.term)).join('|')})${TERM_BOUNDARY_END}`,
        'giu'
    );

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const matchedText = match[1];
        const fullMatch = match[0];
        const offsetInsideFull = fullMatch.indexOf(matchedText);
        const start = match.index + offsetInsideFull;

        if (start > lastIndex) {
            parts.push({ text: text.slice(lastIndex, start), match: null });
        }

        const end = start + matchedText.length;
        const termMeta = sortedTerms.find((item) => normalizeTermKey(item.term) === normalizeTermKey(matchedText));
        parts.push({ text: matchedText, match: termMeta || null });
        lastIndex = end;

        if (regex.lastIndex <= match.index) {
            regex.lastIndex = match.index + 1;
        }
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), match: null });
    }

    return parts.length > 0 ? parts : [{ text, match: null }];
};
