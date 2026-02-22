import React from 'react';
import { getStatusBadgeColor } from '../../styles/theme';

export type IncidentStatus =
    | 'NEW'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'VALIDATED'
    | 'REJECTED'
    | 'REOPENED';

interface StatusBadgeProps {
    status: IncidentStatus | string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const { bg, text } = getStatusBadgeColor(status);

    // Format status text
    const statusText = status
        .replace('_', ' ')
        .split(' ')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');

    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${className}`}
            style={{
                backgroundColor: bg,
                color: text,
            }}
        >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: text, opacity: 0.7 }} />
            {statusText}
        </span>
    );
};

export default StatusBadge;
