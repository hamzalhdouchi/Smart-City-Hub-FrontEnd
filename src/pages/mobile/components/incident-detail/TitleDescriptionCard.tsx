import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CategoryIcon from '../../../../components/common/CategoryIcon';

interface TitleDescriptionCardProps {
    title: string;
    description: string;
    category: string;
    categoryIcon?: string;
}

const categoryConfig: Record<string, { icon: string; color: string; bg: string }> = {
    INFRASTRUCTURE: { icon: '🏗️', color: '#FF6B6B', bg: 'linear-gradient(135deg, #FF6B6B20, #FF6B6B10)' },
    ENVIRONMENT: { icon: '🌿', color: '#32936F', bg: 'linear-gradient(135deg, #32936F20, #32936F10)' },
    SAFETY: { icon: '🚨', color: '#F44336', bg: 'linear-gradient(135deg, #F4433620, #F4433610)' },
    UTILITIES: { icon: '💡', color: '#FFB347', bg: 'linear-gradient(135deg, #FFB34720, #FFB34710)' },
    TRANSPORT: { icon: '🚗', color: '#2196F3', bg: 'linear-gradient(135deg, #2196F320, #2196F310)' },
    OTHER: { icon: '📋', color: '#546E7A', bg: 'linear-gradient(135deg, #546E7A20, #546E7A10)' }
};

export const TitleDescriptionCard: React.FC<TitleDescriptionCardProps> = ({
    title,
    description,
    category,
    categoryIcon
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const config = categoryConfig[category] || categoryConfig.OTHER;

    // Check if description is long enough to need expansion
    const needsExpansion = description.length > 150;

    return (
        <div
            className="relative overflow-hidden rounded-2xl"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            {/* Decorative Top Gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80)` }}
            />

            <div className="p-5">
                {/* Category Badge */}
                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                    style={{ background: config.bg }}
                >
                    <span className="text-xl flex items-center" style={{ color: config.color }}>
                        <CategoryIcon
                            iconName={categoryIcon || category}
                            size={20}
                        />
                    </span>
                    <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: config.color }}
                    >
                        {category.replace('_', ' ')}
                    </span>
                </div>

                {/* Title with Sparkle */}
                <div className="flex items-start gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-[#263238] leading-tight tracking-tight">
                        {title}
                    </h1>
                </div>

                {/* Description */}
                <div className="relative">
                    <p
                        className={`text-[15px] text-[#546E7A] leading-relaxed transition-all duration-300 ${!isExpanded && needsExpansion ? 'line-clamp-3' : ''
                            }`}
                    >
                        {description}
                    </p>

                    {/* Gradient Fade for truncated text */}
                    {!isExpanded && needsExpansion && (
                        <div
                            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                            style={{ background: 'linear-gradient(transparent, white)' }}
                        />
                    )}
                </div>

                {/* Read More Button */}
                {needsExpansion && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
                        style={{ color: config.color }}
                    >
                        {isExpanded ? (
                            <>
                                <span>Show less</span>
                                <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                <span>Read more</span>
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
