import api from './api';

export type Role = 'ROLE_USER' | 'ROLE_AGENT' | 'ROLE_SUPERVISOR' | 'ROLE_ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string | null;
    nationalId: string;
    role: Role;
    status: UserStatus;
    mustChangePassword: boolean;
    createdAt: string;
    approvedAt?: string;
    approvedByName?: string;
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
export const userService = {
    getCurrentUser: async (): Promise<User> => {
        const response = await api.get('/api/users/me');
        return response.data.data;
    },
    getAllUsers: async (page: number = 0, size: number = 10, sort: string = 'createdAt,desc'): Promise<Page<User>> => {
        const response = await api.get(`/api/users?page=${page}&size=${size}&sort=${sort}`);
        return response.data.data;
    },
    getPendingUsers: async (page: number = 0, size: number = 10): Promise<Page<User>> => {
        const response = await api.get(`/api/users/pending?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data.data;
    },
    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/api/users/${id}`);
        return response.data.data;
    },
    getAgents: async (): Promise<User[]> => {
        const response = await api.get('/api/users/agents');
        return response.data.data;
    },
    approveUser: async (id: string): Promise<User> => {
        const response = await api.post(`/api/users/${id}/approve`);
        return response.data.data;
    },
    rejectUser: async (id: string): Promise<void> => {
        await api.post(`/api/users/${id}/reject`);
    },
    updateUserRole: async (id: string, role: string): Promise<User> => {
        const response = await api.patch(`/api/users/${id}/role?role=${role}`);
        return response.data.data;
    },
    deactivateUser: async (id: string): Promise<void> => {
        await api.post(`/api/users/${id}/deactivate`);
    },
    activateUser: async (id: string): Promise<void> => {
        await api.post(`/api/users/${id}/activate`);
    },
    updateProfile: async (firstName?: string, lastName?: string, phone?: string): Promise<User> => {
        const params = new URLSearchParams();
        if (firstName) params.append('firstName', firstName);
        if (lastName) params.append('lastName', lastName);
        if (phone) params.append('phone', phone);

        const response = await api.put(`/api/users/me?${params.toString()}`);
        return response.data.data;
    },

    getProfilePhoto: async (userId: string): Promise<string | null> => {
        try {
            const response = await api.get(`/api/users/${userId}/photo`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch profile photo', error);
            return null;
        }
    },

    getMyProfilePhoto: async (): Promise<string | null> => {
        try {
            const response = await api.get(`/api/users/me/photo`);
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch my profile photo', error);
            return null;
        }
    },

    uploadProfilePhoto: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/users/me/photo', formData);
        return response.data.data;
    }
};

export default userService;
