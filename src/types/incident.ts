
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
export type IncidentPriority = Priority;
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
export type IncidentDetail = Incident & {
    statusHistory?: StatusHistoryItem[];
    comments?: Comment[];
    userRating?: {
        rating: number;
        feedback?: string;
        createdAt: Date;
    };
};
