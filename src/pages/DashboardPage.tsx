import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Users, Bell, Building2, Wifi } from 'lucide-react';
import { Button, SmartCityLogo } from '../components/common';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#ECEFF1]">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-[#B0BEC5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <SmartCityLogo variant="full" size={35} />

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-[#546E7A] hover:text-[#0D7377] hover:bg-[#0D7377]/10 rounded-lg transition-colors">
                                <Bell size={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0D7377] flex items-center justify-center text-white font-medium text-sm">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-[#263238]">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-[#546E7A]">{user?.role?.replace('ROLE_', '')}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<LogOut size={18} />}
                                onClick={logout}
                            >
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#0D7377] font-['Noto_Sans_JP']">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-[#546E7A] mt-1">
                        Here's what's happening in your smart city today.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Incidents', value: '156', icon: FileText, color: '#0D7377' },
                        { label: 'In Progress', value: '23', icon: LayoutDashboard, color: '#FF9800' },
                        { label: 'Resolved Today', value: '12', icon: Users, color: '#4CAF50' },
                        { label: 'IoT Sensors', value: '342', icon: Wifi, color: '#00D9FF' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm border border-[#B0BEC5] hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#546E7A]">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Placeholder */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-[#B0BEC5] text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#0D7377]/10 flex items-center justify-center">
                        <Building2 size={40} className="text-[#0D7377]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#263238] mb-2">
                        Dashboard Coming Soon
                    </h2>
                    <p className="text-[#546E7A] max-w-md mx-auto">
                        Full incident management, analytics, and real-time IoT monitoring features will be available here.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
