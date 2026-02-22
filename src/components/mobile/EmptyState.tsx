import React from 'react';
import { theme } from '../../styles/theme';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
            {/* Icon/Illustration */}
            {icon && (
                <div className="mb-6 text-gray-300">
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3
                className="text-xl font-bold mb-2"
                style={{
                    color: theme.colors.neutral.asphalt,
                    fontFamily: theme.fonts.heading,
                }}
            >
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p
                    className="text-base mb-6 max-w-sm"
                    style={{ color: theme.colors.neutral.steel }}
                >
                    {description}
                </p>
            )}

            {/* Action Button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:scale-105 active:scale-95"
                    style={{
                        backgroundColor: theme.colors.primary.main,
                        minHeight: theme.components.button.medium,
                    }}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
