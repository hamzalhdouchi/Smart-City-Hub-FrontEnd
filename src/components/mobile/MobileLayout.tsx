import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';
import { ToastContainer } from './Toast';

interface MobileLayoutProps {
    children?: React.ReactNode;
    showTabBar?: boolean;
    className?: string;
}


export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    showTabBar = true,
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            
            <main
                className="pb-20" // Padding bottom for tab bar
                style={{
                    minHeight: '100vh',
                }}
            >
                {children || <Outlet />}
            </main>

            
            {showTabBar && <BottomTabBar />}

            
            <ToastContainer />
        </div>
    );
};

export default MobileLayout;
