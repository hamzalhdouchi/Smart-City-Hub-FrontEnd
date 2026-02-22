import React from 'react';
import { Activity, Circle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { IncidentStatus } from '../../../../services/incidentService';
import { ReportedIcon, AssignedIcon, InProgressIcon, ResolvedIcon, ValidatedIcon, RejectedIcon, ReopenedIcon } from './StatusIcons';

interface StatusHistoryItem {
    status: IncidentStatus;
    timestamp: Date;
    actor?: string;
    note?: string;
}

interface StatusTimelineCardProps {
    history: StatusHistoryItem[];
    currentStatus: IncidentStatus;
}

const statusOrder: IncidentStatus[] = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

const statusConfig: Record<IncidentStatus, { label: string; color: string; IconComponent: React.FC<{ size?: number; isActive?: boolean }> }> = {
    NEW: { label: 'Reported', color: '#FFB347', IconComponent: ReportedIcon },
    ASSIGNED: { label: 'Assigned', color: '#2196F3', IconComponent: AssignedIcon },
    IN_PROGRESS: { label: 'In Progress', color: '#0D7377', IconComponent: InProgressIcon },
    RESOLVED: { label: 'Resolved', color: '#32936F', IconComponent: ResolvedIcon },
    VALIDATED: { label: 'Validated', color: '#4CAF50', IconComponent: ValidatedIcon },
    REJECTED: { label: 'Rejected', color: '#F44336', IconComponent: RejectedIcon },
    REOPENED: { label: 'Reopened', color: '#FF9800', IconComponent: ReopenedIcon }
};

export const StatusTimelineCard: React.FC<StatusTimelineCardProps> = ({
    history,
    currentStatus
}) => {
    const currentIndex = statusOrder.indexOf(currentStatus);

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header with gradient */}
            <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                    background: '#E0F2F1'
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: '#0D7377',
                        boxShadow: '0 4px 12px rgba(13, 115, 119, 0.3)'
                    }}
                >
                    <Activity size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#263238]">Status Journey</h2>
                    <p className="text-xs text-[#546E7A]">Track the incident progress</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-5 pt-4">
                <div className="relative">
                    {statusOrder.map((status, index) => {
                        const historyItem = history.find(h => h.status === status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const isLast = index === statusOrder.length - 1;
                        const config = statusConfig[status];

                        return (
                            <div key={status} className="relative flex gap-4">
                                {/* Timeline Line & Dot */}
                                <div className="flex flex-col items-center">
                                    {/* Icon */}
                                    <div
                                        className={`relative z-10 flex items-center justify-center transition-all duration-500 ${isCurrent ? 'scale-110' : ''
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <config.IconComponent size={40} isActive={isCurrent} />
                                        ) : (
                                            <Circle size={40} className="text-[#ECEFF1]" strokeWidth={3} />
                                        )}
                                    </div>

                                    {/* Connecting Line */}
                                    {!isLast && (
                                        <div
                                            className="w-0.5 flex-1 min-h-[40px] my-1 rounded-full transition-all duration-500"
                                            style={{
                                                background: index < currentIndex
                                                    ? `linear-gradient(to bottom, ${config.color}, ${statusConfig[statusOrder[index + 1]]?.color || '#0D7377'})`
                                                    : '#ECEFF1'
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3
                                            className={`text-base font-bold transition-colors ${isCompleted ? 'text-[#263238]' : 'text-[#B0BEC5]'
                                                }`}
                                        >
                                            {config.label}
                                        </h3>
                                        {isCurrent && (
                                            <span
                                                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full text-white"
                                                style={{
                                                    background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)`,
                                                    boxShadow: `0 2px 8px ${config.color}40`
                                                }}
                                            >
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    {historyItem ? (
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#546E7A] flex items-center gap-1.5">
                                                <Clock size={12} />
                                                {formatDistanceToNow(new Date(historyItem.timestamp), { addSuffix: true })}
                                            </p>
                                            {historyItem.actor && (
                                                <p className="text-sm text-[#546E7A]">
                                                    by <span className="font-medium text-[#263238]">{historyItem.actor}</span>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#B0BEC5] italic flex items-center gap-1.5">
                                            {isCompleted ? 'Completed' : (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B0BEC5] animate-pulse" />
                                                    Pending...
                                                </>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
