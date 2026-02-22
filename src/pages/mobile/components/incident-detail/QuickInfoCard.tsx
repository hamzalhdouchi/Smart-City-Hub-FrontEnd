import React from 'react';
import { MapPin, Clock, User, UserCog, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QuickInfoCardProps {
    location: string;
    city: string;
    reportedAt: Date;
    reporterName: string;
    isCurrentUser: boolean;
    assignedAgent?: {
        name: string;
        role: string;
    };
}

export const QuickInfoCard: React.FC<QuickInfoCardProps> = ({
    location,
    city,
    reportedAt,
    reporterName,
    isCurrentUser,
    assignedAgent
}) => {
    const timeAgo = formatDistanceToNow(new Date(reportedAt), { addSuffix: true });
    const formattedDate = new Date(reportedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const InfoItem = ({
        icon: Icon,
        label,
        value,
        subValue,
        badge,
        className = ""
    }: {
        icon: any;
        label: string;
        value: string;
        subValue?: string;
        badge?: string;
        className?: string;
    }) => (
        <div className={`relative p-4 ${className}`}>
            {/* Icon with gradient background */}
            <div className="flex items-center gap-3 mb-2">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                        background: '#E0F2F1',
                        boxShadow: '0 2px 8px rgba(13, 115, 119, 0.1)'
                    }}
                >
                    <Icon size={18} className="text-[#0D7377]" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#546E7A]">
                    {label}
                </span>
            </div>

            {/* Value */}
            <div className="ml-12">
                <p className="text-[15px] font-semibold text-[#263238] truncate">{value}</p>
                {subValue && (
                    <p className="text-xs text-[#546E7A] mt-0.5 flex items-center gap-2">
                        {subValue}
                        {badge && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-[#0D7377] text-white text-[10px] font-bold rounded-full shadow-sm">
                                {badge}
                            </span>
                        )}
                    </p>
                )}
                {!subValue && badge && (
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[#0D7377] text-white text-[10px] font-bold rounded-full shadow-sm">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            <div className="grid grid-cols-2">
                {/* Location */}
                <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={location}
                    subValue={city || undefined}
                    className="border-r border-b border-[#ECEFF1]"
                />

                {/* Reported */}
                <InfoItem
                    icon={Clock}
                    label="Reported"
                    value={timeAgo}
                    subValue={formattedDate}
                    className="border-b border-[#ECEFF1]"
                />

                {/* Reporter */}
                <InfoItem
                    icon={User}
                    label="Reporter"
                    value={reporterName}
                    badge={isCurrentUser ? "YOU" : undefined}
                    className="border-r border-[#ECEFF1]"
                />

                {/* Assigned To */}
                <div className="relative p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${assignedAgent
                                ? ''
                                : 'bg-[#ECEFF1]'
                                }`}
                            style={assignedAgent ? {
                                background: '#E8F5E9',
                                boxShadow: '0 2px 8px rgba(50, 147, 111, 0.1)'
                            } : {}}
                        >
                            <UserCog size={18} className={assignedAgent ? "text-[#32936F]" : "text-[#B0BEC5]"} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-[#546E7A]">
                            Assigned To
                        </span>
                    </div>

                    <div className="ml-12">
                        {assignedAgent ? (
                            <>
                                <p className="text-[15px] font-semibold text-[#263238]">{assignedAgent.name}</p>
                                <p className="text-xs text-[#546E7A] mt-0.5 flex items-center gap-1">
                                    <Shield size={10} className="text-[#32936F]" />
                                    {assignedAgent.role}
                                </p>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#FFB347] animate-pulse" />
                                <p className="text-sm text-[#B0BEC5] italic">Awaiting assignment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
