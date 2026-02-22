// Import types from incidentService
import type {
    Incident,
    IncidentStatus,
    Priority,
    IncidentUser,
    IncidentCategory,
    IncidentPhoto,
    IncidentRating,
    Page,
    CreateIncidentRequest,
    UpdateStatusRequest,
    AssignAgentRequest
} from '../services/incidentService';

// Re-export with proper names
export type {
    IncidentStatus,
    Incident,
    IncidentUser,
    IncidentCategory,
    IncidentPhoto,
    IncidentRating,
    Page,
    CreateIncidentRequest,
    UpdateStatusRequest,
    AssignAgentRequest
};

// Export Priority as IncidentPriority
export type IncidentPriority = Priority;

// Extended types for detail page
export interface StatusHistoryItem {
    status: IncidentStatus;
    timestamp: Date;
    actor?: string;
    note?: string;
}

export interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    createdAt: Date;
    isOwn?: boolean;
}

// IncidentDetail is just an alias for Incident with additional runtime data
// The backend returns Incident, and we add comments/history/rating client-side
export type IncidentDetail = Incident & {
    statusHistory?: StatusHistoryItem[];
    comments?: Comment[];
    userRating?: {
        rating: number;
        feedback?: string;
        createdAt: Date;
    };
};
