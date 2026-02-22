import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button, Input, Card, SmartCityLogo } from '../common';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

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

            // Check if user must change password - read from user object
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
            {/* Logo & Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <SmartCityLogo variant="icon" size={50} />
                </div>
                <h1 className="text-2xl font-bold text-[#0D7377] font-['Noto_Sans_JP']">
                    Welcome Back
                </h1>
                <p className="text-[#546E7A] mt-2">
                    Sign in to your Smart City account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon={<Lock size={18} />}
                    error={errors.password?.message}
                    {...register('password')}
                />

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

            {/* Footer */}
            <p className="text-center text-sm text-[#546E7A] mt-6">
                Don't have an account?{' '}
                <a href="/register" className="text-[#0D7377] hover:text-[#32936F] font-medium">
                    Register
                </a>
            </p>
        </Card>
    );
};
