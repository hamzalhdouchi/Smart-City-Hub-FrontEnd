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

// Category API calls
export const categoryService = {
    // Get active categories (public)
    getActiveCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories');
        return response.data.data;
    },

    // Get all categories including inactive (admin only)
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories/all');
        return response.data.data;
    },

    // Get category by ID
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await api.get(`/api/categories/${id}`);
        return response.data.data;
    },

    // Create category (admin only)
    createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await api.post('/api/categories', data);
        return response.data.data;
    },

    // Update category (admin only)
    updateCategory: async (id: string, data: CreateCategoryRequest): Promise<Category> => {
        const response = await api.put(`/api/categories/${id}`, data);
        return response.data.data;
    },

    // Delete/deactivate category (admin only)
    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/api/categories/${id}`);
    },

    // Reactivate category (admin only)
    reactivateCategory: async (id: string): Promise<Category> => {
        const response = await api.put(`/api/categories/${id}/reactivate`);
        return response.data.data;
    },
};

export default categoryService;
