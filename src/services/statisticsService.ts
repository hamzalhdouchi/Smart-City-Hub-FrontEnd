import api from './api';

export interface StatisticsResponse {
    totalIncidents: number;
    totalUsers: number;
    totalAgents: number;
    incidentsByStatus: Record<string, number>;
    incidentsByCategory: Record<string, number>;
    averageRating: number;
    averageResolutionTimeHours: number;
}

// Statistics API calls
export const statisticsService = {
    // Get global statistics (admin only)
    getGlobalStatistics: async (): Promise<StatisticsResponse> => {
        const response = await api.get('/api/statistics/global');
        return response.data.data;
    },

    // Get stats by status
    getStatsByStatus: async (): Promise<Record<string, number>> => {
        const response = await api.get('/api/statistics/by-status');
        return response.data.data;
    },

    // Get stats by category
    getStatsByCategory: async (): Promise<Record<string, number>> => {
        const response = await api.get('/api/statistics/by-category');
        return response.data.data;
    },
};

export default statisticsService;
