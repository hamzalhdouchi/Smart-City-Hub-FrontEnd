import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { HeroGallery } from './components/incident-detail/HeroGallery';
import { TitleDescriptionCard } from './components/incident-detail/TitleDescriptionCard';
import { QuickInfoCard } from './components/incident-detail/QuickInfoCard';
import { StatusTimelineCard } from './components/incident-detail/StatusTimelineCard';
import { MapCard } from './components/incident-detail/MapCard';
import { AgentProfileCard } from './components/incident-detail/AgentProfileCard';
import { CommentsSection } from './components/incident-detail/CommentsSection';
import { RatingSection } from './components/incident-detail/RatingSection';
import { ActionButtons } from './components/incident-detail/ActionButtons';
import { incidentService } from '../../services/incidentService';
import { useAuth } from '../../context/AuthContext';
import type { IncidentDetail } from '../../types/incident';
import { DataPulseLoader } from '../../components/common/DataPulseLoader';

export const IncidentDetailScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [incident, setIncident] = useState<IncidentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: `Incident: ${incident?.title}`,
            text: `Check out this incident: ${incident?.title}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy link
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchIncident = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await incidentService.getIncidentById(id);

                // Fetch comments separately since backend doesn't include them in incident response
                const commentsData = await incidentService.getComments(id);
                console.log('Fetched comments separately:', commentsData);

                // Build status history
                const statusHistory = [];
                statusHistory.push({
                    status: 'NEW' as const,
                    timestamp: new Date(data.createdAt),
                    actor: data.reporter.fullName,
                    note: undefined
                });

                if (data.assignedAgent) {
                    statusHistory.push({
                        status: 'ASSIGNED' as const,
                        timestamp: new Date(data.updatedAt),
                        actor: data.assignedAgent.fullName,
                        note: undefined
                    });
                }

                // If status is IN_PROGRESS or beyond, add it
                if (data.status === 'IN_PROGRESS' || data.status === 'RESOLVED' || data.status === 'VALIDATED') {
                    statusHistory.push({
                        status: 'IN_PROGRESS' as const,
                        timestamp: new Date(data.updatedAt),
                        actor: data.assignedAgent?.fullName,
                        note: undefined
                    });
                }

                // If resolved, add RESOLVED status
                if (data.status === 'RESOLVED' || data.status === 'VALIDATED') {
                    statusHistory.push({
                        status: 'RESOLVED' as const,
                        timestamp: (data as any).resolvedAt ? new Date((data as any).resolvedAt) : new Date(data.updatedAt),
                        actor: data.assignedAgent?.fullName,
                        note: undefined
                    });
                }

                // Map comments to expected format
                const mappedComments = commentsData.map((comment: any) => ({
                    id: comment.id?.toString() || '',
                    content: comment.content || '',
                    author: {
                        id: comment.authorId || '',
                        name: comment.authorName || 'Unknown',
                        avatarUrl: comment.authorPhotoUrl || undefined,
                        role: comment.authorRole || undefined
                    },
                    createdAt: new Date(comment.createdAt),
                    isOwn: comment.authorId === user?.id
                }));

                // Cast to IncidentDetail and provide defaults for optional fields
                console.log('Raw incident data from backend:', data);
                console.log('Mapped comments:', mappedComments);

                setIncident({
                    ...data,
                    statusHistory,
                    comments: mappedComments,
                    userRating: (data as any).userRating || undefined
                } as IncidentDetail);
            } catch (err) {
                console.error('Failed to fetch incident:', err);
                setError('Failed to load incident details');
            } finally {
                setLoading(false);
            }
        };

        fetchIncident();
    }, [id]);

    const handlePostComment = async (content: string) => {
        if (!id) return;
        await incidentService.postComment(id, content);
        // Re-fetch incident and comments
        const data = await incidentService.getIncidentById(id);
        const commentsData = await incidentService.getComments(id);

        // Rebuild status history (same logic as initial fetch)
        const statusHistory = [];
        statusHistory.push({
            status: 'NEW' as const,
            timestamp: new Date(data.createdAt),
            actor: data.reporter.fullName,
            note: undefined
        });

        if (data.assignedAgent) {
            statusHistory.push({
                status: 'ASSIGNED' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent.fullName,
                note: undefined
            });
        }

        if (data.status === 'IN_PROGRESS' || data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'IN_PROGRESS' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        if (data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'RESOLVED' as const,
                timestamp: (data as any).resolvedAt ? new Date((data as any).resolvedAt) : new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        // Map comments
        const mappedComments = commentsData.map((comment: any) => ({
            id: comment.id?.toString() || '',
            content: comment.content || '',
            author: {
                id: comment.authorId || '',
                name: comment.authorName || 'Unknown',
                avatarUrl: comment.authorPhotoUrl || undefined,
                role: comment.authorRole || undefined
            },
            createdAt: new Date(comment.createdAt),
            isOwn: comment.authorId === user?.id
        }));

        setIncident({
            ...data,
            statusHistory,
            comments: mappedComments,
            userRating: (data as any).userRating || undefined
        } as IncidentDetail);
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!id) return;
        await incidentService.deleteComment(id, commentId);
        // Re-fetch incident and comments
        const data = await incidentService.getIncidentById(id);
        const commentsData = await incidentService.getComments(id);

        // Rebuild status history
        const statusHistory = [];
        statusHistory.push({
            status: 'NEW' as const,
            timestamp: new Date(data.createdAt),
            actor: data.reporter.fullName,
            note: undefined
        });

        if (data.assignedAgent) {
            statusHistory.push({
                status: 'ASSIGNED' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent.fullName,
                note: undefined
            });
        }

        if (data.status === 'IN_PROGRESS' || data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'IN_PROGRESS' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        if (data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'RESOLVED' as const,
                timestamp: (data as any).resolvedAt ? new Date((data as any).resolvedAt) : new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        // Map comments
        const mappedComments = commentsData.map((comment: any) => ({
            id: comment.id?.toString() || '',
            content: comment.content || '',
            author: {
                id: comment.authorId || '',
                name: comment.authorName || 'Unknown',
                avatarUrl: comment.authorPhotoUrl || undefined,
                role: comment.authorRole || undefined
            },
            createdAt: new Date(comment.createdAt),
            isOwn: comment.authorId === user?.id
        }));

        setIncident({
            ...data,
            statusHistory,
            comments: mappedComments,
            userRating: (data as any).userRating || undefined
        } as IncidentDetail);
    };

    const handleSubmitRating = async (rating: number, feedback?: string) => {
        if (!id) return;
        await incidentService.rateIncident(id, rating, feedback);
        // Refresh incident data
        const data = await incidentService.getIncidentById(id);

        // Rebuild status history
        const statusHistory = [];
        statusHistory.push({
            status: 'NEW' as const,
            timestamp: new Date(data.createdAt),
            actor: data.reporter.fullName,
            note: undefined
        });

        if (data.assignedAgent) {
            statusHistory.push({
                status: 'ASSIGNED' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent.fullName,
                note: undefined
            });
        }

        if (data.status === 'IN_PROGRESS' || data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'IN_PROGRESS' as const,
                timestamp: new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        if (data.status === 'RESOLVED' || data.status === 'VALIDATED') {
            statusHistory.push({
                status: 'RESOLVED' as const,
                timestamp: (data as any).resolvedAt ? new Date((data as any).resolvedAt) : new Date(data.updatedAt),
                actor: data.assignedAgent?.fullName,
                note: undefined
            });
        }

        setIncident({
            ...data,
            statusHistory,
            comments: (data as any).comments || [],
            userRating: (data as any).userRating || undefined
        } as IncidentDetail);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA]">
                <DataPulseLoader size={80} />
                <p className="mt-6 text-slate-500 font-medium animate-pulse">Loading Incident Details...</p>
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B2DFDB] p-4">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F44336] flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl">!</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#263238] mb-2">Oops!</h2>
                    <p className="text-[#546E7A] mb-4">{error || 'Incident not found'}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0A5A5D]"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const canRate = incident.status === 'RESOLVED' && incident.reporter.id === user?.id && !incident.userRating;

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-6">
            {/* Navbar */}
            <header className="sticky top-0 z-[9999] bg-white shadow-sm transition-all duration-300">
                <div className="flex items-center justify-between px-4 py-3 max-w-[1400px] mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#0D7377] font-semibold hover:underline"
                    >
                        <ArrowLeft size={24} />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {scrolled && (
                        <div
                            className="px-3 py-1 rounded-full text-white text-sm font-bold"
                            style={{
                                backgroundColor:
                                    incident.status === 'NEW' ? '#FFB347' :
                                        incident.status === 'ASSIGNED' ? '#2196F3' :
                                            incident.status === 'IN_PROGRESS' ? '#0D7377' :
                                                incident.status === 'RESOLVED' ? '#32936F' :
                                                    incident.status === 'VALIDATED' ? '#4CAF50' :
                                                        incident.status === 'REJECTED' ? '#F44336' :
                                                            incident.status === 'REOPENED' ? '#FF9800' : '#546E7A'
                            }}
                        >
                            {incident.status.replace('_', ' ')}
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className={`p-2 rounded-full transition-all duration-300 ${copied
                                ? 'bg-green-100 text-green-600'
                                : 'text-[#546E7A] hover:bg-gray-100 hover:text-[#263238]'
                                }`}
                        >
                            {copied ? (
                                <Check size={24} />
                            ) : (
                                <Share2 size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Desktop Grid Container */}
            <div className="max-w-[1280px] mx-auto px-3 lg:px-6 mt-6">
                <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">

                    {/* Main Content */}
                    <div className="space-y-6 lg:max-w-[800px]">
                        {/* Hero Gallery */}
                        <div
                            className="w-full rounded-2xl overflow-hidden"
                            style={{
                                background: '#FFFFFF',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            <HeroGallery
                                photos={incident.photos.map(p => p.fileUrl || p.url)}
                                status={incident.status}
                                priority={incident.priority}
                            />
                        </div>

                        <TitleDescriptionCard
                            title={incident.title}
                            description={incident.description}
                            category={incident.category.name}
                            categoryIcon={incident.category.icon}
                        />

                        {/* Agent Profile (Moved from sidebar) */}
                        <AgentProfileCard agent={incident.assignedAgent ? {
                            id: incident.assignedAgent.id,
                            name: incident.assignedAgent.fullName,
                            role: 'Agent',
                            avatarUrl: incident.assignedAgent.photoUrl,
                            latestUpdate: undefined
                        } : undefined} />

                        <MapCard
                            latitude={incident.latitude}
                            longitude={incident.longitude}
                            address={incident.address}
                            city=""
                        />

                        <CommentsSection
                            comments={incident.comments || []}
                            onPostComment={handlePostComment}
                            onDeleteComment={handleDeleteComment}
                        />

                        <RatingSection
                            canRate={canRate}
                            existingRating={incident.userRating}
                            onSubmitRating={handleSubmitRating}
                        />

                        <ActionButtons
                            lastUpdated={new Date(incident.updatedAt)}
                            incidentId={incident.id}
                        />
                    </div>

                    {/* Sidebar (Desktop only) */}
                    <div className="hidden lg:block lg:sticky lg:top-24 space-y-3">
                        <QuickInfoCard
                            location={incident.address || ''}
                            city=""
                            reportedAt={new Date(incident.createdAt)}
                            reporterName={incident.reporter.fullName}
                            isCurrentUser={incident.reporter.id === user?.id}
                            assignedAgent={incident.assignedAgent ? {
                                name: incident.assignedAgent.fullName,
                                role: 'Agent'
                            } : undefined}
                        />

                        <StatusTimelineCard
                            history={incident.statusHistory || []}
                            currentStatus={incident.status}
                        />
                    </div>

                    {/* Mobile/Tablet Cards (shown below main content) */}
                    <div className="lg:hidden space-y-3 mt-3">
                        <QuickInfoCard
                            location={incident.address || ''}
                            city=""
                            reportedAt={new Date(incident.createdAt)}
                            reporterName={incident.reporter.fullName}
                            isCurrentUser={incident.reporter.id === user?.id}
                            assignedAgent={incident.assignedAgent ? {
                                name: incident.assignedAgent.fullName,
                                role: 'Agent'
                            } : undefined}
                        />

                        <StatusTimelineCard
                            history={incident.statusHistory || []}
                            currentStatus={incident.status}
                        />

                        <AgentProfileCard agent={incident.assignedAgent ? {
                            id: incident.assignedAgent.id,
                            name: incident.assignedAgent.fullName,
                            role: 'Agent',
                            avatarUrl: incident.assignedAgent.photoUrl,
                            latestUpdate: undefined
                        } : undefined} />
                    </div>
                </div>
            </div>
        </div>
    );
};
