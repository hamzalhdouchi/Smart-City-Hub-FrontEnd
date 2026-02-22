import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-[#0D7377] hover:bg-[#32936F] text-white
      focus:ring-[#14FFEC]
    `,
        secondary: `
      bg-[#ECEFF1] hover:bg-[#5FD19B] text-[#263238]
      border border-[#5FD19B]
      focus:ring-[#0D7377]
    `,
        danger: `
      bg-[#F44336] hover:bg-[#D32F2F] text-white
      focus:ring-[#F44336]
    `,
        ghost: `
      bg-transparent hover:bg-[#0D7377]/10 text-[#0D7377]
      focus:ring-[#0D7377]
    `,
        outline: `
      bg-transparent hover:bg-[#ECEFF1] text-[#546E7A]
      border border-[#B0BEC5]
      focus:ring-[#0D7377]
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span>{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span>{icon}</span>}
                </>
            )}
        </button>
    );
};
