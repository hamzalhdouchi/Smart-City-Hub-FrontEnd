import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { HeroGallery } from '../mobile/components/incident-detail/HeroGallery';
import { TitleDescriptionCard } from '../mobile/components/incident-detail/TitleDescriptionCard';
import { QuickInfoCard } from '../mobile/components/incident-detail/QuickInfoCard';
import { StatusTimelineCard } from '../mobile/components/incident-detail/StatusTimelineCard';
import { MapCard } from '../mobile/components/incident-detail/MapCard';
import { CommentsSection } from '../mobile/components/incident-detail/CommentsSection';
import { Card, Button, DataPulseLoader } from '../../components/common';
import { incidentService } from '../../services/incidentService';
import { useAuth } from '../../context/AuthContext';
import type { IncidentDetail } from '../../types/incident';
import toast from 'react-hot-toast';

// ─── Resolve Modal ────────────────────────────────────────────────────────────

interface ResolveModalProps {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (files: File[]) => void;
}

const ResolveModal: React.FC<ResolveModalProps> = ({ isOpen, isSubmitting, onClose, onSubmit }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        setFiles(selected);
        setPreviews(selected.map((f) => URL.createObjectURL(f)));
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
        setFiles([]);
        setPreviews([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#ECEFF1]">
                    <h2 className="text-lg font-semibold text-[#263238] flex items-center gap-2">
                        <UploadCloud size={20} className="text-[#32936F]" />
                        Submit Resolution
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                    >
                        <X size={20} className="text-[#546E7A]" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <p className="text-sm text-[#546E7A]">
                        Upload at least one clear photo showing the issue has been fixed. An admin will
                        review your submission before the incident is officially resolved.
                    </p>

                    {/* Upload area */}
                    <div
                        className="border-2 border-dashed border-[#B0BEC5] rounded-xl p-6 text-center cursor-pointer hover:border-[#32936F] transition-colors"
                        onClick={() => inputRef.current?.click()}
                    >
                        <ImageIcon size={32} className="mx-auto mb-2 text-[#B0BEC5]" />
                        <p className="text-sm text-[#78909C]">
                            Click to select photos (JPEG, PNG, WebP — max 10 MB each)
                        </p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {previews.map((src, i) => (
                                <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
                                    <img
                                        src={src}
                                        alt={`Preview ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#ECEFF1] flex gap-3">
                    <Button variant="outline" onClick={handleClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onSubmit(files)}
                        disabled={files.length === 0 || isSubmitting}
                        className="flex-1 bg-[#32936F] text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Submitting…
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} className="mr-2" />
                                Submit Resolution
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AgentIncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [incident, setIncident] = useState<IncidentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showResolveModal, setShowResolveModal] = useState(false);
    const [isResolving, setIsResolving] = useState(false);

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

            if (['IN_PROGRESS', 'PENDING_VALIDATION', 'RESOLVED', 'VALIDATED'].includes(data.status)) {
                statusHistory.push({
                    status: 'IN_PROGRESS' as const,
                    timestamp: new Date(data.updatedAt),
                    actor: data.assignedAgent?.fullName,
                    note: undefined,
                });
            }

            if (['PENDING_VALIDATION', 'RESOLVED', 'VALIDATED'].includes(data.status)) {
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

    const handleSubmitResolution = async (files: File[]) => {
        if (!id || !incident) return;
        try {
            setIsResolving(true);
            await incidentService.resolveIncident(id, files);
            toast.success('Resolution submitted, awaiting admin approval');
            setShowResolveModal(false);
            await loadIncident();
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Failed to submit resolution. Please try again.';
            toast.error(msg);
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

    const isAssignedAgent = incident.assignedAgent?.id === user?.id;
    const canStartWork = incident.status === 'ASSIGNED' && isAssignedAgent;
    const canResolve = incident.status === 'IN_PROGRESS' && isAssignedAgent;
    const isPendingValidation = incident.status === 'PENDING_VALIDATION';

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
                            Update the incident status as you work. A resolution photo is required to
                            submit this incident for admin approval.
                        </p>

                        <QuickInfoCard
                            location={incident.address || ''}
                            city=""
                            reportedAt={new Date(incident.createdAt)}
                            reporterName={incident.reporter.fullName}
                            isCurrentUser={incident.reporter.id === user?.id}
                            assignedAgent={
                                incident.assignedAgent
                                    ? { name: incident.assignedAgent.fullName, role: 'Agent' }
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
                                    onClick={() => setShowResolveModal(true)}
                                    className="border-[#32936F]/40 text-[#32936F]"
                                >
                                    <CheckCircle2 size={18} className="mr-2" />
                                    Submit Resolution
                                </Button>
                            )}
                            {isPendingValidation && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                    <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
                                    <p className="text-sm text-amber-800">
                                        Resolution submitted. Awaiting admin approval.
                                    </p>
                                </div>
                            )}
                            {!canStartWork && !canResolve && !isPendingValidation && (
                                <p className="text-xs text-[#90A4AE]">
                                    This incident can no longer be updated by agents.
                                </p>
                            )}
                        </div>
                    </Card>

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
                                    After you submit resolution photos, an admin will review the evidence
                                    and approve or reject your submission.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <ResolveModal
                isOpen={showResolveModal}
                isSubmitting={isResolving}
                onClose={() => setShowResolveModal(false)}
                onSubmit={handleSubmitResolution}
            />
        </div>
    );
};

export default AgentIncidentDetailPage;
