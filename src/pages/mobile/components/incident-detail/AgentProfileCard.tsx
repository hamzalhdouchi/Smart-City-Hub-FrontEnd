import React from 'react';
import { UserCog, Shield, Clock, MessageCircle, Sparkles } from 'lucide-react';

interface AgentProfileCardProps {
    agent?: {
        id: string;
        name: string;
        role: string;
        avatarUrl?: string;
        latestUpdate?: {
            message: string;
            timestamp: Date;
        };
    };
}

export const AgentProfileCard: React.FC<AgentProfileCardProps> = ({ agent }) => {
    if (!agent) {
        return (
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: '#ECEFF1',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4">
                        <UserCog size={28} className="text-[#B0BEC5]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#546E7A] mb-1">Not Yet Assigned</h3>
                    <p className="text-sm text-[#B0BEC5]">An agent will be assigned soon</p>

                    <div className="mt-4 flex justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FFB347] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#FFB347] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#FFB347] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        );
    }

    const initials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase();

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
                className="p-5 pb-6"
                style={{
                    background: '#E0F2F1'
                }}
            >
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {agent.avatarUrl ? (
                        <img
                            src={agent.avatarUrl}
                            alt={agent.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold ring-4 ring-white shadow-lg"
                            style={{
                                background: '#0D7377'
                            }}
                        >
                            {initials}
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-[#263238]">{agent.name}</h3>
                            <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                                style={{ background: '#4CAF50' }}
                            >
                                <Shield size={10} />
                                Verified
                            </span>
                        </div>
                        <p className="text-sm text-[#546E7A] flex items-center gap-1.5">
                            <UserCog size={14} className="text-[#0D7377]" />
                            {agent.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Latest Update */}
            {agent.latestUpdate && (
                <div className="px-5 pb-5">
                    <div
                        className="p-4 rounded-xl"
                        style={{
                            background: '#E8F5E9'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle size={14} className="text-[#0D7377]" />
                            <span className="text-xs font-bold uppercase text-[#0D7377]">Latest Update</span>
                        </div>
                        <p className="text-sm text-[#263238] italic">"{agent.latestUpdate.message}"</p>
                        <p className="text-xs text-[#546E7A] mt-2 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(agent.latestUpdate.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};
