import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, SmartCityLogo } from '../common';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

const forgotSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotFormData = z.infer<typeof forgotSchema>;

// ─── Forgot Password Form ─────────────────────────────────────────────────────

const ForgotPasswordForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotFormData) => {
        try {
            await authService.forgotPassword(data.email);
            setSubmitted(true);
        } catch (error: any) {
            // 400 = invalid email format (field-level error handled by zod, but surface API errors too)
            const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
            // We surface the error inline via react-hook-form setError equivalent — but since it's
            // a catch-all we use toast for non-400 errors.
            toast.error(msg);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                        <CheckCircle2 size={28} className="text-[#32936F]" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-[#263238] mb-2">Check your inbox</h3>
                <p className="text-sm text-[#546E7A] mb-6">
                    If an account with this email exists, a new password has been sent. Please check your inbox and spam folder.
                </p>
                <button
                    onClick={onBack}
                    className="text-sm text-[#0D7377] hover:text-[#32936F] font-medium inline-flex items-center gap-1"
                >
                    <ArrowLeft size={14} />
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#0D7377] font-['Noto_Sans_JP']">
                    Forgot Password?
                </h2>
                <p className="text-sm text-[#546E7A] mt-1">
                    Enter your email and we'll send you a new password.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting}
                    className="mt-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Sending…
                        </>
                    ) : (
                        'Send New Password'
                    )}
                </Button>
            </form>

            <div className="text-center mt-5">
                <button
                    onClick={onBack}
                    className="text-sm text-[#546E7A] hover:text-[#0D7377] inline-flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Login
                </button>
            </div>
        </>
    );
};

// ─── Login Form ───────────────────────────────────────────────────────────────

export const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showForgot, setShowForgot] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await login(data);

            if (response.user.mustChangePassword) {
                navigate('/change-password', { replace: true, state: { forced: true } });
                return;
            }

            toast.success('Welcome back!');
            const role = response.user.role;
            if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPERVISOR') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';

            if (message.toLowerCase().includes('pending')) {
                toast.error('Your account is awaiting admin approval.');
            } else if (message.toLowerCase().includes('inactive') || message.toLowerCase().includes('deactivated')) {
                toast.error('Your account has been disabled. Contact support.');
            } else {
                toast.error(message);
            }
        }
    };

    return (
        <Card className="w-full max-w-md" padding="lg">
            {/* Logo — always visible */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <SmartCityLogo variant="icon" size={50} />
                </div>
                {!showForgot && (
                    <>
                        <h1 className="text-2xl font-bold text-[#0D7377] font-['Noto_Sans_JP']">
                            Welcome Back
                        </h1>
                        <p className="text-[#546E7A] mt-2">
                            Sign in to your Smart City account
                        </p>
                    </>
                )}
            </div>

            {showForgot ? (
                <ForgotPasswordForm onBack={() => setShowForgot(false)} />
            ) : (
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="your.email@example.com"
                            icon={<Mail size={18} />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                icon={<Lock size={18} />}
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <div className="text-right mt-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowForgot(true)}
                                    className="text-xs text-[#0D7377] hover:text-[#32936F] font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={isSubmitting}
                            icon={<LogIn size={18} />}
                            iconPosition="right"
                            className="mt-6"
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[#546E7A] mt-6">
                        Don't have an account?{' '}
                        <a href="/register" className="text-[#0D7377] hover:text-[#32936F] font-medium">
                            Register
                        </a>
                    </p>
                </>
            )}
        </Card>
    );
};
