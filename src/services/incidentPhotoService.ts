import api from './api';
import type { IncidentPhoto } from './incidentService';

export const incidentPhotoService = {
    uploadPhotos: async (incidentId: string, files: File[]): Promise<IncidentPhoto[]> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await api.post(`/api/incidents/${incidentId}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};

export default incidentPhotoService;

