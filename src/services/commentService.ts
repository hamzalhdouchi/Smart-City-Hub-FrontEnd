import api from './api';

export interface Comment {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    authorPhotoUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    content: string;
    isInternal?: boolean;
}

export const commentService = {
    // Get all comments for an incident
    getComments: async (incidentId: string): Promise<Comment[]> => {
        const response = await api.get(`/api/incidents/${incidentId}/comments`);
        return response.data.data;
    },

    // Add a comment to an incident
    addComment: async (incidentId: string, request: CreateCommentRequest): Promise<Comment> => {
        const response = await api.post(`/api/incidents/${incidentId}/comments`, request);
        return response.data.data;
    },

    // Update a comment
    updateComment: async (incidentId: string, commentId: string, request: CreateCommentRequest): Promise<Comment> => {
        const response = await api.put(`/api/incidents/${incidentId}/comments/${commentId}`, request);
        return response.data.data;
    },

    // Delete a comment
    deleteComment: async (incidentId: string, commentId: string): Promise<void> => {
        await api.delete(`/api/incidents/${incidentId}/comments/${commentId}`);
    },
};

export default commentService;
