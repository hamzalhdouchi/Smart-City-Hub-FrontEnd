import React from 'react';
import { MapPin, Clock, ArrowRight, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Incident } from '../../../services/incidentService';
import { getPriorityColor } from '../../../styles/theme';

interface MyIncidentCardProps {
    incident: Incident;
    onView: () => void;
    onUpdate?: () => void;
}

export const MyIncidentCard: React.FC<MyIncidentCardProps> = ({ incident, onView, onUpdate }) => {
    const isResolved = incident.status === 'RESOLVED' || incident.status === 'CLOSED';
    const timeAgo = formatDistanceToNow(new Date(incident.updatedAt), { addSuffix: true });

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return '#FFC107'; // Yellow
            case 'ASSIGNED': return '#2196F3'; // Blue
            case 'IN_PROGRESS': return '#FF9800'; // Orange
            case 'RESOLVED': return '#4CAF50'; // Green
            case 'REJECTED': return '#F44336'; // Red
            case 'CLOSED': return '#607D8B'; // Gray
            default: return '#9E9E9E';
        }
    };

    const statusColor = getStatusColor(incident.status);

    return (
        <div
            className="my-incident-card p-4 mx-4 mb-3 flex gap-4 active:scale-[0.99] transition-transform"
            style={{ borderLeft: `4px solid ${statusColor}` }}
            onClick={onView}
        >
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                {incident.photos && incident.photos.length > 0 ? (
                    <img
                        src={incident.photos[0].fileUrl || incident.photos[0].url}
                        alt={incident.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                        {incident.category.icon}
                    </div>
                )}

                {/* Category Icon Overlay */}
                <div className="absolute bottom-0 left-0 bg-black/50 backdrop-blur-sm p-1 rounded-tr-lg">
                    <span className="text-sm">{incident.category.icon}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-[15px] line-clamp-1 leading-tight">
                            {incident.title}
                        </h3>
                        {/* Priority Dot */}
                        <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: getPriorityColor(incident.priority) }}
                        />
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 font-medium">
                        <span style={{ color: statusColor }}>
                            {isResolved ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        </span>
                        <span style={{ color: statusColor }}>
                            {incident.status.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{timeAgo}</span>
                    </div>
                </div>

                {/* Actions or Rating */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    {isResolved ? (
                        <div className="flex items-center gap-1 text-amber-500">
                            {/* Placeholder for user rating if available, else show 'Rate' button logic parent side */}
                            <Star size={14} fill={incident.userRating ? "currentColor" : "none"} />
                            <span className="text-xs font-bold">
                                {incident.userRating ? `${incident.userRating.rating}/5` : 'Rate Service'}
                            </span>
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={(e) => { e.stopPropagation(); onView(); }}
                                className="flex-1 py-1.5 text-xs font-bold text-[#5E35B1] bg-purple-50 rounded-lg border border-purple-100 text-center"
                            >
                                View
                            </button>
                            {onUpdate && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onUpdate(); }}
                                    className="flex-1 py-1.5 text-xs font-bold text-white bg-[#5E35B1] rounded-lg text-center"
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    )}

                    {isResolved && (
                        <button className="text-[#5E35B1] text-xs font-bold flex items-center gap-1">
                            Details <ArrowRight size={12} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
