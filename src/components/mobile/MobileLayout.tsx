import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';
import { ToastContainer } from './Toast';

interface MobileLayoutProps {
    children?: React.ReactNode;
    showTabBar?: boolean;
    className?: string;
}

/**
 * Mobile Layout Wrapper
 * Provides consistent layout for mobile citizen screens with bottom tab navigation
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    showTabBar = true,
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Main Content Area */}
            <main
                className="pb-20" // Padding bottom for tab bar
                style={{
                    minHeight: '100vh',
                }}
            >
                {children || <Outlet />}
            </main>

            {/* Bottom Tab Bar */}
            {showTabBar && <BottomTabBar />}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default MobileLayout;
