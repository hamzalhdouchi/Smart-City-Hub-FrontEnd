import React from 'react';

interface NetworkNodesPatternProps {
    className?: string;
    opacity?: number;
}

export const NetworkNodesPattern: React.FC<NetworkNodesPatternProps> = ({
    className = '',
    opacity = 0.2
}) => {
    return (
        <svg
            className={className}
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
        >
            {/* Connection lines */}
            <line x1="50" y1="50" x2="150" y2="80" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="150" y1="80" x2="250" y2="100" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="50" y1="50" x2="100" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="100" y1="150" x2="200" y2="180" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="250" y1="100" x2="200" y2="180" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="150" y1="80" x2="100" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="100" y1="150" x2="150" y2="250" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="200" y1="180" x2="150" y2="250" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Nodes with animated pulse */}
            <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                <circle cx="50" cy="50" r="4" fill="white" opacity="0.8" />
                <circle cx="50" cy="50" r="8" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
            </g>

            <circle cx="150" cy="80" r="3" fill="white" opacity="0.7" />
            <circle cx="250" cy="100" r="3.5" fill="white" opacity="0.7" />

            <g className="animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <circle cx="100" cy="150" r="4" fill="white" opacity="0.8" />
                <circle cx="100" cy="150" r="8" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
            </g>

            <circle cx="200" cy="180" r="3" fill="white" opacity="0.7" />

            <g className="animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                <circle cx="150" cy="250" r="4" fill="white" opacity="0.8" />
                <circle cx="150" cy="250" r="8" stroke="white" strokeWidth="0.5" fill="none" opacity="0.4" />
            </g>

            {/* Data flow indicator */}
            <circle cx="125" cy="65" r="2" fill="#C9A961" opacity="0.6">
                <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="M 0 0 L 100 20 L 200 40"
                />
            </circle>
        </svg>
    );
};

export default NetworkNodesPattern;
