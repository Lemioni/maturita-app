import Header from './Header';
import BottomNav from './BottomNav';
import MiniPlayer from '../podcast/MiniPlayer';
import PiPLauncher from '../pip/PiPLauncher';
import { usePodcast } from '../../context/PodcastContext';

const Layout = ({ children }) => {
    const { playerVisible } = usePodcast();

    // Calculate bottom padding based on player visibility
    const getMainPadding = () => {
        if (playerVisible) {
            return 'pb-24 md:pb-20'; // Extra padding when MiniPlayer is visible
        }
        return 'pb-24 md:pb-8';
    };

    return (
        <div className="min-h-screen bg-terminal-bg">
            <Header />
            <main className={`container mx-auto px-3 md:px-4 py-4 md:py-6 ${getMainPadding()}`}>
                {children}
            </main>
            <footer className="hidden md:block border-t border-terminal-border/20 mt-12">
                <div className="container mx-auto px-4 py-4 text-center text-terminal-text/40 text-xs">
                    <p>MATURITA.APP © 2026</p>
                </div>
            </footer>
            <BottomNav />
            <MiniPlayer />
            <PiPLauncher />
        </div>
    );
};

export default Layout;
