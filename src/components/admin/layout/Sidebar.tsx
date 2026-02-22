import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    FolderOpen,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    List,
    Clock,
    X
} from 'lucide-react';
import { SmartCityLogo } from '../../common';
import { useSidebar } from './AdminLayout';

interface SidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
    children?: { label: string; path: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/admin/dashboard',
    },
    {
        label: 'User Management',
        icon: <Users size={20} />,
        path: '/admin/users',
        children: [
            { label: 'All Users', path: '/admin/users/all', icon: <List size={18} /> },
            { label: 'Pending Approvals', path: '/admin/users/pending', icon: <Clock size={18} /> },
        ],
    },
    {
        label: 'Incidents',
        icon: <AlertTriangle size={20} />,
        path: '/admin/incidents',
        children: [
            { label: 'All Incidents', path: '/admin/incidents/all', icon: <List size={18} /> },
        ],
    },
    {
        label: 'Categories',
        icon: <FolderOpen size={20} />,
        path: '/admin/categories',
    },
    {
        label: 'Statistics',
        icon: <BarChart3 size={20} />,
        path: '/admin/statistics',
    },
    {
        label: 'Settings',
        icon: <Settings size={20} />,
        path: '/admin/settings',
    },
];

export const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    isMobileOpen,
    onMobileClose
}) => {
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const toggleExpand = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <aside
            className={`
        fixed top-0 left-0 h-full bg-white border-r border-[#B0BEC5] z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-[280px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-[#B0BEC5]">
                <NavLink to="/admin/dashboard" className="flex items-center gap-3">
                    <SmartCityLogo variant="icon" size={36} />
                    {!isCollapsed && (
                        <span className="font-bold text-[#0D7377] text-lg font-['Noto_Sans_JP']">
                            Admin
                        </span>
                    )}
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
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px-60px)]">
                {navItems.map((item) => (
                    <div key={item.label}>
                        {item.children ? (
                            <>
                                <button
                                    onClick={() => toggleExpand(item.label)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-colors duration-200
                    ${isActive(item.path)
                                            ? 'bg-[#A5D6A7]/30 text-[#0D7377] border-l-4 border-[#0D7377]'
                                            : 'text-[#546E7A] hover:bg-[#ECEFF1]'
                                        }
                  `}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 text-left text-sm font-medium">
                                                {item.label}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className={`transition-transform ${expandedItems.includes(item.label) ? 'rotate-90' : ''
                                                    }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {/* Sub-items */}
                                {!isCollapsed && expandedItems.includes(item.label) && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                className={({ isActive }) => `
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                          transition-colors duration-200
                          ${isActive
                                                        ? 'bg-[#0D7377] text-white'
                                                        : 'text-[#546E7A] hover:bg-[#ECEFF1]'
                                                    }
                        `}
                                            >
                                                {child.icon}
                                                <span>{child.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive
                                        ? 'bg-[#A5D6A7]/30 text-[#0D7377] border-l-4 border-[#0D7377]'
                                        : 'text-[#546E7A] hover:bg-[#ECEFF1]'
                                    }
                `}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#B0BEC5] hidden lg:block">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                     text-[#546E7A] hover:bg-[#ECEFF1] transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <>
                            <ChevronLeft size={20} />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};
