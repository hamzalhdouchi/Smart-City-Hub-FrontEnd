// Services barrel export
export { authService } from './authService';
export type { RegisterRequest, LoginRequest, ChangePasswordRequest, LoginResponse, RegistrationResponse, User } from './authService';

export { incidentService } from './incidentService';
export type {
    IncidentStatus, Priority, IncidentUser, IncidentCategory, IncidentPhoto,
    IncidentRating, Incident, Page, CreateIncidentRequest, UpdateStatusRequest,
    AssignAgentRequest
} from './incidentService';

export { categoryService } from './categoryService';
export type { Category, CreateCategoryRequest, UpdateCategoryRequest } from './categoryService';

export { statisticsService } from './statisticsService';
export type { StatisticsResponse } from './statisticsService';

export { userService } from './userService';
export type { Role, UserStatus, User as UserType, Page as PageType } from './userService';

export { default as api } from './api';
