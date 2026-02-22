import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, CreditCard, ArrowRight } from 'lucide-react';
import { Button, Input, Card, SmartCityLogo } from '../common';
import { authService } from '../../services/authService';
import type { RegisterRequest } from '../../services/authService';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    nationalId: z.string().min(5, 'National ID must be at least 5 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegistrationFormProps {
    onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await authService.register(data as RegisterRequest);
            toast.success('Registration submitted successfully!');
            onSuccess();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
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
                    Join Smart City Hub
                </h1>
                <p className="text-[#546E7A] mt-2">
                    Create your account to get started
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        placeholder="Prénom"
                        icon={<User size={18} />}
                        error={errors.firstName?.message}
                        {...register('firstName')}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Nom"
                        icon={<User size={18} />}
                        error={errors.lastName?.message}
                        {...register('lastName')}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Phone (Optional)"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    icon={<Phone size={18} />}
                    error={errors.phone?.message}
                    {...register('phone')}
                />

                <Input
                    label="National ID"
                    placeholder="AB123456"
                    icon={<CreditCard size={18} />}
                    hint="Ex: AB123456"
                    error={errors.nationalId?.message}
                    {...register('nationalId')}
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                    className="mt-6"
                >
                    Submit Registration
                </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-[#546E7A] mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-[#0D7377] hover:text-[#32936F] font-medium">
                    Login
                </a>
            </p>
        </Card>
    );
};
