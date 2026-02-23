const PSI_START_ID = 11;
const PSI_END_ID = 20;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const stripMarkdownArtifacts = (value) => {
    if (!isNonEmptyString(value)) return '';

    return value
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^>\s+/g, '')
        .replace(/^#{1,6}\s+/g, '')
        .replace(/^[-*]\s+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const normalize = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[*_`~#>]/g, '')
        .replace(/[.,;:!?()\[\]{}"'“”„]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const toKey = (value) => normalize(value);
const isTipTitle = (value) => /tip\s*k\s*maturit/i.test(value || '');

const createMapStore = () => ({
    order: [],
    map: new Map(),
});

const addUnique = (store, value) => {
    if (!isNonEmptyString(value)) return;
    const trimmedValue = stripMarkdownArtifacts(value);
    if (!trimmedValue) return;
    const key = toKey(trimmedValue);
    if (!key) return;
    if (!store.map.has(key)) {
        store.order.push(key);
        store.map.set(key, trimmedValue);
    }
};

const createSection = (title) => ({
    title: title || '',
    texts: createMapStore(),
    items: createMapStore(),
    numberedItems: createMapStore(),
    subsections: new Map(),
    subsectionOrder: [],
});

const ensureSection = (sectionMap, sectionOrder, title) => {
    const safeTitle = isNonEmptyString(title) ? stripMarkdownArtifacts(title) : 'Doplňující body';
    const key = toKey(safeTitle) || safeTitle;

    if (!sectionMap.has(key)) {
        sectionMap.set(key, createSection(safeTitle));
        sectionOrder.push(key);
    }

    return sectionMap.get(key);
};

const ensureSubsection = (section, title) => {
    const safeTitle = isNonEmptyString(title) ? stripMarkdownArtifacts(title) : 'Další';
    const key = toKey(safeTitle) || safeTitle;

    if (!section.subsections.has(key)) {
        section.subsections.set(key, {
            title: safeTitle,
            texts: createMapStore(),
            items: createMapStore(),
            numberedItems: createMapStore(),
        });
        section.subsectionOrder.push(key);
    }

    return section.subsections.get(key);
};

const itemToString = (item) => {
    if (isNonEmptyString(item)) return stripMarkdownArtifacts(item);
    if (!item || typeof item !== 'object') return '';

    if (isNonEmptyString(item.term) && isNonEmptyString(item.definition)) {
        return stripMarkdownArtifacts(`${item.term.trim()} – ${item.definition.trim()}`);
    }

    if (isNonEmptyString(item.term)) {
        return stripMarkdownArtifacts(item.term);
    }

    if (isNonEmptyString(item.definition)) {
        return stripMarkdownArtifacts(item.definition);
    }

    return '';
};

const ingestSectionData = (targetSection, sectionData) => {
    if (!sectionData || typeof sectionData !== 'object') return;

    if (isNonEmptyString(sectionData.text)) {
        addUnique(targetSection.texts, sectionData.text);
    }

    if (Array.isArray(sectionData.items)) {
        sectionData.items.forEach((item) => addUnique(targetSection.items, itemToString(item)));
    }

    if (Array.isArray(sectionData.numberedItems)) {
        sectionData.numberedItems.forEach((item) => addUnique(targetSection.numberedItems, itemToString(item)));
    }

    if (Array.isArray(sectionData.subsections)) {
        sectionData.subsections.forEach((subsection) => {
            const targetSub = ensureSubsection(targetSection, subsection?.title);
            if (isNonEmptyString(subsection?.text)) {
                addUnique(targetSub.texts, subsection.text);
            }

            if (Array.isArray(subsection?.items)) {
                subsection.items.forEach((item) => addUnique(targetSub.items, itemToString(item)));
            }

            if (Array.isArray(subsection?.numberedItems)) {
                subsection.numberedItems.forEach((item) => addUnique(targetSub.numberedItems, itemToString(item)));
            }
        });
    }
};

const parseAnswerToSections = (answer) => {
    if (!isNonEmptyString(answer)) return [];

    const lines = answer.split(/\r?\n/);
    const sections = [];
    let current = { title: 'Přehled', text: '', items: [], numberedItems: [] };
    let paragraphBuffer = [];
    let inCodeBlock = false;

    const flushParagraph = () => {
        if (!paragraphBuffer.length) return;
        const paragraph = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
        if (!paragraph) {
            paragraphBuffer = [];
            return;
        }

        if (!current.text) {
            current.text = paragraph;
        } else {
            current.items.push(paragraph);
        }

        paragraphBuffer = [];
    };

    const pushCurrent = () => {
        flushParagraph();
        if (current.text || current.items.length || current.numberedItems.length || isNonEmptyString(current.title)) {
            sections.push(current);
        }
    };

    lines.forEach((rawLine) => {
        const line = rawLine.trim();

        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }

        if (inCodeBlock) return;

        if (!line) {
            flushParagraph();
            return;
        }

        const headingMatch = line.match(/^#{1,6}\s+(.*)$/);
        if (headingMatch) {
            pushCurrent();
            current = { title: stripMarkdownArtifacts(headingMatch[1]), text: '', items: [], numberedItems: [] };
            return;
        }

        const uppercaseSectionLike = line.match(/^[A-Z0-9ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s\/().,+-]{4,90}(?:\s[💡⚠️✅📌])?:?$/);
        if (uppercaseSectionLike) {
            const cleanedHeading = stripMarkdownArtifacts(line.replace(/[:\s]+$/, '').replace(/[💡⚠️✅📌]/g, '').trim());
            if (cleanedHeading.length >= 3) {
                pushCurrent();
                current = { title: cleanedHeading, text: '', items: [], numberedItems: [] };
                return;
            }
        }

        const bulletMatch = line.match(/^[-*]\s+(.*)$/);
        if (bulletMatch) {
            flushParagraph();
            current.items.push(stripMarkdownArtifacts(bulletMatch[1]));
            return;
        }

        const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);
        if (orderedMatch) {
            flushParagraph();
            current.numberedItems.push(stripMarkdownArtifacts(orderedMatch[1]));
            return;
        }

        const plainHeadingLike = line.match(/^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0-9].{0,80}:$/);
        if (plainHeadingLike) {
            pushCurrent();
            current = { title: stripMarkdownArtifacts(line.replace(/:$/, '').trim()), text: '', items: [], numberedItems: [] };
            return;
        }

        const termDefinitionLike = line.match(/^([^:]{2,80})\s[–-]\s(.+)$/);
        if (termDefinitionLike && line.length <= 190) {
            flushParagraph();
            current.items.push(stripMarkdownArtifacts(line));
            return;
        }

        const shortMarkerLine = line.match(/^[A-Z0-9ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\/().,+-]{2,25}$/);
        if (shortMarkerLine) {
            flushParagraph();
            current.items.push(stripMarkdownArtifacts(line));
            return;
        }

        paragraphBuffer.push(stripMarkdownArtifacts(line));
    });

    pushCurrent();

    return sections.filter((section) => section.text || section.items.length || section.numberedItems.length);
};

const storeValues = (store) => store.order.map((key) => store.map.get(key)).filter(Boolean);

const compactText = (text) => {
    if (!isNonEmptyString(text)) return '';
    return text.replace(/\s+/g, ' ').trim();
};

export const isPsiQuestion = (question) => {
    if (!question || typeof question !== 'object') return false;
    const id = Number(question.id);
    return Number.isFinite(id) && id >= PSI_START_ID && id <= PSI_END_ID;
};

export const buildUnifiedPsiContent = (question) => {
    if (!isPsiQuestion(question)) return question?.content || null;

    const sectionMap = new Map();
    const sectionOrder = [];

    const ingestSections = (sections) => {
        if (!Array.isArray(sections)) return;
        sections.forEach((section) => {
            const targetSection = ensureSection(sectionMap, sectionOrder, section?.title);
            ingestSectionData(targetSection, section);
        });
    };

    ingestSections(question?.content?.sections || []);
    ingestSections(question?.compactContent?.sections || []);
    ingestSections(parseAnswerToSections(question?.answer));

    const mergedSections = sectionOrder
        .map((key) => sectionMap.get(key))
        .filter(Boolean)
        .map((section) => {
            const subsections = section.subsectionOrder
                .map((subKey) => section.subsections.get(subKey))
                .filter(Boolean)
                .map((sub) => {
                    const subTexts = storeValues(sub.texts);
                    const subItems = storeValues(sub.items);
                    const subNumbered = storeValues(sub.numberedItems);

                    return {
                        ...(isNonEmptyString(sub.title) ? { title: sub.title } : {}),
                        ...(subTexts.length ? { text: subTexts.join(' ') } : {}),
                        ...(subItems.length ? { items: subItems } : {}),
                        ...(subNumbered.length ? { numberedItems: subNumbered } : {}),
                    };
                })
                .filter((sub) => sub.text || (sub.items && sub.items.length) || (sub.numberedItems && sub.numberedItems.length));

            const texts = storeValues(section.texts);
            const items = storeValues(section.items);
            const numberedItems = storeValues(section.numberedItems);

            return {
                ...(isNonEmptyString(section.title) ? { title: section.title } : {}),
                ...(texts.length ? { text: texts.join(' ') } : {}),
                ...(items.length ? { items } : {}),
                ...(numberedItems.length ? { numberedItems } : {}),
                ...(subsections.length ? { subsections } : {}),
            };
        })
        .filter((section) => section.text || (section.items && section.items.length) || (section.numberedItems && section.numberedItems.length) || (section.subsections && section.subsections.length));

    const regularSections = mergedSections.filter((section) => !isTipTitle(section.title));
    const tipSections = mergedSections.filter((section) => isTipTitle(section.title));
    const orderedSections = [...regularSections, ...tipSections];

    return orderedSections.length ? { sections: orderedSections } : null;
};

export const buildCompactFromUnifiedContent = (unifiedContent) => {
    if (!unifiedContent?.sections?.length) return null;

    return {
        sections: unifiedContent.sections.map((section) => ({
            ...(isNonEmptyString(section.title) ? { title: section.title } : {}),
            ...(isNonEmptyString(section.text) ? { text: compactText(section.text) } : {}),
            ...(Array.isArray(section.items) && section.items.length
                ? { items: section.items.map((item) => compactText(item)).filter(Boolean) }
                : {}),
            ...(Array.isArray(section.numberedItems) && section.numberedItems.length
                ? { numberedItems: section.numberedItems.map((item) => compactText(item)).filter(Boolean) }
                : {}),
            ...(Array.isArray(section.subsections) && section.subsections.length
                ? {
                    subsections: section.subsections
                        .map((subsection) => ({
                            ...(isNonEmptyString(subsection.title) ? { title: subsection.title } : {}),
                            ...(isNonEmptyString(subsection.text) ? { text: compactText(subsection.text) } : {}),
                            ...(Array.isArray(subsection.items) && subsection.items.length
                                ? { items: subsection.items.map((item) => compactText(item)).filter(Boolean) }
                                : {}),
                            ...(Array.isArray(subsection.numberedItems) && subsection.numberedItems.length
                                ? { numberedItems: subsection.numberedItems.map((item) => compactText(item)).filter(Boolean) }
                                : {}),
                        }))
                        .filter((subsection) => subsection.text || (subsection.items && subsection.items.length) || (subsection.numberedItems && subsection.numberedItems.length)),
                }
                : {}),
        })),
    };
};