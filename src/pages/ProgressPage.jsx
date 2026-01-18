import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import itQuestionsData from '../data/it-questions.json';

const ProgressPage = () => {
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tvůj pokrok</h1>
        <p className="text-gray-600">Sleduj, jak se zlepšuješ</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4">Celkový pokrok v IT</h2>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-5xl font-bold">{percentage}%</div>
            <div className="text-blue-100">zvládnuto</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.itKnown} / {stats.itTotal}</div>
            <div className="text-blue-100">otázek</div>
          </div>
        </div>
        <div className="w-full bg-blue-400 rounded-full h-4">
          <div 
            className="bg-white h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.itKnown}</div>
              <div className="text-gray-600">Znám</div>
            </div>
            <FaCheck className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{stats.itUnknown}</div>
              <div className="text-gray-600">Neznám</div>
            </div>
            <FaTimes className="text-4xl text-red-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{stats.itTotal}</div>
              <div className="text-gray-600">Celkem</div>
            </div>
            <FaClock className="text-4xl text-blue-200" />
          </div>
        </div>
      </div>

      {/* By Exam */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pokrok podle zkoušky</h2>
        <div className="space-y-4">
          {Object.entries(stats.byExam).map(([exam, data]) => {
            const examPercentage = data.total > 0 ? Math.round((data.known / data.total) * 100) : 0;
            return (
              <div key={exam}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {exam} - {itQuestionsData.exams[exam].name}
                  </span>
                  <span className="text-gray-600">
                    {data.known} / {data.total} ({examPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${examPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pokrok podle kategorie</h2>
        <div className="space-y-4">
          {Object.entries(stats.byCategory).map(([category, data]) => {
            const categoryPercentage = data.total > 0 ? Math.round((data.known / data.total) * 100) : 0;
            return (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-gray-600">
                    {data.known} / {data.total} ({categoryPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all"
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nedávná aktivita</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {activity.question?.question}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(activity.lastReviewed).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  activity.known 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
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
