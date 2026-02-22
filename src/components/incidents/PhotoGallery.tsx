import React, { useState } from 'react';
import { Camera, ZoomIn, Download, X, ChevronLeft, ChevronRight, User, Clock } from 'lucide-react';
import type { IncidentPhoto } from '../../services/incidentService';

interface PhotoGalleryProps {
    photos: IncidentPhoto[];
    onPhotoClick?: (index: number) => void;
}

interface PhotoLightboxProps {
    photos: IncidentPhoto[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
    photos,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}) => {
    const photo = photos[currentIndex];

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
    }, [onClose, onPrev, onNext]);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = photo.url || photo.fileUrl;
        link.download = photo.fileName || 'photo';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
            >
                <X size={24} />
            </button>

            {/* Download button */}
            <button
                onClick={handleDownload}
                className="absolute top-4 right-16 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
            >
                <Download size={24} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {photos.length}
            </div>

            {/* Navigation arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        disabled={currentIndex === 0}
                        className="absolute left-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentIndex === photos.length - 1}
                        className="absolute right-4 p-3 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Main image */}
            <div className="max-w-[90vw] max-h-[85vh] relative">
                <img
                    src={photo.url || photo.fileUrl}
                    alt={photo.fileName}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />

                {/* Photo info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <p className="text-white font-medium">{photo.fileName}</p>
                    <div className="flex items-center gap-4 text-white/70 text-sm mt-1">
                        <span className="flex items-center gap-1">
                            <User size={14} />
                            {photo.uploadedByName || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDate(photo.createdAt || photo.uploadedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const handleImageLoad = (photoId: string) => {
        setLoadedImages(prev => new Set(prev).add(photoId));
    };

    const handleImageError = (photoId: string) => {
        setFailedImages(prev => new Set(prev).add(photoId));
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const goToPrev = () => {
        if (lightboxIndex !== null && lightboxIndex > 0) {
            setLightboxIndex(lightboxIndex - 1);
        }
    };

    const goToNext = () => {
        if (lightboxIndex !== null && lightboxIndex < photos.length - 1) {
            setLightboxIndex(lightboxIndex + 1);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (!photos || photos.length === 0) {
        return (
            <div className="text-center py-8 bg-[#ECEFF1]/50 rounded-lg">
                <Camera size={48} className="mx-auto mb-3 text-[#B0BEC5]" />
                <p className="text-[#546E7A]">No photos attached</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-[#ECEFF1] cursor-pointer group"
                        onClick={() => openLightbox(index)}
                    >
                        {/* Skeleton loader */}
                        {!loadedImages.has(photo.id) && !failedImages.has(photo.id) && (
                            <div className="absolute inset-0 bg-[#ECEFF1] animate-pulse flex items-center justify-center">
                                <Camera size={32} className="text-[#B0BEC5]" />
                            </div>
                        )}

                        {/* Error state */}
                        {failedImages.has(photo.id) && (
                            <div className="absolute inset-0 bg-[#ECEFF1] flex flex-col items-center justify-center">
                                <Camera size={32} className="text-[#B0BEC5] mb-2" />
                                <span className="text-xs text-[#546E7A]">Failed to load</span>
                            </div>
                        )}

                        {/* Actual image */}
                        <img
                            src={photo.url || photo.fileUrl}
                            alt={photo.fileName}
                            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${loadedImages.has(photo.id) ? '' : 'opacity-0'
                                }`}
                            onLoad={() => handleImageLoad(photo.id)}
                            onError={() => handleImageError(photo.id)}
                            loading="lazy"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <ZoomIn
                                size={32}
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </div>

                        {/* Photo info on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs truncate">{photo.fileName}</p>
                            {photo.fileSize && (
                                <p className="text-white/70 text-xs">{formatFileSize(photo.fileSize)}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={photos}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={goToPrev}
                    onNext={goToNext}
                />
            )}
        </>
    );
};

export default PhotoGallery;
