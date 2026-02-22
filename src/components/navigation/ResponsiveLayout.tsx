import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { BottomTabBar } from '../mobile/BottomTabBar';
import { ToastContainer } from '../mobile/Toast';
import { useAuth } from '../../context/AuthContext';

interface ResponsiveLayoutProps {
    children?: React.ReactNode;
    showNavigation?: boolean;
    className?: string;
}

// Custom hook for media query
const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Set initial value
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        // Create listener function
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        media.addEventListener('change', listener);

        // Cleanup
        return () => media.removeEventListener('change', listener);
    }, [query, matches]);

    return matches;
};

/**
 * Responsive Layout Wrapper
 * - Desktop (≥1024px): Left sidebar navigation
 * - Mobile (<1024px): Bottom tab bar navigation
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
    children,
    showNavigation = true,
    className = ''
}) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const { user } = useAuth();
    const isAgent = user?.role === 'ROLE_AGENT';

    return (
        <div className={`responsive-layout min-h-screen bg-gray-50 ${className}`}>
            {/* Desktop Sidebar - Only on screens ≥1024px */}
            {showNavigation && isDesktop && !isAgent && <DesktopSidebar />}

            {/* Main Content Area */}
            <main
                className="responsive-main-content"
                style={{
                    marginLeft: showNavigation && isDesktop && !isAgent ? '260px' : 0,
                    paddingBottom: showNavigation && !isDesktop && !isAgent ? '80px' : 0,
                    minHeight: '100vh',
                    transition: 'margin-left 300ms ease',
                }}
            >
                {children || <Outlet />}
            </main>

            {/* Mobile Bottom Bar - Only on screens <1024px */}
            {showNavigation && !isDesktop && !isAgent && <BottomTabBar autoHide={true} />}

            {/* Toast Container */}
            <ToastContainer />

            {/* Responsive Styles */}
            <style>{`
                @media (min-width: 1024px) {
                    .mobile-bottom-bar {
                        display: none !important;
                    }
                }

                @media (max-width: 1023px) {
                    .desktop-sidebar {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResponsiveLayout;
