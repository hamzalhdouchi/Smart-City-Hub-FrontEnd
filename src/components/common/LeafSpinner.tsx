import React from 'react';
import { Leaf } from 'lucide-react';

interface LeafSpinnerProps {
    size?: number;
    className?: string;
}

export const LeafSpinner: React.FC<LeafSpinnerProps> = ({
    size = 48,
    className = '',
}) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative">
                {/* Outer glow */}
                <div
                    className="absolute inset-0 rounded-full animate-pulse-glow"
                    style={{ width: size, height: size }}
                />
                {/* Spinning leaf */}
                <div
                    className="animate-spin-leaf"
                    style={{ width: size, height: size }}
                >
                    <Leaf
                        size={size}
                        className="text-[#7CB342]"
                        strokeWidth={2}
                    />
                </div>
            </div>
        </div>
    );
};

// Inline spinner for buttons
export const LeafSpinnerSmall: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <Leaf size={size} className="text-current animate-spin-leaf" strokeWidth={2} />
);
