import React from 'react';
import { theme } from '../../styles/theme';
import { X } from 'lucide-react';

export interface FilterChipProps {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    count?: number;
    onClick: () => void;
    onRemove?: () => void;
    variant?: 'status' | 'category' | 'active' | 'glass';
    size?: 'small' | 'medium';
}

export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    icon,
    isActive = false,
    count,
    onClick,
    onRemove,
    variant = 'status',
    size = 'medium',
}) => {
    const getBackgroundColor = () => {
        if (variant === 'active') {
            return theme.colors.neutral.asphalt;
        }

        if (variant === 'glass') {
            return isActive ? 'rgba(20, 255, 236, 0.25)' : 'rgba(255, 255, 255, 0.1)';
        }

        if (isActive) {
            return variant === 'status'
                ? theme.colors.primary.main
                : theme.colors.secondary.main;
        }

        return theme.colors.neutral.white;
    };

    const getTextColor = () => {
        if (variant === 'glass') {
            return isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)';
        }
        if (variant === 'active' || isActive) {
            return theme.colors.neutral.white;
        }
        return theme.colors.neutral.steel;
    };

    const getBorderColor = () => {
        if (variant === 'active') {
            return theme.colors.neutral.asphalt;
        }

        if (variant === 'glass') {
            return isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)';
        }

        if (isActive) {
            return variant === 'status'
                ? theme.colors.primary.main
                : theme.colors.secondary.main;
        }

        return theme.colors.neutral.concrete;
    };

    const padding = size === 'small' ? 'px-3 py-1.5' : 'px-4 py-2';
    const fontSize = size === 'small' ? 'text-xs' : 'text-[13px]';
    const backdropBlur = variant === 'glass' ? 'backdrop-blur-md' : '';

    return (
        <button
            onClick={onClick}
            className={`${padding} ${fontSize} ${backdropBlur} rounded-full font-medium whitespace-nowrap transition-all inline-flex items-center gap-2`}
            style={{
                backgroundColor: getBackgroundColor(),
                color: getTextColor(),
                border: `1px solid ${getBorderColor()}`,
                boxShadow: isActive ? theme.shadows.level1 : 'none',
            }}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{label}</span>
            {count !== undefined && count > 0 && (
                <span
                    className="px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center"
                    style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : theme.colors.neutral.concrete,
                        color: isActive ? theme.colors.neutral.white : theme.colors.neutral.asphalt,
                    }}
                >
                    {count}
                </span>
            )}
            {variant === 'active' && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove filter"
                >
                    <X size={14} />
                </button>
            )}
        </button>
    );
};

export default FilterChip;
