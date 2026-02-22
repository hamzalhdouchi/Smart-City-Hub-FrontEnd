import React, { useRef, useState } from 'react';
import { Plus, X, Lightbulb, Upload, Image as ImageIcon } from 'lucide-react';
import { PhotoIcon } from '../../../../components/icons/WizardIcons';
import type { ReportWizardState } from '../types';

interface Step2PhotoUploadProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

export const Step2PhotoUpload: React.FC<Step2PhotoUploadProps> = ({ state, onUpdate, onNext }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalFiles = [...state.photos, ...newFiles].slice(0, 10);
            onUpdate({ photos: totalFiles });
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            const totalFiles = [...state.photos, ...newFiles].slice(0, 10);
            onUpdate({ photos: totalFiles });
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...state.photos];
        newPhotos.splice(index, 1);
        onUpdate({ photos: newPhotos });
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 lg:mb-8">

                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                        <PhotoIcon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-[#0D7377] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100/50 flex items-center gap-1.5 shadow-sm">
                        EVIDENCE
                    </span>
                </div>
                <h2 className="text-[28px] lg:text-[32px] font-black text-slate-800 mb-2">
                    Add photos of the issue
                </h2>
                <p className="text-slate-500 font-medium text-sm lg:text-base">
                    You can add up to <span className="font-bold text-teal-600">10 photos</span> to help us understand the problem better.
                </p>
            </div>

            {/* Desktop Drag & Drop Zone */}
            <div className="hidden lg:block mb-6">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${isDragging
                        ? 'border-teal-500 bg-teal-50 scale-[1.02]'
                        : state.photos.length > 0
                            ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            : 'border-teal-300 bg-teal-50/50 hover:bg-teal-50'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <Upload size={32} className={isDragging ? 'text-teal-500 animate-bounce' : 'text-teal-600'} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800 mb-1">
                                {isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}
                            </p>
                            <p className="text-sm text-slate-500">
                                or <span className="text-teal-600 font-semibold">click to browse</span> • {state.photos.length}/10 photos
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Upload Button - Only visible on mobile */}
            {state.photos.length < 10 && (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="lg:hidden w-full py-4 mb-6 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors"
                >
                    <Plus size={24} className="text-teal-500" />
                    <span className="text-sm font-bold text-teal-600">Add Photos ({state.photos.length}/10)</span>
                </button>
            )}

            {/* Photo Preview Grid */}
            {state.photos.length > 0 ? (
                <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                        Uploaded Photos ({state.photos.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {state.photos.map((file, index) => {
                            let photoUrl: string | null = null;
                            try {
                                if (file && typeof file === 'object') {
                                    photoUrl = URL.createObjectURL(file as Blob);
                                }
                            } catch (error) {
                                photoUrl = null;
                            }

                            return (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-lg transition-all bg-slate-50"
                                >
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={`Upload ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all"
                                        >
                                            <X size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                                        #{index + 1}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 lg:py-0">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <ImageIcon size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-400 font-medium">No photos uploaded yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add photos to better document the issue</p>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
            />

            {/* Tips */}
            <div className="bg-teal-50/50 rounded-2xl p-4 mt-auto mb-6 flex gap-3 border border-teal-100/50">
                <Lightbulb className="text-teal-500 shrink-0" size={20} />
                <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-bold text-teal-800">Tips for good photos:</p>
                    <ul className="text-[12px] text-teal-700 space-y-1">
                        <li>• Show the entire problem from multiple angles</li>
                        <li>• Include context (nearby landmarks, streets)</li>
                        <li>• Ensure good lighting for clarity</li>
                    </ul>
                </div>
            </div>

            {/* Validation Message */}
            {state.photos.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <ImageIcon className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-semibold text-amber-800">
                        At least one photo is required to continue
                    </p>
                </div>
            )}
            {/* Mobile Continue Button */}
            <button
                onClick={onNext}
                disabled={state.photos.length === 0}
                className={`lg:hidden mt-auto w-full py-4 font-black text-lg rounded-2xl shadow-lg transition-all ${state.photos.length > 0
                    ? 'bg-gradient-to-r from-[#0D7377] to-[#32936F] text-white shadow-teal-500/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
            >
                Continue
            </button>
        </div>
    );
};
