import { useState, useEffect } from 'react';
import { FaTrophy, FaFire, FaBolt, FaBook, FaStar, FaGraduationCap, FaCheck, FaBrain, FaCalendarCheck, FaLock } from 'react-icons/fa';
import useStreak from '../hooks/useStreak';
import cjBooks from '../data/cj-books.json';
import itQuestions from '../data/it-questions.json';

const SECTION_KEYS = ['nazev', 'dej', 'tema', 'casoprostor', 'kompozice', 'vypravec', 'postavy', 'jazyk', 'autor', 'kontext'];

const getAchievements = (data) => [
    {
        id: 'first-day',
        icon: FaCalendarCheck,
        title: 'První den',
        desc: 'Otevři aplikaci poprvé',
        color: '#22c55e',
        unlocked: data.totalDaysActive >= 1,
    },
    {
        id: 'streak-3',
        icon: FaFire,
        title: '3denní série',
        desc: 'Uč se 3 dny za sebou',
        color: '#f97316',
        unlocked: data.longestStreak >= 3,
    },
    {
        id: 'streak-7',
        icon: FaFire,
        title: 'Týdenní válec',
        desc: 'Uč se 7 dní za sebou',
        color: '#ef4444',
        unlocked: data.longestStreak >= 7,
    },
    {
        id: 'streak-14',
        icon: FaFire,
        title: 'Neporazitelný',
        desc: '14denní série',
        color: '#dc2626',
        unlocked: data.longestStreak >= 14,
    },
    {
        id: 'streak-30',
        icon: FaTrophy,
        title: 'Měsíční mašina',
        desc: '30denní série',
        color: '#eab308',
        unlocked: data.longestStreak >= 30,
    },
    {
        id: 'it-10',
        icon: FaBolt,
        title: 'IT Nováček',
        desc: 'Označ 10 IT otázek jako "Znám"',
        color: '#3b82f6',
        unlocked: data.itKnown >= 10,
    },
    {
        id: 'it-25',
        icon: FaBolt,
        title: 'IT Pokročilý',
        desc: 'Označ 25 IT otázek jako "Znám"',
        color: '#6366f1',
        unlocked: data.itKnown >= 25,
    },
    {
        id: 'it-all',
        icon: FaGraduationCap,
        title: 'IT Mistr',
        desc: 'Označ všechny IT otázky jako "Znám"',
        color: '#a855f7',
        unlocked: data.itKnown >= data.itTotal,
    },
    {
        id: 'book-5',
        icon: FaBook,
        title: 'Čtenář',
        desc: 'Označ 5 knih jako naučené (všechny sekce)',
        color: '#10b981',
        unlocked: data.fullyKnownBooks >= 5,
    },
    {
        id: 'book-10',
        icon: FaBook,
        title: 'Knihomol',
        desc: 'Označ 10 knih jako plně naučené',
        color: '#14b8a6',
        unlocked: data.fullyKnownBooks >= 10,
    },
    {
        id: 'book-20',
        icon: FaStar,
        title: 'Literární génius',
        desc: 'Všech 20 knih plně naučených',
        color: '#eab308',
        unlocked: data.fullyKnownBooks >= 20,
    },
    {
        id: 'sections-50',
        icon: FaBrain,
        title: 'Poloviční znalosti',
        desc: 'Označ 50% všech sekcí jako naučené',
        color: '#06b6d4',
        unlocked: data.sectionPercent >= 50,
    },
    {
        id: 'sections-100',
        icon: FaGraduationCap,
        title: 'Absolutní zvládnutí',
        desc: '100% všech sekcí všech knih',
        color: '#f59e0b',
        unlocked: data.sectionPercent >= 100,
    },
    {
        id: 'days-10',
        icon: FaCalendarCheck,
        title: 'Vytrvalo',
        desc: 'Celkem 10 aktivních dní',
        color: '#8b5cf6',
        unlocked: data.totalDaysActive >= 10,
    },
    {
        id: 'days-30',
        icon: FaCalendarCheck,
        title: 'Pravidelný student',
        desc: 'Celkem 30 aktivních dní',
        color: '#ec4899',
        unlocked: data.totalDaysActive >= 30,
    },
];

const AchievementsPage = () => {
    const { currentStreak, longestStreak, totalDaysActive } = useStreak();
    const [data, setData] = useState({
        longestStreak: 0,
        totalDaysActive: 0,
        itKnown: 0,
        itTotal: itQuestions.questions.length,
        fullyKnownBooks: 0,
        sectionPercent: 0,
    });

    useEffect(() => {
        // IT progress
        const progress = JSON.parse(localStorage.getItem('maturita-progress') || '{}');
        const itProgress = progress.itQuestions || {};
        const itKnown = Object.values(itProgress).filter(v => v.known).length;

        // Section knowledge
        const sectionData = JSON.parse(localStorage.getItem('maturita-section-knowledge') || '{}');
        const totalBooks = cjBooks.books.length;
        let totalSections = 0;
        let knownSections = 0;
        let fullyKnownBooks = 0;

        cjBooks.books.forEach(b => {
            const bookSections = sectionData[b.id] || {};
            const bookKnown = SECTION_KEYS.filter(k => bookSections[k]).length;
            totalSections += SECTION_KEYS.length;
            knownSections += bookKnown;
            if (bookKnown === SECTION_KEYS.length) fullyKnownBooks++;
        });

        setData({
            longestStreak,
            totalDaysActive,
            itKnown,
            itTotal: itQuestions.questions.length,
            fullyKnownBooks,
            sectionPercent: totalSections > 0 ? Math.round((knownSections / totalSections) * 100) : 0,
        });
    }, [longestStreak, totalDaysActive]);

    const achievements = getAchievements(data);
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="max-w-4xl mx-auto mt-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-terminal-accent flex items-center gap-2">
                    <FaTrophy /> Achievementy
                </h1>
                <span className="text-sm text-terminal-text/50">
                    {unlockedCount} / {achievements.length} odemčeno
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-terminal-border/20 h-2 rounded mb-8">
                <div
                    className="bg-terminal-accent h-2 rounded transition-all duration-500"
                    style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map(a => (
                    <div
                        key={a.id}
                        className={`terminal-card relative overflow-hidden transition-all duration-300 ${a.unlocked ? 'border-l-2' : 'opacity-50 grayscale'
                            }`}
                        style={a.unlocked ? { borderLeftColor: a.color } : {}}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: a.unlocked ? `${a.color}20` : 'rgba(255,255,255,0.05)' }}
                            >
                                {a.unlocked ? (
                                    <a.icon className="text-lg" style={{ color: a.color }} />
                                ) : (
                                    <FaLock className="text-terminal-text/30" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${a.unlocked ? 'text-terminal-text' : 'text-terminal-text/40'}`}>
                                    {a.title}
                                </h3>
                                <p className="text-[11px] text-terminal-text/50 leading-snug mt-0.5">{a.desc}</p>
                            </div>
                        </div>
                        {a.unlocked && (
                            <div className="absolute top-2 right-2">
                                <FaCheck className="text-xs" style={{ color: a.color }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;
