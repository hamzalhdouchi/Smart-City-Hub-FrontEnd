import React, { useState, useEffect } from 'react';
import {
    RefreshCcw, Sparkles, Activity, Zap,
    Route, Lightbulb, Droplets, Trash2,
    ShieldAlert, Leaf, Armchair,
    HelpCircle, Construction, AlertTriangle
} from 'lucide-react';
import { CategoryIcon } from '../../../../components/icons/WizardIcons';
import type { ReportWizardState } from '../types';
import { incidentService } from '../../../../services/incidentService';
import type { IncidentCategory } from '../../../../services/incidentService';

interface Step1CategoryProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

const COLOR_ACCENTS: Record<string, { color: string, bg: string, border: string, glow: string, text: string }> = {
    'VOIRIE': { color: '#0D7377', bg: 'from-teal-500/10 to-teal-500/5', border: 'border-teal-500/20', glow: 'shadow-teal-500/30', text: 'text-teal-700' },
    'ECLAIRAGE': { color: '#FFB347', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', glow: 'shadow-amber-500/30', text: 'text-amber-700' },
    'EAU': { color: '#2196F3', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', glow: 'shadow-blue-500/30', text: 'text-blue-700' },
    'DECHETS': { color: '#32936F', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/30', text: 'text-emerald-700' },
    'SECURITE': { color: '#F44336', bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', glow: 'shadow-red-500/30', text: 'text-red-700' },
    'VERT': { color: '#8BC34A', bg: 'from-lime-500/10 to-lime-500/5', border: 'border-lime-500/20', glow: 'shadow-lime-500/30', text: 'text-lime-700' },
    'MOBILIER': { color: '#795548', bg: 'from-brown-500/10 to-brown-500/5', border: 'border-brown-500/20', glow: 'shadow-brown-500/30', text: 'text-brown-700' },
    'SIGNAL': { color: '#FF5722', bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', glow: 'shadow-orange-500/30', text: 'text-orange-700' },
    'DEFAULT': { color: '#546E7A', bg: 'from-slate-500/10 to-slate-500/5', border: 'border-slate-500/20', glow: 'shadow-slate-500/30', text: 'text-slate-700' }
};

const ICON_MAP: Record<string, any> = {
    'VOIRIE': Route,
    'ROAD': Route,
    'ECLAIRAGE': Lightbulb,
    'LIGHT': Lightbulb,
    'EAU': Droplets,
    'WATER': Droplets,
    'DECHETS': Trash2,
    'WASTE': Trash2,
    'SECURITE': ShieldAlert,
    'SAFETY': ShieldAlert,
    'VERT': Leaf,
    'GREEN': Leaf,
    'MOBILIER': Armchair,
    'FURNITURE': Armchair,
    'SIGNAL': AlertTriangle,
    'INFRASTRUCTURE': Construction,
};

const getCategoryIcon = (name: string) => {
    const upper = name.toUpperCase();
    for (const [key, Icon] of Object.entries(ICON_MAP)) {
        if (upper.includes(key)) return Icon;
    }
    return HelpCircle;
};

const getAccent = (name: string) => {
    const upper = name.toUpperCase();
    for (const key of Object.keys(COLOR_ACCENTS)) {
        if (upper.includes(key)) return COLOR_ACCENTS[key];
    }
    return COLOR_ACCENTS.DEFAULT;
};



export const Step1Category: React.FC<Step1CategoryProps> = ({ state, onUpdate, onNext }) => {
    const [categories, setCategories] = useState<IncidentCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await incidentService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-700">
            {/* Creative Header Section */}
            <div className="relative mb-6 lg:mb-8 group">
                <div className="flex items-start justify-between">
                    <div className="relative z-10 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                                <CategoryIcon className="w-6 h-6" />
                            </div>
                            <span className="px-3 py-1 bg-teal-50 text-[#0D7377] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100/50 flex items-center gap-1.5 shadow-sm">
                                <Sparkles size={12} className="animate-pulse" />
                                Smart City Intelligence
                            </span>
                        </div>
                        <h2 className="text-[28px] lg:text-[32px] font-black leading-none text-slate-800 tracking-tight mb-2">
                            Identify the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Anomaly</span>
                        </h2>
                        <p className="text-slate-400 font-bold text-sm tracking-tight hidden lg:block">
                            Select the category that defines this incidence event.
                        </p>
                    </div>

                    <button
                        onClick={fetchCategories}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-teal-500 hover:bg-teal-50 active:rotate-180 transition-all duration-500 shadow-sm border border-slate-100"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Animated Scanning Line Decor */}
                <div className="absolute -bottom-2 lg:-bottom-4 left-0 w-20 lg:w-24 h-1 bg-gradient-to-r from-teal-500 to-transparent rounded-full opacity-30 animate-pulse" />
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-16">
                    <div className="relative">
                        <div className="w-16 h-16 border-[5px] border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity size={20} className="text-teal-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-5 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">
                        Synchronizing...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {categories.map((cat, idx) => {
                        const isSelected = state.category === cat.id;
                        const CategoryIcon = getCategoryIcon(cat.name);
                        const accent = getAccent(cat.name);

                        const renderVisual = () => {
                            if (cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/') || cat.icon.includes('.'))) {
                                return (
                                    <div className={`relative w-16 h-16 mb-3 flex items-center justify-center transition-all duration-500 ${isSelected ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} rounded-full blur-xl opacity-40 animate-pulse`} />
                                        <img src={cat.icon} alt="" className="w-12 h-12 object-contain relative z-10 drop-shadow-xl" />
                                    </div>
                                );
                            }
                            return (
                                <div className={`relative w-16 h-16 mb-3 flex items-center justify-center transition-all duration-500 ${isSelected ? 'scale-110 -translate-y-1' : 'group-hover:scale-110'}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} rounded-[18px] blur-lg opacity-60 animate-float`} style={{ animationDelay: `${idx * 0.15}s` }} />
                                    <div className={`w-12 h-12 rounded-[16px] bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-md relative z-10 transition-colors duration-300 ${isSelected ? 'bg-white/80' : ''}`}>
                                        <CategoryIcon
                                            size={24}
                                            strokeWidth={2.5}
                                            className={`transition-all duration-500 ${isSelected ? accent.text : 'text-slate-400 group-hover:text-slate-600'}`}
                                        />
                                    </div>
                                </div>
                            );
                        };

                        return (
                            <button
                                key={cat.id}
                                onClick={() => onUpdate({ category: cat.id })}
                                className={`group relative flex flex-col items-center justify-center p-5 rounded-[32px] border-2 transition-all duration-500 ${isSelected
                                    ? `border-[#0D7377] bg-white scale-[1.02] shadow-[0_15px_40px_rgba(13,115,119,0.12)] z-10`
                                    : 'border-transparent bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                {/* Selection Glow Line */}
                                {isSelected && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0D7377] rounded-b-full shadow-[0_2px_8px_rgba(13,115,119,0.3)]" />
                                )}

                                {renderVisual()}

                                <span className={`text-[14px] font-black text-center leading-tight tracking-tight transition-all duration-300 ${isSelected ? 'text-slate-900 scale-105' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                    {cat.name}
                                </span>

                                {/* Premium Status Indicator */}
                                {isSelected && (
                                    <div className="absolute top-5 right-5">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
                                        <div className="absolute inset-0 w-1.5 h-1.5 bg-teal-500 rounded-full" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Premium Sticky Footer Action - Mobile Only */}
            <div className="lg:hidden fixed bottom-24 left-0 right-0 pointer-events-none z-[60] flex justify-center px-6">
                {state.category && (
                    <div className="w-full max-w-md pointer-events-auto">
                        <button
                            onClick={onNext}
                            className="w-full py-5 group text-white font-bold text-lg rounded-[22px] shadow-2xl transition-all active:scale-[0.98] animate-in slide-in-from-bottom-10 duration-700 flex items-center justify-center gap-4 overflow-hidden relative border border-white/20" style={{ background: '#0D7377' }}
                        >
                            {/* Internal Animated Shine */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-teal-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                            <span className="relative z-10 flex items-center gap-3 tracking-[0.05em]">
                                INITIALIZE REPORT <Zap size={18} className="fill-white" />
                            </span>
                        </button>
                    </div>
                )}
            </div>


        </div>
    );
};

export default Step1Category;
