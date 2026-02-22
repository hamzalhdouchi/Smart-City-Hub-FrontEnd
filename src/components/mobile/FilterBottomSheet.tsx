import React from 'react';
import { theme } from '../../styles/theme';
import { Filter, X } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { FilterChip } from './FilterChip';
import type { Category } from '../../services/categoryService';

export interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    selectedCategories: string[];
    onCategoryToggle: (categoryId: string) => void;
    onClearAll: () => void;
    incidentCounts?: Record<string, number>;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
    isOpen,
    onClose,
    categories,
    selectedCategories,
    onCategoryToggle,
    onClearAll,
    incidentCounts = {},
}) => {
    const hasActiveFilters = selectedCategories.length > 0;

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter by category">
            <div className="space-y-4">
                {/* Header with Clear All */}
                {hasActiveFilters && (
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.colors.neutral.concrete }}>
                        <p className="text-sm" style={{ color: theme.colors.neutral.steel }}>
                            {selectedCategories.length} {selectedCategories.length === 1 ? 'active filter' : 'active filters'}
                        </p>
                        <button
                            onClick={onClearAll}
                            className="text-sm font-medium flex items-center gap-1"
                            style={{ color: theme.colors.primary.main }}
                        >
                            <X size={16} />
                            Clear all
                        </button>
                    </div>
                )}

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => {
                        const isSelected = selectedCategories.includes(category.id);
                        const count = incidentCounts[category.id] || 0;

                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryToggle(category.id)}
                                className="p-4 rounded-xl text-left transition-all"
                                style={{
                                    backgroundColor: isSelected ? `${theme.colors.secondary.main}15` : theme.colors.neutral.white,
                                    border: `2px solid ${isSelected ? theme.colors.secondary.main : theme.colors.neutral.concrete}`,
                                    boxShadow: isSelected ? theme.shadows.level1 : 'none',
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-2xl">{category.icon}</span>
                                    {count > 0 && (
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                                            style={{
                                                backgroundColor: theme.colors.neutral.concrete,
                                                color: theme.colors.neutral.asphalt,
                                            }}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </div>
                                <p
                                    className="text-sm font-medium"
                                    style={{
                                        color: isSelected ? theme.colors.secondary.main : theme.colors.neutral.asphalt,
                                    }}
                                >
                                    {category.name}
                                </p>
                                {category.description && (
                                    <p className="text-xs mt-1" style={{ color: theme.colors.neutral.steel }}>
                                        {category.description}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Apply Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-medium text-white"
                    style={{
                        backgroundColor: theme.colors.primary.main,
                        boxShadow: theme.shadows.level2,
                    }}
                >
                    Apply filters
                </button>
            </div>
        </BottomSheet>
    );
};

export default FilterBottomSheet;
