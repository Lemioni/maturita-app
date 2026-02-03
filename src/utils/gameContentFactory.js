import itQuestionsData from '../data/it-questions.json';

export const generateGameContent = () => {
    const pairs = [];
    const usedTerms = new Set();

    try {
        if (!itQuestionsData || !itQuestionsData.questions) {
            console.error('Dopamine: Invalid data source', itQuestionsData);
            return [];
        }

        // Iterate all IT questions
        itQuestionsData.questions.forEach(q => {
            if (!q.compactContent || !q.compactContent.sections) return;

            q.compactContent.sections.forEach(section => {
                if (!section.items) return;

                section.items.forEach(item => {
                    // Basic validation: Term must act as "Question" and Definition as "Answer"
                    // Or vice versa. We usually want short Q and short A.
                    // Term is usually short. Definition can be long.

                    // Safe Item Check
                    if (!item || typeof item.term !== 'string' || typeof item.definition !== 'string') {
                        return;
                    }

                    // Clean up
                    const term = item.term.trim();
                    let def = item.definition.trim();

                    if (!term || !def) return; // Skip empty

                    // Skip if too long for a bubble
                    if (def.length > 80) {
                        // Try to truncate cleanly? Or just skip? 
                        // Let's truncate for gameplay flow
                        def = def.substring(0, 77) + '...';
                    }

                    // Dedup
                    if (usedTerms.has(term)) return;
                    usedTerms.add(term);

                    pairs.push({
                        q: term,
                        a: def,
                        sourceId: q.id,
                        sourceTopic: q.question
                    });
                });
            });
        });

        // Shuffle
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

        console.log(`Dopamine: Loaded ${pairs.length} pairs.`);
    } catch (e) {
        console.error('Dopamine: Error generating content', e);
    }

    // Fallback if empty (Demo Mode)
    if (pairs.length === 0) {
        console.warn('Dopamine: No dynamic pairs found. Using fallback.');
        return [
            { q: "Demo: HTML", a: "HyperText Markup Language", sourceId: 0 },
            { q: "Demo: CSS", a: "Cascading Style Sheets", sourceId: 0 },
            { q: "Demo: JS", a: "JavaScript", sourceId: 0 },
            { q: "Demo: React", a: "UI Library", sourceId: 0 },
            { q: "Demo: CPU", a: "Central Processing Unit", sourceId: 0 },
        ];
    }

    return pairs;
};
