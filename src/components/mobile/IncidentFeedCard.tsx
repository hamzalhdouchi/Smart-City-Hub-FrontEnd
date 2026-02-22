import React from 'react';
import type { Incident } from '../../services/incidentService';
import { StatusBadge } from './StatusBadge';
import { theme, getPriorityColor } from '../../styles/theme';
import { MapPin, Clock, MessageCircle, Star, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CategoryIcon from '../../components/common/CategoryIcon';

interface IncidentFeedCardProps {
    incident: Incident;
    onClick: () => void;
}

export const IncidentFeedCard: React.FC<IncidentFeedCardProps> = ({ incident, onClick }) => {
    const primaryPhoto = incident.photos?.[0];
    const hasMultiplePhotos = incident.photos?.length > 1;
    const [imageError, setImageError] = React.useState(false);

    const timeAgo = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true });

    const getImageUrl = () => {
        if (!primaryPhoto) return null;
        return primaryPhoto.fileUrl || primaryPhoto.url || null;
    };

    const imageUrl = getImageUrl();

    return (
        <article
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
        >
            {/* Image area */}
            {imageUrl && !imageError ? (
                <div className="relative overflow-hidden h-48 lg:h-52 w-full shrink-0">
                    <img
                        src={imageUrl}
                        alt={incident.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top-right: photo count */}
                    {hasMultiplePhotos && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-bold text-white backdrop-blur-sm"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            +{incident.photos.length - 1}
                        </div>
                    )}

                    {/* Bottom-left: category */}
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white backdrop-blur-md"
                            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <span className="text-[13px]">{incident.category.icon}</span>
                            {incident.category.name}
                        </span>
                    </div>

                    {/* Bottom-right: arrow on hover */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                        <ArrowUpRight size={15} style={{ color: '#0D7377' }} />
                    </div>
                </div>
            ) : (
                <div className="relative h-44 lg:h-48 w-full shrink-0 flex flex-col items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f0fafa 0%, #e6f7f7 100%)' }}>
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-2">
                        <CategoryIcon iconName={incident.category.icon} size={32} />
                    </div>
                    <p className="text-xs font-semibold text-slate-400">{incident.category.name}</p>
                    {/* Arrow on hover */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                        <ArrowUpRight size={15} style={{ color: '#0D7377' }} />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                {/* Priority + Status row */}
                <div className="flex items-center justify-between mb-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wide"
                        style={{
                            backgroundColor: `${getPriorityColor(incident.priority)}18`,
                            color: getPriorityColor(incident.priority),
                        }}>
                        {incident.priority}
                    </span>
                    <StatusBadge status={incident.status} />
                </div>

                {/* Title */}
                <h3 className="font-black text-[15px] leading-snug line-clamp-2 mb-1.5 text-slate-800">
                    {incident.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-relaxed line-clamp-2 text-slate-500 mb-3 flex-1">
                    {incident.description}
                </p>

                {/* Location + Time */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                        <MapPin size={12} className="shrink-0" style={{ color: '#0D7377' }} />
                        <span className="truncate font-medium">{incident.address.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Clock size={12} />
                        <span>{timeAgo}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 mb-3" />

                {/* Reporter + engagement */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                            style={{ backgroundColor: theme.colors.primary.main }}>
                            {incident.reporter.firstName[0]}{incident.reporter.lastName[0]}
                        </div>
                        <span className="text-[12px] font-semibold text-slate-600 truncate max-w-[100px]">
                            {incident.reporter.fullName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                        {incident.commentsCount > 0 && (
                            <div className="flex items-center gap-1">
                                <MessageCircle size={12} />
                                <span>{incident.commentsCount}</span>
                            </div>
                        )}
                        {incident.rating && (
                            <div className="flex items-center gap-1">
                                <Star size={12} fill={theme.colors.accent.warning} style={{ color: theme.colors.accent.warning }} />
                                <span>{incident.rating.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Teal left-border accent on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl transition-all duration-300 group-hover:opacity-100 opacity-0"
                style={{ background: 'linear-gradient(to bottom, #0D7377, #32936F)' }} />
        </article>
    );
};

export default IncidentFeedCard;
