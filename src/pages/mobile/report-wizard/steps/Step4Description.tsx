import React from 'react';
import { Lightbulb, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { DescriptionIcon } from '../../../../components/icons/WizardIcons';
import type { ReportWizardState } from '../types';

interface Step4DescriptionProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

const URGENCY_LEVELS = [
    { value: 'LOW' as const, label: 'Low', color: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200', icon: '🟢' },
    { value: 'MEDIUM' as const, label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200', icon: '🟡' },
    { value: 'HIGH' as const, label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200', icon: '🟠' },
    { value: 'CRITICAL' as const, label: 'Critical', color: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200', icon: '🔴' },
];

export const Step4Description: React.FC<Step4DescriptionProps> = ({ state, onUpdate, onNext }) => {
    const isTitleValid = state.title.trim().length >= 10;
    const isDescriptionValid = state.description.trim().length >= 20;
    const charCount = state.description.length;
    const isValid = isTitleValid && isDescriptionValid;

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                        <DescriptionIcon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-[#0D7377] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100/50 flex items-center gap-1.5 shadow-sm">
                        DETAILS
                    </span>
                </div>
                <h2 className="text-[28px] lg:text-[32px] font-black text-slate-800 mb-2">
                    Describe the issue
                </h2>
                <p className="text-slate-500 font-medium text-sm lg:text-base">
                    Give us a few more details about what's happening.
                </p>
            </div>

            <div className="space-y-6 mb-6">
                {/* Title Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        Title <span className="text-red-500">*</span>
                        <span className="text-[11px] font-bold text-slate-400 normal-case tracking-normal">(Min. 10 characters)</span>
                    </label>
                    <input
                        type="text"
                        value={state.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        placeholder="e.g., Broken street light on Avenue Hassan II"
                        className={`w-full px-5 py-4 bg-white border-2 rounded-xl lg:rounded-2xl font-semibold text-slate-700 placeholder:text-slate-300 focus:ring-4 outline-none transition-all ${state.title && !isTitleValid
                            ? 'border-red-200 focus:ring-red-500/10 focus:border-red-400'
                            : 'border-slate-200 focus:ring-teal-500/10 focus:border-teal-500'
                            }`}
                    />
                    {state.title && !isTitleValid && (
                        <p className="text-[11px] font-bold text-red-500 px-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Title must be at least 10 characters long
                        </p>
                    )}
                    {isTitleValid && (
                        <p className="text-[11px] font-bold text-green-600 px-1">✓ Title looks good!</p>
                    )}
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        Description <span className="text-red-500">*</span>
                        <span className="text-[11px] font-bold text-slate-400 normal-case tracking-normal">(Min. 20 characters)</span>
                    </label>
                    <div className="relative">
                        <textarea
                            value={state.description}
                            onChange={(e) => onUpdate({ description: e.target.value.slice(0, 500) })}
                            placeholder="Provide more details here...&#10;- When did you notice it?&#10;- Is it getting worse?&#10;- Any safety concerns?"
                            className={`w-full px-5 py-4 bg-white border-2 rounded-xl lg:rounded-2xl font-medium text-slate-600 placeholder:text-slate-300 focus:ring-4 outline-none transition-all min-h-[160px] lg:min-h-[200px] resize-none ${state.description && !isDescriptionValid
                                ? 'border-red-200 focus:ring-red-500/10 focus:border-red-400'
                                : 'border-slate-200 focus:ring-teal-500/10 focus:border-teal-500'
                                }`}
                        />
                        <div className={`absolute bottom-4 right-4 text-[11px] font-black tracking-wider transition-colors ${charCount >= 450 ? 'text-orange-500' :
                            charCount >= 500 ? 'text-red-500' :
                                'text-slate-300'
                            }`}>
                            {charCount}/500
                        </div>
                    </div>
                    {state.description && !isDescriptionValid && (
                        <p className="text-[11px] font-bold text-red-500 px-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Description must be at least 20 characters long
                        </p>
                    )}
                    {isDescriptionValid && (
                        <p className="text-[11px] font-bold text-green-600 px-1">✓ Description looks complete!</p>
                    )}
                </div>

                {/* Urgency Level */}
                <div className="flex flex-col gap-3">
                    <label className="text-[14px] font-black text-slate-700 uppercase tracking-wider">
                        Urgency Level
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {URGENCY_LEVELS.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => onUpdate({ urgencyLevel: level.value })}
                                className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${state.urgencyLevel === level.value
                                    ? `${level.color} scale-105 shadow-lg`
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                    }`}
                            >
                                <span className="mr-1">{level.icon}</span>
                                {level.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex flex-col gap-3">
                    <label className="text-[14px] font-black text-slate-700 uppercase tracking-wider">
                        Visibility
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onUpdate({ visibility: 'PUBLIC' })}
                            className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${state.visibility === 'PUBLIC'
                                ? 'bg-teal-100 text-teal-700 border-teal-300 scale-105 shadow-lg'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                        >
                            <Eye size={18} />
                            Public
                        </button>
                        <button
                            onClick={() => onUpdate({ visibility: 'PRIVATE' })}
                            className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${state.visibility === 'PRIVATE'
                                ? 'bg-slate-100 text-slate-700 border-slate-400 scale-105 shadow-lg'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                        >
                            <EyeOff size={18} />
                            Private
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 px-1">
                        {state.visibility === 'PUBLIC'
                            ? '✓ Report will be visible to everyone'
                            : '✓ Report will only be visible to administrators'}
                    </p>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-teal-50/50 rounded-2xl p-4 mb-6 flex gap-3 border border-teal-100/50">
                <Lightbulb className="text-teal-500 shrink-0" size={20} />
                <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-bold text-teal-800">Good descriptions include:</p>
                    <ul className="text-[12px] text-teal-700 space-y-1">
                        <li>• What's broken or wrong</li>
                        <li>• When you noticed it</li>
                        <li>• Any immediate dangers</li>
                    </ul>
                </div>
            </div>

            {/* Mobile Continue Button */}
            <button
                onClick={onNext}
                disabled={!isValid}
                className={`lg:hidden mt-auto w-full py-4 font-black text-lg rounded-2xl shadow-lg transition-all ${isValid
                    ? 'bg-gradient-to-r from-[#0D7377] to-[#32936F] text-white shadow-teal-500/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
            >
                Continue →
            </button>
        </div>
    );
};

export default Step4Description;
