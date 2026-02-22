import React from 'react';
import { theme } from '../../styles/theme';
import { Plus } from 'lucide-react';

interface FABProps {
    onClick: () => void;
    icon?: React.ReactNode;
    label?: string;
    className?: string;
}

export const FAB: React.FC<FABProps> = ({
    onClick,
    icon = <Plus size={24} />,
    label,
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            className={`fixed rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 ${className}`}
            style={{
                width: theme.components.fab.size,
                height: theme.components.fab.size,
                bottom: theme.components.fab.bottomOffset,
                right: theme.components.fab.rightOffset,
                background: theme.gradients.tech,
                boxShadow: theme.shadows.level3,
            }}
            aria-label={label || 'Primary action'}
        >
            {icon}

            {/* Pulse animation */}
            <span
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: theme.colors.accent.electric }}
            />
        </button>
    );
};

export default FAB;
