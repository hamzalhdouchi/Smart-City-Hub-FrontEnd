import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Edit2, Trash2, User, Clock } from 'lucide-react';
import { Button, DeleteConfirmationModal } from '../common';
import commentService from '../../services/commentService';
import userService from '../../services/userService';
import type { Comment } from '../../services/commentService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface CommentSectionProps {
    incidentId: string;
}

const getRoleBadge = (role: string) => {
    const roleMap: { [key: string]: { label: string; color: string } } = {
        'ROLE_ADMIN': { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
        'ROLE_SUPERVISOR': { label: 'Supervisor', color: 'bg-blue-100 text-blue-700' },
        'ROLE_AGENT': { label: 'Agent', color: 'bg-teal-100 text-teal-700' },
        'ROLE_USER': { label: 'Citizen', color: 'bg-gray-100 text-gray-700' },
    };
    return roleMap[role] || { label: 'User', color: 'bg-gray-100 text-gray-700' };
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CommentSection: React.FC<CommentSectionProps> = ({ incidentId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);
    const [deleteModalInfo, setDeleteModalInfo] = useState<{ show: boolean; commentId: string | null }>({
        show: false,
        commentId: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadComments();
        if (user) {
            const fetchUserPhoto = async () => {
                try {
                    const url = await userService.getMyProfilePhoto();
                    if (url) setCurrentUserPhoto(url);
                } catch (e) {
                    console.error("Failed to fetch user photo", e);
                }
            };
            fetchUserPhoto();
        }
    }, [incidentId, user]);

    const loadComments = async () => {
        try {
            setIsLoading(true);
            const data = await commentService.getComments(incidentId);
            console.log('Fetched comments:', data);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            const comment = await commentService.addComment(incidentId, { content: newComment });
            setComments(prev => [...prev, comment]);
            setNewComment('');
            toast.success('Comment added');
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            const updated = await commentService.updateComment(incidentId, commentId, { content: editContent });
            setComments(prev => prev.map(c => c.id === commentId ? updated : c));
            setEditingId(null);
            setEditContent('');
            toast.success('Comment updated');
        } catch (error) {
            console.error('Failed to update comment:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteClick = (commentId: string) => {
        setDeleteModalInfo({ show: true, commentId });
    };

    const confirmDelete = async () => {
        if (!deleteModalInfo.commentId) return;

        try {
            setIsDeleting(true);
            await commentService.deleteComment(incidentId, deleteModalInfo.commentId);
            setComments(prev => prev.filter(c => c.id !== deleteModalInfo.commentId));
            toast.success('Comment deleted');
            setDeleteModalInfo({ show: false, commentId: null });
        } catch (error) {
            console.error('Failed to delete comment:', error);
            toast.error('Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditContent('');
    };

    const canModify = (comment: Comment) => {
        if (!user) return false;
        // User can edit/delete their own comments, or admin can delete any
        return comment.authorId === user.id || user.role === 'ROLE_ADMIN';
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-[#ECEFF1]" />
                        <div className="flex-1">
                            <div className="h-4 w-32 bg-[#ECEFF1] rounded mb-2" />
                            <div className="h-16 bg-[#ECEFF1] rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Comments list */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 bg-[#ECEFF1]/50 rounded-lg">
                        <MessageCircle size={48} className="mx-auto mb-3 text-[#B0BEC5]" />
                        <p className="text-[#546E7A]">No comments yet</p>
                        <p className="text-sm text-[#78909C]">Be the first to comment on this incident</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ACC1] to-[#26A69A] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden border border-white/20">
                                {comment.authorPhotoUrl ? (
                                    <img src={comment.authorPhotoUrl} alt={comment.authorName} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{getInitials(comment.authorName)}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-[#263238]">{comment.authorName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadge(comment.authorRole).color}`}>
                                        {getRoleBadge(comment.authorRole).label}
                                    </span>
                                    <span className="text-xs text-[#78909C] flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatRelativeTime(comment.createdAt)}
                                    </span>
                                    {comment.updatedAt !== comment.createdAt && (
                                        <span className="text-xs text-[#78909C] italic">(edited)</span>
                                    )}
                                </div>

                                {editingId !== null && editingId === comment.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1]/30 focus:border-[#00ACC1] resize-none"
                                            rows={3}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleEdit(comment.id)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-[#455A64] whitespace-pre-wrap">
                                        {comment.content || <span className="text-red-500 italic">No content received from server</span>}
                                    </p>
                                )}

                                {/* Actions */}
                                {canModify(comment) && editingId !== comment.id && (
                                    <div className="flex gap-2 mt-2">
                                        {comment.authorId === user?.id && (
                                            <button
                                                onClick={() => startEditing(comment)}
                                                className="text-[#78909C] hover:text-[#00ACC1] transition-colors text-sm flex items-center gap-1"
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(comment.id)}
                                            className="text-[#78909C] hover:text-red-500 transition-colors text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add comment form */}
            <form onSubmit={handleSubmit} className="border-t border-[#ECEFF1] pt-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ACC1] to-[#26A69A] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden border border-white/20">
                        {/* We need to get the current user's photo here. Since we don't have it in the user object directly, we might need to fetch it or use a context.
                            For now, let's leave it as generic user icon or initials if user is present.
                            Actually, TopBar fetches it. Maybe AuthContext should store it?
                            For now, I'll stick to the existing generic icon or use initials if user exists.
                         */}
                        {currentUserPhoto ? (
                            <img src={currentUserPhoto} alt="Me" className="w-full h-full object-cover" />
                        ) : user ? (
                            <span className="font-semibold">{getInitials(user.firstName + ' ' + user.lastName)}</span>
                        ) : (
                            <User size={18} />
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-4 py-3 border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1]/30 focus:border-[#00ACC1] resize-none"
                            rows={3}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-[#78909C]">{newComment.length}/500</span>
                            <Button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Send size={16} />
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalInfo.show}
                onClose={() => setDeleteModalInfo({ show: false, commentId: null })}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
            />
        </div>
    );
};

export default CommentSection;
