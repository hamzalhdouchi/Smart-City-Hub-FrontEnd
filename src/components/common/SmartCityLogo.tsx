import React from 'react';
import logoImage from '../../assets/logo.png';

interface SmartCityLogoProps {
    variant?: 'full' | 'icon' | 'monochrome';
    size?: number;
    className?: string;
}

export const SmartCityLogo: React.FC<SmartCityLogoProps> = ({
    variant = 'full',
    size = 40,
    className = '',
}) => {
    const logoStyle = {
        width: size,
        height: size,
    };

    if (variant === 'icon') {
        return (
            <img
                src={logoImage}
                alt="Smart City Hub"
                style={logoStyle}
                className={`object-contain ${className}`}
            />
        );
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src={logoImage}
                alt="Smart City Hub"
                style={logoStyle}
                className="object-contain"
            />
            {variant === 'full' && (
                <span className="font-bold text-xl font-['Noto_Sans_JP'] text-[#0D7377]">
                    Smart City Hub
                </span>
            )}
        </div>
    );
};
