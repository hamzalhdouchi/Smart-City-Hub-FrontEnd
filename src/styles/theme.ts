// Smart City Theme Colors - Eco-Tech Urban Fusion

export const colors = {
    // Primary - Tech Blue meets Eco Green
    primary: {
        main: '#0D7377',      // Teal-cyan (tech + nature balance)
        light: '#14FFEC',     // Electric cyan (innovation, clean energy) - NEW ACCENT
        dark: '#053B3E',      // Deep ocean teal (stability)
    },

    // Secondary - Urban Green
    secondary: {
        main: '#32936F',      // Balanced green (urban parks, sustainability)
        light: '#5FD19B',     // Soft mint (green buildings)
        dark: '#1E5A42',      // Forest green (natural integration)
    },

    // Accent - Smart Technology
    accent: {
        electric: '#14FFEC',  // Electric cyan (IoT, connectivity)
        energy: '#7DDF64',    // Eco green (renewable energy)
        warning: '#FFB347',   // Amber (alerts)
        danger: '#EF5350',    // Red (critical)
    },

    // Neutral - Urban Concrete & Glass
    neutral: {
        concrete: '#B0BEC5',  // Light gray (modern architecture)
        steel: '#546E7A',     // Medium gray (infrastructure)
        asphalt: '#263238',   // Dark gray (roads, text)
        glass: '#ECEFF1',     // Off-white (glass buildings)
        white: '#FFFFFF',
    },

    // Status Colors
    status: {
        new: '#14FFEC',       // Cyan (Fresh, New)
        in_progress: '#0D7377', // Teal (Active)
        resolved: '#32936F',  // Green (Done)
        closed: '#546E7A',    // Gray (Archived)
        error: '#EF5350',     // Red
    },

    // Priority Colors
    priority: {
        high: '#EF5350',      // Red
        medium: '#FFB347',    // Amber
        low: '#B0BEC5',       // Gray
    },
} as const;

// Gradient definitions
export const gradients = {
    primary: 'linear-gradient(135deg, #0D7377 0%, #32936F 100%)',
    tech: 'linear-gradient(135deg, #053B3E 0%, #0D7377 100%)',
    energy: 'linear-gradient(135deg, #32936F 0%, #7DDF64 100%)',
    night: 'linear-gradient(135deg, #053B3E 0%, #263238 100%)',
    highPriority: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    mediumPriority: 'linear-gradient(135deg, #FFB347 0%, #FF9800 100%)',
    lowPriority: 'linear-gradient(135deg, #B0BEC5 0%, #90A4AE 100%)',
    header: 'linear-gradient(to right, #ECEFF1, #FFFFFF)',
} as const;

// Typography
export const fonts = {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Inter', 'Noto Sans JP', sans-serif",
    weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const;

// Spacing
export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
} as const;

// Border radius
export const radius = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
} as const;

// Shadows
export const shadows = {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(20, 255, 236, 0.3)',
    // Mobile-specific elevation levels
    level1: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',       // Cards
    level2: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',       // Elevated cards
    level3: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',      // FAB
    level4: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',   // Modals
} as const;

// Breakpoints for responsive design (Mobile-first)
export const breakpoints = {
    mobile: '320px',          // Mobile portrait
    mobileLandscape: '568px', // Mobile landscape
    tablet: '768px',          // Tablet portrait
    tabletLandscape: '1024px',// Tablet landscape
    desktop: '1200px',        // Desktop
} as const;

// Z-index layers
export const zIndex = {
    base: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 9999,
} as const;

// Mobile Component Sizes (Touch-optimized)
export const components = {
    touchTarget: {
        min: '44px',          // iOS/Android minimum
    },
    button: {
        small: '36px',
        medium: '48px',       // Default for mobile
        large: '56px',
    },
    input: {
        height: '48px',
        padding: '12px',
    },
    tabBar: {
        height: '60px',
        iconSize: '24px',
        labelSize: '11px',
    },
    fab: {
        size: '56px',
        iconSize: '24px',
        bottomOffset: '80px', // Above tab bar
        rightOffset: '16px',
    },
    card: {
        borderRadius: '12px',
        padding: '16px',
        photoAspectRatio: '16/9',
    },
    bottomSheet: {
        handleWidth: '40px',
        handleHeight: '4px',
        peekHeight: '80px',
    },
    avatar: {
        small: '32px',
        medium: '40px',
        large: '100px',
    },
    badge: {
        height: '24px',
        padding: '6px 12px',
        fontSize: '12px',
    },
} as const;

// Animation configurations
export const animations = {
    duration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '400ms',
    },
    easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
} as const;

// Helper Functions
export const getStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase().replace('_', '');

    const statusMap: Record<string, { bg: string; text: string }> = {
        'new': { bg: colors.accent.warning, text: '#5D3A1A' },
        'pending': { bg: colors.accent.warning, text: '#5D3A1A' },
        'assigned': { bg: '#9C27B0', text: '#FFFFFF' },
        'inprogress': { bg: colors.primary.main, text: '#FFFFFF' },
        'resolved': { bg: colors.secondary.main, text: '#FFFFFF' },
        'validated': { bg: '#4CAF50', text: '#FFFFFF' },  // Green - confirmed
        'rejected': { bg: colors.accent.danger, text: '#FFFFFF' },
        'reopened': { bg: '#FF6F00', text: '#FFFFFF' },  // Deep Orange - needs attention
    };

    return statusMap[statusLower] || { bg: colors.accent.warning, text: '#5D3A1A' };
};

export const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase();

    const priorityMap: Record<string, string> = {
        'low': colors.priority.low,
        'normal': colors.neutral.steel,
        'medium': colors.priority.medium,
        'high': colors.priority.high,
        'urgent': colors.accent.danger,
        'critical': colors.accent.danger,
    };

    return priorityMap[priorityLower] || colors.neutral.steel;
};

// Media query helpers
export const mediaQuery = {
    mobile: `@media (min-width: ${breakpoints.mobile})`,
    mobileLandscape: `@media (min-width: ${breakpoints.mobileLandscape})`,
    tablet: `@media (min-width: ${breakpoints.tablet})`,
    tabletLandscape: `@media (min-width: ${breakpoints.tabletLandscape})`,
    desktop: `@media (min-width: ${breakpoints.desktop})`,
};

// Export consolidated theme
export const theme = {
    colors,
    gradients,
    fonts,
    spacing,
    radius,
    shadows,
    breakpoints,
    zIndex,
    components,
    animations,
} as const;

export default theme;

