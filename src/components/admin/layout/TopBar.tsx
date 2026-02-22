import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    Search,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronDown,
    X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';

interface TopBarProps {
    onMobileMenuClick: () => void;
}

const getBreadcrumb = (pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return 'Dashboard';

    const labels: Record<string, string> = {
        admin: 'Admin',
        dashboard: 'Dashboard',
        users: 'User Management',
        all: 'All',
        pending: 'Pending Approvals',
        incidents: 'Incidents',
        categories: 'Categories',
        statistics: 'Statistics',
        settings: 'Settings',
    };

    return segments.map(s => labels[s] || s).slice(1).join(' / ');
};

export const TopBar: React.FC<TopBarProps> = ({ onMobileMenuClick }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            const url = await userService.getMyProfilePhoto();
            if (url) setPhotoUrl(url);
        };
        fetchPhoto();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const notifications = [
        { id: 1, title: 'New user registration', message: 'Ahmed K. requested approval', time: '5 min ago', unread: true },
        { id: 2, title: 'Critical incident', message: 'Broken water pipe reported', time: '1 hour ago', unread: true },
        { id: 3, title: 'Incident resolved', message: 'Street light fixed by Ali B.', time: '3 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="h-[70px] bg-white border-b border-[#B0BEC5] sticky top-0 z-30">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMobileMenuClick}
                        className="lg:hidden p-2 hover:bg-[#ECEFF1] rounded-lg"
                    >
                        <Menu size={24} className="text-[#546E7A]" />
                    </button>

                    {/* Breadcrumb */}
                    <div>
                        <h1 className="text-xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                            {getBreadcrumb(location.pathname)}
                        </h1>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                    >
                        <Search size={20} className="text-[#546E7A]" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors relative"
                        >
                            <Bell size={20} className="text-[#546E7A]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FFB347] text-white text-xs 
                                 rounded-full flex items-center justify-center font-medium">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg 
                                border border-[#B0BEC5] z-50 overflow-hidden">
                                    <div className="p-4 border-b border-[#B0BEC5] flex justify-between items-center">
                                        <h3 className="font-semibold text-[#263238]">Notifications</h3>
                                        <button className="text-sm text-[#0D7377] hover:underline">
                                            Mark all as read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 border-b border-[#ECEFF1] hover:bg-[#ECEFF1]/50 cursor-pointer
                                    ${notif.unread ? 'bg-[#0D7377]/5' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    {notif.unread && (
                                                        <span className="w-2 h-2 bg-[#0D7377] rounded-full mt-2 flex-shrink-0" />
                                                    )}
                                                    <div className={notif.unread ? '' : 'ml-5'}>
                                                        <p className="font-medium text-sm text-[#263238]">{notif.title}</p>
                                                        <p className="text-sm text-[#546E7A]">{notif.message}</p>
                                                        <p className="text-xs text-[#B0BEC5] mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-[#B0BEC5]">
                                        <button className="text-sm text-[#0D7377] hover:underline font-medium">
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D7377] to-[#32936F] 
                              flex items-center justify-center text-white font-medium text-sm overflow-hidden border border-white/20">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-[#263238]">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-[#546E7A]">
                                    {user?.role?.replace('ROLE_', '')}
                                </p>
                            </div>
                            <ChevronDown size={16} className="text-[#546E7A] hidden md:block" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg 
                                border border-[#B0BEC5] z-50 overflow-hidden">
                                    <div className="p-4 border-b border-[#B0BEC5]">
                                        <p className="font-medium text-[#263238]">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-[#546E7A]">{user?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#546E7A] 
                                 hover:bg-[#ECEFF1] transition-colors"
                                        >
                                            <User size={16} />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/admin/settings')}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#546E7A] 
                                 hover:bg-[#ECEFF1] transition-colors"
                                        >
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                    <div className="border-t border-[#B0BEC5] py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#F44336] 
                                 hover:bg-[#F44336]/10 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {showSearch && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
                    <div className="bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-4 flex items-center gap-4 border-b border-[#B0BEC5]">
                            <Search size={20} className="text-[#546E7A]" />
                            <input
                                type="text"
                                placeholder="Search users, incidents, categories..."
                                className="flex-1 text-lg outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => setShowSearch(false)}
                                className="p-2 hover:bg-[#ECEFF1] rounded-lg"
                            >
                                <X size={20} className="text-[#546E7A]" />
                            </button>
                        </div>
                        <div className="p-8 text-center text-[#546E7A]">
                            <Search size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Start typing to search...</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
