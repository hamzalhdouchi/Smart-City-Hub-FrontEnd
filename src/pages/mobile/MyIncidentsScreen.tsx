import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Rocket, X } from 'lucide-react';
import { incidentService, type Incident } from '../../services/incidentService';
import { useAuth } from '../../context/AuthContext';
import { DataPulseLoader, Pagination } from '../../components/common';
import type { Page } from '../../services/incidentService';

// Redesign Components
import { HeroHeader } from './my-incidents/redesign/HeroHeader';
import { QuickStatsCards } from './my-incidents/redesign/QuickStatsCards';
import { MiniStatsCarousel } from './my-incidents/redesign/MiniStatsCarousel';
import { EnhancedIncidentCard } from './my-incidents/redesign/EnhancedIncidentCard';

export const MyIncidentsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState<Page<Incident> | null>(null);
    const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (location.state?.showSuccess) {
            setShowSuccessToast(true);
            // Clear location state to prevent toast on refresh
            window.history.replaceState({}, document.title);

            // Auto hide after 5 seconds
            const timer = setTimeout(() => {
                setShowSuccessToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location]);
    // Remove activeFilter as it's no longer used due to filter removal

    const fetchIncidents = async (pageNum: number = 0) => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const data = await incidentService.getMyIncidents(pageNum, 6);
            setIncidents(data.content || []);
            setPageData(data);
        } catch (error) {
            console.error('Error fetching user incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    // Separate fetch for stats — gets all incidents regardless of pagination
    useEffect(() => {
        if (!user?.id) return;
        incidentService.getMyIncidents(0, 500).then(data => {
            setAllIncidents(data.content || []);
        }).catch(() => {});
    }, [user?.id]);

    useEffect(() => {
        fetchIncidents(page);
    }, [user?.id, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const stats = useMemo(() => {
        const src = allIncidents.length > 0 ? allIncidents : incidents;
        const active = src.filter(i => !['RESOLVED', 'CLOSED', 'VALIDATED', 'REJECTED'].includes(i.status)).length;
        const resolved = src.filter(i => ['RESOLVED', 'VALIDATED'].includes(i.status)).length;
        const total = src.length;

        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        const now = new Date();
        const thisMonth = src.filter(i => {
            const d = new Date(i.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        const withResolved = src.filter(i =>
            ['RESOLVED', 'VALIDATED'].includes(i.status) && i.resolvedAt
        );
        const avgResponseDays = withResolved.length > 0
            ? Math.round(
                withResolved.reduce((sum, i) => {
                    const diff = new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime();
                    return sum + diff / (1000 * 60 * 60 * 24);
                }, 0) / withResolved.length
            )
            : null;

        return { active, resolved, resolutionRate, thisMonth, avgResponseDays, total };
    }, [allIncidents, incidents]);

    const filteredIncidents = incidents;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center">
                <DataPulseLoader size={64} />
                <p className="mt-6 text-slate-500 font-bold animate-pulse">Loading your journey...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <HeroHeader />

            {/* Success Toast Notification */}
            {showSuccessToast && (
                <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 max-w-sm w-full">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-teal-100 p-4 flex items-start gap-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-emerald-500" />
                        <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                            <Rocket size={16} className="text-teal-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-slate-800 text-[14px] mb-0.5">Report Submitted! 🎉</h3>
                            <p className="text-slate-500 text-[12px] font-medium leading-snug">
                                Successfully sent. +50 XP
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <QuickStatsCards active={stats.active} resolved={stats.resolved} />

            <MiniStatsCarousel
                totalReports={stats.total}
                resolutionRate={stats.resolutionRate}
                thisMonth={stats.thisMonth}
                avgResponseDays={stats.avgResponseDays}
            />

            {/* Reports Section */}
            <div className="px-5 mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xl font-black text-slate-800">My Reports</h2>
                {isDesktop && pageData && (
                    <span className="text-sm font-medium" style={{ color: '#B0BEC5' }}>
                        {pageData.totalElements} reports
                    </span>
                )}
            </div>

            {filteredIncidents.length > 0 ? (
                <>
                    <div className={isDesktop
                        ? 'grid grid-cols-2 xl:grid-cols-3 gap-4 px-5 mb-2'
                        : 'space-y-1'
                    }>
                        {filteredIncidents.map(incident => (
                            <EnhancedIncidentCard
                                key={incident.id}
                                incident={incident}
                                onView={() => navigate(`/incidents/${incident.id}`)}
                                inGrid={isDesktop}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pageData && (
                        <div className="mx-5 mt-4 mb-2 bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-2">
                            <Pagination
                                page={pageData.number}
                                totalPages={pageData.totalPages}
                                totalElements={pageData.totalElements}
                                size={pageData.size}
                                onPageChange={handlePageChange}
                                loading={loading}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="px-10 py-16 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative overflow-hidden">
                        <div className="w-10 h-10 border-4 border-slate-100 rounded-lg flex items-center justify-center rotate-12">
                            <div className="w-4 h-1 bg-slate-100 rounded-full mb-1" />
                            <div className="w-4 h-1 bg-slate-100 rounded-full" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal-50/30" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">
                        Start Making Impact!
                    </h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Report your first incident and help improve your city
                    </p>
                </div>
            )}
        </div>
    );
};

