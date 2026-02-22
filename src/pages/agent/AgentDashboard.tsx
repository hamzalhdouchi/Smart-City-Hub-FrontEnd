import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    ArrowRightCircle,
    CheckCircle2,
    Clock,
    MapPin,
    Star,
} from 'lucide-react';
import { Card, Button, DataPulseLoader, CategoryIcon, Pagination } from '../../components/common';
import { incidentService } from '../../services/incidentService';
import type { Incident, IncidentStatus, Page } from '../../services/incidentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type StatusKey = IncidentStatus | 'VALIDATED';

const statusConfig: Record<StatusKey, { bg: string; text: string; label: string }> = {
    NEW: { bg: 'bg-[#FFB347]/10', text: 'text-[#FFB347]', label: 'New' },
    ASSIGNED: { bg: 'bg-[#0D7377]/10', text: 'text-[#0D7377]', label: 'Assigned' },
    IN_PROGRESS: { bg: 'bg-[#2196F3]/10', text: 'text-[#2196F3]', label: 'In Progress' },
    RESOLVED: { bg: 'bg-[#32936F]/10', text: 'text-[#32936F]', label: 'Resolved' },
    VALIDATED: { bg: 'bg-[#4CAF50]/10', text: 'text-[#4CAF50]', label: 'Validated' },
    REJECTED: { bg: 'bg-[#EF5350]/10', text: 'text-[#EF5350]', label: 'Rejected' },
    REOPENED: { bg: 'bg-[#FF9800]/10', text: 'text-[#FF9800]', label: 'Reopened' },
    CLOSED: { bg: 'bg-[#546E7A]/10', text: 'text-[#546E7A]', label: 'Closed' },
};

const AgentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [assignedPage, setAssignedPage] = useState<Page<Incident> | null>(null);
    const [assignedIncidents, setAssignedIncidents] = useState<Incident[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchAssignedIncidents = useCallback(
        async (page: number = 0) => {
            try {
                page === 0 ? setLoading(true) : setIsRefreshing(true);
                const data = await incidentService.getAssignedIncidents(page, 12);
                setAssignedPage(data);
                setAssignedIncidents(data.content || []);
            } catch (error) {
                console.error('Failed to fetch assigned incidents:', error);
                toast.error('Failed to load your incidents');
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchAssignedIncidents(currentPage);
    }, [currentPage, fetchAssignedIncidents]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const metrics = useMemo(() => {
        const now = new Date();
        let assigned = 0;
        let inProgress = 0;
        let resolvedRecently = 0;
        let highPriority = 0;
        let ratedCount = 0;
        let ratingSum = 0;

        assignedIncidents.forEach((incident) => {
            if (incident.status === 'ASSIGNED') assigned += 1;
            if (incident.status === 'IN_PROGRESS') inProgress += 1;

            if (incident.status === 'RESOLVED' || incident.status === 'VALIDATED') {
                if (incident.resolvedAt) {
                    const resolvedAt = new Date(incident.resolvedAt);
                    const diffMs = now.getTime() - resolvedAt.getTime();
                    const diffHours = diffMs / (1000 * 60 * 60);
                    if (diffHours <= 24) {
                        resolvedRecently += 1;
                    }
                }
            }

            if (incident.priority === 'HIGH') {
                highPriority += 1;
            }

            if (incident.rating && typeof incident.rating.rating === 'number') {
                ratingSum += incident.rating.rating;
                ratedCount += 1;
            }
        });

        const averageRating = ratedCount > 0 ? ratingSum / ratedCount : 0;

        return {
            totalAssigned: assignedIncidents.length,
            assigned,
            inProgress,
            resolvedRecently,
            highPriority,
            averageRating,
        };
    }, [assignedIncidents]);

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (loading && !assignedPage) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Header */}
            <div
                className="
                    relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10 text-white shadow-2xl
                "
                style={{
                    backgroundImage:
                        "linear-gradient(120deg, rgba(5,59,62,0.95), rgba(13,115,119,0.9), rgba(38,50,56,0.95)), url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Subtle overlay grid */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_left,rgba(20,255,236,0.35),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(50,147,111,0.4),transparent_55%)]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#14FFEC]/90 mb-3">
                            Active Citizen Grid
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black font-['Noto_Sans_JP'] tracking-tight mb-3">
                            {user?.firstName ? `Good afternoon, ${user.firstName}` : 'Good afternoon, Agent'}
                        </h1>
                        <p className="text-sm md:text-base text-slate-100/80 max-w-xl">
                            Monitor, prioritize, and resolve the incidents assigned to you across the city.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Active incidents pill */}
                        <div className="flex-1 min-w-[220px] rounded-3xl bg-slate-950/70 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.6)] px-6 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-teal-300">
                                    Active
                                </p>
                                <p className="text-3xl md:text-4xl font-black mt-1">
                                    {metrics.inProgress + metrics.assigned}
                                </p>
                                <p className="text-xs text-slate-300 mt-1">
                                    reports in progress
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center">
                                <Activity size={18} className="text-emerald-300" />
                            </div>
                        </div>

                        {/* Fixed / resolved pill */}
                        <div className="flex-1 min-w-[220px] rounded-3xl bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.35)] px-6 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-teal-700">
                                    Fixed
                                </p>
                                <p className="text-3xl md:text-4xl font-black mt-1">
                                    {metrics.resolvedRecently}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    issues resolved today
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
                                <CheckCircle2 size={18} className="text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14FFEC]/10 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#546E7A] mb-1">Assigned to You</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {metrics.totalAssigned}
                            </p>
                            <p className="text-xs text-[#78909C] mt-1">
                                {metrics.assigned} waiting • {metrics.inProgress} in progress
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#14FFEC]/15">
                            <AlertTriangle className="text-[#0D7377]" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#32936F]/10 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#546E7A] mb-1">Resolved (last 24h)</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {metrics.resolvedRecently}
                            </p>
                            <p className="text-xs text-[#78909C] mt-1">
                                Keep your SLA on track
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#32936F]/15">
                            <CheckCircle2 className="text-[#32936F]" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EF5350]/5 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#546E7A] mb-1">High Priority</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {metrics.highPriority}
                            </p>
                            <p className="text-xs text-[#78909C] mt-1">
                                Tackle these first for maximum impact
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#EF5350]/10">
                            <Clock className="text-[#EF5350]" size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFB347]/10 to-transparent pointer-events-none" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#546E7A] mb-1">Citizen Rating</p>
                            <p className="text-3xl font-bold text-[#263238]">
                                {metrics.averageRating ? metrics.averageRating.toFixed(1) : '—'}
                            </p>
                            <p className="text-xs text-[#78909C] mt-1">
                                Based on resolved incidents you handled
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FFB347]/15">
                            <Star className="text-[#FFB347]" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Queue list */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#263238]">
                                    Your Incident Queue
                                </h2>
                                <p className="text-sm text-[#78909C]">
                                    Focus on high-priority and in-progress cases first.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Clock size={16} className={isRefreshing ? 'animate-spin' : ''} />}
                                    onClick={() => fetchAssignedIncidents(currentPage)}
                                    disabled={isRefreshing}
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {assignedIncidents.length === 0 ? (
                            <div className="text-center py-10 text-[#78909C]">
                                <p className="text-lg font-medium mb-1">No incidents assigned yet</p>
                                <p className="text-sm">
                                    Once a supervisor assigns an incident to you, it will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignedIncidents.map((incident) => {
                                    const statusStyles =
                                        statusConfig[incident.status as StatusKey] ||
                                        statusConfig.NEW;

                                    return (
                                        <div
                                            key={incident.id}
                                            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                                            onClick={() => navigate(`/agent/incidents/${incident.id}`)}
                                        >
                                            <div className="p-4 md:p-5 flex gap-4">
                                                {/* Category Icon */}
                                                <div className="flex-shrink-0">
                                                    <CategoryIcon
                                                        iconName={
                                                            incident.category.icon || incident.category.name
                                                        }
                                                        variant="badge"
                                                        size={32}
                                                        className="transform group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>

                                                {/* Main Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                                        <div className="min-w-0">
                                                            <h3 className="text-base md:text-lg font-semibold text-[#263238] truncate group-hover:text-[#0D7377] transition-colors">
                                                                {incident.title}
                                                            </h3>
                                                            <p className="text-xs text-[#78909C] mt-0.5 flex items-center gap-1">
                                                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                                                    {incident.id.substring(0, 8)}...
                                                                </span>
                                                                <span>•</span>
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[11px] font-medium">
                                                                    {incident.category.name}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1">
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${statusStyles.bg} ${statusStyles.text}`}
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                                {statusStyles.label}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-[#546E7A] border border-gray-100">
                                                                Priority: {incident.priority}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-[#546E7A] line-clamp-2 mt-1">
                                                        {incident.description}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#78909C]">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} className="text-[#0D7377]" />
                                                            <span className="truncate max-w-[200px]">
                                                                {incident.address || 'No location'}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} className="text-[#0D7377]" />
                                                            <span>{formatRelativeTime(incident.createdAt)}</span>
                                                        </span>
                                                        {incident.reporter && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-5 h-5 rounded-full bg-[#ECEFF1] flex items-center justify-center text-[10px] font-semibold text-[#546E7A]">
                                                                    {incident.reporter.firstName?.[0]}
                                                                    {incident.reporter.lastName?.[0]}
                                                                </span>
                                                                <span className="truncate max-w-[140px]">
                                                                    {incident.reporter.fullName}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* CTA */}
                                                <div className="hidden md:flex flex-col justify-center items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="rounded-full bg-[#0D7377] text-white hover:bg-[#14FFEC] hover:text-[#053B3E] transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/agent/incidents/${incident.id}`);
                                                        }}
                                                        icon={<ArrowRightCircle size={16} />}
                                                    >
                                                        Open
                                                    </Button>
                                                    {incident.rating && (
                                                        <div className="flex items-center gap-1 text-xs text-[#FFB347]">
                                                            <Star size={12} />
                                                            <span>{incident.rating.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {assignedPage && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Pagination
                                    page={assignedPage.number}
                                    totalPages={assignedPage.totalPages}
                                    totalElements={assignedPage.totalElements}
                                    size={assignedPage.size}
                                    onPageChange={handlePageChange}
                                    loading={loading || isRefreshing}
                                />
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right column: focus & tips */}
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-lg font-semibold text-[#263238] mb-2">
                            Today&apos;s Focus
                        </h2>
                        <p className="text-sm text-[#546E7A] mb-3">
                            Start with high-priority incidents, then move to new assignments.
                        </p>
                        <ul className="space-y-2 text-sm text-[#546E7A]">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#EF5350]" />
                                <span>
                                    Resolve <strong>HIGH</strong> priority incidents first to maintain
                                    service-level targets.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#0D7377]" />
                                <span>
                                    Keep citizens informed using comments whenever status changes.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FFB347]" />
                                <span>
                                    Close the loop by updating status to <strong>RESOLVED</strong>{' '}
                                    once work is completed.
                                </span>
                            </li>
                        </ul>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-[#263238] mb-2">
                            Shortcuts
                        </h2>
                        <div className="flex flex-col gap-2 text-sm">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/my-incidents')}
                            >
                                View incidents I reported
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/report')}
                            >
                                Report a new issue
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/profile')}
                            >
                                Update my profile & photo
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;

