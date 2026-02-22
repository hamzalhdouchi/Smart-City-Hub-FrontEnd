import React from 'react';

interface MiniStatsCarouselProps {
    totalReports: number;
    resolutionRate: number;   // 0-100
    thisMonth: number;
    avgResponseDays: number | null;
}

export const MiniStatsCarousel: React.FC<MiniStatsCarouselProps> = ({
    totalReports,
    resolutionRate,
    thisMonth,
    avgResponseDays,
}) => {
    const miniStats = [
        {
            label: 'Avg Response',
            value: avgResponseDays !== null ? `${avgResponseDays}d` : 'N/A',
            icon: 0,
        },
        {
            label: 'Resolution Rate',
            value: `${resolutionRate}%`,
            icon: 1,
        },
        {
            label: 'This Month',
            value: `${thisMonth} report${thisMonth !== 1 ? 's' : ''}`,
            icon: 2,
        },
        {
            label: 'Total Reports',
            value: `${totalReports}`,
            icon: 3,
        },
    ];

    return (
        <>
            <style>{`
                .carousel-no-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .carousel-no-scroll::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `}</style>
            <div className="flex gap-3 px-4 py-6 overflow-x-auto carousel-no-scroll">
                {miniStats.map((stat, idx) => (
                    <div key={idx} className="flex-shrink-0 w-[110px] bg-white rounded-xl border border-slate-100 p-3 shadow-sm flex flex-col items-center text-center">
                        <div className="w-8 h-8 mb-2 flex items-center justify-center">
                            {stat.icon === 0 && (
                                <div className="w-5 h-5 rounded-full border-2 border-teal-200 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                                </div>
                            )}
                            {stat.icon === 1 && (
                                <div className="flex items-end gap-0.5 h-4 w-6">
                                    <div className="w-1 bg-teal-100 h-2 rounded-full" />
                                    <div className="w-1 bg-teal-300 h-3 rounded-full" />
                                    <div className="w-1 bg-teal-500 h-4 rounded-full" />
                                </div>
                            )}
                            {stat.icon === 2 && (
                                <div className="w-5 h-5 rotate-45 border-2 border-teal-400 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-teal-600" />
                                </div>
                            )}
                            {stat.icon === 3 && (
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-teal-100 rounded-full opacity-50" />
                                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-ping" />
                                    <div className="absolute w-1.5 h-1.5 bg-teal-700 rounded-full" />
                                </div>
                            )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</span>
                        <span className="text-[12px] font-black text-slate-700">{stat.value}</span>
                    </div>
                ))}
            </div>
        </>
    );
};
