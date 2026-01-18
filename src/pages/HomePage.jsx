import { Link } from 'react-router-dom';
import { FaLaptopCode, FaBook, FaLayerGroup, FaChartLine } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [stats, setStats] = useState({
    itTotal: 47,
    itCompleted: 0,
    cjTotal: 0,
    cjCompleted: 0,
  });

  useEffect(() => {
    // Load progress from localStorage
    const progress = JSON.parse(localStorage.getItem('maturita-progress') || '{}');
    const itProgress = progress.itQuestions || {};
    const cjProgress = progress.books || {};
    
    const itCompleted = Object.values(itProgress).filter(q => q.known).length;
    const cjCompleted = Object.values(cjProgress).filter(b => b.studied).length;
    
    setStats({
      itTotal: 47,
      itCompleted,
      cjTotal: 0,
      cjCompleted,
    });
  }, []);

  const cards = [
    {
      title: 'IT Otázky',
      icon: FaLaptopCode,
      color: 'blue',
      path: '/it',
      total: stats.itTotal,
      completed: stats.itCompleted,
      description: 'Hardware, Sítě, OS, Programování, Databáze'
    },
    {
      title: 'Čeština',
      icon: FaBook,
      color: 'green',
      path: '/cj',
      total: stats.cjTotal,
      completed: stats.cjCompleted,
      description: 'Rozbory knih z milujemecestinu'
    },
    {
      title: 'Flashcards',
      icon: FaLayerGroup,
      color: 'orange',
      path: '/flashcards',
      description: 'Kartičky pro rychlé opakování'
    },
    {
      title: 'Pokrok',
      icon: FaChartLine,
      color: 'purple',
      path: '/progress',
      description: 'Sledování tvého pokroku'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    };
    return colors[color];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Příprava na maturitu
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          IT a Čeština - vše na jednom místě
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className={`relative overflow-hidden rounded-2xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl`}
          >
            <div className={`bg-gradient-to-br ${getColorClasses(card.color)} p-8 text-white`}>
              <card.icon className="text-5xl mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-white/90 mb-4">{card.description}</p>
              
              {card.total !== undefined && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pokrok</span>
                    <span className="font-semibold">
                      {card.completed} / {card.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div 
                      className="bg-white h-2.5 rounded-full transition-all"
                      style={{ width: `${card.total ? (card.completed / card.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-transparent dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Rychlý start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/it" 
            className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Náhodná IT otázka</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Procvič si jednu náhodnou otázku</p>
          </Link>
          <Link 
            to="/flashcards" 
            className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
          >
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-1">Flashcards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rychlé opakování kartiček</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
