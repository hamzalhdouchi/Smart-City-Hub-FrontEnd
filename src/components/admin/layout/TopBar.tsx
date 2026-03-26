import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    Bell,
    Settings,
    LogOut,
    User,
    ChevronDown,
    X,
    ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';
import { incidentService } from '../../../services/incidentService';
import type { Incident } from '../../../services/incidentService';

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
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [pendingValidation, setPendingValidation] = useState<Incident[]>([]);

    useEffect(() => {
        const fetchPhoto = async () => {
            const url = await userService.getMyProfilePhoto();
            if (url) setPhotoUrl(url);
        };
        fetchPhoto();
    }, [user]);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const result = await incidentService.getIncidents('PENDING_VALIDATION', undefined, 0, 20);
                setPendingValidation(result.content || []);
            } catch {
                setPendingValidation([]);
            }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const unreadCount = pendingValidation.length;

    return (
        <header className="h-[70px] bg-white border-b border-[#B0BEC5] sticky top-0 z-30">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                    
                    <button
                        onClick={onMobileMenuClick}
                        className="lg:hidden p-2 hover:bg-[#ECEFF1] rounded-lg"
                    >
                        <Menu size={24} className="text-[#546E7A]" />
                    </button>

                    
                    <div>
                        <h1 className="text-xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                            {getBreadcrumb(location.pathname)}
                        </h1>
                    </div>
                </div>

                
                <div className="flex items-center gap-2">

                    
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors relative"
                        >
                            <Bell size={20} className="text-[#546E7A]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-[#B0BEC5] z-50 overflow-hidden">
                                    <div className="p-4 border-b border-[#B0BEC5] flex items-center gap-2">
                                        <ShieldAlert size={18} className="text-orange-500" />
                                        <h3 className="font-semibold text-[#263238] flex-1">Pending Validation</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                                                {unreadCount} awaiting
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {pendingValidation.length === 0 ? (
                                            <div className="p-8 text-center text-[#90A4AE]">
                                                <ShieldAlert size={32} className="mx-auto mb-2 opacity-40" />
                                                <p className="text-sm">No incidents awaiting validation</p>
                                            </div>
                                        ) : (
                                            pendingValidation.map((incident) => (
                                                <div
                                                    key={incident.id}
                                                    className="p-4 border-b border-[#ECEFF1] hover:bg-orange-50 cursor-pointer transition-colors"
                                                    onClick={() => {
                                                        setShowNotifications(false);
                                                        navigate(`/admin/incidents/${incident.id}`);
                                                    }}
                                                >
                                                    <div className="flex gap-3 items-start">
                                                        <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-[#263238] truncate">{incident.title}</p>
                                                            <p className="text-xs text-[#546E7A] mt-0.5">
                                                                Agent: {incident.assignedAgent?.fullName || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-[#90A4AE] mt-0.5">{incident.category?.name}</p>
                                                        </div>
                                                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg flex-shrink-0">
                                                            Review
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 text-center border-t border-[#B0BEC5]">
                                        <button
                                            className="text-sm text-[#0D7377] hover:underline font-medium"
                                            onClick={() => {
                                                setShowNotifications(false);
                                                navigate('/admin/incidents/all');
                                            }}
                                        >
                                            View All Incidents
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    
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
                                                navigate('/admin/profile');
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
        </header>
    );
};
