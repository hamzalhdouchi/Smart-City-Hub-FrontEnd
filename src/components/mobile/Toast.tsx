import React from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';
import { theme } from '../../styles/theme';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast notification wrapper for react-hot-toast
 * Mobile-optimized positioning and styling
 */

export const ToastContainer: React.FC = () => {
    return (
        <Toaster
            position="bottom-center"
            toastOptions={{
                // Default options
                duration: 3000,

                // Mobile-specific positioning
                style: {
                    background: theme.colors.neutral.asphalt,
                    color: theme.colors.neutral.white,
                    fontSize: '14px',
                    fontFamily: theme.fonts.body,
                    borderRadius: theme.radius.md,
                    padding: '12px 16px',
                    minHeight: theme.components.touchTarget.min,
                    maxWidth: '90%',
                    bottom: '80px', // Above tab bar
                    boxShadow: theme.shadows.level2,
                },

                // Success toast
                success: {
                    duration: 3000,
                    icon: <CheckCircle size={20} color="#4CAF50" />,
                    style: {
                        background: theme.colors.neutral.asphalt,
                        opacity: 0.9,
                    },
                },

                // Error toast
                error: {
                    duration: 5000, // Longer for errors
                    icon: <XCircle size={20} color={theme.colors.accent.danger} />,
                    style: {
                        background: theme.colors.neutral.asphalt,
                        opacity: 0.9,
                    },
                },

                // Loading toast
                loading: {
                    duration: Infinity,
                    style: {
                        background: theme.colors.neutral.asphalt,
                        opacity: 0.9,
                    },
                },
            }}

            // Container style for positioning
            containerStyle={{
                bottom: 80, // Above bottom tab bar
                zIndex: theme.zIndex.toast,
            }}
        />
    );
};

/**
 * Toast notification helper functions
 */

export const toast = {
    success: (message: string, options?: any) => {
        return hotToast.success(message, {
            duration: 3000,
            ...options,
        });
    },

    error: (message: string, options?: any) => {
        return hotToast.error(message, {
            duration: 5000, // Longer for errors
            ...options,
        });
    },

    info: (message: string, options?: any) => {
        return hotToast(message, {
            icon: <Info size={20} color="#2196F3" />,
            duration: 4000,
            ...options,
        });
    },

    warning: (message: string, options?: any) => {
        return hotToast(message, {
            icon: <AlertTriangle size={20} color={theme.colors.accent.warning} />,
            duration: 5000,
            ...options,
        });
    },

    loading: (message: string, options?: any) => {
        return hotToast.loading(message, options);
    },

    dismiss: (toastId?: string) => {
        hotToast.dismiss(toastId);
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        },
        options?: any
    ) => {
        return hotToast.promise(promise, messages, {
            success: { duration: 3000 },
            error: { duration: 5000 },
            ...options,
        });
    },
};

export default toast;
