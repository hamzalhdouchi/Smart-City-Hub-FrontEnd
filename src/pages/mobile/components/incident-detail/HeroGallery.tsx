import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Maximize2 } from 'lucide-react';
import type { IncidentStatus, Priority } from '../../../../services/incidentService';

interface HeroGalleryProps {
    photos: string[];
    status: IncidentStatus;
    priority: Priority;
    onPhotoClick?: (index: number) => void;
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({
    photos,
    status,
    priority,
    onPhotoClick
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const statusColors: Record<IncidentStatus, { bg: string; text: string; glow: string }> = {
        NEW: { bg: '#FFB347', text: 'New', glow: '#FFB347' },
        ASSIGNED: { bg: '#2196F3', text: 'Assigned', glow: '#2196F3' },
        IN_PROGRESS: { bg: '#0D7377', text: 'In Progress', glow: '#0D7377' },
        RESOLVED: { bg: '#32936F', text: 'Resolved', glow: '#32936F' },
        VALIDATED: { bg: '#4CAF50', text: 'Validated', glow: '#4CAF50' },
        REJECTED: { bg: '#F44336', text: 'Rejected', glow: '#F44336' },
        REOPENED: { bg: '#FF9800', text: 'Reopened', glow: '#FF9800' },
        CLOSED: { bg: '#546E7A', text: 'Closed', glow: '#546E7A' }
    };

    const priorityConfig: Record<Priority, { show: boolean; color: string; label: string }> = {
        HIGH: { show: true, color: '#F44336', label: '🔴 High Priority' },
        MEDIUM: { show: true, color: '#FFB347', label: '🟡 Medium' },
        LOW: { show: false, color: '#4CAF50', label: '' }
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            handleNext();
        }
        if (touchStart - touchEnd < -75) {
            handlePrevious();
        }
    };

    const currentPhoto = photos[currentIndex] || '/placeholder-incident.jpg';
    const statusConfig = statusColors[status];
    const priorityInfo = priorityConfig[priority];

    return (
        <div className="relative w-full overflow-hidden rounded-2xl lg:h-[400px]" style={{ aspectRatio: '16/10' }}>
            <div
                className="w-full h-full cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => onPhotoClick?.(currentIndex)}
            >
                {photos.length > 0 ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E0F7FA] to-[#B2DFDB] flex items-center justify-center">
                                <div className="w-10 h-10 border-3 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={currentPhoto}
                            alt={`Incident photo ${currentIndex + 1}`}
                            className="w-full h-full object-cover animate-subtle-zoom"
                            onLoad={() => setIsLoading(false)}
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-3">
                            <Camera size={32} className="text-[#0D7377]" />
                        </div>
                        <p className="text-[#546E7A] font-medium">No photos available</p>
                    </div>
                )}
            </div>

            {/* Gradient Overlays */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.5) 100%)'
                }}
            />

            {/* Status Badge - Top Left */}
            <div
                className="absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-2"
                style={{
                    background: statusConfig.bg,
                    boxShadow: `0 4px 15px ${statusConfig.glow}50`
                }}
            >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {statusConfig.text}
            </div>

            {/* Priority Badge - Top Right */}
            {priorityInfo.show && (
                <div
                    className="absolute top-4 right-4 px-3 py-2 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-md"
                    style={{
                        background: `${priorityInfo.color}E0`,
                        boxShadow: `0 4px 15px ${priorityInfo.color}40`
                    }}
                >
                    {priorityInfo.label}
                </div>
            )}

            {/* Photo Counter & Dots - Bottom Center */}
            {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-white text-xs font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {photos.length}
                    </span>
                    <div className="flex gap-1.5">
                        {photos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                    ? 'w-6 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen Button */}
            {photos.length > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPhotoClick?.(currentIndex);
                    }}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                    <Maximize2 size={18} />
                </button>
            )}

            {/* Navigation Arrows (Desktop) */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevious();
                        }}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all hidden md:flex shadow-lg"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all hidden md:flex shadow-lg"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            <style>{`
                @keyframes subtle-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.05); }
                }
                .animate-subtle-zoom {
                    animation: subtle-zoom 15s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};
