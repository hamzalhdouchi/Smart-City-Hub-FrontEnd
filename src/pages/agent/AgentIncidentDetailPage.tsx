import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, UploadCloud, Loader2 } from 'lucide-react';
import { HeroGallery } from '../mobile/components/incident-detail/HeroGallery';
import { TitleDescriptionCard } from '../mobile/components/incident-detail/TitleDescriptionCard';
import { QuickInfoCard } from '../mobile/components/incident-detail/QuickInfoCard';
import { StatusTimelineCard } from '../mobile/components/incident-detail/StatusTimelineCard';
import { MapCard } from '../mobile/components/incident-detail/MapCard';
import { CommentsSection } from '../mobile/components/incident-detail/CommentsSection';
import { Card, Button, DataPulseLoader } from '../../components/common';
import { incidentService } from '../../services/incidentService';
import { incidentPhotoService } from '../../services/incidentPhotoService';
import { useAuth } from '../../context/AuthContext';
import type { IncidentDetail } from '../../types/incident';
import toast from 'react-hot-toast';

const AgentIncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [incident, setIncident] = useState<IncidentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isResolving, setIsResolving] = useState(false);
    const [showResolvePanel, setShowResolvePanel] = useState(false);
    const [resolveFiles, setResolveFiles] = useState<File[]>([]);
    const [resolveComment, setResolveComment] = useState('');

    const loadIncident = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await incidentService.getIncidentById(id);
            const commentsData = await incidentService.getComments(id);

            const statusHistory = [];
            statusHistory.push({
                status: 'NEW' as const,
                timestamp: new Date(data.createdAt),
                actor: data.reporter.fullName,
                note: undefined,
            });

            if (data.assignedAgent) {
                statusHistory.push({
                    status: 'ASSIGNED' as const,
                    timestamp: new Date(data.updatedAt),
                    actor: data.assignedAgent.fullName,
                    note: undefined,
                });
            }

            if (data.status === 'IN_PROGRESS' || data.status === 'RESOLVED' || data.status === 'VALIDATED') {
                statusHistory.push({
                    status: 'IN_PROGRESS' as const,
                    timestamp: new Date(data.updatedAt),
                    actor: data.assignedAgent?.fullName,
                    note: undefined,
                });
            }

            if (data.status === 'RESOLVED' || data.status === 'VALIDATED') {
                statusHistory.push({
                    status: 'RESOLVED' as const,
                    timestamp: (data as any).resolvedAt ? new Date((data as any).resolvedAt) : new Date(data.updatedAt),
                    actor: data.assignedAgent?.fullName,
                    note: undefined,
                });
            }

            const mappedComments = commentsData.map((comment: any) => ({
                id: comment.id?.toString() || '',
                content: comment.content || '',
                author: {
                    id: comment.authorId || '',
                    name: comment.authorName || 'Unknown',
                    avatarUrl: comment.authorPhotoUrl || undefined,
                    role: comment.authorRole || undefined,
                },
                createdAt: new Date(comment.createdAt),
                isOwn: comment.authorId === user?.id,
            }));

            setIncident({
                ...data,
                statusHistory,
                comments: mappedComments,
                userRating: (data as any).userRating || undefined,
            } as IncidentDetail);
        } catch (e) {
            console.error('Failed to load incident for agent:', e);
            setError('Failed to load incident details');
        } finally {
            setLoading(false);
        }
    }, [id, user?.id]);

    useEffect(() => {
        loadIncident();
    }, [loadIncident]);

    const handlePostComment = async (content: string) => {
        if (!id) return;
        await incidentService.postComment(id, content);
        await loadIncident();
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!id) return;
        await incidentService.deleteComment(id, commentId);
        await loadIncident();
    };

    const handleStartWork = async () => {
        if (!id || !incident) return;
        try {
            await incidentService.updateStatus(id, { status: 'IN_PROGRESS' });
            toast.success('Incident marked as IN PROGRESS');
            await loadIncident();
        } catch (e) {
            console.error('Failed to update status:', e);
            toast.error('Failed to update status');
        }
    };

    const handleResolve = async () => {
        if (!id || !incident) return;
        if (resolveFiles.length === 0) {
            toast.error('Please upload at least one photo of the resolved incident.');
            return;
        }
        try {
            setIsResolving(true);
            await incidentPhotoService.uploadPhotos(id, resolveFiles);
            await incidentService.updateStatus(id, { status: 'RESOLVED', comment: resolveComment || undefined });
            toast.success('Incident marked as RESOLVED and photos uploaded for admin review');
            setShowResolvePanel(false);
            setResolveFiles([]);
            setResolveComment('');
            await loadIncident();
        } catch (e) {
            console.error('Failed to resolve incident:', e);
            toast.error('Failed to resolve incident. Please try again.');
        } finally {
            setIsResolving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-[#EF5350] font-semibold mb-2">Could not load incident details.</p>
                <Button onClick={() => navigate(-1)}>Go back</Button>
            </div>
        );
    }

    const canStartWork = incident.status === 'ASSIGNED';
    const canResolve = incident.status === 'IN_PROGRESS' || incident.status === 'ASSIGNED';

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-[#0D7377] font-medium hover:underline"
                >
                    <ArrowLeft size={18} />
                    Back to queue
                </button>
                <div className="text-xs text-[#78909C]">
                    Incident ID <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{incident.id.slice(0, 8)}...</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-6">
                {/* Left column: citizen view info */}
                <div className="space-y-5">
                    <div
                        className="w-full rounded-2xl overflow-hidden"
                        style={{
                            background: '#FFFFFF',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        <HeroGallery
                            photos={incident.photos.map((p) => p.fileUrl || p.url)}
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
                </div>

                {/* Right column: agent mission panel */}
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-lg font-semibold text-[#263238] mb-2">Mission Status</h2>
                        <p className="text-sm text-[#546E7A] mb-4">
                            Update the incident status as you work. A resolution photo is required to mark this
                            incident as <strong>RESOLVED</strong>.
                        </p>

                        <QuickInfoCard
                            location={incident.address || ''}
                            city=""
                            reportedAt={new Date(incident.createdAt)}
                            reporterName={incident.reporter.fullName}
                            isCurrentUser={incident.reporter.id === user?.id}
                            assignedAgent={
                                incident.assignedAgent
                                    ? {
                                          name: incident.assignedAgent.fullName,
                                          role: 'Agent',
                                      }
                                    : undefined
                            }
                        />

                        <div className="mt-4">
                            <StatusTimelineCard
                                history={incident.statusHistory || []}
                                currentStatus={incident.status}
                            />
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                            {canStartWork && (
                                <Button onClick={handleStartWork} className="bg-[#0D7377] text-white">
                                    Start mission (set IN PROGRESS)
                                </Button>
                            )}
                            {canResolve && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowResolvePanel(true)}
                                    className="border-[#32936F]/40 text-[#32936F]"
                                >
                                    <CheckCircle2 size={18} className="mr-2" />
                                    Mark as resolved (with photos)
                                </Button>
                            )}
                            {!canStartWork && !canResolve && (
                                <p className="text-xs text-[#90A4AE]">
                                    This incident can no longer be updated by agents.
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Resolve panel */}
                    {showResolvePanel && (
                        <Card className="border border-[#32936F]/30 bg-[#E8F5E9]">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
                                    <UploadCloud size={18} className="text-[#32936F]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#1B5E20]">
                                        Upload resolution evidence
                                    </h3>
                                    <p className="text-xs text-[#388E3C]">
                                        Add at least one clear photo showing the issue has been fixed. Admins will
                                        review before closing the mission.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setResolveFiles(files);
                                    }}
                                    className="block w-full text-xs text-[#546E7A] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0D7377]/10 file:text-[#0D7377] hover:file:bg-[#0D7377]/20"
                                />
                                <textarea
                                    value={resolveComment}
                                    onChange={(e) => setResolveComment(e.target.value)}
                                    placeholder="Optional note for the admin (what was done, special details...)"
                                    className="w-full text-xs border border-[#Cfd8dc] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D7377]/40"
                                    rows={3}
                                />

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[11px] text-[#455A64]">
                                        Selected photos: <strong>{resolveFiles.length}</strong>
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setShowResolvePanel(false);
                                                setResolveFiles([]);
                                                setResolveComment('');
                                            }}
                                            className="text-[#546E7A]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleResolve}
                                            disabled={isResolving}
                                            className="bg-[#32936F] text-white"
                                        >
                                            {isResolving ? (
                                                <>
                                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={16} className="mr-2" />
                                                    Confirm & mark resolved
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="bg-[#FFFDE7] border border-[#FFECB3]">
                        <div className="flex gap-3">
                            <div className="mt-1">
                                <AlertTriangle size={18} className="text-[#FFB300]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-[#795548] mb-1">
                                    Admin validation
                                </h3>
                                <p className="text-xs text-[#6D4C41]">
                                    After you mark this incident as resolved with photos, supervisors and admins can
                                    review the evidence and update the final status.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AgentIncidentDetailPage;

