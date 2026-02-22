import React from 'react';

interface FilterTabsProps {
    activeTab: 'active' | 'resolved' | 'all';
    onTabChange: (tab: 'active' | 'resolved' | 'all') => void;
    counts: {
        active: number;
        resolved: number;
        all: number;
    };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange, counts }) => {
    return (
        <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 overflow-x-auto no-scrollbar">
            <button
                onClick={() => onTabChange('active')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'active' ? 'filter-tab-active' : 'filter-tab-inactive'
                    }`}
            >
                Active
                <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-md ${activeTab === 'active' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {counts.active}
                </span>
            </button>

            <button
                onClick={() => onTabChange('resolved')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'resolved' ? 'filter-tab-active' : 'filter-tab-inactive'
                    }`}
            >
                Resolved
                <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-md ${activeTab === 'resolved' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {counts.resolved}
                </span>
            </button>

            <button
                onClick={() => onTabChange('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'all' ? 'filter-tab-active' : 'filter-tab-inactive'
                    }`}
            >
                All Reports
                <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-md ${activeTab === 'all' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {counts.all}
                </span>
            </button>
        </div>
    );
};
