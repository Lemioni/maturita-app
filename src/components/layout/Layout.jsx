import Header from './Header';
import ExperimentalMenu from '../experimental/ExperimentalMenu';
import MiniPlayer from '../podcast/MiniPlayer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        {children}
      </main>
      <footer className="border-t border-terminal-border/20 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-terminal-text/40 text-xs">
          <p>&gt; MATURITA.APP © 2026</p>
        </div>
      </footer>
      <ExperimentalMenu />
      <MiniPlayer />
    </div>
  );
};

export default Layout;
