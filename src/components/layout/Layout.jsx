import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Maturitní aplikace IT + Čeština © 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
