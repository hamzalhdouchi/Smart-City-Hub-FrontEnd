import React from 'react';

interface BadgeProps {
    type: string;
    title: string;
    description: string;
    isLocked?: boolean;
    color?: string;
}

const CreativeIcon: React.FC<{ type: string; isLocked?: boolean }> = ({ type, isLocked }) => {
    if (isLocked) return <div className="text-2xl opacity-40">🔒</div>;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            {type === 'star' && (
                <div className="w-8 h-8 bg-white/30 rotate-45 relative">
                    <div className="absolute inset-2 bg-white rounded-full animate-pulse" />
                </div>
            )}
            {type === 'bolt' && (
                <div className="relative w-8 h-8">
                    <div className="absolute inset-0 bg-white/20 skew-x-12" />
                    <div className="absolute inset-1.5 bg-white skew-x-12 shadow-[0_0_10px_white]" />
                </div>
            )}
            {type === 'hero' && (
                <div className="w-8 h-8 rounded-full border-4 border-white/40 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                </div>
            )}
            {type === 'streak' && (
                <div className="w-8 h-8 rounded-full border-b-4 border-r-4 border-white/60 animate-spin" style={{ animationDuration: '3s' }} />
            )}
            {type === 'city' && (
                <div className="flex items-end gap-0.5 h-6">
                    <div className="w-1.5 bg-white/40 h-2" />
                    <div className="w-1.5 bg-white/60 h-4" />
                    <div className="w-1.5 bg-white/80 h-3" />
                </div>
            )}
        </div>
    );
};

const Badge: React.FC<BadgeProps> = ({ type, title, description, isLocked, color }) => (
    <div className={`flex-shrink-0 w-32 h-36 rounded-2xl p-3 flex flex-col items-center text-center justify-center transition-all ${isLocked
        ? 'bg-slate-50 opacity-60 grayscale'
        : `bg-gradient-to-br ${color || 'from-amber-400 to-orange-500'} shadow-lg shadow-orange-100 border-2 border-white/50`
        }`}>
        <div className="relative mb-2">
            <CreativeIcon type={type} isLocked={isLocked} />
            {!isLocked && (
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse" />
            )}
        </div>
        <h4 className={`text-[11px] font-black leading-tight mb-1 ${isLocked ? 'text-slate-400' : 'text-white'}`}>
            {title}
        </h4>
        <p className={`text-[8px] font-bold uppercase tracking-tighter ${isLocked ? 'text-slate-300' : 'text-white/80'}`}>
            {description}
        </p>
    </div>
);

export const AchievementBadges: React.FC = () => {
    const badges = [
        { type: 'star', title: 'First Resolver', description: 'Resolved 1st report', color: 'from-amber-400 to-orange-500' },
        { type: 'bolt', title: 'Fast Reporter', description: 'Quick submission', color: 'from-blue-400 to-indigo-500' },
        { type: 'hero', title: 'Community Hero', description: '10 valid reports', isLocked: true },
        { type: 'streak', title: 'Streak Master', description: '7 day activity', isLocked: true },
        { type: 'city', title: 'City Keeper', description: 'Pro contributor', isLocked: true },
    ];

    return (
        <div className="mb-8">
            <div className="px-5 mb-4 flex items-center justify-between">
                <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">Your Achievements</h3>
                <span className="text-[11px] font-black text-[#0D7377]">View All</span>
            </div>
            <div className="flex gap-4 px-5 overflow-x-auto no-scrollbar py-2">
                {badges.map((badge, idx) => (
                    <Badge key={idx} {...badge} />
                ))}
            </div>
        </div>
    );
};
