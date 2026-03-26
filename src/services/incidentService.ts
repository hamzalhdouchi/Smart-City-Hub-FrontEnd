import api from './api';

export type IncidentStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_VALIDATION' | 'RESOLVED' | 'VALIDATED' | 'REJECTED' | 'REOPENED' | 'CLOSED';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface IncidentUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    photoUrl?: string;
}

export interface IncidentCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    active?: boolean;
}

export interface IncidentPhoto {
    id: string;
    fileName: string;
    filePath: string;
    url: string;
    fileUrl: string;
    fileSize: number;
    uploadedById: string;
    uploadedByName: string;
    uploadedAt: string;
    createdAt: string;
}

export interface IncidentRating {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface Incident {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    status: IncidentStatus;
    priority: Priority;
    reporter: IncidentUser;
    assignedAgent?: IncidentUser;
    category: IncidentCategory;
    photos: IncidentPhoto[];
    commentsCount: number;
    rating?: IncidentRating;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface CreateIncidentRequest {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    district?: string;
    categoryId: string;
    urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    visibility?: 'PUBLIC' | 'PRIVATE';
    priority?: Priority;
}

export interface UpdateStatusRequest {
    status: IncidentStatus;
    comment?: string;
}

export interface AssignAgentRequest {
    agentId: string;
}
export const incidentService = {
    getIncidents: async (
        status?: IncidentStatus,
        categoryId?: string,
        page: number = 0,
        size: number = 10
    ): Promise<Page<Incident>> => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (categoryId) params.append('categoryId', categoryId);
        params.append('page', page.toString());
        params.append('size', size.toString());
        params.append('sort', 'createdAt,desc');

        const response = await api.get(`/api/incidents?${params.toString()}`);
        return response.data.data;
    },
    getIncidentById: async (id: string): Promise<Incident> => {
        const response = await api.get(`/api/incidents/${id}`);
        return response.data.data;
    },
    getMyIncidents: async (page: number = 0, size: number = 10): Promise<Page<Incident>> => {
        const response = await api.get(`/api/incidents/my?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data.data;
    },
    getAssignedIncidents: async (page: number = 0, size: number = 10): Promise<Page<Incident>> => {
        const response = await api.get(`/api/incidents/assigned?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data.data;
    },
    createIncident: async (data: CreateIncidentRequest, photos?: File[]): Promise<Incident> => {
        const formData = new FormData();
        formData.append('incident', JSON.stringify(data));

        if (photos && photos.length > 0) {
            photos.forEach((photo) => {
                formData.append('photos', photo);
            });
        }

        const response = await api.post('/api/incidents', formData);
        return response.data.data;
    },
    updateStatus: async (id: string, request: UpdateStatusRequest): Promise<Incident> => {
        const response = await api.patch(`/api/incidents/${id}/status`, request);
        return response.data.data;
    },
    resolveIncident: async (id: string, photos: File[]): Promise<Incident> => {
        const formData = new FormData();
        photos.forEach((photo) => formData.append('photos', photo));

        const token = localStorage.getItem('accessToken');
        const baseUrl = import.meta.env.VITE_API_URL || '';

        const response = await fetch(`${baseUrl}/api/incidents/${id}/resolve`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw Object.assign(new Error(err.message || 'Failed to submit resolution'), { response: { data: err } });
        }

        const json = await response.json();
        return json.data;
    },
    assignAgent: async (id: string, request: AssignAgentRequest): Promise<Incident> => {
        const response = await api.post(`/api/incidents/${id}/assign`, request);
        return response.data.data;
    },
    getComments: async (id: string): Promise<any[]> => {
        const response = await api.get(`/api/incidents/${id}/comments`);
        return response.data.data || [];
    },
    postComment: async (id: string, content: string): Promise<void> => {
        await api.post(`/api/incidents/${id}/comments`, { content });
    },
    deleteComment: async (incidentId: string, commentId: string): Promise<void> => {
        await api.delete(`/api/incidents/${incidentId}/comments/${commentId}`);
    },
    rateIncident: async (id: string, rating: number, feedback?: string): Promise<void> => {
        await api.post(`/api/incidents/${id}/rate`, { rating, comment: feedback });
    },
    getCategories: async (): Promise<IncidentCategory[]> => {
        const response = await api.get('/api/categories');
        return response.data.data;
    },

    deleteIncident: async (id: string): Promise<void> => {
        await api.delete(`/api/incidents/${id}`);
    },
};

export default incidentService;
