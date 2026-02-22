import React, { useEffect, useState } from 'react';
import { Search, Filter, UserCheck, UserX, Clock, Mail, Phone, CreditCard } from 'lucide-react';
import { Card, Button, DataPulseLoader } from '../../components/common';
import { authService } from '../../services/authService';
import type { User } from '../../services/authService';
import toast from 'react-hot-toast';

const PendingUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const data = await authService.getPendingUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load pending users');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        setProcessingId(userId);
        try {
            await authService.approveUser(userId);
            toast.success('User approved successfully!');
            setUsers(users.filter(u => u.id !== userId));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve user');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (userId: string) => {
        setProcessingId(userId);
        try {
            await authService.rejectUser(userId);
            toast.success('User rejected');
            setUsers(users.filter(u => u.id !== userId));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject user');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D7377] font-['Noto_Sans_JP'] flex items-center gap-3">
                        Pending Registrations
                        {users.length > 0 && (
                            <span className="px-3 py-1 text-sm bg-[#FF9800] text-white rounded-full">
                                {users.length}
                            </span>
                        )}
                    </h1>
                    <p className="text-[#546E7A] mt-1">Review and approve new user registrations</p>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#546E7A]" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-[#B0BEC5] rounded-lg focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 w-64"
                        />
                    </div>
                    <Button variant="secondary" icon={<Filter size={18} />}>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length === 0 ? (
                <Card className="text-center py-16">
                    <UserCheck size={64} className="mx-auto mb-4 text-[#B0BEC5]" />
                    <h3 className="text-xl font-semibold text-[#263238] mb-2">All Caught Up!</h3>
                    <p className="text-[#546E7A]">No pending registrations at the moment.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <Card
                            key={user.id}
                            className="hover:shadow-xl transition-shadow duration-200"
                            padding="md"
                        >
                            {/* User Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#0D7377] flex items-center justify-center text-white font-bold text-lg">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#263238]">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-[#546E7A] flex items-center gap-1">
                                        <Clock size={14} />
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                    <Mail size={16} className="text-[#0D7377]" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                        <Phone size={16} className="text-[#0D7377]" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                    <CreditCard size={16} className="text-[#0D7377]" />
                                    <span>{user.nationalId}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="border-[#B0BEC5] mb-4" />

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={<UserCheck size={16} />}
                                    onClick={() => handleApprove(user.id)}
                                    loading={processingId === user.id}
                                    className="flex-1"
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<UserX size={16} />}
                                    onClick={() => handleReject(user.id)}
                                    disabled={processingId === user.id}
                                    className="flex-1"
                                >
                                    Reject
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingUsersPage;
