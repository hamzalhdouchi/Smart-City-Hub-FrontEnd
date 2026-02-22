import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Map,
    User,
    X,
} from 'lucide-react';
import { SmartCityLogo } from '../../common';

interface AgentSidebarProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const navItems = [
    {
        label: 'Dashboard',
        description: 'Overview of your work',
        icon: <LayoutDashboard size={20} />,
        path: '/agent/dashboard',
    },
    {
        label: 'My Queue',
        description: 'All assigned incidents',
        icon: <ClipboardList size={20} />,
        path: '/agent/dashboard',
    },
    {
        label: 'Map View',
        description: 'City incident map',
        icon: <Map size={20} />,
        path: '/map',
    },
    {
        label: 'Profile',
        description: 'Personal information',
        icon: <User size={20} />,
        path: '/agent/profile',
    },
];

export const AgentSidebar: React.FC<AgentSidebarProps> = ({
    isMobileOpen,
    onMobileClose,
}) => {
    return (
        <aside
            className={`
                fixed top-0 left-0 h-full bg-white border-r border-[#B0BEC5] z-40
                w-[260px] transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-[#B0BEC5]">
                <NavLink to="/agent/dashboard" className="flex items-center gap-3">
                    <SmartCityLogo variant="icon" size={36} />
                    <div className="flex flex-col">
                        <span className="font-bold text-[#0D7377] text-lg font-['Noto_Sans_JP']">
                            Agent
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-[#546E7A]">
                            Field Console
                        </span>
                    </div>
                </NavLink>

                {/* Mobile close button */}
                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-2 hover:bg-[#ECEFF1] rounded-lg"
                >
                    <X size={20} className="text-[#546E7A]" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-3 rounded-xl mb-1
                            transition-colors duration-200
                            ${isActive
                                ? 'bg-[#0D7377]/10 text-[#0D7377] border-l-4 border-[#0D7377]'
                                : 'text-[#546E7A] hover:bg-[#ECEFF1]'
                            }
                        `}
                        onClick={onMobileClose}
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.label}</span>
                            <span className="text-xs text-[#90A4AE]">{item.description}</span>
                        </div>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default AgentSidebar;

