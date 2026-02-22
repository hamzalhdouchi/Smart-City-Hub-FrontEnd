import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg' | 'none';
    accentBorder?: 'top' | 'left' | 'none';
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    accentBorder = 'none',
    onClick,
}) => {
    const paddingMap = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const accentMap = {
        none: '',
        top: 'border-t-4 border-t-[#0D7377]',
        left: 'border-l-4 border-l-[#0D7377]',
    };

    return (
        <div
            className={`
                bg-white rounded-xl shadow-lg
                ${paddingMap[padding]}
                ${accentMap[accentBorder]}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
