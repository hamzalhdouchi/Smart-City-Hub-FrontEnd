import React from 'react';

interface DataPulseLoaderProps {
    size?: number;
    className?: string;
}

export const DataPulseLoader: React.FC<DataPulseLoaderProps> = ({
    size = 48,
    className = '',
}) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                {/* Outer pulse rings */}
                <div
                    className="absolute inset-0 rounded-full border-2 border-[#0D7377] animate-sensor-pulse opacity-50"
                />
                <div
                    className="absolute inset-0 rounded-full border-2 border-[#14FFEC] animate-sensor-pulse opacity-30"
                    style={{ animationDelay: '0.5s' }}
                />

                {/* Hexagon container with rotation */}
                <svg
                    viewBox="0 0 100 100"
                    className="animate-spin"
                    style={{ width: size, height: size, animationDuration: '3s' }}
                >
                    {/* Outer hexagon */}
                    <polygon
                        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                        fill="none"
                        stroke="#0D7377"
                        strokeWidth="3"
                        className="opacity-80"
                    />

                    {/* Inner hexagon */}
                    <polygon
                        points="50,20 75,35 75,65 50,80 25,65 25,35"
                        fill="rgba(13, 115, 119, 0.1)"
                        stroke="#14FFEC"
                        strokeWidth="2"
                        className="opacity-60"
                    />

                    {/* Center pulsing circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="12"
                        fill="#0D7377"
                        className="animate-pulse"
                    />

                    {/* Circuit lines */}
                    <line x1="50" y1="20" x2="50" y2="38" stroke="#14FFEC" strokeWidth="1" opacity="0.5" />
                    <line x1="50" y1="62" x2="50" y2="80" stroke="#14FFEC" strokeWidth="1" opacity="0.5" />
                    <line x1="25" y1="50" x2="38" y2="50" stroke="#14FFEC" strokeWidth="1" opacity="0.5" />
                    <line x1="62" y1="50" x2="75" y2="50" stroke="#14FFEC" strokeWidth="1" opacity="0.5" />

                    {/* Node dots */}
                    <circle cx="50" cy="20" r="3" fill="#14FFEC" />
                    <circle cx="50" cy="80" r="3" fill="#14FFEC" />
                    <circle cx="25" cy="50" r="3" fill="#14FFEC" />
                    <circle cx="75" cy="50" r="3" fill="#14FFEC" />
                </svg>
            </div>
        </div>
    );
};

// Small inline version for buttons
export const DataPulseSmall: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg
        viewBox="0 0 100 100"
        className="animate-spin"
        style={{ width: size, height: size }}
    >
        <polygon
            points="50,10 85,32.5 85,67.5 50,90 15,67.5 15,32.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
        />
        <circle cx="50" cy="50" r="15" fill="currentColor" />
    </svg>
);
