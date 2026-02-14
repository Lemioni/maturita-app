import Header from './Header';
import ExperimentalMenu from '../experimental/ExperimentalMenu';
import MiniPlayer from '../podcast/MiniPlayer';
import FrutigerSidebar from '../experimental/FrutigerSidebar';
import { useExperimental } from '../../context/ExperimentalContext';

const Layout = ({ children }) => {
    const { frutigerAero } = useExperimental();

    if (frutigerAero) {
        return (
            <>
                <div id="websiteContainer">
                    <div className="website-spacers" />
                    <header id="mainHeader">
                        <div className="header-logo-text">
                            <img src="/aero-logo.png" alt="Logo" id="logo" />
                            <div className="header-text-wrap">
                                <span className="header-title">Maturita.app</span>
                                <span className="header-motto">Study smarter, not harder</span>
                            </div>
                        </div>
                    </header>

                    <div id="navAndContentContainer">
                        <FrutigerSidebar />
                        <main id="mainContent">
                            {children}
                        </main>
                    </div>
                </div>

                <ExperimentalMenu />
                <MiniPlayer />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-terminal-bg">
            <Header />
            <main className="container mx-auto px-4 py-6 pb-20">
                {children}
            </main>
            <footer className="border-t border-terminal-border/20 mt-12">
                <div className="container mx-auto px-4 py-4 text-center text-terminal-text/40 text-xs">
                    <p>MATURITA.APP © 2026</p>
                </div>
            </footer>
            <ExperimentalMenu />
            <MiniPlayer />
        </div>
    );
};

export default Layout;
