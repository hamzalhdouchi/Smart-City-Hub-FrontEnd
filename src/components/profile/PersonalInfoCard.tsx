import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Edit2, X, Save, Lock, Check } from 'lucide-react';
import { Card } from '../common';
import type { User as UserType } from '../../services/userService';

// Helper for country codes (simplified)
const COUNTRY_CODES = [
    { code: '+212', flag: '🇲🇦' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+33', flag: '🇫🇷' },
    { code: '+44', flag: '🇬🇧' },
];

interface PersonalInfoCardProps {
    user: UserType;
    onUpdate: (data: { firstName: string; lastName: string; phone: string }) => Promise<void>;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        countryCode: '+212' // Default
    });

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await onUpdate({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || '',
            countryCode: '+212'
        });
        setIsEditing(false);
    };

    return (
        <Card className="mb-6 mt-8 overflow-visible" padding="none">
            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-[#E6F3F1] rounded-full text-[#2D8B7E]">
                                <User size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
                        </div>
                        {/* Teal Accent Line */}
                        <div className="w-10 h-[3px] bg-[#2D8B7E] rounded-full ml-11" />
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#2D8B7E] text-[#2D8B7E] font-medium hover:bg-[#2D8B7E] hover:text-white transition-all duration-200 active:scale-95"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1">First Name</label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D8B7E]">
                                        <User size={18} />
                                    </div>
                                    <input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="First Name"
                                        className="w-full bg-white border border-[#C7E0DC] text-gray-900 text-sm rounded-xl focus:ring-[#2D8B7E] focus:border-[#2D8B7E] block pl-10 p-3.5 transition-all duration-200 focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300"
                                    />
                                </div>
                            ) : (
                                <div className="bg-[#F0F7F6] rounded-xl border border-[#C7E0DC] p-3.5 flex items-center gap-3">
                                    <User size={18} className="text-[#2D8B7E] shrink-0" />
                                    <span className="text-gray-900 font-medium">{user.firstName}</span>
                                </div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1">Last Name</label>
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D8B7E]">
                                        <User size={18} />
                                    </div>
                                    <input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Last Name"
                                        className="w-full bg-white border border-[#C7E0DC] text-gray-900 text-sm rounded-xl focus:ring-[#2D8B7E] focus:border-[#2D8B7E] block pl-10 p-3.5 transition-all duration-200 focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300"
                                    />
                                </div>
                            ) : (
                                <div className="bg-[#F0F7F6] rounded-xl border border-[#C7E0DC] p-3.5 flex items-center gap-3">
                                    <User size={18} className="text-[#2D8B7E] shrink-0" />
                                    <span className="text-gray-900 font-medium">{user.lastName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="w-full">
                        <label className="flex items-center justify-between text-sm font-medium text-gray-500 mb-1.5 ml-1">
                            Email Address
                            {!isEditing && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <Lock size={12} className="text-[#2D8B7E]" /> Cannot be changed
                                </span>
                            )}
                        </label>
                        <div className="bg-[#F0F7F6] rounded-xl border border-[#C7E0DC] p-3.5 flex items-center justify-between opacity-80 cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[#2D8B7E] shrink-0" />
                                <span className="text-gray-900 font-medium">{user.email}</span>
                            </div>
                            <Lock size={16} className="text-gray-400" />
                        </div>
                    </div>

                    {/* National ID (Read-only) */}
                    <div className="w-full">
                        <label className="flex items-center justify-between text-sm font-medium text-gray-500 mb-1.5 ml-1">
                            National ID
                        </label>
                        <div className="bg-[#F0F7F6] rounded-xl border border-[#C7E0DC] p-3.5 flex items-center justify-between cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-[#2D8B7E] shrink-0" />
                                <span className="text-gray-900 font-medium">{user.nationalId}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-[#2D8B7E] text-white px-1.5 py-0.5 rounded-md shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                                <Check size={10} strokeWidth={4} />
                            </div>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-1.5 ml-1">Phone Number</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <div className="relative w-28 shrink-0">
                                    <select
                                        className="w-full bg-white border border-[#C7E0DC] text-gray-900 text-sm rounded-xl focus:ring-[#2D8B7E] focus:border-[#2D8B7E] block p-3.5 transition-all duration-200 outline-none appearance-none"
                                        value={formData.countryCode}
                                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                    >
                                        {COUNTRY_CODES.map(c => (
                                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 text-xs">▼</span>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D8B7E]">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="612 345 678"
                                        className="w-full bg-white border border-[#C7E0DC] text-gray-900 text-sm rounded-xl focus:ring-[#2D8B7E] focus:border-[#2D8B7E] block pl-10 p-3.5 transition-all duration-200 focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#F0F7F6] rounded-xl border border-[#C7E0DC] p-3.5 flex items-center gap-3">
                                <Phone size={18} className="text-[#2D8B7E] shrink-0" />
                                {user.phone ? (
                                    <span className="text-gray-900 font-medium">
                                        {user.phone.startsWith('+') ? user.phone : `+212 ${user.phone}`}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 italic">Not provided</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {isEditing && (
                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2D8B7E] text-white font-medium hover:bg-[#24756A] shadow-lg shadow-teal-700/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PersonalInfoCard;
