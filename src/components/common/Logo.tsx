import React from 'react';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
    const sizeMap = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div className={`${sizeMap[size]} flex items-center justify-center ${className}`}>
            <img
                src="/src/assets/logo.png"
                alt="Smart City Hub Logo"
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default Logo;
