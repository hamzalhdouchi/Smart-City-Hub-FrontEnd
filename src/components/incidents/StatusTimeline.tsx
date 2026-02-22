import React from 'react';
import { Clock, ArrowRight, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { IncidentStatus } from '../../services/incidentService';

interface StatusHistoryItem {
    id: string;
    previousStatus: IncidentStatus | null;
    newStatus: IncidentStatus;
    comment?: string;
    changedByName: string;
    changedAt: string;
}

interface StatusTimelineProps {
    history: StatusHistoryItem[];
    currentStatus: IncidentStatus;
}

const getStatusStyle = (status: IncidentStatus) => {
    const styles: Record<IncidentStatus, { bg: string; text: string; icon: React.ReactNode }> = {
        NEW: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            icon: <AlertCircle size={16} />,
        },
        IN_PROGRESS: {
            bg: 'bg-amber-100',
            text: 'text-amber-700',
            icon: <Play size={16} />,
        },
        RESOLVED: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: <CheckCircle size={16} />,
        },
        CLOSED: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            icon: <XCircle size={16} />,
        },
    };
    return styles[status] || styles.NEW;
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const StatusTimeline: React.FC<StatusTimelineProps> = ({ history, currentStatus }) => {
    if (!history || history.length === 0) {
        // Show just the current status if no history
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusStyle(currentStatus).bg} ${getStatusStyle(currentStatus).text}`}>
                        {getStatusStyle(currentStatus).icon}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-[#263238]">
                            Current Status: {currentStatus.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-[#78909C]">No status changes recorded</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-[#ECEFF1]" />

            <div className="space-y-6">
                {history.map((item, index) => {
                    const style = getStatusStyle(item.newStatus);
                    const isLast = index === history.length - 1;

                    return (
                        <div key={item.id} className="flex items-start gap-4 relative">
                            {/* Timeline dot */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isLast && item.newStatus === currentStatus
                                    ? `${style.bg} ${style.text} ring-4 ring-[#00ACC1]/20`
                                    : `${style.bg} ${style.text}`
                                    }`}
                            >
                                {style.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {item.previousStatus && (
                                        <>
                                            <span className={`text-sm px-2 py-0.5 rounded ${getStatusStyle(item.previousStatus).bg} ${getStatusStyle(item.previousStatus).text}`}>
                                                {item.previousStatus.replace('_', ' ')}
                                            </span>
                                            <ArrowRight size={14} className="text-[#78909C]" />
                                        </>
                                    )}
                                    <span className={`text-sm px-2 py-0.5 rounded font-medium ${style.bg} ${style.text}`}>
                                        {item.newStatus.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-sm text-[#78909C]">
                                    <span>by {item.changedByName}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatDateTime(item.changedAt)}
                                    </span>
                                </div>

                                {item.comment && (
                                    <p className="mt-2 text-sm text-[#455A64] bg-[#ECEFF1]/50 px-3 py-2 rounded-lg">
                                        "{item.comment}"
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusTimeline;
