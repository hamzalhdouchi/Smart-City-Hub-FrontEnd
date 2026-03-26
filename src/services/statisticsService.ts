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
export const statisticsService = {
    getGlobalStatistics: async (): Promise<StatisticsResponse> => {
        const response = await api.get('/api/statistics/global');
        return response.data.data;
    },
    getStatsByStatus: async (): Promise<Record<string, number>> => {
        const response = await api.get('/api/statistics/by-status');
        return response.data.data;
    },
    getStatsByCategory: async (): Promise<Record<string, number>> => {
        const response = await api.get('/api/statistics/by-category');
        return response.data.data;
    },
};

export default statisticsService;
