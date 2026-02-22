import React, { useEffect } from 'react';
import { theme } from '../../styles/theme';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    height?: 'peek' | 'half' | 'full';
    showHandle?: boolean;
    className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    title,
    children,
    height = 'half',
    showHandle = true,
    className = '',
}) => {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const getHeightClass = () => {
        switch (height) {
            case 'peek':
                return 'h-[80px]';
            case 'half':
                return 'h-[50vh]';
            case 'full':
                return 'h-[90vh]';
            default:
                return 'h-[50vh]';
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                style={{ zIndex: theme.zIndex.modalBackdrop }}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white overflow-hidden transition-transform duration-300 ease-out ${getHeightClass()} ${className}`}
                style={{
                    borderTopLeftRadius: theme.radius.xl,
                    borderTopRightRadius: theme.radius.xl,
                    boxShadow: theme.shadows.level4,
                    zIndex: theme.zIndex.modal,
                }}
            >
                {/* Handle Bar */}
                {showHandle && (
                    <div className="flex justify-center pt-3 pb-2">
                        <div
                            className="rounded-full bg-gray-300"
                            style={{
                                width: theme.components.bottomSheet.handleWidth,
                                height: theme.components.bottomSheet.handleHeight,
                            }}
                        />
                    </div>
                )}

                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <h3
                            className="text-lg font-semibold"
                            style={{
                                color: theme.colors.neutral.asphalt,
                                fontFamily: theme.fonts.heading,
                            }}
                        >
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} style={{ color: theme.colors.neutral.steel }} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto h-full pb-6">
                    {children}
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
