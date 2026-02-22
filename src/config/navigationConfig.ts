import { Home, Map, Plus, FileText, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
    id: string;
    label: string;
    icon: LucideIcon;
    route: string;
    isCenter?: boolean; // For FAB-style Report button on mobile
}

export const navigationItems: NavigationItem[] = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        route: '/home'
    },
    {
        id: 'map',
        label: 'Map',
        icon: Map,
        route: '/map'
    },
    {
        id: 'report',
        label: 'Report',
        icon: Plus,
        route: '/report',
        isCenter: true
    },
    {
        id: 'mine',
        label: 'My Incidents',
        icon: FileText,
        route: '/my-incidents'
    },
    {
        id: 'profile',
        label: 'Profile',
        icon: User,
        route: '/profile'
    },
];

// Desktop-only additional items (if needed)
export const desktopOnlyItems: NavigationItem[] = [];

// Theme colors for navigation
export const navColors = {
    primary: '#2D8B7E',
    activeBackground: '#E0F2FE',
    hoverBackground: '#F1F5F9',
    textDefault: '#64748B',
    textActive: '#2D8B7E',
    border: '#E2E8F0',
    shadow: '2px 0 8px rgba(0,0,0,0.08)',
};
