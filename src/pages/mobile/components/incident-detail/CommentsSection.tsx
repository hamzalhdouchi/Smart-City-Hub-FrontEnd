import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Clock, Crown, Headphones } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    id: string;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
        role?: string;
    };
    content: string;
    createdAt: Date;
    isOwn?: boolean;
}

interface CommentsSectionProps {
    comments: Comment[];
    onPostComment: (content: string) => Promise<void>;
    onDeleteComment: (id: string) => Promise<void>;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
    comments,
    onPostComment,
    onDeleteComment
}) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onPostComment(newComment.trim());
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header */}
            <div
                className="px-5 py-4 flex items-center justify-between"
                style={{
                    background: '#E0F2F1'
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: '#0D7377',
                            boxShadow: '0 4px 12px rgba(13, 115, 119, 0.3)'
                        }}
                    >
                        <MessageSquare size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#263238]">Discussion</h2>
                        <p className="text-xs text-[#546E7A]">{comments.length} messages</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="p-5 pt-4 space-y-2.5 max-h-[400px] overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-[#E0F2F1] flex items-center justify-center mx-auto mb-3">
                            <MessageSquare size={24} className="text-[#0D7377]" />
                        </div>
                        <p className="text-sm text-[#546E7A]">No messages yet</p>
                        <p className="text-xs text-[#B0BEC5] mt-1">Start the conversation!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`flex gap-2 ${comment.isOwn ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {comment.author.avatarUrl ? (
                                    <img
                                        src={comment.author.avatarUrl}
                                        alt={comment.author.name}
                                        className="w-9 h-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ background: comment.isOwn ? '#0D7377' : '#90A4AE' }}
                                    >
                                        {comment.author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={`flex-1 max-w-[85%] ${comment.isOwn ? '' : 'flex flex-col items-end'}`}>
                                {/* Author Name & Time */}
                                <div className={`flex items-center gap-2 mb-1 ${comment.isOwn ? '' : 'flex-row-reverse'}`}>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-[#263238]">
                                            {comment.author.name}
                                        </span>
                                        {comment.author.role === 'ADMIN' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F44336] text-white text-[9px] font-semibold rounded-full">
                                                <Crown size={10} />
                                                Admin
                                            </span>
                                        )}
                                        {comment.author.role === 'AGENT' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0D7377] text-white text-[9px] font-semibold rounded-full">
                                                <Headphones size={10} />
                                                Agent
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-[#B0BEC5] flex items-center gap-1">
                                        <Clock size={10} />
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>

                                {/* Message Content */}
                                <div className="relative group">
                                    <div
                                        className={`px-3 py-2 rounded-2xl ${comment.isOwn
                                            ? 'rounded-tl-sm'
                                            : 'rounded-tr-sm'
                                            }`}
                                        style={comment.isOwn ? {
                                            background: '#0D7377',
                                            color: '#FFFFFF',
                                            boxShadow: '0 2px 8px rgba(13, 115, 119, 0.2)'
                                        } : {
                                            background: '#F5F7FA',
                                            color: '#263238'
                                        }}
                                    >
                                        <p className="text-sm leading-relaxed break-words">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    {comment.isOwn && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this message?')) {
                                                    onDeleteComment(comment.id);
                                                }
                                            }}
                                            className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={14} className="text-[#F44336]" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Comment Form */}
            <form onSubmit={handleSubmit} className="p-5 m-5">
                <div
                    className="flex items-end gap-3 p-3 rounded-2xl transition-all"
                    style={{
                        background: '#F5F7FA',
                        border: '2px solid transparent',
                    }}
                >
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-sm text-[#263238] resize-none max-h-24"
                        disabled={isSubmitting}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${newComment.trim() && !isSubmitting
                            ? 'text-white active:scale-95'
                            : 'bg-[#ECEFF1] text-[#B0BEC5] cursor-not-allowed'
                            }`}
                        style={newComment.trim() && !isSubmitting ? {
                            background: '#0D7377',
                            boxShadow: '0 2px 8px rgba(13, 115, 119, 0.3)'
                        } : {}}
                    >
                        <Send size={18} className={isSubmitting ? 'animate-pulse' : ''} />
                    </button>
                </div>
                <p className="text-xs text-[#B0BEC5] mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </form>
        </div>
    );
};
