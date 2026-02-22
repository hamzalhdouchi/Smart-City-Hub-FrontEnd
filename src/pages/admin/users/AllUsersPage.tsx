import React, { useEffect, useState, useCallback } from 'react';
import { Search, Download, Eye, MoreVertical, RefreshCw } from 'lucide-react';
import { Card, Button, DataPulseLoader, Pagination } from '../../../components/common';
import { exportToCSV } from '../../../utils/exportUtils';
import { userService } from '../../../services/userService';
import type { User, Page, Role, UserStatus } from '../../../services/userService';
import toast from 'react-hot-toast';

const roleConfig: Record<Role, { label: string; color: string }> = {
    ROLE_ADMIN: { label: 'Admin', color: '#9C27B0' },
    ROLE_SUPERVISOR: { label: 'Supervisor', color: '#2196F3' },
    ROLE_AGENT: { label: 'Agent', color: '#0D7377' },
    ROLE_USER: { label: 'User', color: '#546E7A' },
};

const statusConfig: Record<UserStatus, { label: string; bg: string; text: string }> = {
    ACTIVE: { label: 'Active', bg: 'bg-[#32936F]', text: 'text-white' },
    PENDING: { label: 'Pending', bg: 'bg-[#FFB347]', text: 'text-white' },
    INACTIVE: { label: 'Inactive', bg: 'bg-[#B0BEC5]', text: 'text-white' },
    REJECTED: { label: 'Rejected', bg: 'bg-[#F44336]', text: 'text-white' },
};

const AllUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
    const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState<Page<User> | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers(page, 12);
            setUsers(data.content);
            setPageData(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Client-side filtering
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.nationalId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const handleDeactivate = async (userId: string) => {
        try {
            await userService.deactivateUser(userId);
            toast.success('User deactivated');
            fetchUsers();
        } catch (error) {
            console.error('Failed to deactivate user:', error);
            toast.error('Failed to deactivate user');
        }
        setOpenActionMenu(null);
    };

    const handleActivate = async (userId: string) => {
        try {
            await userService.activateUser(userId);
            toast.success('User activated');
            fetchUsers();
        } catch (error) {
            console.error('Failed to activate user:', error);
            toast.error('Failed to activate user');
        }
        setOpenActionMenu(null);
    };

    const handleRoleChange = async (userId: string, newRole: Role) => {
        try {
            await userService.updateUserRole(userId, newRole.replace('ROLE_', ''));
            toast.success('Role updated');
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
            toast.error('Failed to update role');
        }
        setOpenActionMenu(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getRoleColor = (role: Role) => {
        return roleConfig[role]?.color || '#546E7A';
    };

    const handleExport = async () => {
        try {
            const allUsers = await userService.getAllUsers(0, 1000); // Fetch up to 1000 for export

            const exportData = allUsers.content.map(user => ({
                ID: user.id,
                Name: user.fullName,
                Email: user.email,
                Role: user.role,
                Status: user.status,
                'National ID': user.nationalId,
                'Joined Date': new Date(user.createdAt).toLocaleDateString(),
            }));

            exportToCSV(exportData, `users_export_${new Date().toISOString().split('T')[0]}`);
            toast.success('Export started');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export users');
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                        User Management
                    </h1>
                    <p className="text-[#546E7A]">
                        {pageData ? `${pageData.totalElements} total users` : 'Loading...'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        icon={<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />}
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button variant="ghost" icon={<Download size={18} />} onClick={handleExport}>
                        Export
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card padding="md">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#546E7A]" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or national ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#B0BEC5] rounded-lg 
                         focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'ALL')}
                        className="px-4 py-2 border border-[#B0BEC5] rounded-lg 
                       focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as Role | 'ALL')}
                        className="px-4 py-2 border border-[#B0BEC5] rounded-lg 
                       focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_SUPERVISOR">Supervisor</option>
                        <option value="ROLE_AGENT">Agent</option>
                        <option value="ROLE_USER">User</option>
                    </select>
                </div>
            </Card>

            {/* Users Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#ECEFF1]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#546E7A]">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#546E7A]">Email</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-[#546E7A]">Role</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-[#546E7A]">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#546E7A]">Joined</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-[#546E7A]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ECEFF1]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[#ECEFF1]/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                                                style={{ backgroundColor: getRoleColor(user.role) }}
                                            >
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#263238]">{user.fullName}</p>
                                                <p className="text-sm text-[#546E7A]">{user.nationalId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#546E7A]">{user.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                            style={{ backgroundColor: getRoleColor(user.role) }}
                                        >
                                            {roleConfig[user.role]?.label || user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[user.status]?.bg || 'bg-gray-500'} ${statusConfig[user.status]?.text || 'text-white'}`}>
                                            {statusConfig[user.status]?.label || user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#546E7A]">{formatDate(user.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2 relative">
                                            <button
                                                className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} className="text-[#546E7A]" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                                                onClick={() => setOpenActionMenu(openActionMenu === user.id ? null : user.id)}
                                            >
                                                <MoreVertical size={16} className="text-[#546E7A]" />
                                            </button>

                                            {/* Action Menu */}
                                            {openActionMenu === user.id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#B0BEC5] z-10">
                                                    <div className="py-1">
                                                        {user.status === 'ACTIVE' ? (
                                                            <button
                                                                onClick={() => handleDeactivate(user.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-[#F44336] hover:bg-[#ECEFF1]"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        ) : user.status === 'INACTIVE' && (
                                                            <button
                                                                onClick={() => handleActivate(user.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-[#32936F] hover:bg-[#ECEFF1]"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                        <div className="border-t border-[#ECEFF1] my-1" />
                                                        <div className="px-4 py-2 text-xs text-[#546E7A] font-medium">Change Role</div>
                                                        {(['ROLE_USER', 'ROLE_AGENT', 'ROLE_SUPERVISOR', 'ROLE_ADMIN'] as Role[]).map((role) => (
                                                            <button
                                                                key={role}
                                                                onClick={() => handleRoleChange(user.id, role)}
                                                                disabled={user.role === role}
                                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#ECEFF1] flex items-center gap-2 ${user.role === role ? 'text-[#0D7377] font-medium' : 'text-[#263238]'}`}
                                                            >
                                                                <span
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{ backgroundColor: getRoleColor(role) }}
                                                                />
                                                                {roleConfig[role].label}
                                                                {user.role === role && ' (current)'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-[#546E7A]">No users found</p>
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {pageData && (
                <Card padding="md">
                    <Pagination
                        page={pageData.number}
                        totalPages={pageData.totalPages}
                        totalElements={pageData.totalElements}
                        size={pageData.size}
                        onPageChange={setPage}
                        loading={loading}
                    />
                </Card>
            )}
        </div>
    );
};

export default AllUsersPage;
