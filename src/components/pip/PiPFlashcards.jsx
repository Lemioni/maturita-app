import React, { useState, useEffect, useCallback } from 'react';
import cjBooks from '../../data/cj-books.json';
import itQuestions from '../../data/it-questions.json';

const STORAGE_KEY = 'maturita-srs';
const INTERVALS = [1, 3, 7, 14, 30];

const generateCards = () => {
    const cards = [];

    // CJ book cards
    cjBooks.books.forEach(b => {
        const a = b.analysis;
        if (!a) return;
        cards.push({ id: `${b.id}-author`, front: `Kdo napsal "${b.title}"?`, back: b.author, cat: 'cj' });
        if (b.genre) cards.push({ id: `${b.id}-genre`, front: `Žánr: "${b.title}"`, back: b.genre, cat: 'cj' });
        if (b.period) cards.push({ id: `${b.id}-period`, front: `Období: "${b.title}"`, back: b.period, cat: 'cj' });
        if (b.literaryForm) cards.push({ id: `${b.id}-form`, front: `Literární druh: "${b.title}"`, back: b.literaryForm, cat: 'cj' });
        if (a.narration?.narrator) cards.push({ id: `${b.id}-narrator`, front: `Typ vypravěče v "${b.title}"`, back: a.narration.narrator, cat: 'cj' });
        if (a.themes?.main) cards.push({ id: `${b.id}-theme`, front: `Hlavní téma: "${b.title}"`, back: a.themes.main, cat: 'cj' });
        if (a.literaryContext?.movement) cards.push({ id: `${b.id}-movement`, front: `Literární směr: "${b.title}"`, back: a.literaryContext.movement, cat: 'cj' });
        if (a.setting?.place) cards.push({ id: `${b.id}-place`, front: `Místo děje: "${b.title}"`, back: a.setting.place, cat: 'cj' });
        if (a.setting?.time) cards.push({ id: `${b.id}-time`, front: `Čas děje: "${b.title}"`, back: a.setting.time, cat: 'cj' });
        if (a.composition?.structure) cards.push({ id: `${b.id}-comp`, front: `Kompozice: "${b.title}"`, back: a.composition.structure, cat: 'cj' });
        // Characters
        if (a.characters?.length) {
            a.characters.slice(0, 3).forEach((c, i) => {
                if (c.name && (c.description || c.traits)) {
                    const desc = c.description || Object.values(c.traits || {}).join(', ');
                    cards.push({ id: `${b.id}-char-${i}`, front: `Kdo je ${c.name} v "${b.title}"?`, back: desc, cat: 'cj' });
                }
            });
            // Identify the main character
            const mainChar = a.characters.find(c => c.isMain);
            if (mainChar) {
                cards.push({ id: `${b.id}-mainchar`, front: `Hlavní postava díla "${b.title}"?`, back: mainChar.name, cat: 'cj' });
            }
        }

        // Year of publication
        if (b.year) {
            cards.push({ id: `${b.id}-year`, front: `Rok vydání díla "${b.title}"?`, back: b.year.toString(), cat: 'cj' });
        }

        // Author's other works
        if (a.authorContext?.otherWorks?.length) {
            const works = a.authorContext.otherWorks.filter(Boolean).map(w => typeof w === 'string' ? w : w?.title || '').filter(Boolean).slice(0, 4);
            if (works.length > 0) {
                cards.push({ id: `${b.id}-otherworks`, front: `Další díla autora "${b.author}" (kromě "${b.title}")?`, back: works.join(', '), cat: 'cj' });
            }
        }

        // Language devices
        if (a.languageDevices?.length) {
            const devs = a.languageDevices.slice(0, 3).join('; ');
            cards.push({ id: `${b.id}-langdev`, front: `Jazykové prostředky v "${b.title}"?`, back: devs, cat: 'cj' });
        }

        // Literary devices (tropes)
        if (a.literaryDevices?.length) {
            const devs = a.literaryDevices.filter(Boolean).slice(0, 3).map(d => `${d?.name || '?'}: ${d?.example || '?'}`).join('; ');
            cards.push({ id: `${b.id}-litdev`, front: `Tropy a figury v "${b.title}" (příklady)?`, back: devs, cat: 'cj' });
        }

        // Setting time
        if (a.setting?.time) {
            cards.push({ id: `${b.id}-time2`, front: `Kdy se odehrává děj "${b.title}"?`, back: a.setting.time, cat: 'cj' });
        }

        // Narration style
        if (a.narration?.style) {
            cards.push({ id: `${b.id}-narstyle`, front: `Styl vyprávění v "${b.title}"?`, back: a.narration.style, cat: 'cj' });
        }

        // Composition timeline
        if (a.composition?.timeline) {
            cards.push({ id: `${b.id}-timeline`, front: `Časová posloupnost v "${b.title}"?`, back: a.composition.timeline, cat: 'cj' });
        }

        // Literary context description
        if (a.literaryContext?.description) {
            const desc = a.literaryContext.description.slice(0, 120);
            cards.push({ id: `${b.id}-litctx`, front: `Stručně charakterizuj literární směr díla "${b.title}"`, back: desc, cat: 'cj' });
        }

        // Theme motifs
        if (a.themes?.motifs?.length) {
            cards.push({ id: `${b.id}-motifs`, front: `Hlavní motivy díla "${b.title}"?`, back: a.themes.motifs.join(', '), cat: 'cj' });
        }

        // Plot card (short)
        if (a.plot) {
            const shortPlot = a.plot.replace(/\\n/g, ' ').replace(/\n/g, ' ').slice(0, 150);
            cards.push({ id: `${b.id}-plot`, front: `O čem je "${b.title}" (stručně)?`, back: shortPlot, cat: 'cj' });
        }

        // Excerpt "who said it"
        if (a.excerpt?.text) {
            const cleanText = a.excerpt.text.replace(/\\n/g, ' ').replace(/\n/g, ' ').slice(0, 120);
            cards.push({ id: `${b.id}-excerpt`, front: `Z jakého díla pochází tato ukázka: "${cleanText}…"`, back: b.title, cat: 'cj' });
        }
    });

    // IT question cards
    if (itQuestions?.questions) {
        itQuestions.questions.forEach(q => {
            // Title/question card
            if (q.question) {
                const headings = (q.answer || '').split('\n')
                    .filter(l => l.trim().startsWith('## ') || l.trim().startsWith('### '))
                    .map(l => l.replace(/^#{1,4}\s*/, '').trim())
                    .filter(h => h.length > 0 && h.length < 80)
                    .slice(0, 5);
                if (headings.length > 0) {
                    cards.push({
                        id: `it-${q.id}-topics`,
                        front: `Co zahrnuje IT otázka: "${q.question}"?`,
                        back: headings.join(', '),
                        cat: 'it',
                    });
                }
            }

            // Category card
            if (q.question && q.category) {
                cards.push({
                    id: `it-${q.id}-cat`,
                    front: `Do jaké kategorie patří IT otázka: "${q.question}"?`,
                    back: q.category,
                    cat: 'it',
                });
            }

            // Key terms from compact content
            if (q.compactContent) {
                const terms = (q.compactContent || '').split('\n')
                    .filter(l => l.trim().startsWith('**') || l.trim().startsWith('- ') || l.trim().startsWith('• '))
                    .map(l => l.replace(/\*\*/g, '').replace(/^[-•]\s*/, '').trim())
                    .filter(t => t.length > 3 && t.length < 80)
                    .slice(0, 4);
                if (terms.length > 0) {
                    cards.push({
                        id: `it-${q.id}-terms`,
                        front: `Klíčové pojmy otázky č.${q.id}: "${q.question}"?`,
                        back: terms.join('; '),
                        cat: 'it',
                    });
                }
            }
        });
    }

    return cards;
};

const getStoredData = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};

const s = {
    card: {
        background: '#111', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '2px', padding: '20px 16px', textAlign: 'center',
        minHeight: '160px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
    },
    label: { fontSize: '9px', color: 'rgba(224,224,224,0.2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
    question: { fontSize: '14px', fontWeight: '500', color: '#e0e0e0', lineHeight: '1.5' },
    answer: { fontSize: '15px', fontWeight: '600', color: '#8b5cf6', lineHeight: '1.5' },
    hint: { fontSize: '10px', color: 'rgba(224,224,224,0.2)', marginTop: '14px' },
    btnRow: { display: 'flex', gap: '8px', marginTop: '14px', width: '100%' },
    btnGreen: {
        flex: 1, padding: '8px', border: '1px solid rgba(51,255,51,0.15)',
        borderRadius: '2px', background: 'rgba(51,255,51,0.05)', color: '#33ff33',
        fontWeight: '600', fontSize: '11px', cursor: 'pointer',
    },
    btnRed: {
        flex: 1, padding: '8px', border: '1px solid rgba(255,51,51,0.15)',
        borderRadius: '2px', background: 'rgba(255,51,51,0.05)', color: '#ff3333',
        fontWeight: '600', fontSize: '11px', cursor: 'pointer',
    },
    progress: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: 'rgba(224,224,224,0.3)' },
    progressBar: { height: '2px', background: 'rgba(255,255,255,0.04)', marginBottom: '10px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#8b5cf6', transition: 'width 0.3s ease' },
    catBadge: (cat) => ({
        display: 'inline-block', fontSize: '9px', padding: '1px 4px', borderRadius: '2px', marginLeft: '6px',
        color: cat === 'it' ? 'rgba(96,165,250,0.7)' : 'rgba(244,114,182,0.7)',
    }),
    doneBox: { textAlign: 'center', padding: '32px 16px' },
    retryBtn: {
        padding: '8px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '2px', color: 'rgba(224,224,224,0.4)', fontWeight: '500', fontSize: '11px', cursor: 'pointer',
    },
};

const PiPFlashcards = () => {
    const [allCards] = useState(() => generateCards());
    const [dueCards, setDueCards] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [sessionDone, setSessionDone] = useState(false);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });

    const loadDue = useCallback(() => {
        const stored = getStoredData();
        const now = Date.now();
        const due = allCards.filter(c => {
            const d = stored[c.id];
            if (!d) return true;
            return now >= d.nextReview;
        });
        for (let i = due.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [due[i], due[j]] = [due[j], due[i]];
        }
        setDueCards(due.slice(0, 20));
        setCurrentIdx(0);
        setShowBack(false);
        setSessionDone(false);
        setStats({ correct: 0, wrong: 0 });
    }, [allCards]);

    useEffect(() => { loadDue(); }, [loadDue]);

    const handleAnswer = (correct) => {
        const card = dueCards[currentIdx];
        const stored = getStoredData();
        const cardData = stored[card.id] || { box: 0 };
        cardData.box = correct ? Math.min(cardData.box + 1, INTERVALS.length - 1) : 0;
        cardData.nextReview = Date.now() + INTERVALS[cardData.box] * 86400000;
        cardData.lastReviewed = Date.now();
        stored[card.id] = cardData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

        setStats(p => ({ correct: p.correct + (correct ? 1 : 0), wrong: p.wrong + (correct ? 0 : 1) }));
        setShowBack(false);
        if (currentIdx + 1 >= dueCards.length) setSessionDone(true);
        else setCurrentIdx(currentIdx + 1);
    };

    if (sessionDone || dueCards.length === 0) {
        return (
            <div style={s.doneBox}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧠</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#8b5cf6', marginBottom: '6px' }}>
                    {dueCards.length === 0 ? 'Žádné kartičky!' : 'Hotovo!'}
                </div>
                {sessionDone && (
                    <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginBottom: '8px' }}>
                        <span style={{ color: '#33ff33' }}>{stats.correct} ✓</span>
                        {' · '}
                        <span style={{ color: '#ff3333' }}>{stats.wrong} ✗</span>
                    </div>
                )}
                <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.3)', marginBottom: '16px' }}>
                    {dueCards.length === 0 ? 'Vrať se zítra!' : 'Skvělá práce!'}
                </div>
                <button style={s.retryBtn} onClick={loadDue}>Znovu</button>
            </div>
        );
    }

    const current = dueCards[currentIdx];
    const progress = ((currentIdx + 1) / dueCards.length) * 100;
    const stored = getStoredData();
    const box = (stored[current.id]?.box ?? 0) + 1;

    return (
        <div>
            <div style={s.progress}>
                <span>
                    {currentIdx + 1} / {dueCards.length}
                    <span style={s.catBadge(current.cat)}>{current.cat === 'it' ? 'IT' : 'ČJ'}</span>
                </span>
                <span>
                    <span style={{ color: '#4ade80' }}>{stats.correct} ✓</span>
                    {' · '}
                    <span style={{ color: '#f87171' }}>{stats.wrong} ✗</span>
                </span>
            </div>
            <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${progress}%` }} />
            </div>
            <div style={s.card} onClick={() => !showBack && setShowBack(true)}>
                <div style={s.label}>{showBack ? 'ODPOVĚĎ' : 'OTÁZKA'} · Box {box}</div>
                <div style={showBack ? s.answer : s.question}>
                    {showBack ? current.back : current.front}
                </div>
                {!showBack && <div style={s.hint}>Klikni pro odpověď</div>}
                {showBack && (
                    <div style={s.btnRow}>
                        <button style={s.btnGreen} onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}>
                            ✓ Věděl
                        </button>
                        <button style={s.btnRed} onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}>
                            ✗ Nevěděl
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PiPFlashcards;
