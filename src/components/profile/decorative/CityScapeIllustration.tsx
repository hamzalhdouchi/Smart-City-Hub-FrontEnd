import React from 'react';

interface CityScapeIllustrationProps {
    className?: string;
    opacity?: number;
}

export const CityScapeIllustration: React.FC<CityScapeIllustrationProps> = ({
    className = '',
    opacity = 0.15
}) => {
    return (
        <svg
            className={className}
            viewBox="0 0 400 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
        >
            {/* Building 1 - Tall */}
            <rect x="50" y="60" width="40" height="140" stroke="white" strokeWidth="1" />
            <line x1="70" y1="60" x2="70" y2="200" stroke="white" strokeWidth="0.5" opacity="0.5" />
            {/* Windows */}
            <rect x="58" y="70" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="74" y="70" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="58" y="90" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="74" y="90" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="58" y="110" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="74" y="110" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />

            {/* Building 2 - Medium */}
            <rect x="110" y="100" width="50" height="100" stroke="white" strokeWidth="1" />
            <line x1="135" y1="100" x2="135" y2="200" stroke="white" strokeWidth="0.5" opacity="0.5" />
            {/* Windows */}
            <rect x="120" y="115" width="10" height="10" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="140" y="115" width="10" height="10" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="120" y="140" width="10" height="10" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="140" y="140" width="10" height="10" stroke="white" strokeWidth="0.5" opacity="0.7" />

            {/* Building 3 - Short */}
            <rect x="180" y="130" width="35" height="70" stroke="white" strokeWidth="1" />
            <rect x="188" y="145" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />
            <rect x="200" y="145" width="8" height="8" stroke="white" strokeWidth="0.5" opacity="0.7" />

            {/* Building 4 - Tall Tower */}
            <rect x="240" y="40" width="45" height="160" stroke="white" strokeWidth="1" />
            <line x1="262.5" y1="40" x2="262.5" y2="200" stroke="white" strokeWidth="0.5" opacity="0.5" />
            {/* Antenna */}
            <line x1="262.5" y1="20" x2="262.5" y2="40" stroke="white" strokeWidth="1" />
            <circle cx="262.5" cy="20" r="3" stroke="white" strokeWidth="0.5" fill="none" />

            {/* Connection lines - IoT Network */}
            <line x1="70" y1="80" x2="135" y2="120" stroke="white" strokeWidth="0.5" opacity="0.3" strokeDasharray="2,2" />
            <line x1="135" y1="130" x2="200" y2="150" stroke="white" strokeWidth="0.5" opacity="0.3" strokeDasharray="2,2" />
            <line x1="200" y1="155" x2="262" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" strokeDasharray="2,2" />

            {/* Ground level */}
            <line x1="40" y1="200" x2="300" y2="200" stroke="white" strokeWidth="1" opacity="0.5" />
        </svg>
    );
};

export default CityScapeIllustration;
