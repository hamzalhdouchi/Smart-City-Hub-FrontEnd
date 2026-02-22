import React from 'react';

interface BigActionButtonProps {
    onClick: () => void;
    label: string;
}

export const BigActionButton: React.FC<BigActionButtonProps> = ({ onClick, label }) => {
    return (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
            <button
                onClick={onClick}
                className="w-full h-14 bg-gradient-to-r from-[#0D7377] to-[#32936F] rounded-[18px] text-white font-bold text-lg shadow-[0_10px_30px_rgba(13,115,119,0.3)] transition-all active:scale-[0.98] hover:-translate-y-0.5"
            >
                {label}
            </button>
        </div>
    );
};
