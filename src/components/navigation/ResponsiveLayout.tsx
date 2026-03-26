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
const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query, matches]);

    return matches;
};


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
            
            {showNavigation && isDesktop && !isAgent && <DesktopSidebar />}

            
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

            
            {showNavigation && !isDesktop && !isAgent && <BottomTabBar autoHide={true} />}

            
            <ToastContainer />

            
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
