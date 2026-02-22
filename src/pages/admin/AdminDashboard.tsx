import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, AlertTriangle, Clock, CheckCircle,
    TrendingUp, TrendingDown, ArrowRight, RefreshCw,
    MapPin, User, Camera, MessageSquare, FolderOpen, Plus
} from 'lucide-react';
import { Card, Button, DataPulseLoader, CategoryIcon } from '../../components/common';
import { statisticsService } from '../../services/statisticsService';
import type { StatisticsResponse } from '../../services/statisticsService';
import { incidentService } from '../../services/incidentService';
import type { Incident } from '../../services/incidentService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: { value: string; isPositive: boolean };
    onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, iconBg, trend, onClick }) => (
    <Card
        className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-[#546E7A] mb-1">{title}</p>
                <p className="text-3xl font-bold text-[#263238]">{value}</p>
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-[#32936F]' : 'text-[#F44336]'}`}>
                        {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                {icon}
            </div>
        </div>
    </Card>
);

const statusConfig = {
    NEW: { bg: 'bg-[#FFB347]', text: 'text-white', label: 'New' },
    IN_PROGRESS: { bg: 'bg-[#2196F3]', text: 'text-white', label: 'In Progress' },
    RESOLVED: { bg: 'bg-[#32936F]', text: 'text-white', label: 'Resolved' },
    CLOSED: { bg: 'bg-[#546E7A]', text: 'text-white', label: 'Closed' },
};

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
    const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
    const [pendingUsersCount, setPendingUsersCount] = useState(0);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsData, incidentsData, pendingData] = await Promise.all([
                statisticsService.getGlobalStatistics(),
                incidentService.getIncidents(undefined, undefined, 0, 5),
                userService.getPendingUsers(0, 1),
            ]);
            setStatistics(statsData);
            setRecentIncidents(incidentsData.content);
            setPendingUsersCount(pendingData.totalElements);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    // Calculate metrics
    const newIncidents = statistics?.incidentsByStatus?.['NEW'] || 0;
    const inProgressIncidents = statistics?.incidentsByStatus?.['IN_PROGRESS'] || 0;
    const resolvedToday = statistics?.incidentsByStatus?.['RESOLVED'] || 0;
    const activeIncidents = newIncidents + inProgressIncidents;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                        Admin Dashboard
                    </h1>
                    <p className="text-[#546E7A]">Welcome back! Here's an overview of your platform.</p>
                </div>
                <Button
                    variant="ghost"
                    icon={<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />}
                    onClick={fetchDashboardData}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Users"
                    value={statistics?.totalUsers?.toLocaleString() || '0'}
                    icon={<Users size={24} className="text-[#0D7377]" />}
                    iconBg="bg-[#0D7377]/10"
                    onClick={() => navigate('/admin/users/all')}
                />
                <MetricCard
                    title="Active Incidents"
                    value={activeIncidents}
                    icon={<AlertTriangle size={24} className="text-[#FFB347]" />}
                    iconBg="bg-[#FFB347]/10"
                    onClick={() => navigate('/admin/incidents/all')}
                />
                <MetricCard
                    title="Pending Approvals"
                    value={pendingUsersCount}
                    icon={<Clock size={24} className="text-[#2196F3]" />}
                    iconBg="bg-[#2196F3]/10"
                    onClick={() => navigate('/admin/users/pending')}
                />
                <MetricCard
                    title="Resolved Incidents"
                    value={resolvedToday}
                    icon={<CheckCircle size={24} className="text-[#32936F]" />}
                    iconBg="bg-[#32936F]/10"
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-lg font-semibold text-[#263238] mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="secondary"
                        icon={<Plus size={18} />}
                        onClick={() => navigate('/admin/categories')}
                    >
                        Create Category
                    </Button>
                    <Button
                        variant="secondary"
                        icon={<Clock size={18} />}
                        onClick={() => navigate('/admin/users/pending')}
                    >
                        View Pending Users ({pendingUsersCount})
                    </Button>
                    <Button
                        variant="secondary"
                        icon={<AlertTriangle size={18} />}
                        onClick={() => navigate('/admin/incidents/all')}
                    >
                        View New Incidents ({newIncidents})
                    </Button>
                </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Incidents */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[#263238]">Recent Incidents</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<ArrowRight size={16} />}
                                onClick={() => navigate('/admin/incidents/all')}
                            >
                                View All
                            </Button>
                        </div>

                        {recentIncidents.length > 0 ? (
                            <div className="space-y-4">
                                {recentIncidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        className="flex items-start gap-4 p-4 bg-[#ECEFF1]/50 rounded-lg hover:bg-[#ECEFF1] transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/incidents/${incident.id}`)}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
                                            title={`Category: ${incident.category?.name || 'Unknown'}`}
                                        >
                                            <CategoryIcon
                                                iconName={
                                                    (incident.category?.icon && incident.category.icon !== 'help-circle')
                                                        ? incident.category.icon
                                                        : (incident.category?.name || 'default')
                                                }
                                                size={24}
                                                className="text-[#546E7A]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-[#263238] truncate">{incident.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[incident.status]?.bg} ${statusConfig[incident.status]?.text}`}>
                                                    {statusConfig[incident.status]?.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#546E7A]">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {incident.address || 'Unknown'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {incident.reporter?.fullName || 'Unknown'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatDate(incident.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-sm text-[#546E7A]">
                                                <span className="flex items-center gap-1">
                                                    <Camera size={12} />
                                                    {incident.photos?.length || 0} photos
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare size={12} />
                                                    {incident.commentsCount || 0} comments
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#546E7A]">
                                <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No recent incidents</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Statistics Summary */}
                <div className="space-y-6">
                    {/* Category Breakdown */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[#263238]">By Category</h2>
                            <FolderOpen size={20} className="text-[#546E7A]" />
                        </div>
                        {statistics?.incidentsByCategory && Object.keys(statistics.incidentsByCategory).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(statistics.incidentsByCategory).slice(0, 5).map(([name, count], index) => {
                                    const total = Object.values(statistics.incidentsByCategory).reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                                    const colors = ['#0D7377', '#32936F', '#2196F3', '#9C27B0', '#FF9800'];
                                    return (
                                        <div key={name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[#546E7A]">{name}</span>
                                                <span className="font-medium text-[#263238]">{count}</span>
                                            </div>
                                            <div className="h-2 bg-[#ECEFF1] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: colors[index % colors.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center py-4 text-[#546E7A]">No category data</p>
                        )}
                    </Card>

                    {/* Platform Stats */}
                    <Card>
                        <h2 className="text-lg font-semibold text-[#263238] mb-4">Platform Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-[#ECEFF1]">
                                <span className="text-[#546E7A]">Total Incidents</span>
                                <span className="font-semibold text-[#263238]">
                                    {statistics?.totalIncidents?.toLocaleString() || '0'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#ECEFF1]">
                                <span className="text-[#546E7A]">Active Agents</span>
                                <span className="font-semibold text-[#263238]">
                                    {statistics?.totalAgents || '0'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#ECEFF1]">
                                <span className="text-[#546E7A]">Avg Resolution</span>
                                <span className="font-semibold text-[#263238]">
                                    {statistics?.averageResolutionTimeHours
                                        ? `${(statistics.averageResolutionTimeHours / 24).toFixed(1)} days`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[#546E7A]">Avg Rating</span>
                                <span className="font-semibold text-[#263238]">
                                    {statistics?.averageRating ? `${statistics.averageRating.toFixed(1)} ⭐` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
