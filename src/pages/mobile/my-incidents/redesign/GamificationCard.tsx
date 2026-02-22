import { ChevronRight } from 'lucide-react';

export const GamificationCard: React.FC = () => {
    return (
        <div className="mx-4 mb-8 bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-teal-100 flex flex-col relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50" />

            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    {/* Creative Citizen Crest (No Emoji) */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0D7377] to-[#32936F] rounded-2xl rotate-45 shadow-lg shadow-teal-100/50" />
                        <div className="absolute inset-1.5 border-2 border-white/20 rounded-xl rotate-45" />
                        <div className="relative z-10 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <div className="w-2.5 h-2.5 bg-[#0D7377] rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-lg leading-none">Citizen Level 3</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Active Contributor</p>
                    </div>
                </div>
                <button className="text-[11px] font-black text-[#0D7377] uppercase tracking-widest flex items-center gap-0.5 hover:opacity-70">
                    View Rank <ChevronRight size={14} strokeWidth={3} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-500">Progress to Level 4</span>
                    <span className="text-[13px] font-black text-[#0D7377]">320 / 500 XP</span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-[#0D7377] to-[#32936F] rounded-full pulse-fill shadow-[0_0_10px_rgba(13,115,119,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: '64%' }}
                    />
                </div>

                <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-100/50 flex items-center gap-3">
                    {/* Creative Target Shape (No Emoji) */}
                    <div className="w-8 h-8 rounded-lg bg-white border border-teal-100 flex items-center justify-center shadow-sm shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-teal-200 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-[#0D7377] rounded-full" />
                        </div>
                    </div>
                    <p className="text-[11px] text-[#0D7377] font-bold leading-tight">
                        Report <span className="text-[#32936F]">3 more incidents</span> this week to reach <span className="text-[#053B3E]">Level 4</span>!
                    </p>
                </div>
            </div>
        </div>
    );
};
