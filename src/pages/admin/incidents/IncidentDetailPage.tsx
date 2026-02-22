import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Clock,
    User,
    Mail,
    Tag,
    Image as ImageIcon,
    MessageCircle,
    Star,
    UserCheck,
    FileCheck,
    AlertCircle,
    Play,
    CheckCircle,
    XCircle,
    ExternalLink,
    Copy,
    Check,
} from 'lucide-react';
import { Card, Button, DataPulseLoader, LocationMap } from '../../../components/common';
import { PhotoGallery, CommentSection, StatusTimeline, AssignAgentModal, ChangeStatusModal } from '../../../components/incidents';
import incidentService from '../../../services/incidentService';
import type { Incident, IncidentStatus } from '../../../services/incidentService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const getStatusBadge = (status: IncidentStatus) => {
    const styles: Record<IncidentStatus, { bg: string; text: string; icon: React.ReactNode }> = {
        NEW: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            icon: <AlertCircle size={16} />,
        },
        IN_PROGRESS: {
            bg: 'bg-amber-100',
            text: 'text-amber-700',
            icon: <Play size={16} />,
        },
        RESOLVED: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: <CheckCircle size={16} />,
        },
        CLOSED: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            icon: <XCircle size={16} />,
        },
    };
    return styles[status] || styles.NEW;
};

const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
        HIGH: 'bg-red-100 text-red-700',
        MEDIUM: 'bg-amber-100 text-amber-700',
        LOW: 'bg-green-100 text-green-700',
    };
    return styles[priority] || styles.MEDIUM;
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const IncidentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [incident, setIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState(false);

    // Modals
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPERVISOR';

    useEffect(() => {
        if (id) {
            loadIncident();
        }
    }, [id]);

    const loadIncident = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await incidentService.getIncidentById(id);
            setIncident(data);
        } catch (err: any) {
            console.error('Failed to load incident:', err);
            if (err.response?.status === 404) {
                setError('Incident not found');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to view this incident');
            } else {
                setError('Failed to load incident details');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyId = async () => {
        if (!incident) return;
        await navigator.clipboard.writeText(incident.id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleAssignAgent = async (agentId: string) => {
        if (!incident) return;
        try {
            const updated = await incidentService.assignAgent(incident.id, { agentId });
            setIncident(updated);
            toast.success('Agent assigned successfully');
        } catch (error) {
            console.error('Failed to assign agent:', error);
            toast.error('Failed to assign agent');
            throw error;
        }
    };

    const handleStatusChange = async (status: IncidentStatus, comment?: string) => {
        if (!incident) return;
        try {
            const updated = await incidentService.updateStatus(incident.id, { status, comment });
            setIncident(updated);
            toast.success(`Status updated to ${status.replace('_', ' ')}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
            throw error;
        }
    };

    const getGoogleMapsUrl = () => {
        if (!incident) return '';
        return `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`;
    };

    const getGoogleMapsEmbedUrl = () => {
        if (!incident) return '';
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${incident.longitude}!3d${incident.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1234567890`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    if (error || !incident) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle size={64} className="text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-[#263238] mb-2">{error || 'Incident not found'}</h2>
                <p className="text-[#546E7A] mb-6">The incident you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button onClick={() => navigate('/admin/incidents/all')}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Incidents
                </Button>
            </div>
        );
    }

    const statusStyle = getStatusBadge(incident.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="self-start"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                </Button>

                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-[#263238]">{incident.title}</h1>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {incident.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(incident.priority)}`}>
                            {incident.priority}
                        </span>
                    </div>
                    <p className="text-sm text-[#78909C] mt-1 flex items-center gap-2">
                        <Clock size={14} />
                        Reported {formatRelativeTime(incident.createdAt)}
                        {incident.category && (
                            <>
                                <span>•</span>
                                <Tag size={14} />
                                {incident.category.name}
                            </>
                        )}
                    </p>
                </div>

                {isAdmin && (
                    <div className="flex gap-2 self-start md:self-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowStatusModal(true)}
                        >
                            <FileCheck size={16} className="mr-2" />
                            Change Status
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setShowAssignModal(true)}
                        >
                            <UserCheck size={16} className="mr-2" />
                            {incident.assignedAgent ? 'Reassign' : 'Assign Agent'}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Card */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-[#263238] mb-4">Description</h2>
                            <p className="text-[#455A64] whitespace-pre-wrap leading-relaxed">
                                {incident.description}
                            </p>

                            {/* Reporter Info */}
                            <div className="mt-6 pt-4 border-t border-[#ECEFF1]">
                                <p className="text-sm font-medium text-[#78909C] mb-3">Reported by</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ACC1] to-[#26A69A] flex items-center justify-center text-white font-semibold">
                                        {incident.reporter?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#263238]">{incident.reporter?.fullName || 'Unknown User'}</p>
                                        <div className="flex flex-wrap gap-3 text-sm text-[#78909C]">
                                            {incident.reporter?.email && (
                                                <a href={`mailto:${incident.reporter.email}`} className="flex items-center gap-1 hover:text-[#00ACC1] transition-colors">
                                                    <Mail size={14} />
                                                    {incident.reporter.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Location Card */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-[#263238]">Location</h2>
                                <a
                                    href={getGoogleMapsUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#00ACC1] hover:underline flex items-center gap-1"
                                >
                                    Open in Maps
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            {/* Interactive Map */}
                            <div className="mb-4">
                                <LocationMap
                                    address={incident.address}
                                    latitude={incident.latitude}
                                    longitude={incident.longitude}
                                    height="300px"
                                />
                            </div>

                            <div className="flex items-start gap-2 text-[#455A64]">
                                <MapPin size={18} className="text-[#00ACC1] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p>{incident.address || 'No address provided'}</p>
                                    <p className="text-sm text-[#78909C] mt-1">
                                        Coordinates: {incident.latitude?.toFixed(6)}, {incident.longitude?.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Photo Gallery */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-[#263238] mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-[#00ACC1]" />
                                Photos
                                {incident.photos && incident.photos.length > 0 && (
                                    <span className="text-sm font-normal text-[#78909C]">
                                        ({incident.photos.length})
                                    </span>
                                )}
                            </h2>
                            <PhotoGallery photos={incident.photos || []} />
                        </div>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-[#263238] mb-4 flex items-center gap-2">
                                <MessageCircle size={20} className="text-[#00ACC1]" />
                                Comments
                                {incident.commentsCount > 0 && (
                                    <span className="text-sm font-normal text-[#78909C]">
                                        ({incident.commentsCount})
                                    </span>
                                )}
                            </h2>
                            <CommentSection incidentId={incident.id} />
                        </div>
                    </Card>
                </div>

                {/* Sidebar - Right Column (1/3) */}
                <div className="space-y-6">
                    {/* Details Card */}
                    <Card>
                        <div className="p-6">
                            <h3 className="font-semibold text-[#263238] mb-4">Details</h3>
                            <div className="space-y-4">
                                {/* Incident ID */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">ID</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-[#ECEFF1] px-2 py-1 rounded">
                                            {incident.id.slice(0, 8)}...
                                        </code>
                                        <button
                                            onClick={handleCopyId}
                                            className="p-1 hover:bg-[#ECEFF1] rounded transition-colors"
                                            title="Copy full ID"
                                        >
                                            {copiedId ? (
                                                <Check size={14} className="text-green-500" />
                                            ) : (
                                                <Copy size={14} className="text-[#78909C]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">Category</span>
                                    <span className="text-sm font-medium text-[#263238] flex items-center gap-1.5">
                                        {incident.category?.icon && <span>{incident.category.icon}</span>}
                                        {incident.category?.name || 'Uncategorized'}
                                    </span>
                                </div>

                                {/* Priority */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">Priority</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(incident.priority)}`}>
                                        {incident.priority}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">Status</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                        {statusStyle.icon}
                                        {incident.status.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Created Date */}
                                <div className="flex items-start justify-between">
                                    <span className="text-sm text-[#78909C]">Created</span>
                                    <span className="text-sm text-[#263238] text-right">
                                        {formatDateTime(incident.createdAt)}
                                    </span>
                                </div>

                                {/* Updated Date */}
                                <div className="flex items-start justify-between">
                                    <span className="text-sm text-[#78909C]">Last Updated</span>
                                    <span className="text-sm text-[#263238] text-right">
                                        {formatDateTime(incident.updatedAt)}
                                    </span>
                                </div>

                                {/* Resolved Date */}
                                {incident.resolvedAt && (
                                    <div className="flex items-start justify-between">
                                        <span className="text-sm text-[#78909C]">Resolved</span>
                                        <span className="text-sm text-green-600 text-right">
                                            {formatDateTime(incident.resolvedAt)}
                                        </span>
                                    </div>
                                )}

                                {/* Photos count */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">Photos</span>
                                    <span className="text-sm text-[#263238]">
                                        {incident.photos?.length || 0} photos
                                    </span>
                                </div>

                                {/* Comments count */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#78909C]">Comments</span>
                                    <span className="text-sm text-[#263238]">
                                        {incident.commentsCount || 0} comments
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Assigned Agent Card */}
                    <Card>
                        <div className="p-6">
                            <h3 className="font-semibold text-[#263238] mb-4 flex items-center gap-2">
                                <UserCheck size={18} className="text-[#00ACC1]" />
                                Assigned Agent
                            </h3>

                            {incident.assignedAgent ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {incident.assignedAgent.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#263238] truncate">
                                            {incident.assignedAgent.fullName}
                                        </p>
                                        <p className="text-sm text-[#78909C] truncate">
                                            {incident.assignedAgent.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <User size={32} className="mx-auto mb-2 text-[#B0BEC5]" />
                                    <p className="text-sm text-[#78909C] mb-3">No agent assigned</p>
                                    {isAdmin && (
                                        <Button
                                            size="sm"
                                            onClick={() => setShowAssignModal(true)}
                                        >
                                            Assign Agent
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Status Timeline Card */}
                    <Card>
                        <div className="p-6">
                            <h3 className="font-semibold text-[#263238] mb-4">Status History</h3>
                            <StatusTimeline
                                history={[]}
                                currentStatus={incident.status}
                            />
                        </div>
                    </Card>

                    {/* Rating Card (if resolved) */}
                    {incident.rating && (
                        <Card>
                            <div className="p-6">
                                <h3 className="font-semibold text-[#263238] mb-4 flex items-center gap-2">
                                    <Star size={18} className="text-amber-400" />
                                    Rating
                                </h3>
                                <div className="text-center">
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={24}
                                                className={star <= incident.rating!.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-lg font-semibold text-[#263238]">
                                        {incident.rating.rating}/5
                                    </p>
                                    {incident.rating.comment && (
                                        <p className="mt-2 text-sm text-[#546E7A] italic">
                                            "{incident.rating.comment}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AssignAgentModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onAssign={handleAssignAgent}
                currentAgentId={incident.assignedAgent?.id}
            />

            <ChangeStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onConfirm={handleStatusChange}
                currentStatus={incident.status}
            />
        </div>
    );
};

export default IncidentDetailPage;
