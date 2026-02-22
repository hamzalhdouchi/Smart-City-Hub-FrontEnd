import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon, error, hint, type = 'text', className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#263238] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D7377]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? 'text' : type}
                        className={`
              w-full rounded-lg border bg-white
              px-4 py-2.5 text-[#263238]
              placeholder:text-[#546E7A]/50
              transition-all duration-200
              focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20
              ${icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${error ? 'border-[#F44336]' : 'border-[#B0BEC5]'}
              ${className}
            `}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#546E7A] hover:text-[#0D7377] transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-[#F44336]">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-1 text-sm text-[#546E7A]">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
