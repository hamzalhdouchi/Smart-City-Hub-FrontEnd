import api from './api';

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    active: boolean;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
    icon: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string;
    icon?: string;
    active?: boolean;
}
export const categoryService = {
    getActiveCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories');
        return response.data.data;
    },
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories/all');
        return response.data.data;
    },
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await api.get(`/api/categories/${id}`);
        return response.data.data;
    },
    createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await api.post('/api/categories', data);
        return response.data.data;
    },
    updateCategory: async (id: string, data: CreateCategoryRequest): Promise<Category> => {
        const response = await api.put(`/api/categories/${id}`, data);
        return response.data.data;
    },
    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/api/categories/${id}`);
    },
    reactivateCategory: async (id: string): Promise<Category> => {
        const response = await api.put(`/api/categories/${id}/reactivate`);
        return response.data.data;
    },
};

export default categoryService;
