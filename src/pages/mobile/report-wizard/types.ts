
export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface ReportWizardState {
    step: WizardStep;
    category: string | null;
    photos: File[];
    location: {
        latitude: number;
        longitude: number;
        address: string;
    } | null;
    district: string;
    title: string;
    description: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    visibility: 'PUBLIC' | 'PRIVATE';
    anonymous: boolean;
    completedSteps: number[];
}

export const INITIAL_STATE: ReportWizardState = {
    step: 1,
    category: null,
    photos: [],
    location: null,
    district: '',
    title: '',
    description: '',
    urgencyLevel: 'MEDIUM',
    visibility: 'PUBLIC',
    anonymous: false,
    completedSteps: [],
};
