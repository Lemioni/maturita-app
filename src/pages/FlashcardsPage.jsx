const FlashcardsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Flashcards</h1>
        <p className="text-gray-600">Kartičky pro rychlé opakování</p>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-orange-800 mb-2">
          Samostatný flashcard systém
        </h2>
        <p className="text-orange-700">
          Flashcards jsou také dostupné v režimu učení u IT otázek. 
          Tato sekce bude obsahovat dodatečné balíčky kartiček, které si budeš moct vytvořit sám.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">IT Flashcards</h3>
          <p className="text-gray-600 mb-4">
            Použij flashcard režim v sekci IT Otázky
          </p>
          <a 
            href="/it"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Přejít na IT otázky
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">ČJ Flashcards</h3>
          <p className="text-gray-600 mb-4">
            Flashcards pro rozbory knih (připraveno na data)
          </p>
          <button 
            disabled
            className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
          >
            Čeká na materiály
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
