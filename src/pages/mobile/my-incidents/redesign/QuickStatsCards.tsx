import React from 'react';

interface QuickStatsProps {
    active: number;
    resolved: number;
}

export const QuickStatsCards: React.FC<QuickStatsProps> = ({ active, resolved }) => {
    return (
        <div className="grid grid-cols-2 gap-4 px-6 -mt-10 relative z-30">
            {/* Active Card */}
            <div className="group relative bg-slate-900 border border-white/10 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden active:scale-95 transition-all duration-500">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-teal-500/30 transition-colors" />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                        <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active</p>
                        <h4 className="text-4xl font-black text-white leading-none">{active}</h4>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider leading-tight">Reports<br />in progress</p>
                        <div className="w-8 h-8 rounded-xl bg-teal-400/20 flex items-center justify-center border border-teal-400/20">
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Resolved Card */}
            <div className="group relative bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden active:scale-95 transition-all duration-500">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/20 transition-colors" />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fixed</p>
                        <h4 className="text-4xl font-black text-slate-900 leading-none">{resolved}</h4>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-slate-400 text-[9px] font-medium uppercase tracking-wider leading-tight">Issues<br />Resolved</p>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm rotate-45 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
