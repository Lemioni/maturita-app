import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaClock, FaFire, FaTrophy, FaCalendarCheck, FaLightbulb } from 'react-icons/fa';
import itQuestionsData from '../data/it-questions.json';
import cjBooks from '../data/cj-books.json';
import { useExperimental } from '../context/ExperimentalContext';
import useStreak from '../hooks/useStreak';

const SECTION_KEYS = ['nazev', 'dej', 'tema', 'casoprostor', 'kompozice', 'vypravec', 'postavy', 'jazyk', 'autor', 'kontext'];
const SECTION_LABELS = ['Název', 'Děj', 'Téma', 'Čas', 'Komp', 'Vypr', 'Post', 'Jaz', 'Autor', 'Kont'];

const ProgressPage = () => {
  const { frutigerAero } = useExperimental();
  const { currentStreak, longestStreak, totalDaysActive } = useStreak();
  const [stats, setStats] = useState({
    itTotal: 47,
    itKnown: 0,
    itUnknown: 0,
    byCategory: {},
    byExam: {},
    recentActivity: []
  });

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('maturita-progress') || '{}');
    const itProgress = progress.itQuestions || {};

    let known = 0;
    let unknown = 0;
    const byCategory = {};
    const byExam = { IKT1: { known: 0, total: 0 }, IKT2: { known: 0, total: 0 } };

    itQuestionsData.questions.forEach(q => {
      const isKnown = itProgress[q.id]?.known || false;

      if (isKnown) {
        known++;
      } else {
        unknown++;
      }

      // By category
      if (!byCategory[q.category]) {
        byCategory[q.category] = { known: 0, total: 0 };
      }
      byCategory[q.category].total++;
      if (isKnown) {
        byCategory[q.category].known++;
      }

      // By exam
      byExam[q.exam].total++;
      if (isKnown) {
        byExam[q.exam].known++;
      }
    });

    // Recent activity
    const recentActivity = Object.entries(itProgress)
      .filter(([_, data]) => data.lastReviewed)
      .sort((a, b) => new Date(b[1].lastReviewed) - new Date(a[1].lastReviewed))
      .slice(0, 10)
      .map(([id, data]) => ({
        question: itQuestionsData.questions.find(q => q.id === parseInt(id)),
        ...data
      }));

    setStats({
      itTotal: 47,
      itKnown: known,
      itUnknown: unknown,
      byCategory,
      byExam,
      recentActivity
    });
  }, []);

  const percentage = Math.round((stats.itKnown / stats.itTotal) * 100);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        {frutigerAero && <img src="/aero-icons/vista_perf_center.ico" alt="" className="w-12 h-12" />}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Tvůj pokrok</h1>
          <p className="text-gray-600 dark:text-gray-400">Sleduj, jak se zlepšuješ</p>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-4'}>
          <div className="flex items-center gap-2">
            <FaFire className="text-2xl text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Aktuální série</div>
            </div>
          </div>
        </div>
        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-4'}>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-2xl text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-500">{longestStreak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Nejdelší série</div>
            </div>
          </div>
        </div>
        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-4'}>
          <div className="flex items-center gap-2">
            <FaCalendarCheck className="text-2xl text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-500">{totalDaysActive}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Celkem dní</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className={`rounded-2xl shadow-lg p-8 text-white mb-8 ${frutigerAero ? 'bg-gradient-to-br from-blue-600/80 to-cyan-500/80 border border-white/50 backdrop-blur-md' : 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700'}`}>
        <h2 className="text-2xl font-bold mb-4">Celkový pokrok v IT</h2>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-5xl font-bold">{percentage}%</div>
            <div className="text-blue-100 dark:text-blue-200">zvládnuto</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.itKnown} / {stats.itTotal}</div>
            <div className="text-blue-100 dark:text-blue-200">otázek</div>
          </div>
        </div>
        <div className="w-full bg-blue-400 dark:bg-blue-500 rounded-full h-4">
          <div
            className="bg-white h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.itKnown}</div>
              <div className="text-gray-600 dark:text-gray-400">Znám</div>
            </div>
            {frutigerAero ? <img src="/aero-icons/vista_firewall_status_1.ico" className="w-12 h-12" alt="OK" /> : <FaCheck className="text-4xl text-green-200 dark:text-green-800" />}
          </div>
        </div>

        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.itUnknown}</div>
              <div className="text-gray-600 dark:text-gray-400">Neznám</div>
            </div>
            {frutigerAero ? <img src="/aero-icons/vista_firewall_status_3.ico" className="w-12 h-12" alt="Bad" /> : <FaTimes className="text-4xl text-red-200 dark:text-red-800" />}
          </div>
        </div>

        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.itTotal}</div>
              <div className="text-gray-600 dark:text-gray-400">Celkem</div>
            </div>
            {frutigerAero ? <img src="/aero-icons/vista_cal_1.ico" className="w-12 h-12" alt="Total" /> : <FaClock className="text-4xl text-blue-200 dark:text-blue-800" />}
          </div>
        </div>
      </div>

      {/* By Exam */}
      <div className={frutigerAero ? 'terminal-card mb-8' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8'}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pokrok podle zkoušky</h2>
        <div className="space-y-4">
          {Object.entries(stats.byExam).map(([exam, data]) => {
            const examPercentage = data.total > 0 ? Math.round((data.known / data.total) * 100) : 0;
            return (
              <div key={exam}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {exam} - {itQuestionsData.exams[exam].name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {data.known} / {data.total} ({examPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full transition-all"
                    style={{ width: `${examPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Category */}
      <div className={frutigerAero ? 'terminal-card mb-8' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8'}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pokrok podle kategorie</h2>
        <div className="space-y-4">
          {Object.entries(stats.byCategory).map(([category, data]) => {
            const categoryPercentage = data.total > 0 ? Math.round((data.known / data.total) * 100) : 0;
            return (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {data.known} / {data.total} ({categoryPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full transition-all"
                    style={{ width: `${categoryPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className={frutigerAero ? 'terminal-card' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6'}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Nedávná aktivita</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className={`flex items-start justify-between p-3 rounded-lg ${frutigerAero ? 'bg-black/20 border border-white/10' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {activity.question?.question}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(activity.lastReviewed).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${activity.known
                  ? (frutigerAero ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300')
                  : (frutigerAero ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300')
                  }`}>
                  {activity.known ? 'Znám' : 'Neznám'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Heatmap */}
      <div className={frutigerAero ? 'terminal-card mb-8' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8'}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Heatmapa znalostí – Knihy</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr>
                <th className="text-left text-terminal-text/50 pb-2 pr-2 whitespace-nowrap">Kniha</th>
                {SECTION_LABELS.map((l, i) => (
                  <th key={i} className="text-center text-terminal-text/50 pb-2 px-0.5" title={SECTION_KEYS[i]}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cjBooks.books.map(b => {
                const sectionData = JSON.parse(localStorage.getItem('maturita-section-knowledge') || '{}');
                const bookSections = sectionData[b.id] || {};
                return (
                  <tr key={b.id} className="border-t border-terminal-border/10">
                    <td className="py-1 pr-2 text-terminal-text/70 whitespace-nowrap max-w-[120px] truncate" title={b.title}>
                      {b.title.length > 18 ? b.title.substring(0, 18) + '…' : b.title}
                    </td>
                    {SECTION_KEYS.map((s, i) => (
                      <td key={i} className="text-center py-1 px-0.5">
                        <div className={`w-4 h-4 mx-auto rounded-sm ${bookSections[s] ? 'bg-green-500/60' : 'bg-red-500/30'
                          }`} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-terminal-text/40">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/60 rounded-sm" /> Umím</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/30 rounded-sm" /> Neumím / Neoznačeno</span>
        </div>
      </div>

      {/* Smart Recommendations */}
      {(() => {
        const sectionData = JSON.parse(localStorage.getItem('maturita-section-knowledge') || '{}');
        const weakSections = {};
        SECTION_KEYS.forEach(s => { weakSections[s] = { total: 0, unknown: 0 }; });
        cjBooks.books.forEach(b => {
          const bs = sectionData[b.id] || {};
          SECTION_KEYS.forEach(s => {
            weakSections[s].total++;
            if (!bs[s]) weakSections[s].unknown++;
          });
        });
        const sorted = Object.entries(weakSections)
          .map(([key, val]) => ({ key, ...val, pct: Math.round((val.unknown / val.total) * 100) }))
          .filter(s => s.unknown > 0)
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 3);
        const labelMap = { nazev: 'Analýza názvu', dej: 'Děj', tema: 'Téma a motivy', casoprostor: 'Časoprostor', kompozice: 'Kompozice', vypravec: 'Vypravěč', postavy: 'Postavy', jazyk: 'Jazykové prostředky', autor: 'Kontext autora', kontext: 'Literární kontext' };

        if (sorted.length === 0) return null;
        return (
          <div className={frutigerAero ? 'terminal-card mb-8' : 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8'}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" /> Doporučení
            </h2>
            <div className="space-y-3">
              {sorted.map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Zaměř se na: {labelMap[s.key]}</span>
                      <span className="text-xs text-red-400">{s.unknown}/{s.total} knih</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProgressPage;
