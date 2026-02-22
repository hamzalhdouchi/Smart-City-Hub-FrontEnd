import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationItems, navColors } from '../../config/navigationConfig';
import { theme } from '../../styles/theme';

interface BottomTabBarProps {
    className?: string;
    autoHide?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    className = '',
    autoHide = true
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Auto-hide logic
    const handleScroll = useCallback(() => {
        if (!autoHide) return;

        const currentScrollY = window.scrollY;

        // Always show at top
        if (currentScrollY <= 10) {
            setIsVisible(true);
            setLastScrollY(currentScrollY);
            return;
        }

        // Hide when scrolling down (after 100px threshold)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
        }
        // Show when scrolling up
        else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
    }, [lastScrollY, autoHide]);

    useEffect(() => {
        if (!autoHide) return;

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll, autoHide]);

    const handleTabClick = (route: string) => {
        navigate(route);
    };

    const isActive = (route: string) => {
        return location.pathname === route;
    };

    return (
        <nav
            className={`mobile-bottom-bar fixed bottom-0 left-0 right-0 mobile-navbar-glass ${className}`}
            style={{
                height: '64px',
                zIndex: theme.zIndex.fixed,
                paddingBottom: 'env(safe-area-inset-bottom)',
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
            }}
        >
            <div className="flex items-center justify-around h-full max-w-screen-lg mx-auto px-2">
                {navigationItems.map((item) => {
                    const active = isActive(item.route);
                    const Icon = item.icon;

                    // Center tab (Report) - FAB style
                    if (item.isCenter) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.route)}
                                className="flex flex-col items-center justify-center transition-all active:scale-95 -mt-6"
                                aria-label={item.label}
                                aria-current={active ? 'page' : undefined}
                            >
                                <div
                                    className="rounded-full flex items-center justify-center text-white fab-glass-glow"
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        background: active
                                            ? theme.gradients.tech
                                            : navColors.primary,
                                        transition: 'transform 200ms ease',
                                    }}
                                >
                                    <Icon size={24} />
                                </div>
                                <span
                                    className="text-xs mt-1 font-medium"
                                    style={{
                                        fontSize: '11px',
                                        color: active ? navColors.primary : navColors.textDefault,
                                    }}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    // Regular tabs
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.route)}
                            className="flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 relative"
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            {/* Active Glow Pill */}
                            {active && (
                                <div className="nav-item-active-glow" />
                            )}

                            <div
                                className="relative transition-all duration-300"
                                style={{
                                    color: active ? navColors.primary : navColors.textDefault,
                                    transform: active ? 'scale(1.1)' : 'scale(1)',
                                    zIndex: 1
                                }}
                            >
                                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                            </div>

                            <span
                                className="text-xs mt-1 font-medium relative transition-colors"
                                style={{
                                    fontSize: '11px',
                                    color: active ? navColors.primary : navColors.textDefault,
                                    zIndex: 1
                                }}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomTabBar;
