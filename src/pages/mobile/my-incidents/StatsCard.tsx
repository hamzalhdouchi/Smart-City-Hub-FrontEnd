import React from 'react';
import { BarChart3, Clock, CheckCircle2 } from 'lucide-react';

interface StatsProps {
    total: number;
    active: number;
    resolved: number;
    avgResponseDays?: number;
    resolutionRate?: number;
}

export const StatsCard: React.FC<{ stats: StatsProps }> = ({ stats }) => {
    return (
        <div className="stats-card-glass p-5 mx-4 -mt-10 relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-[#5E35B1]" size={20} />
                <h2 className="font-bold text-[#424242]">Your Impact</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="text-2xl font-bold text-orange-500 mb-1">{stats.active}</div>
                    <div className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Active</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
                    <div className="text-xs font-semibold text-green-500 uppercase tracking-wide">Resolved</div>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> Avg Response
                    </span>
                    <span className="font-semibold text-gray-700">{stats.avgResponseDays || 4} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Resolution Rate
                    </span>
                    <span className="font-semibold text-gray-700">{stats.resolutionRate || 98}%</span>
                </div>
            </div>
        </div>
    );
};
