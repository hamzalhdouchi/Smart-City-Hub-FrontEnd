import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, type Incident, type IncidentStatus } from '../../services/incidentService';
import { userService } from '../../services/userService';
import { theme } from '../../styles/theme';
import { EmptyState, toast, WeatherWidget, FilterChip } from '../../components/mobile';
import { Pagination } from '../../components/common';
import type { Page } from '../../services/incidentService';
import { Search, Sun, Moon, Cloud, MapPin } from 'lucide-react';
import { IncidentFeedCard } from '../../components/mobile/IncidentFeedCard';
import FilterBottomSheet from '../../components/mobile/FilterBottomSheet';

const statusFilters: { label: string; value: IncidentStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'New', value: 'NEW' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
];

export const HomeScreen: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState<Page<Incident> | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | 'ALL'>('ALL');
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Derive initials from user object
    const profileUser = user as any;
    const initials = profileUser?.firstName && profileUser?.lastName
        ? `${profileUser.firstName.charAt(0)}${profileUser.lastName.charAt(0)}`
        : 'U';

    // Fetch profile photo
    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const url = await userService.getMyProfilePhoto();
                if (url) setPhotoUrl(url);
            } catch (error) {
                console.error('Failed to fetch photo', error);
            }
        };
        fetchPhoto();
    }, []);

    // Get greeting based on time of day with creative icon styling
    const getGreeting = () => {
        const hour = new Date().getHours();
        const iconProps = {
            size: 20,
            className: "animate-float drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        };

        if (hour < 12) return {
            text: 'Good morning',
            icon: <Sun {...iconProps} style={{ color: '#FFD700' }} />
        };
        if (hour < 18) return {
            text: 'Good afternoon',
            icon: <Cloud {...iconProps} style={{ color: '#E0E0E0' }} />
        };
        return {
            text: 'Good evening',
            icon: <Moon {...iconProps} style={{ color: '#B0C4DE' }} />
        };
    };

    const greeting = getGreeting();

    // Fetch incidents based on filters
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                setLoading(true);
                const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
                const result = await incidentService.getIncidents(status, undefined, page, 12);
                setIncidents(result.content);
                setPageData(result);
            } catch (error) {
                console.error('Failed to fetch incidents:', error);
                toast.error('Failed to load incidents');
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, [page, selectedStatus]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle incident click
    const handleIncidentClick = (id: string) => {
        navigate(`/incidents/${id}`);
    };

    return (
        <div className="min-h-screen relative lg:bg-[#F5F7FA]" style={{ backgroundColor: !isDesktop ? theme.colors.neutral.glass : undefined }}>
            {/* Sticky Header Container */}
            <header
                className="sticky top-0 z-40"
                style={{ background: 'linear-gradient(135deg, #0a4f54 0%, #0d7377 55%, #0e9e8e 100%)' }}
            >
                {isDesktop ? (
                    // DESKTOP: Teal Command Header
                    <div className="relative w-full max-w-[1200px] mx-auto py-5 px-8 overflow-hidden">
                        {/* Ambient glow orbs */}
                        <div className="absolute top-0 right-0 w-80 h-20 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
                        <div className="absolute bottom-0 left-0 w-60 h-16 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

                        <div className="relative flex items-center justify-between">
                            {/* Left: Avatar + Identity */}
                            <div className="flex items-center gap-4">
                                <div className="relative cursor-pointer" onClick={() => navigate('/my-incidents')}>
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                                                <span className="text-white font-black text-base">{initials}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-teal-700 shadow-sm" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/65 uppercase tracking-[0.22em] mb-0.5">
                                        {greeting.text}
                                    </p>
                                    <h1 className="text-lg font-black text-white leading-none flex items-center gap-2 drop-shadow-sm">
                                        {user?.firstName}! {greeting.icon}
                                    </h1>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <MapPin size={10} className="text-white/50" />
                                        <span className="text-[11px] text-white/55 font-medium">Casablanca, Morocco</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Brand */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center select-none">
                                <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Smart City</span>
                                <span className="text-xl font-black text-white tracking-widest leading-none drop-shadow-sm">HUB</span>
                            </div>

                            {/* Right: Live + Search */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Live</span>
                                </div>
                                <button
                                    onClick={() => navigate('/search')}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 transition-all"
                                    aria-label="Search"
                                >
                                    <Search size={18} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom scan line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-white/10">
                            <div className="absolute top-0 h-full w-40 desktop-scan-line"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                        </div>
                    </div>
                ) : (
                    // MOBILE: Teal Command Header
                    <div className="relative px-5 pt-4 pb-3 overflow-hidden">
                        {/* Ambient glow orbs */}
                        <div className="absolute top-0 right-0 w-64 h-32 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />
                        <div className="absolute bottom-0 left-0 w-48 h-20 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

                        <div className="relative flex items-center justify-between">
                            {/* Left: Avatar + Greeting */}
                            <div className="flex items-center gap-3.5">
                                <div className="relative cursor-pointer" onClick={() => navigate('/my-incidents')}>
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/20">
                                                <span className="text-white font-black text-base">{initials}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-teal-800 shadow-sm" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live
                                    </p>
                                    <h1 className="text-[18px] font-black text-white leading-none mb-1 flex items-center gap-2 drop-shadow-sm">
                                        {greeting.text}, {user?.firstName?.split(' ')[0]}! {greeting.icon}
                                    </h1>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} className="text-white/50" />
                                        <span className="text-[11px] text-white/60 font-medium">Casablanca District</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Search */}
                            <button
                                onClick={() => navigate('/search')}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 border border-white/25 hover:bg-white/25 active:scale-95 transition-all"
                                aria-label="Search"
                            >
                                <Search size={18} className="text-white" />
                            </button>
                        </div>

                        {/* Bottom scan line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-white/10">
                            <div className="absolute top-0 h-full w-32 desktop-scan-line"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                        </div>
                    </div>
                )}

                {/* Status Filter Row — shown on all screen sizes */}
                <div className="border-t border-white/10" style={{ background: 'rgba(0,0,0,0.15)' }}>
                    <div className="px-5 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mr-1 shrink-0">Filter</span>
                        {statusFilters.map((filter) => {
                            const isActive = selectedStatus === filter.value;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => { setPage(0); setSelectedStatus(filter.value); setPageData(null); }}
                                    className="px-4 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0"
                                    style={isActive ? {
                                        background: 'rgba(255,255,255,0.95)',
                                        border: '1px solid rgba(255,255,255,1)',
                                        color: '#0d7377',
                                    } : {
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: 'rgba(255,255,255,0.7)',
                                    }}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header >

            <style>{`
                @keyframes animate-pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }

                @keyframes radar-ping {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .animate-pulse-red {
                    animation: animate-pulse-red 2s infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-radar-ping {
                    animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                @keyframes desktopScan {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(900%);  }
                }
                .desktop-scan-line {
                    animation: desktopScan 4s ease-in-out infinite;
                }
            `}</style>




            {/* Main Content */}
            <main className="px-4 pb-20 mt-2 lg:px-8 xl:px-14 2xl:px-20 lg:mt-6">
                {/* Weather Widget - Hide on desktop if needed, or keep */}
                <div className="mb-4 mt-4 lg:hidden">
                    <WeatherWidget />
                </div>

                {/* Active Status Filter Indicator */}
                {selectedStatus !== 'ALL' && (
                    <div className="mb-4 lg:mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:text-xs">
                                Current View
                            </span>
                            <button
                                onClick={() => {
                                    setPage(0);
                                    setSelectedStatus('ALL');
                                }}
                                className="text-xs font-semibold text-[#0D7377] lg:text-sm lg:hover:text-[#14FFEC]"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip
                                label={`${statusFilters.find((f) => f.value === selectedStatus)?.label} Incidents`}
                                isActive={true}
                                onClick={() => {
                                    setPage(0);
                                    setSelectedStatus('ALL');
                                }}
                                onRemove={() => {
                                    setPage(0);
                                    setSelectedStatus('ALL');
                                }}
                                variant="active"
                                size="small"
                            />
                        </div>
                    </div>
                )}

                {/* Incident Feed */}
                {loading && page === 0 ? (
                    // Loading skeleton
                    <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl overflow-hidden animate-pulse"
                                style={{ height: '320px' }}
                            >
                                <div className="bg-gray-200 h-48 lg:h-64" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : incidents.length === 0 ? (
                    // Empty state
                    <EmptyState
                        icon={<div className="text-6xl">🏙️✨</div>}
                        title="All Clear!"
                        description="No incidents reported yet. Your city is running smoothly."
                        action={{
                            label: 'Report First Incident',
                            onClick: () => navigate('/report'),
                        }}
                    />
                ) : (
                    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-5">
                        {/* Incident cards */}
                        {incidents.map((incident) => (
                            <IncidentFeedCard
                                key={incident.id}
                                incident={incident}
                                onClick={() => handleIncidentClick(incident.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pageData && (
                    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2">
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
            </main>

            {/* Mobile Filter Menu (Bottom Sheet) */}
            <FilterBottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={statusFilters.map(f => ({
                    id: f.value,
                    name: f.label,
                    icon: '🏷️',
                    slug: f.value.toLowerCase(),
                    description: '',
                    color: '#0D7377',
                    active: false
                }))}
                selectedCategories={selectedStatus === 'ALL' ? [] : [selectedStatus]}
                onCategoryToggle={(id) => {
                    setSelectedStatus(id as IncidentStatus | 'ALL');
                    setIsFilterOpen(false);
                }}
                onClearAll={() => setSelectedStatus('ALL')}
            />
        </div >
    );
};

export default HomeScreen;
