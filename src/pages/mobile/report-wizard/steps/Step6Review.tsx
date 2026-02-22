import React, { useState } from 'react';
import { Edit2, MapPin, Camera, ClipboardList, Rocket } from 'lucide-react';
import { ReviewIcon } from '../../../../components/icons/WizardIcons';
import { incidentService } from '../../../../services/incidentService';
import type { CreateIncidentRequest } from '../../../../services/incidentService';
import type { ReportWizardState, WizardStep } from '../types';

interface Step6ReviewProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onSubmit: () => void;
}

export const Step6Review: React.FC<Step6ReviewProps> = ({ state, onUpdate, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (step: number) => {
        onUpdate({ step: step as WizardStep });
    };

    const handleSubmit = async () => {
        if (!state.category || !state.location) return;

        setIsSubmitting(true);
        try {
            const request: CreateIncidentRequest = {
                title: state.title,
                description: state.description,
                latitude: state.location.latitude,
                longitude: state.location.longitude,
                address: state.location.address,
                categoryId: state.category,
                district: state.district || 'Downtown', // Fallback district
                urgencyLevel: state.urgencyLevel,
                visibility: state.visibility,
                priority: 'MEDIUM', // Default priority
            };

            await incidentService.createIncident(request, state.photos);
            onSubmit();
        } catch (error) {
            console.error("Failed to submit incident:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                        <ReviewIcon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-[#0D7377] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100/50 flex items-center gap-1.5 shadow-sm">
                        SUMMARY
                    </span>
                </div>
                <h2 className="text-[28px] lg:text-[32px] font-black text-slate-800 mb-2">
                    Review your report
                </h2>
                <p className="text-slate-500 font-medium text-sm lg:text-base">
                    Make sure everything is correct before sending.
                </p>
            </div>

            <div className="space-y-4 mb-12">
                {/* Category Card */}
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[12px] font-black text-slate-400 border-b border-slate-50 pb-1 uppercase tracking-widest">
                            <ClipboardList size={14} /> Category
                        </div>
                        <button onClick={() => handleEdit(1)} className="text-teal-600 font-bold text-[13px] flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏗️</span>
                        <span className="font-bold text-slate-800">{state.category}</span>
                    </div>
                </div>

                {/* Photos Card */}
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[12px] font-black text-slate-400 border-b border-slate-50 pb-1 uppercase tracking-widest">
                            <Camera size={14} /> Photos ({state.photos.length})
                        </div>
                        <button onClick={() => handleEdit(2)} className="text-teal-600 font-bold text-[13px] flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {state.photos.map((file, i) => {
                            let photoUrl: string | null = null;
                            try {
                                if (file && typeof file === 'object') {
                                    photoUrl = URL.createObjectURL(file as Blob);
                                }
                            } catch (error) {
                                photoUrl = null;
                            }
                            return photoUrl ? (
                                <img key={i} src={photoUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            ) : null;
                        })}
                        {state.photos.length === 0 && <span className="text-slate-400 text-sm font-medium italic">No photos added</span>}
                    </div>
                </div>

                {/* Location Card */}
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[12px] font-black text-slate-400 border-b border-slate-50 pb-1 uppercase tracking-widest">
                            <MapPin size={14} /> Location
                        </div>
                        <button onClick={() => handleEdit(3)} className="text-teal-600 font-bold text-[13px] flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    <p className="font-bold text-slate-800 text-[14px]">
                        {state.location?.address}
                    </p>
                </div>

                {/* Description Card */}
                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[12px] font-black text-slate-400 border-b border-slate-50 pb-1 uppercase tracking-widest">
                            <ClipboardList size={14} /> Description
                        </div>
                        <button onClick={() => handleEdit(4)} className="text-teal-600 font-bold text-[13px] flex items-center gap-1">
                            <Edit2 size={12} /> Edit
                        </button>
                    </div>
                    <p className="font-black text-slate-800 text-[15px] mb-1">{state.title}</p>
                    <p className="text-slate-600 text-[14px] line-clamp-2 leading-relaxed italic">{state.description || 'No detailed description provided.'}</p>
                </div>


            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`mt-auto w-full py-5 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${isSubmitting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#0D7377] to-[#32936F] text-white shadow-teal-500/30'
                    }`}
            >
                {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        Submit Report <Rocket size={24} />
                    </>
                )}
            </button>
        </div>
    );
};

export default Step6Review;
