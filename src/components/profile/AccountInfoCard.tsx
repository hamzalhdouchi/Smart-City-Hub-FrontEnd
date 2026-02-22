import React, { useState } from 'react';
import { CreditCard, Copy, Check, Shield, Activity, Calendar, Clock } from 'lucide-react';
import { Card } from '../common';
import type { User as UserType } from '../../services/userService';
import toast from 'react-hot-toast';

interface AccountInfoCardProps {
    user: UserType;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        toast.success('User ID copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'bg-red-100 text-red-700';
            case 'ROLE_SUPERVISOR': return 'bg-orange-100 text-orange-700';
            case 'ROLE_AGENT': return 'bg-purple-100 text-purple-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <Card className="mb-6">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#E3F2FD] rounded-lg text-[#1976D2]">
                        <CreditCard size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-[#263238]">Account Information</h2>
                </div>

                {/* Content Rows */}
                <div className="space-y-6">

                    {/* User ID */}
                    <div className="pb-6 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#546E7A] mb-2">User ID</p>
                        <div className="flex items-center justify-between">
                            <code className="bg-[#F5F7F8] px-3 py-1.5 rounded text-[#263238] font-mono text-sm">
                                {user.id}
                            </code>
                            <button
                                onClick={handleCopyId}
                                className="p-2 hover:bg-[#F5F7F8] rounded-full transition-colors text-[#546E7A] hover:text-[#0D7377]"
                                title="Copy ID"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Role & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-[#546E7A] mb-2">Role</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${getRoleColor(user.role)}`}>
                                <Shield size={14} />
                                {user.role.replace('ROLE_', '')}
                            </div>
                            <p className="text-xs text-[#90A4AE] mt-1.5">
                                Standard platform user with basic access privileges.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-[#546E7A] mb-2">Account Status</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">
                                <Activity size={14} />
                                Active
                            </div>
                            <p className="text-xs text-[#90A4AE] mt-1.5">
                                Full access to all enabled features.
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-[#546E7A] mb-1">Member Since</p>
                            <div className="flex items-center gap-2 text-[#263238] font-medium">
                                <Calendar size={16} className="text-[#0D7377]" />
                                {formatDate(user.createdAt)}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-[#546E7A] mb-1">Last Login</p>
                            <div className="flex items-center gap-2 text-[#263238] font-medium">
                                <Clock size={16} className="text-[#0D7377]" />
                                2 hours ago
                                <span className="text-xs font-normal text-[#90A4AE] ml-1">from Chrome on Windows</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Card>
    );
};

export default AccountInfoCard;
