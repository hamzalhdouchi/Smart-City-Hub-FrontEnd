import React from 'react';
import { MessageCircle, MapPin, ChevronRight, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Incident } from '../../../../services/incidentService';
import { StatusBadge } from '../../../../components/mobile/StatusBadge';
import { theme, getPriorityColor } from '../../../../styles/theme';

interface EnhancedIncidentCardProps {
    incident: Incident;
    onView: () => void;
    inGrid?: boolean;
}

const STATUS_STEP: Record<string, number> = {
    NEW:         1,
    ASSIGNED:    2,
    IN_PROGRESS: 3,
    RESOLVED:    4,
    VALIDATED:   4,
    REOPENED:    2,
    REJECTED:    0,
    CLOSED:      4,
};

const PROGRESS_STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export const EnhancedIncidentCard: React.FC<EnhancedIncidentCardProps> = ({ incident, onView, inGrid = false }) => {
    const priColor   = getPriorityColor(incident.priority);
    const timeAgo    = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true });
    const step       = STATUS_STEP[incident.status] ?? 1;
    const isRejected = incident.status === 'REJECTED';
    const photoSrc   = incident.photos?.[0]?.fileUrl || incident.photos?.[0]?.url;
    const progressPct = isRejected ? 0 : Math.round((step / 4) * 100);

    return (
        <div className={inGrid ? 'mb-0' : 'mx-4 mb-3'} onClick={onView}>
            <div
                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
            >
                {/* Priority accent bar — top */}
                <div
                    className="h-[3px] w-full"
                    style={{ background: `linear-gradient(90deg, ${priColor} 0%, ${priColor}44 100%)` }}
                />

                {/* Left teal border accent on tap */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl opacity-0 group-active:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to bottom, #0D7377, #32936F)' }}
                />

                {/* Main body */}
                <div className="p-4 flex gap-3">
                    {/* Photo / Placeholder */}
                    <div className="relative shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden">
                        {photoSrc ? (
                            <img
                                src={photoSrc}
                                alt={incident.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #f0fafa 0%, #e6f7f7 100%)' }}
                            >
                                {incident.category?.icon ? (
                                    <span className="text-2xl">{incident.category.icon}</span>
                                ) : (
                                    <div
                                        className="w-8 h-8 rounded-xl border-2 opacity-40"
                                        style={{ borderColor: '#0D7377' }}
                                    />
                                )}
                            </div>
                        )}
                        {/* Priority dot */}
                        <div
                            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                            style={{ background: priColor }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Status + time */}
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                            <StatusBadge status={incident.status} />
                            <div className="flex items-center gap-1" style={{ color: '#B0BEC5' }}>
                                <Clock size={10} />
                                <span className="text-[10px] font-medium">{timeAgo}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="font-black text-[14px] leading-snug line-clamp-1 mb-1"
                            style={{ color: '#263238', fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                            {incident.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[12px] line-clamp-2 leading-relaxed mb-1.5" style={{ color: '#546E7A' }}>
                            {incident.description}
                        </p>

                        {/* Location */}
                        {incident.address && (
                            <div className="flex items-center gap-1">
                                <MapPin size={10} className="shrink-0" style={{ color: '#0D7377' }} />
                                <span className="text-[11px] truncate" style={{ color: '#B0BEC5' }}>
                                    {incident.address.split(',')[0]}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress tracker */}
                <div className="px-4 pb-3">
                    <div className="flex items-center justify-between mb-1">
                        {PROGRESS_STEPS.map((label, i) => (
                            <span
                                key={label}
                                className="text-[9px] font-bold uppercase tracking-wide"
                                style={{ color: i < step ? '#0D7377' : '#B0BEC5' }}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#ECEFF1' }}>
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${progressPct}%`,
                                background: isRejected
                                    ? theme.colors.accent.danger
                                    : 'linear-gradient(90deg, #0D7377, #32936F)',
                            }}
                        />
                    </div>
                </div>

                {/* Rating row — shown only if rated */}
                {incident.rating && (
                    <div
                        className="mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
                        style={{
                            background: `${theme.colors.accent.warning}18`,
                            border: `1px solid ${theme.colors.accent.warning}30`,
                        }}
                    >
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                    key={s}
                                    size={13}
                                    fill={s <= Math.round(incident.rating!.rating)
                                        ? theme.colors.accent.warning
                                        : `${theme.colors.accent.warning}40`}
                                    style={{
                                        color: s <= Math.round(incident.rating!.rating)
                                            ? theme.colors.accent.warning
                                            : `${theme.colors.accent.warning}40`,
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: '#7D4E00' }}>
                            {incident.rating.rating.toFixed(1)} · Your rating
                        </span>
                    </div>
                )}

                {/* Footer */}
                <div
                    className="flex items-center justify-between px-4 py-2.5 border-t"
                    style={{ borderColor: '#ECEFF1', background: '#f8fafb' }}
                >
                    <div className="flex items-center gap-3">
                        {/* Priority badge */}
                        <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide"
                            style={{
                                backgroundColor: `${priColor}18`,
                                color: priColor,
                            }}
                        >
                            {incident.priority}
                        </span>

                        {/* Comments count */}
                        {incident.commentsCount > 0 && (
                            <div className="flex items-center gap-1" style={{ color: '#546E7A' }}>
                                <MessageCircle size={12} />
                                <span className="text-[11px] font-semibold">{incident.commentsCount}</span>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide text-white transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #0D7377, #32936F)' }}
                    >
                        Details
                        <ChevronRight size={12} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};
