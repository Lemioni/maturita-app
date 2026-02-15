import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import itQuestionsData from '../data/it-questions.json';
import { useExperimental } from '../context/ExperimentalContext';

const ProgressPage = () => {
  const { frutigerAero } = useExperimental();
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
    </div>
  );
};

export default ProgressPage;
