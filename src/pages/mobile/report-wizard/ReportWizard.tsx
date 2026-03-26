import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import type { ReportWizardState, WizardStep } from './types';
import { INITIAL_STATE } from './types';
import { CategoryIcon, PhotoIcon, LocationIcon, DescriptionIcon, ReviewIcon } from '../../../components/icons/WizardIcons';
import { incidentService } from '../../../services/incidentService';
import { toast } from 'react-hot-toast';

import Step1Category from './steps/Step1Category';
import { Step2PhotoUpload } from './steps/Step2PhotoUpload';
import Step3Location from './steps/Step3Location';
import Step4Description from './steps/Step4Description';
import Step6Review from './steps/Step6Review';

import { LivePreviewPanel } from './components/LivePreviewPanel';

const STEP_NAMES = [
    'Category',
    'Photos',
    'Location',
    'Description',
    'Review'
];

const STEP_ICONS = [CategoryIcon, PhotoIcon, LocationIcon, DescriptionIcon, ReviewIcon];

export const ReportWizard: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<ReportWizardState>(() => {
        const saved = localStorage.getItem('incident_report_draft');
        if (saved) {
            const parsed = JSON.parse(saved);

            return {
                ...INITIAL_STATE,
                ...parsed,
                completedSteps: parsed.completedSteps || []
            };
        }
        return INITIAL_STATE;
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        localStorage.setItem('incident_report_draft', JSON.stringify(state));
    }, [state]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const checkDuplicates = async (): Promise<boolean> => {
        if (!state.location || !state.category) return false;

        try {
            setIsChecking(true);
            const duplicates = await incidentService.getIncidents(undefined, state.category, 0, 50);

            const match = duplicates.content.find(i => {
                const dist = calculateDistance(
                    state.location!.latitude,
                    state.location!.longitude,
                    i.latitude,
                    i.longitude
                );
                const isActive = !['RESOLVED', 'REJECTED', 'CLOSED'].includes(i.status);
                return dist < 100 && isActive;
            });

            if (match) {
                toast.error(
                    "Duplicate Alert: An incident is already reported here!",
                    { icon: '⚠️', duration: 4000 }
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setIsChecking(false);
        }
    };

    const handleBack = () => {
        if (state.step === 1) {
            navigate(-1);
        } else {
            setState(prev => ({ ...prev, step: (prev.step - 1) as WizardStep }));
        }
    };

    const handleNext = async () => {
        if (state.step < 5) {

            if (state.step === 3) {
                const isDuplicate = await checkDuplicates();
                if (isDuplicate) return;
            }

            const newCompletedSteps = [...(state.completedSteps || [])];
            if (!newCompletedSteps.includes(state.step)) {
                newCompletedSteps.push(state.step);
            }
            setState(prev => ({
                ...prev,
                step: (prev.step + 1) as WizardStep,
                completedSteps: newCompletedSteps
            }));
        }
    };

    const canNavigateToStep = (targetStep: WizardStep): boolean => {

        if (targetStep <= state.step) return true;

        return false;
    };

    const updateState = (updates: Partial<ReportWizardState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        localStorage.removeItem('incident_report_draft');
    };

    const jumpToStep = (step: WizardStep) => {
        if (canNavigateToStep(step)) {
            setState(prev => ({ ...prev, step }));
        }
    };

    useEffect(() => {
        if (isSubmitted) {

            localStorage.removeItem('incident_report_draft');

            navigate('/my-incidents', {
                state: {
                    showSuccess: true,
                    message: 'Report submitted successfully! 🎉'
                }
            });
        }
    }, [isSubmitted, navigate]);

    if (isSubmitted) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 lg:bg-gradient-to-br flex flex-col lg:block">
            
            <header className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex gap-2 mb-1.5">
                            {[1, 2, 3, 4, 5, 6].map((it) => (
                                <div
                                    key={it}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${it < state.step ? 'w-4 bg-[#0D7377]' :
                                        it === state.step ? 'w-10 bg-[#0D7377]' :
                                            'w-2 bg-slate-100'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#0D7377' }}>Step {state.step}</span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Incident Report</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.setItem('incident_report_draft', JSON.stringify(state));
                    }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                >
                    <Save size={20} />
                </button>
            </header>

            
            <div className="hidden lg:grid lg:grid-cols-[280px_1fr_400px] gap-8 max-w-[1800px] mx-auto p-8 min-h-screen">
                
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={handleBack}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h3 className="font-black text-slate-800">Report Wizard</h3>
                                <p className="text-xs text-slate-400">Step {state.step} of 5</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {STEP_NAMES.map((name, idx) => {
                                const stepNum = (idx + 1) as WizardStep;
                                const isActive = state.step === stepNum;
                                const isCompleted = state.step > stepNum;
                                const canAccess = canNavigateToStep(stepNum);
                                const IconComponent = STEP_ICONS[idx];

                                return (
                                    <button
                                        key={stepNum}
                                        onClick={() => jumpToStep(stepNum)}
                                        disabled={!canAccess}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-[#0D7377] text-white shadow-lg scale-105'
                                            : isCompleted
                                                ? 'bg-teal-50 text-[#0D7377] hover:bg-teal-100 cursor-pointer'
                                                : canAccess
                                                    ? 'bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer'
                                                    : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <div className="shrink-0">
                                            {isCompleted ? (
                                                <CheckCircle size={20} style={{ color: '#0D7377' }} />
                                            ) : (
                                                <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-300'}`} style={canAccess && !isActive ? { color: '#0D7377' } : undefined} />
                                            )}
                                        </div>
                                        <span className="font-semibold text-sm">{name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    
                    <button
                        onClick={() => {
                            localStorage.setItem('incident_report_draft', JSON.stringify(state));
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-teal-300 hover:text-teal-600 transition-all shadow-sm"
                    >
                        <Save size={18} />
                        <span className="font-semibold text-sm">Save Draft</span>
                    </button>
                </div>

                
                <div className="flex flex-col">
                    
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-2xl font-black text-slate-800">
                                {STEP_NAMES[state.step - 1]}
                            </h2>
                            <span className="text-sm font-bold" style={{ color: '#0D7377' }}>
                                {Math.round((state.step / 5) * 100)}% Complete
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((it) => (
                                <div
                                    key={it}
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${it <= state.step
                                        ? 'bg-[#0D7377]'
                                        : 'bg-slate-100'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    
                    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 overflow-y-auto">
                        {state.step === 1 && (
                            <Step1Category state={state} onUpdate={updateState} onNext={handleNext} />
                        )}
                        {state.step === 2 && (
                            <Step2PhotoUpload state={state} onUpdate={updateState} onNext={handleNext} />
                        )}
                        {state.step === 3 && (
                            <Step3Location state={state} onUpdate={updateState} onNext={handleNext} />
                        )}
                        {state.step === 4 && (
                            <Step4Description state={state} onUpdate={updateState} onNext={handleNext} />
                        )}
                        {state.step === 5 && (
                            <Step6Review state={state} onUpdate={updateState} onSubmit={handleSubmit} />
                        )}
                    </div>

                    
                    <div className="flex gap-4 mt-6">
                        {state.step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
                            >
                                <ArrowLeft size={18} />
                                Previous
                            </button>
                        )}
                        {state.step < 5 && (
                            <button
                                onClick={handleNext}
                                disabled={(state.step === 2 && state.photos.length === 0) || isChecking}
                                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${state.step === 2 && state.photos.length === 0
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#0D7377] text-white hover:bg-[#0b6569] hover:shadow-lg'
                                    } ${isChecking ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isChecking ? (
                                    <>Checking...</>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                
                <LivePreviewPanel state={state} />
            </div>

            
            <main className="lg:hidden flex-1 overflow-y-auto px-5 py-8">
                {state.step === 1 && (
                    <Step1Category state={state} onUpdate={updateState} onNext={handleNext} />
                )}
                {state.step === 2 && (
                    <Step2PhotoUpload state={state} onUpdate={updateState} onNext={handleNext} />
                )}
                {state.step === 3 && (
                    <Step3Location state={state} onUpdate={updateState} onNext={handleNext} />
                )}
                {state.step === 4 && (
                    <Step4Description state={state} onUpdate={updateState} onNext={handleNext} />
                )}
                {state.step === 5 && (
                    <Step6Review state={state} onUpdate={updateState} onSubmit={handleSubmit} />
                )}
            </main>
        </div>
    );
};

export default ReportWizard;
