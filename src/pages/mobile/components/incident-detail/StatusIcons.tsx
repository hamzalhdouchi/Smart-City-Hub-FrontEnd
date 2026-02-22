import React from 'react';

interface StatusIconProps {
    size?: number;
    isActive?: boolean;
}

// Reported: Concentric circles with ripple effect
export const ReportedIcon: React.FC<StatusIconProps> = ({ size = 48, isActive = false }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle with ripple animation */}
        {isActive && (
            <circle
                cx="24"
                cy="24"
                r="22"
                stroke="#FFB347"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
            >
                <animate
                    attributeName="r"
                    from="22"
                    to="28"
                    dur="2s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
        )}
        {/* Outer circle */}
        <circle
            cx="24"
            cy="24"
            r="22"
            stroke="#FFB347"
            strokeWidth="2"
            fill="none"
        />
        {/* Inner circle */}
        <circle
            cx="24"
            cy="24"
            r="12"
            fill="#FFB347"
        />
    </svg>
);

// Assigned: Hexagon with person icon
export const AssignedIcon: React.FC<StatusIconProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hexagon outline */}
        <path
            d="M24 4L38.8564 12V36L24 44L9.14359 36V12L24 4Z"
            stroke="#2196F3"
            strokeWidth="3"
            fill="none"
        />
        {/* Person icon inside */}
        <circle cx="24" cy="20" r="4" fill="#2196F3" />
        <path
            d="M16 32C16 28 19 26 24 26C29 26 32 28 32 32"
            stroke="#2196F3"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

// In Progress: Filled hexagon with animated progress bars
export const InProgressIcon: React.FC<StatusIconProps> = ({ size = 48, isActive = false }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Filled hexagon */}
        <path
            d="M24 4L38.8564 12V36L24 44L9.14359 36V12L24 4Z"
            fill="#0D7377"
        />
        {/* Progress bars */}
        <g>
            {/* Bar 1 */}
            <rect x="14" y="18" width="20" height="2" fill="white" opacity="0.4" rx="1" />
            <rect x="14" y="18" width={isActive ? "20" : "8"} height="2" fill="white" rx="1">
                {isActive && (
                    <animate
                        attributeName="width"
                        from="0"
                        to="20"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                )}
            </rect>

            {/* Bar 2 */}
            <rect x="14" y="23" width="20" height="2" fill="white" opacity="0.4" rx="1" />
            <rect x="14" y="23" width={isActive ? "20" : "14"} height="2" fill="white" rx="1">
                {isActive && (
                    <animate
                        attributeName="width"
                        from="0"
                        to="20"
                        dur="1.5s"
                        begin="0.3s"
                        repeatCount="indefinite"
                    />
                )}
            </rect>

            {/* Bar 3 */}
            <rect x="14" y="28" width="20" height="2" fill="white" opacity="0.4" rx="1" />
            <rect x="14" y="28" width={isActive ? "20" : "5"} height="2" fill="white" rx="1">
                {isActive && (
                    <animate
                        attributeName="width"
                        from="0"
                        to="20"
                        dur="1.5s"
                        begin="0.6s"
                        repeatCount="indefinite"
                    />
                )}
            </rect>
        </g>
    </svg>
);

// Resolved: Circle with animated checkmark
export const ResolvedIcon: React.FC<StatusIconProps> = ({ size = 48, isActive = false }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle outline */}
        <circle
            cx="24"
            cy="24"
            r="22"
            stroke="#32936F"
            strokeWidth="3"
            fill="none"
        />
        {/* Checkmark */}
        <path
            d="M14 24L20 30L34 16"
            stroke="#32936F"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isActive ? "40" : "0"}
            strokeDashoffset={isActive ? "0" : "40"}
        >
            {isActive && (
                <animate
                    attributeName="stroke-dashoffset"
                    from="40"
                    to="0"
                    dur="0.5s"
                    fill="freeze"
                />
            )}
        </path>
    </svg>
);

// Validated: Same as Resolved but with different color
export const ValidatedIcon: React.FC<StatusIconProps> = ({ size = 48, isActive = false }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="#4CAF50" strokeWidth="3" fill="none" />
        <path
            d="M14 24L20 30L34 16"
            stroke="#4CAF50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isActive ? "40" : "0"}
            strokeDashoffset={isActive ? "0" : "40"}
        >
            {isActive && (
                <animate
                    attributeName="stroke-dashoffset"
                    from="40"
                    to="0"
                    dur="0.5s"
                    fill="freeze"
                />
            )}
        </path>
    </svg>
);

// Rejected: X in circle
export const RejectedIcon: React.FC<StatusIconProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="#F44336" strokeWidth="3" fill="none" />
        <path d="M16 16L32 32M32 16L16 32" stroke="#F44336" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// Reopened: Circular arrow
export const ReopenedIcon: React.FC<StatusIconProps> = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="#FF9800" strokeWidth="3" fill="none" />
        <path
            d="M24 12C17.4 12 12 17.4 12 24C12 30.6 17.4 36 24 36C28.4 36 32.2 33.6 34.2 30"
            stroke="#FF9800"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />
        <path d="M30 30L34.2 30L34.2 26" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
