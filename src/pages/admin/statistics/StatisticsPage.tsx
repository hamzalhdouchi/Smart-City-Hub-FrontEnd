import React, { useEffect, useState, useCallback } from 'react';
import {
    TrendingUp, TrendingDown, AlertTriangle,
    Clock, CheckCircle, Star, BarChart3, PieChart, Activity, RefreshCw, Users
} from 'lucide-react';
import { Card, DataPulseLoader } from '../../../components/common';
import { statisticsService } from '../../../services/statisticsService';
import type { StatisticsResponse } from '../../../services/statisticsService';
import toast from 'react-hot-toast';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    iconColor: string;
    trend?: { value: string; isPositive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, iconColor, trend }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-[#546E7A] mb-1">{title}</p>
                <p className="text-3xl font-bold text-[#263238]">{value}</p>
                {subtitle && <p className="text-sm text-[#546E7A] mt-1">{subtitle}</p>}
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-[#32936F]' : 'text-[#F44336]'
                        }`}>
                        {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}20` }}
            >
                <span style={{ color: iconColor }}>{icon}</span>
            </div>
        </div>
    </Card>
);

// Status color mapping
const statusColors: Record<string, string> = {
    'NEW': '#FFB347',
    'IN_PROGRESS': '#2196F3',
    'RESOLVED': '#32936F',
    'CLOSED': '#546E7A',
};

// Category color palette
const categoryColors = ['#0D7377', '#32936F', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];

const StatisticsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await statisticsService.getGlobalStatistics();
            setStatistics(data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            toast.error('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    if (!statistics) {
        return (
            <Card className="text-center py-16">
                <AlertTriangle size={48} className="mx-auto mb-4 text-[#B0BEC5]" />
                <h3 className="text-xl font-semibold text-[#263238] mb-2">Failed to load statistics</h3>
                <p className="text-[#546E7A]">Please try again later</p>
            </Card>
        );
    }

    // Calculate totals
    const totalIncidentsByStatus = Object.values(statistics.incidentsByStatus || {}).reduce((a, b) => a + b, 0);
    const resolvedCount = (statistics.incidentsByStatus?.['RESOLVED'] || 0) + (statistics.incidentsByStatus?.['CLOSED'] || 0);
    const resolutionRate = totalIncidentsByStatus > 0
        ? Math.round((resolvedCount / totalIncidentsByStatus) * 100)
        : 0;

    // Format resolution time
    const formatResolutionTime = (hours: number) => {
        if (!hours || hours === 0) return 'N/A';
        if (hours < 24) return `${hours.toFixed(1)} hours`;
        return `${(hours / 24).toFixed(1)} days`;
    };

    // Convert status data for chart
    const statusData = Object.entries(statistics.incidentsByStatus || {}).map(([label, value]) => ({
        label: label.replace('_', ' '),
        value,
        color: statusColors[label] || '#B0BEC5',
    }));

    // Convert category data for chart
    const categoryData = Object.entries(statistics.incidentsByCategory || {}).map(([label, value], index) => ({
        label,
        value,
        color: categoryColors[index % categoryColors.length],
    }));

    const maxCategoryValue = Math.max(...categoryData.map(c => c.value), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                        Statistics & Analytics
                    </h1>
                    <p className="text-[#546E7A]">Platform performance overview</p>
                </div>
                <button
                    onClick={fetchStatistics}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#B0BEC5] text-[#546E7A] hover:bg-[#ECEFF1] transition-colors"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Incidents"
                    value={statistics.totalIncidents?.toLocaleString() || '0'}
                    subtitle="All time"
                    icon={<AlertTriangle size={24} />}
                    iconColor="#FFB347"
                />
                <StatCard
                    title="Resolution Rate"
                    value={`${resolutionRate}%`}
                    subtitle="Incidents resolved"
                    icon={<CheckCircle size={24} />}
                    iconColor="#32936F"
                />
                <StatCard
                    title="Avg Resolution Time"
                    value={formatResolutionTime(statistics.averageResolutionTimeHours)}
                    subtitle="Time to resolve"
                    icon={<Clock size={24} />}
                    iconColor="#2196F3"
                />
                <StatCard
                    title="User Satisfaction"
                    value={statistics.averageRating?.toFixed(1) || 'N/A'}
                    subtitle="Average rating"
                    icon={<Star size={24} />}
                    iconColor="#FF9800"
                />
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: '#0D737720' }}
                        >
                            <Users size={28} style={{ color: '#0D7377' }} />
                        </div>
                        <div>
                            <p className="text-sm text-[#546E7A]">Total Users</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {statistics.totalUsers?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: '#32936F20' }}
                        >
                            <Activity size={28} style={{ color: '#32936F' }} />
                        </div>
                        <div>
                            <p className="text-sm text-[#546E7A]">Active Agents</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {statistics.totalAgents?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-[#263238] text-lg">Incidents by Status</h3>
                        <PieChart size={20} className="text-[#546E7A]" />
                    </div>

                    {statusData.length > 0 ? (
                        <div className="space-y-4">
                            {statusData.map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#546E7A] flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            {item.label}
                                        </span>
                                        <span className="font-medium text-[#263238]">
                                            {item.value} ({totalIncidentsByStatus > 0 ? Math.round(item.value / totalIncidentsByStatus * 100) : 0}%)
                                        </span>
                                    </div>
                                    <div className="h-3 bg-[#ECEFF1] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${totalIncidentsByStatus > 0 ? (item.value / totalIncidentsByStatus) * 100 : 0}%`,
                                                backgroundColor: item.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#546E7A] text-center py-8">No data available</p>
                    )}
                </Card>

                {/* Category Distribution */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-[#263238] text-lg">Incidents by Category</h3>
                        <BarChart3 size={20} className="text-[#546E7A]" />
                    </div>

                    {categoryData.length > 0 ? (
                        <div className="space-y-4">
                            {categoryData.map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-[#546E7A] flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            {item.label}
                                        </span>
                                        <span className="font-medium text-[#263238]">
                                            {item.value}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-[#ECEFF1] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${(item.value / maxCategoryValue) * 100}%`,
                                                backgroundColor: item.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#546E7A] text-center py-8">No data available</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default StatisticsPage;
