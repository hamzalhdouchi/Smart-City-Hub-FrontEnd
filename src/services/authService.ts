import api from './api';

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    nationalId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface RegistrationResponse {
    id: string;
    email: string;
    status: string;
    message: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string | null;
    nationalId: string;
    role: string;
    status: string;
    mustChangePassword: boolean;
    photoUrl?: string;
    createdAt: string;
}

// Auth API calls
export const authService = {
    register: async (data: RegisterRequest): Promise<RegistrationResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<LoginResponse> => {
        const response = await api.post('/auth/change-password', data);
        return response.data.data;
    },

    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get('/api/users/me');
        return response.data.data;
    },

    // Admin endpoints
    getPendingUsers: async (): Promise<User[]> => {
        const response = await api.get('/api/users/pending');
        return response.data.data.content || response.data.data;
    },

    approveUser: async (userId: string): Promise<void> => {
        await api.post(`/api/users/${userId}/approve`);
    },

    rejectUser: async (userId: string): Promise<void> => {
        await api.post(`/api/users/${userId}/reject`);
    },
};

export default authService;
