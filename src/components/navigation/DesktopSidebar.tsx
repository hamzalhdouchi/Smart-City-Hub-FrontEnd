import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navigationItems } from '../../config/navigationConfig';
import { LogOut, ChevronDown, Settings, User as UserIcon } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import { userService } from '../../services/userService';

interface DesktopSidebarProps {
    className?: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Fetch profile photo
    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const url = await userService.getMyProfilePhoto();
                if (url) setPhotoUrl(url);
            } catch (error) {
                console.error('Failed to fetch photo', error);
            }
        };
        fetchPhoto();
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (route: string) => location.pathname === route;

    const handleNavClick = (route: string) => {
        navigate(route);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
        : 'U';

    return (
        <aside
            className={`desktop-sidebar ${className} group/sidebar`}
            style={{
                width: '270px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                boxShadow: '10px 0 30px rgba(0, 0, 0, 0.05)',
                padding: '0 12px',
            }}
        >
            {/* Logo Section */}
            <div className="px-4 py-8 mb-4">
                <div className="flex items-center gap-4 transition-transform hover:scale-105 duration-300 cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="w-16 h-16 flex items-center justify-center">
                        <img
                            src={logoImage}
                            alt="Smart City Hub"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-[24px] font-black text-[#0D7377] leading-none tracking-tight">
                            SmartCity
                        </h1>
                        <p className="text-[12px] font-bold uppercase tracking-[2px] text-[#32936F] mt-2 opacity-80">
                            Citizen Hub
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-1 overflow-y-auto scrollbar-hide py-2">
                <ul className="space-y-3">
                    {navigationItems.map((item) => {
                        const active = isActive(item.route);
                        const Icon = item.icon;

                        return (
                            <li key={item.id} className="relative mb-2">
                                {item.id === 'report' ? (
                                    <button
                                        onClick={() => handleNavClick(item.route)}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group bg-[#0D7377] hover:bg-[#0A5F62] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] border border-transparent"
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                                <Icon
                                                    size={20}
                                                    className="text-white"
                                                />
                                            </div>
                                            <span className="text-[15px] font-bold text-white tracking-wide">
                                                {item.label}
                                            </span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleNavClick(item.route)}
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${active
                                            ? 'glass-nav-active'
                                            : 'hover:bg-white/40 text-slate-500 hover:text-[#0D7377]'
                                            }`}
                                    >
                                        <div className={`transition-all duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            <Icon
                                                size={22}
                                                className={`${active ? 'text-[#0D7377]' : 'text-slate-400 group-hover:text-[#0D7377]'}`}
                                            />
                                        </div>
                                        <span className={`text-[15px] font-bold transition-all duration-300 ${active ? 'text-[#0D7377]' : ''}`}>
                                            {item.label}
                                        </span>

                                        {active && (
                                            <div className="absolute left-[-12px] w-1.5 h-8 bg-[#0D7377] rounded-r-full shadow-[4px_0_12px_rgba(13,115,119,0.4)]" />
                                        )}
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="py-6 border-t border-white/20">
                <div ref={profileMenuRef} className="relative">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-300 ${isProfileMenuOpen ? 'bg-white/40 shadow-sm border border-white/40' : 'hover:bg-white/30'
                            }`}
                    >
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full border-2 border-white/60 shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0D7377] to-[#32936F]">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-black text-sm">
                                        {initials}
                                    </span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full translate-x-1 translate-y-1" />
                        </div>

                        <div className="flex-1 text-left">
                            <p className="text-[14px] font-bold text-slate-800 leading-tight truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                                Verified Citizen
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`text-slate-400 transition-transform duration-500 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Popover Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-3 glass-sidebar-popover animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
                            <button
                                onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/40 transition-colors text-left"
                            >
                                <UserIcon size={18} className="text-slate-500" />
                                <span className="text-[14px] font-bold text-slate-700">Profile Settings</span>
                            </button>

                            <button
                                onClick={() => { setIsProfileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/40 transition-colors text-left"
                            >
                                <Settings size={18} className="text-slate-500" />
                                <span className="text-[14px] font-bold text-slate-700">Preferences</span>
                            </button>

                            <div className="h-[1px] bg-white/20 mx-2 my-1" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 text-red-600 transition-colors text-left"
                            >
                                <LogOut size={18} />
                                <span className="text-[14px] font-bold">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .glass-nav-active {
                    background: rgba(255, 255, 255, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(13, 115, 119, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.45) !important;
                }

                .glass-sidebar-popover {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
                    z-index: 1001;
                }

                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes animate-pulse-red {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </aside>
    );
};

export default DesktopSidebar;
