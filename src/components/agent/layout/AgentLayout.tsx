import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AgentSidebar } from './AgentSidebar';
import { useAuth } from '../../../context/AuthContext';

export const AgentLayout: React.FC = () => {
    const { user } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobile = () => setIsMobileOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-[#ECEFF1]">
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={toggleMobile}
                />
            )}

            {/* Sidebar */}
            <AgentSidebar
                isMobileOpen={isMobileOpen}
                onMobileClose={toggleMobile}
            />

            {/* Main content */}
            <div
                className="min-h-screen flex flex-col"
                style={{ marginLeft: '0', paddingLeft: '0' }}
            >
                <div className="lg:ml-[260px] transition-all duration-300">
                    {/* Top bar */}
                    <header className="h-[70px] bg-white border-b border-[#B0BEC5] sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
                        {/* Mobile menu */}
                        <button
                            onClick={toggleMobile}
                            className="lg:hidden p-2 rounded-lg hover:bg-[#ECEFF1]"
                        >
                            <span className="sr-only">Toggle menu</span>
                            <div className="space-y-1">
                                <span className="block w-5 h-0.5 bg-[#546E7A]" />
                                <span className="block w-4 h-0.5 bg-[#546E7A]" />
                                <span className="block w-5 h-0.5 bg-[#546E7A]" />
                            </div>
                        </button>

                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-[#90A4AE] uppercase tracking-wide">
                                Agent Workspace
                            </span>
                            <span className="text-lg font-bold text-[#263238] font-['Noto_Sans_JP']">
                                {user?.firstName
                                    ? `Welcome, ${user.firstName}`
                                    : 'Your daily missions'}
                            </span>
                        </div>

                        <div className="hidden lg:flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-[#90A4AE]">
                                    Role
                                </span>
                                <span className="text-sm font-medium text-[#263238]">
                                    Agent
                                </span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D7377] to-[#32936F] flex items-center justify-center text-white text-sm font-semibold">
                                {user?.firstName?.[0]}
                                {user?.lastName?.[0]}
                            </div>
                        </div>
                    </header>

                    <main className="p-4 lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AgentLayout;

