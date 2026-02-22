import React from 'react';

interface GeometricPatternProps {
    className?: string;
    opacity?: number;
}

export const GeometricPattern: React.FC<GeometricPatternProps> = ({
    className = '',
    opacity = 0.1
}) => {
    return (
        <svg
            className={className}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
        >
            {/* Inspired by Japanese Kumiko woodwork patterns */}

            {/* Diamond grid */}
            <path d="M 100 20 L 140 60 L 100 100 L 60 60 Z" stroke="white" strokeWidth="0.5" />
            <path d="M 140 60 L 180 100 L 140 140 L 100 100 Z" stroke="white" strokeWidth="0.5" />
            <path d="M 100 100 L 140 140 L 100 180 L 60 140 Z" stroke="white" strokeWidth="0.5" />
            <path d="M 60 60 L 100 100 L 60 140 L 20 100 Z" stroke="white" strokeWidth="0.5" />

            {/* Inner squares */}
            <rect x="80" y="80" width="40" height="40" stroke="white" strokeWidth="0.5" transform="rotate(45 100 100)" />
            <rect x="90" y="90" width="20" height="20" stroke="white" strokeWidth="0.5" transform="rotate(45 100 100)" />

            {/* Connecting lines */}
            <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="0.3" opacity="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="0.3" opacity="0.5" />

            {/* Corner details */}
            <circle cx="100" cy="20" r="2" fill="white" opacity="0.6" />
            <circle cx="180" cy="100" r="2" fill="white" opacity="0.6" />
            <circle cx="100" cy="180" r="2" fill="white" opacity="0.6" />
            <circle cx="20" cy="100" r="2" fill="white" opacity="0.6" />

            {/* Accent gold elements */}
            <circle cx="100" cy="100" r="3" fill="#C9A961" opacity="0.4" />
        </svg>
    );
};

export default GeometricPattern;
