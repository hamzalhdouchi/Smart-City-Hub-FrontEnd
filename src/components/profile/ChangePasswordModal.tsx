import React, { useState } from 'react';
import { X, Lock, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../common';
import { authService } from '../../services/authService';
import type { ChangePasswordRequest } from '../../services/authService';
import toast from 'react-hot-toast';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<ChangePasswordRequest>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<{ current: boolean; new: boolean; confirm: boolean }>({
        current: false, new: false, confirm: false
    });

    if (!isOpen) return null;

    // Password Strength & Validation Logic
    const validations = {
        length: formData.newPassword.length >= 8,
        uppercase: /[A-Z]/.test(formData.newPassword),
        lowercase: /[a-z]/.test(formData.newPassword),
        number: /[0-9]/.test(formData.newPassword),
        special: /[!@#$%^&*]/.test(formData.newPassword),
        match: formData.newPassword && formData.newPassword === formData.confirmPassword
    };

    const strengthScore = Object.values(validations).filter(v => v).length - (validations.match ? 1 : 0); // Exclude match from strength
    const getStrengthColor = () => {
        if (strengthScore <= 2) return 'bg-red-500';
        if (strengthScore <= 4) return 'bg-orange-500';
        return 'bg-green-500';
    };
    const getStrengthLabel = () => {
        if (strengthScore <= 2) return 'Weak';
        if (strengthScore <= 4) return 'Fair';
        return 'Strong';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validations.match) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            await authService.changePassword(formData);
            toast.success('Password updated successfully!');
            onClose();
            // Reset form
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShow = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#263238] flex items-center gap-2">
                        <Lock className="text-[#0D7377]" size={24} />
                        Change Password
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-[#546E7A]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-1.5">Current Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword.current ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('current')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-1.5">New Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Strength Meter */}
                        {formData.newPassword && (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[#546E7A]">Password Strength</span>
                                    <span className={`font-bold ${strengthScore <= 2 ? 'text-red-500' : strengthScore <= 4 ? 'text-orange-500' : 'text-green-500'
                                        }`}>{getStrengthLabel()}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#78909C] bg-gray-50 p-3 rounded-lg">
                        <div className={`flex items-center gap-1.5 ${validations.length ? 'text-green-600' : ''}`}>
                            {validations.length ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                            8+ Characters
                        </div>
                        <div className={`flex items-center gap-1.5 ${validations.uppercase ? 'text-green-600' : ''}`}>
                            {validations.uppercase ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                            Uppercase Letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${validations.lowercase ? 'text-green-600' : ''}`}>
                            {validations.lowercase ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                            Lowercase Letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${validations.number ? 'text-green-600' : ''}`}>
                            {validations.number ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                            Number
                        </div>
                        <div className={`flex items-center gap-1.5 ${validations.special ? 'text-green-600' : ''}`}>
                            {validations.special ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                            Special Character
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <Input
                                type={showPassword.confirm ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleShow('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {formData.confirmPassword && !validations.match && (
                            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                <AlertCircle size={12} /> Passwords do not match
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" onClick={onClose} type="button" className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={!validations.match || strengthScore < 3}
                            className="flex-1"
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
