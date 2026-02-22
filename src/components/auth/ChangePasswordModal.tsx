import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Key, Lock, Check, X, ShieldAlert } from 'lucide-react';
import { Button, Input, Card } from '../common';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordModalProps {
    forced?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ forced = false }) => {
    const { setMustChangePassword, checkAuth, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Check if forced from navigation state
    const isForced = forced || (location.state as any)?.forced === true;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const newPassword = watch('newPassword', '');
    const confirmPassword = watch('confirmPassword', '');

    useEffect(() => {
        let strength = 0;
        if (newPassword.length >= 8) strength += 20;
        if (/[A-Z]/.test(newPassword)) strength += 20;
        if (/[a-z]/.test(newPassword)) strength += 20;
        if (/[0-9]/.test(newPassword)) strength += 20;
        if (/[^A-Za-z0-9]/.test(newPassword)) strength += 20;
        setPasswordStrength(strength);
    }, [newPassword]);

    const getStrengthLabel = () => {
        if (passwordStrength <= 20) return { label: 'Weak', color: '#F44336' };
        if (passwordStrength <= 40) return { label: 'Fair', color: '#FF9800' };
        if (passwordStrength <= 60) return { label: 'Good', color: '#FFB347' };
        if (passwordStrength <= 80) return { label: 'Strong', color: '#32936F' };
        return { label: 'Very Strong', color: '#4CAF50' };
    };

    const requirements = [
        { met: newPassword.length >= 8, label: '8+ characters' },
        { met: /[A-Z]/.test(newPassword), label: 'Uppercase letter (A-Z)' },
        { met: /[a-z]/.test(newPassword), label: 'Lowercase letter (a-z)' },
        { met: /[0-9]/.test(newPassword), label: 'Number (0-9)' },
        { met: /[^A-Za-z0-9]/.test(newPassword), label: 'Special character (!@#$%^&*)' },
    ];

    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

    const onSubmit = async (data: PasswordFormData) => {
        try {
            const response = await authService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            // Store new tokens
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            toast.success('Password changed successfully!');
            setMustChangePassword(false);
            await checkAuth();

            // Redirect after short delay
            setTimeout(() => {
                if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERVISOR') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            }, 1000);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update password';
            toast.error(message);
        }
    };

    const strengthInfo = getStrengthLabel();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#053B3E] to-[#263238] pattern-circuit"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-md mx-4"
            >
                {/* Forced Warning Banner */}
                {isForced && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-[#FFB347] rounded-lg flex items-center gap-3 shadow-lg"
                    >
                        <ShieldAlert size={24} className="text-[#263238] flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-[#263238] text-sm">Security Required</p>
                            <p className="text-[#263238]/80 text-xs">
                                You must change your temporary password before accessing the dashboard.
                            </p>
                        </div>
                    </motion.div>
                )}

                <Card className="w-full" padding="lg" accentBorder="left">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#0D7377]/20 flex items-center justify-center">
                            <Key size={24} className="text-[#0D7377]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#0D7377] font-['Noto_Sans_JP']">
                                {isForced ? 'Create Your Password' : 'Update Password'}
                            </h2>
                            <p className="text-sm text-[#546E7A]">
                                {isForced ? 'Set a secure password to continue' : 'Enter your current and new password'}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Current Temporary Password"
                            type="password"
                            placeholder="Enter temporary password"
                            icon={<Lock size={18} />}
                            error={errors.currentPassword?.message}
                            {...register('currentPassword')}
                        />

                        <div>
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Create new password"
                                icon={<Lock size={18} />}
                                error={errors.newPassword?.message}
                                {...register('newPassword')}
                            />

                            {newPassword && (
                                <div className="mt-3">
                                    {/* Strength meter */}
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-[#546E7A]">Password Strength</span>
                                        <span
                                            className="text-xs font-medium"
                                            style={{ color: strengthInfo.color }}
                                        >
                                            {strengthInfo.label}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[#B0BEC5] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${passwordStrength}%` }}
                                            className="h-full rounded-full transition-colors duration-300"
                                            style={{ backgroundColor: strengthInfo.color }}
                                        />
                                    </div>

                                    {/* Requirements checklist */}
                                    <div className="grid grid-cols-1 gap-1.5 mt-3">
                                        {requirements.map((req, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                {req.met ? (
                                                    <Check size={14} className="text-[#4CAF50]" />
                                                ) : (
                                                    <X size={14} className="text-[#B0BEC5]" />
                                                )}
                                                <span className={`text-xs ${req.met ? 'text-[#4CAF50]' : 'text-[#546E7A]'}`}>
                                                    {req.label}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="Confirm new password"
                                icon={<Lock size={18} />}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />
                            {confirmPassword && (
                                <div className="absolute right-3 top-9">
                                    {passwordsMatch ? (
                                        <Check size={18} className="text-[#4CAF50]" />
                                    ) : (
                                        <X size={18} className="text-[#F44336]" />
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={isSubmitting}
                            disabled={passwordStrength < 100 || !passwordsMatch}
                            className="mt-6"
                        >
                            {isForced ? 'Change Password & Continue' : 'Update Password'}
                        </Button>

                        {/* Only show cancel if not forced */}
                        {!isForced && (
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                        )}
                    </form>
                </Card>
            </motion.div>
        </motion.div>
    );
};
