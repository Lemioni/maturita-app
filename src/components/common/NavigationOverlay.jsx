import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Covers the old page content immediately when a navigation starts,
 * preventing the "wrong page visible under new URL" lag caused by
 * React Router v7 wrapping location updates in startTransition.
 */
const NavigationOverlay = () => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const committedPath = useRef(location.pathname + location.search);

    useEffect(() => {
        const originalPushState = history.pushState.bind(history);
        const originalReplaceState = history.replaceState.bind(history);

        history.pushState = (state, unused, url) => {
            const result = originalPushState(state, unused, url);
            // Only show overlay if navigating to a different path
            const targetPath = url ? String(url) : '';
            if (targetPath !== committedPath.current) {
                setVisible(true);
            }
            return result;
        };

        const handlePopState = () => {
            const currentHref = window.location.pathname + window.location.search;
            if (currentHref !== committedPath.current) {
                setVisible(true);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // When React actually commits the new location, hide the overlay
    useEffect(() => {
        committedPath.current = location.pathname + location.search;
        setVisible(false);
    }, [location.pathname, location.search]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-terminal-bg flex items-center justify-center">
            <div className="text-terminal-text/40 text-sm tracking-wider animate-pulse">
                Načítání...
            </div>
        </div>
    );
};

export default NavigationOverlay;
