import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../common';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (photoUrl: string) => void;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
            setIsDragging(false);
            setIsUploading(false);
        }
    }, [isOpen]);
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPG, PNG, WebP)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        e.target.value = '';
    };

    const handleClose = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            const returnedUrl = await userService.uploadProfilePhoto(selectedFile);
            if (returnedUrl) {
                onUpload(returnedUrl);
            } else {
                const freshUrl = await userService.getMyProfilePhoto();
                onUpload(freshUrl ?? previewUrl!);
            }

            toast.success('Profile photo updated successfully!');
            handleClose();
        } catch (error: any) {
            console.error('Failed to upload photo:', error);
            const msg = error.response?.data?.message || 'Failed to upload profile photo';
            toast.error(msg);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#263238]">Upload Profile Photo</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-[#546E7A]" />
                    </button>
                </div>

                
                <div className="p-6">
                    {previewUrl ? (
                        <div className="flex flex-col items-center">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#0D7377] shadow-lg mb-6">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm font-medium text-[#263238] mb-1">{selectedFile?.name}</p>
                            <p className="text-xs text-[#78909C] mb-6">
                                {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                            </p>

                            <div className="flex gap-3 w-full">
                                <Button
                                    variant="outline"
                                    onClick={() => inputRef.current?.click()}
                                    className="flex-1"
                                    disabled={isUploading}
                                >
                                    Change
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    loading={isUploading}
                                    className="flex-1"
                                >
                                    Upload Photo
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                                isDragging
                                    ? 'border-[#0D7377] bg-[#E0F2F1]'
                                    : 'border-[#CFD8DC] hover:border-[#0D7377] hover:bg-gray-50'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <div className="w-16 h-16 bg-[#ECEFF1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#546E7A]">
                                <Upload size={32} />
                            </div>
                            <h3 className="font-semibold text-[#263238] mb-1">Click or drag image here</h3>
                            <p className="text-sm text-[#78909C]">Max 5MB • JPG, PNG, WebP</p>
                        </div>
                    )}

                    
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileInput}
                    />

                    <div className="mt-6 flex items-start gap-3 p-3 bg-[#E3F2FD] rounded-lg text-sm text-[#0277BD]">
                        <ImageIcon size={18} className="mt-0.5 flex-shrink-0" />
                        <p>Best results with square images. We support standard formats like JPG and PNG.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoUploadModal;
