import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    toggleSidebar: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

export const AdminLayout: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            <div className="min-h-screen bg-[#ECEFF1]">
                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={toggleMobile}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    onMobileClose={toggleMobile}
                />

                {/* Main Content */}
                <div
                    className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
                        }`}
                >
                    <TopBar onMobileMenuClick={toggleMobile} />

                    <main className="p-6 lg:p-8 min-h-[calc(100vh-70px)]">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};
