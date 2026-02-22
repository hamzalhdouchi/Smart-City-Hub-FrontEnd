import React from 'react';

export const CategoryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <path d="M3 16C3 14.8954 3.89543 14 5 14H8C9.10457 14 10 14.8954 10 16V19C10 20.1046 9.10457 21 8 21H5C3.89543 21 3 20.1046 3 19V16Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        <circle cx="6.5" cy="17.5" r="1.5" fill="white" fillOpacity="0.9" />
    </svg>
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
        <path d="M7 6V4.5C7 3.67157 7.67157 3 8.5 3H15.5C16.3284 3 17 3.67157 17 4.5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="13" r="1.5" fill="currentColor" />
        <circle cx="18" cy="9" r="1" fill="currentColor" fillOpacity="0.4" />
        <path d="M22 14L18 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </svg>
);

export const LocationIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C12 21 19 14.4183 19 8.5C19 4.91015 15.866 2 12 2C8.13401 2 5 4.91015 5 8.5C5 14.4183 12 21 12 21Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 11C13.3807 11 14.5 9.88071 14.5 8.5C14.5 7.11929 13.3807 6 12 6C10.6193 6 9.5 7.11929 9.5 8.5C9.5 9.88071 10.6193 11 12 11Z" fill="currentColor" />
        <path d="M16 19C16 19 19.5 20.5 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M8 19C8 19 4.5 20.5 3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
);

export const DescriptionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="17" r="2" fill="currentColor" />
        <path d="M15 17.5L15.8 18.2L17.5 16.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ReviewIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
