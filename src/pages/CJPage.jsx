import { useState } from 'react';
import cjBooksData from '../data/cj-books.json';

const CJPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Čeština - Rozbory knih</h1>
        <p className="text-gray-600">Materiály z milujemecestinu</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          Sekce připravena
        </h2>
        <p className="text-yellow-700 mb-4">
          Tato sekce je připravena na rozbory knih. Až mi pošleš materiály z milujemecestinu, 
          přidám je sem a budeš moci:
        </p>
        <ul className="list-disc list-inside text-yellow-700 space-y-1 mb-4">
          <li>Prohlížet strukturované rozbory knih</li>
          <li>Procvičovat znalosti o knihách</li>
          <li>Sledovat pokrok v učení</li>
          <li>Vytvářet flashcards z rozborů</li>
        </ul>
        <p className="text-sm text-yellow-600">
          Prozatím můžeš pokračovat s IT otázkami nebo flashcards.
        </p>
      </div>

      {cjBooksData.books && cjBooksData.books.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cjBooksData.books.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">{book.author}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                  {book.genre}
                </span>
                {book.literaryPeriod && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                    {book.literaryPeriod}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CJPage;
