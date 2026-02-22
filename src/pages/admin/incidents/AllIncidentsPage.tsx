import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, AlertTriangle, MapPin,
    Clock, Eye, RefreshCw,
    X, ArrowUp
} from 'lucide-react';
import { Card, Button, DataPulseLoader, CategoryIcon, Pagination } from '../../../components/common';
import { exportToCSV } from '../../../utils/exportUtils';
import { incidentService } from '../../../services/incidentService';
import type { Incident, Page } from '../../../services/incidentService';
import toast from 'react-hot-toast';

// Enhanced Status Config with Gradient/Glow
const statusConfig: Record<string, any> = {
    NEW: {
        bg: 'bg-[#14FFEC]/10',
        text: 'text-[#0D7377]',
        border: 'border border-[#14FFEC]',
        glow: 'shadow-[0_0_10px_rgba(20,255,236,0.3)]',
        label: 'New',
        icon: '🟢'
    },
    IN_PROGRESS: {
        bg: 'bg-[#0D7377]/10',
        text: 'text-[#0D7377]',
        border: 'border border-[#0D7377]',
        label: 'In Progress',
        icon: '🔵'
    },
    RESOLVED: {
        bg: 'bg-[#32936F]/10',
        text: 'text-[#32936F]',
        border: 'border border-[#32936F]',
        label: 'Resolved',
        icon: '✅'
    },
    CLOSED: {
        bg: 'bg-[#546E7A]/10',
        text: 'text-[#546E7A]',
        border: 'border border-[#546E7A]',
        label: 'Closed',
        icon: '⚫'
    },
    ASSIGNED: {
        bg: 'bg-[#0D7377]/10',
        text: 'text-[#0D7377]',
        border: 'border border-[#0D7377]',
        label: 'Assigned',
        icon: '👤'
    },
    VALIDATED: {
        bg: 'bg-[#32936F]/10',
        text: 'text-[#32936F]',
        border: 'border border-[#32936F]',
        label: 'Validated',
        icon: '✅'
    },
    REJECTED: {
        bg: 'bg-[#EF5350]/10',
        text: 'text-[#EF5350]',
        border: 'border border-[#EF5350]',
        label: 'Rejected',
        icon: '❌'
    },
    REOPENED: {
        bg: 'bg-[#FF9800]/10',
        text: 'text-[#FF9800]',
        border: 'border border-[#FF9800]',
        label: 'Reopened',
        icon: '🔄'
    }
};

// Enhanced Priority Config with Gradients
const priorityConfig = {
    HIGH: {
        gradient: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
        color: '#EF5350',
        label: 'High',
        icon: '🔴'
    },
    MEDIUM: {
        gradient: 'linear-gradient(135deg, #FFB347 0%, #FF9800 100%)',
        color: '#FFB347',
        label: 'Medium',
        icon: '🟠'
    },
    LOW: {
        gradient: 'linear-gradient(135deg, #B0BEC5 0%, #90A4AE 100%)',
        color: '#B0BEC5',
        label: 'Low',
        icon: '⚪'
    },
};

const PAGE_SIZE = 12;

const AllIncidentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState<Page<Incident> | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

    const fetchIncidents = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const data = await incidentService.getIncidents(undefined, undefined, pageNum, PAGE_SIZE);
            setIncidents(data.content);
            setPageData(data);
        } catch (error) {
            console.error('Failed to fetch incidents:', error);
            toast.error('Failed to load incidents');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncidents(page);
    }, [page, fetchIncidents]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Back to Top Logic
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Enhanced Client-side Filtering
    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch =
            inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inc.address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(inc.status);
        const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(inc.priority);

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const toggleStatus = (status: string) => {
        setSelectedStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const togglePriority = (priority: string) => {
        setSelectedPriorities(prev =>
            prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
        );
    };

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

    const handleExport = async () => {
        try {
            const allIncidents = await incidentService.getIncidents(undefined, undefined, 0, 1000); // Fetch up to 1000

            const exportData = allIncidents.content.map(incident => ({
                ID: incident.id,
                Title: incident.title,
                Status: incident.status,
                Priority: incident.priority,
                Category: incident.category?.name || 'Uncategorized',
                Address: incident.address,
                'Reported By': incident.reporter?.fullName || 'Unknown',
                'Assigned Agent': incident.assignedAgent?.fullName || 'Unassigned',
                'Date Reported': new Date(incident.createdAt).toLocaleDateString(),
                'Photos Count': incident.photos?.length || 0
            }));

            exportToCSV(exportData, `incidents_export_${new Date().toISOString().split('T')[0]}`);
            toast.success('Export started');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export incidents');
        }
    };

    // Scroll detection for sticky header
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter Chips Logic
    const activeFiltersCount =
        selectedStatuses.length +
        selectedPriorities.length +
        (searchTerm ? 1 : 0);
    // Add more when implementing multi-select priority/category

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatuses([]);
        setSelectedPriorities([]);
        setPage(0);
    };

    if (loading && incidents.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Enhanced Header */}
            <div className={`
                relative overflow-hidden rounded-3xl p-8 mb-8 text-white shadow-2xl
                bg-gradient-to-r from-[#0D7377] via-[#053B3E] to-[#263238]
            `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] mix-blend-overlay" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-[#14FFEC]">
                            <AlertTriangle size={20} className="animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">Admin Management</span>
                        </div>
                        <h1 className="text-4xl font-black font-['Noto_Sans_JP'] tracking-tight mb-2">
                            Incident
                        </h1>
                        <p className="text-gray-300 max-w-lg text-lg">
                            Monitor, manage, and resolve city infrastructure issues.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-3xl font-bold font-mono text-[#14FFEC]">
                                {pageData ? pageData.totalElements : 0}
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Active Incidents</div>
                        </div>


                    </div>
                </div>
            </div>

            {/* Sticky Filter Bar */}
            <div className={`
                sticky top-4 z-40 transition-all duration-300
                ${isSticky ? 'pt-0' : ''}
            `}>
                <div className={`
                    bg-white rounded-xl shadow-lg border border-gray-100 p-4
                    transition-all duration-300
                    ${isSticky ? 'shadow-2xl translate-y-2 scale-[1.01]' : ''}
                `}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative group">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D7377] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by title, ID, location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                                 focus:border-[#0D7377] focus:ring-4 focus:ring-[#0D7377]/10 outline-none transition-all font-medium text-[#263238]"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Actions Group */}
                            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                                {/* Priority Toggles */}
                                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    {['HIGH', 'MEDIUM', 'LOW'].map(priority => (
                                        <button
                                            key={priority}
                                            onClick={() => togglePriority(priority)}
                                            className={`
                                                px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1
                                                ${selectedPriorities.includes(priority)
                                                    ? 'bg-white shadow-sm text-[#263238] ring-1 ring-gray-200'
                                                    : 'text-gray-400 hover:text-gray-600'}
                                            `}
                                        >
                                            {priorityConfig[priority as keyof typeof priorityConfig]?.icon}
                                            {selectedPriorities.includes(priority) && priorityConfig[priority as keyof typeof priorityConfig]?.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-8 w-px bg-gray-200 mx-1" />

                                {/* Status Filter Dropdown (Simulated with simple buttons for now) */}
                                <div className="flex items-center gap-2">
                                    {['NEW', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => toggleStatus(status)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1
                                                ${selectedStatuses.includes(status)
                                                    ? `${statusConfig[status as keyof typeof statusConfig]?.bg} ${statusConfig[status as keyof typeof statusConfig]?.text} ${statusConfig[status as keyof typeof statusConfig]?.border}`
                                                    : 'bg-white border-dashed border-gray-300 text-gray-400 hover:border-gray-400'}
                                            `}
                                        >
                                            {statusConfig[status as keyof typeof statusConfig]?.icon}
                                            {/* Only show label if selected to save space */}
                                            {selectedStatuses.includes(status) && statusConfig[status as keyof typeof statusConfig]?.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-full w-px bg-gray-200 mx-2" />

                                <Button
                                    variant="ghost"
                                    icon={<RefreshCw size={18} className={loading ? 'animate-spin' : ''} />}
                                    onClick={() => { setPage(0); fetchIncidents(0); }}
                                    disabled={loading}
                                    className="hover:text-[#0D7377] hover:bg-[#0D7377]/5"
                                >
                                    Refresh
                                </Button>
                                <Button
                                    variant="ghost"
                                    icon={<Download size={18} />}
                                    onClick={handleExport}
                                    className="hover:text-[#0D7377] hover:bg-[#0D7377]/5"
                                >
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Active Filters Chips */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2">Active Filters:</span>

                                {selectedStatuses.map(status => (
                                    <span key={status} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0D7377]/10 text-[#0D7377] text-sm font-medium border border-[#0D7377]/20">
                                        {statusConfig[status as keyof typeof statusConfig]?.label}
                                        <button onClick={() => toggleStatus(status)} className="hover:text-red-500 ml-1"><X size={12} /></button>
                                    </span>
                                ))}

                                {selectedPriorities.map(p => (
                                    <span key={p} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium border border-orange-200">
                                        {priorityConfig[p as keyof typeof priorityConfig]?.label}
                                        <button onClick={() => togglePriority(p)} className="hover:text-red-500 ml-1"><X size={12} /></button>
                                    </span>
                                ))}

                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0D7377]/10 text-[#0D7377] text-sm font-medium border border-[#0D7377]/20">
                                        Search: {searchTerm}
                                        <button onClick={() => setSearchTerm('')} className="hover:text-red-500 ml-1"><X size={12} /></button>
                                    </span>
                                )}

                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-gray-500 hover:text-red-500 underline ml-auto font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Page loading overlay */}
            {loading && (
                <div className="flex justify-center py-6">
                    <DataPulseLoader size={40} />
                </div>
            )}

            {/* Incidents List */}
            <div className="space-y-4 perspective-1000 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredIncidents.map((incident, index) => (
                        <motion.div
                            key={incident.id}
                            layout
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer border border-gray-100"
                            onClick={() => navigate(`/admin/incidents/${incident.id}`)}
                            style={{
                                borderLeft: `4px solid ${priorityConfig[incident.priority]?.color || '#B0BEC5'}`
                            }}
                        >
                            {/* New Status Pulse Effect */}
                            {incident.status === 'NEW' && (
                                <div className="absolute inset-0 bg-[#14FFEC]/5 animate-pulse pointer-events-none" />
                            )}

                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Large Category Badge */}
                                    <div className="flex-shrink-0">
                                        <CategoryIcon
                                            iconName={incident.category.icon || incident.category.name}
                                            variant="badge"
                                            size={32}
                                            className="transform group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-[#263238] font-['Noto_Sans_JP'] truncate group-hover:text-[#0D7377] transition-colors">
                                                    {incident.title}
                                                </h3>
                                                <p className="text-sm text-[#546E7A] flex items-center gap-2 mt-1">
                                                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                                        {incident.id.substring(0, 8)}...
                                                    </span>
                                                    <span>•</span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        {incident.category.name}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Status & Priority Badges (Top Right) */}
                                            <div className="flex flex-col items-end gap-2">
                                                <span
                                                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                                                    style={{ background: priorityConfig[incident.priority]?.gradient || '#B0BEC5' }}
                                                >
                                                    {priorityConfig[incident.priority]?.label}
                                                </span>

                                                <span className={`
                                                    flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${statusConfig[incident.status]?.bg} 
                                                    ${statusConfig[incident.status]?.text}
                                                    ${statusConfig[incident.status]?.border}
                                                    ${(statusConfig[incident.status] as any)?.glow || ''}
                                                `}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {statusConfig[incident.status]?.label}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-[#546E7A] text-sm leading-relaxed mb-4 line-clamp-2 w-11/12">
                                            {incident.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                                <MapPin size={16} className="text-[#0D7377]" />
                                                <span className="truncate max-w-[200px]">{incident.address || 'No Location'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                                <Clock size={16} className="text-[#0D7377]" />
                                                <span>{formatDate(incident.createdAt)}</span>
                                            </div>
                                            {incident.assignedAgent ? (
                                                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-[#0D7377]/5 rounded-full text-sm border border-[#0D7377]/20">
                                                    <span className="text-[#0D7377] font-medium">{incident.assignedAgent.fullName}</span>
                                                </div>
                                            ) : (
                                                <div className="ml-auto px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">Unassigned</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Simple Details Button Column */}
                                    <div className="flex flex-col items-center justify-center gap-2 min-w-[80px]">
                                        <Button
                                            className="bg-[#0D7377] hover:bg-[#14FFEC] hover:text-[#053B3E] text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md transition-all"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/incidents/${incident.id}`);
                                            }}
                                        >
                                            <Eye size={16} />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>

            {/* Pagination */}
            {pageData && (
                <Card padding="md">
                    <Pagination
                        page={pageData.number}
                        totalPages={pageData.totalPages}
                        totalElements={pageData.totalElements}
                        size={pageData.size}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </Card>
            )}

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 bg-[#0D7377] text-white p-3 rounded-full shadow-2xl hover:bg-[#14FFEC] hover:text-[#053B3E] transition-colors z-50 hover:scale-110"
                    >
                        <ArrowUp size={24} strokeWidth={2.5} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!loading && filteredIncidents.length === 0 && (
                <Card className="text-center py-16">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-[#B0BEC5]" />
                    <h3 className="text-xl font-semibold text-[#263238] mb-2">No incidents found</h3>
                    <p className="text-[#546E7A]">Try adjusting your search or filters</p>
                </Card>
            )}
        </div>
    );
};

export default AllIncidentsPage;
