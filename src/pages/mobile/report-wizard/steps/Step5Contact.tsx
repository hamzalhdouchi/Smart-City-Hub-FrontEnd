import React from 'react';
import { Mail, Bell, MessageSquare, UserX } from 'lucide-react';
import type { ReportWizardState } from '../types';

interface Step5ContactProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

export const Step5Contact: React.FC<Step5ContactProps> = ({ state, onUpdate, onNext }) => {
    const togglePreference = (key: keyof typeof state.contactPreferences) => {
        onUpdate({
            contactPreferences: {
                ...state.contactPreferences,
                [key]: !state.contactPreferences[key as keyof typeof state.contactPreferences]
            }
        });
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-slate-800 mb-2">
                How should we contact you? 📞
            </h2>
            <p className="text-slate-500 mb-8 font-medium">
                Choose your preferred notification methods.
            </p>

            <div className="space-y-4 mb-8">
                {/* Email Option */}
                <button
                    onClick={() => togglePreference('email')}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${state.contactPreferences.email
                        ? 'border-teal-500 bg-teal-50 shadow-sm'
                        : 'border-slate-100 bg-white'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${state.contactPreferences.email ? 'bg-teal-100 text-teal-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                            <Mail size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[15px] font-bold text-slate-800">Email notifications</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enabled by default</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${state.contactPreferences.email ? 'bg-teal-500 border-teal-500' : 'border-slate-200'
                        }`}>
                        {state.contactPreferences.email && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                    </div>
                </button>

                {/* Push Option */}
                <button
                    onClick={() => togglePreference('push')}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${state.contactPreferences.push
                        ? 'border-teal-500 bg-teal-50 shadow-sm'
                        : 'border-slate-100 bg-white'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${state.contactPreferences.push ? 'bg-teal-100 text-teal-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                            <Bell size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[15px] font-bold text-slate-800">Push notifications</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real-time updates</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${state.contactPreferences.push ? 'bg-teal-500 border-teal-500' : 'border-slate-200'
                        }`}>
                        {state.contactPreferences.push && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                    </div>
                </button>

                {/* SMS Option */}
                <div className={`rounded-2xl border-2 transition-all overflow-hidden ${state.contactPreferences.sms
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : 'border-slate-100 bg-white'
                    }`}>
                    <button
                        onClick={() => togglePreference('sms')}
                        className="w-full flex items-center justify-between p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${state.contactPreferences.sms ? 'bg-teal-100 text-teal-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                <MessageSquare size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-[15px] font-bold text-slate-800">SMS updates</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile text alerts</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${state.contactPreferences.sms ? 'bg-teal-500 border-teal-500' : 'border-slate-200'
                            }`}>
                            {state.contactPreferences.sms && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </div>
                    </button>
                    {state.contactPreferences.sms && (
                        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="h-[1px] bg-teal-100 mb-4" />
                            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-teal-100 rounded-xl">
                                <span className="font-bold text-slate-400">+212</span>
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={state.contactPreferences.phone || ''}
                                    onChange={(e) => onUpdate({
                                        contactPreferences: { ...state.contactPreferences, phone: e.target.value }
                                    })}
                                    className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-4" />

                {/* Anonymous Option */}
                <button
                    onClick={() => onUpdate({ anonymous: !state.anonymous })}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${state.anonymous
                        ? 'border-slate-800 bg-slate-900 shadow-lg'
                        : 'border-slate-100 bg-white'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${state.anonymous ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'
                            }`}>
                            <UserX size={24} />
                        </div>
                        <div className="text-left">
                            <p className={`text-[15px] font-bold ${state.anonymous ? 'text-white' : 'text-slate-800'}`}>Keep me anonymous</p>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${state.anonymous ? 'text-slate-400' : 'text-slate-400'}`}>Your name won't be shown</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${state.anonymous ? 'bg-white border-white' : 'border-slate-200'
                        }`}>
                        {state.anonymous && (
                            <div className="w-2 h-2 bg-slate-900 rounded-full" />
                        )}
                    </div>
                </button>
            </div>

            <div className="mt-auto flex gap-4">
                <button
                    onClick={onNext}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold text-lg rounded-2xl hover:bg-slate-200 transition-colors"
                >
                    Skip
                </button>
                <button
                    onClick={onNext}
                    className="flex-[2] py-4 bg-gradient-to-r from-[#0D7377] to-[#32936F] text-white font-black text-lg rounded-2xl shadow-lg shadow-teal-500/30"
                >
                    Continue →
                </button>
            </div>
        </div>
    );
};

export default Step5Contact;
