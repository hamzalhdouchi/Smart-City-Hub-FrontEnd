import React from 'react';
import { MapPin, Calendar, AlertCircle, Eye, EyeOff, User, ImageIcon } from 'lucide-react';
import type { ReportWizardState } from '../types';

interface LivePreviewPanelProps {
    state: ReportWizardState;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ state }) => {
    const getUrgencyColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="hidden lg:block sticky top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4" style={{ background: '#0D7377' }}>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Eye size={20} />
                        Live Preview
                    </h3>
                    <p className="text-teal-100 text-sm mt-1">See how your report will look</p>
                </div>

                {/* Preview Content */}
                <div className="p-6 space-y-4">
                    {/* Category Badge */}
                    {state.category ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-200">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                            Category Selected
                        </div>
                    ) : (
                        <div className="text-slate-400 text-sm italic">No category selected yet...</div>
                    )}

                    {/* Photos Preview */}
                    {state.photos.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Photos ({state.photos.length})</p>
                            <div className="grid grid-cols-3 gap-2">
                                {state.photos.slice(0, 6).map((photo, idx) => {
                                    // Safely try to create object URL
                                    let photoUrl: string | null = null;
                                    try {
                                        if (photo && typeof photo === 'object') {
                                            photoUrl = URL.createObjectURL(photo as Blob);
                                        }
                                    } catch (error) {
                                        // Photo is not a valid Blob/File (e.g., from localStorage)
                                        photoUrl = null;
                                    }

                                    return (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                            {photoUrl ? (
                                                <img
                                                    src={photoUrl}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon size={20} className="text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {state.photos.length > 6 && (
                                    <div className="aspect-square rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                                        <span className="text-slate-600 font-bold">+{state.photos.length - 6}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {state.location && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</p>
                            <div className="flex items-start gap-2 text-sm text-slate-700">
                                <MapPin size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{state.location.address || 'Location selected'}</span>
                            </div>
                            {state.district && (
                                <div className="text-xs text-slate-500 pl-6">District: {state.district}</div>
                            )}
                        </div>
                    )}

                    {/* Title & Description */}
                    {(state.title || state.description) && (
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                            {state.title && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Title</p>
                                    <h4 className="font-bold text-slate-800 line-clamp-2">{state.title}</h4>
                                </div>
                            )}
                            {state.description && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Description</p>
                                    <p className="text-sm text-slate-600 line-clamp-4">{state.description}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Urgency & Visibility */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(state.urgencyLevel)}`}>
                            <AlertCircle size={14} />
                            {state.urgencyLevel}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {state.visibility === 'PUBLIC' ? <Eye size={14} /> : <EyeOff size={14} />}
                            {state.visibility}
                        </div>
                        {state.anonymous && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                                <User size={14} />
                                Anonymous
                            </div>
                        )}
                    </div>

                    {/* Timestamp Simulation */}
                    <div className="pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={14} />
                            <span>Will be submitted now</span>
                        </div>
                    </div>

                    {/* Empty State */}
                    {!state.category && state.photos.length === 0 && !state.location && !state.title && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Eye size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Start filling the form</p>
                            <p className="text-slate-400 text-xs mt-1">Your report preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Completion</span>
                    <span className="text-sm font-bold" style={{ color: '#0D7377' }}>
                        {Math.round((state.step / 5) * 100)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{ background: '#0D7377', width: `${(state.step / 5) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LivePreviewPanel;
