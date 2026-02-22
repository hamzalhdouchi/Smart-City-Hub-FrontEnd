import React from 'react';

interface TimelineStep {
    label: string;
    timestamp?: string;
    status: 'completed' | 'current' | 'pending';
}

interface TimelineProps {
    steps: TimelineStep[];
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
    return (
        <div className="flex flex-col space-y-4 mt-4 px-1">
            {steps.map((step, index) => (
                <div key={index} className="flex gap-3 relative">
                    {/* Vertical Line */}
                    {index !== steps.length - 1 && (
                        <div className={`absolute left-[11px] top-6 w-[2px] h-full ${step.status === 'completed' ? 'bg-[#32936F]' : 'bg-gray-200'
                            }`} />
                    )}

                    {/* Icon Circle */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${step.status === 'completed' ? 'bg-[#32936F] shadow-[0_0_10px_rgba(50,147,111,0.3)]' :
                        step.status === 'current' ? 'bg-[#0D7377] shadow-[0_0_10px_rgba(13,115,119,0.3)] animate-pulse' :
                            'bg-gray-200'
                        }`}>
                        {step.status === 'completed' ? (
                            <div className="w-2.5 h-1.5 border-b-2 border-l-2 border-white -rotate-45 mb-0.5 ml-0.5" />
                        ) : step.status === 'current' ? (
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 pb-1">
                        <span className={`text-xs font-bold ${step.status === 'pending' ? 'text-gray-400' : 'text-slate-700'
                            }`}>
                            {step.label}
                        </span>
                        {step.timestamp && (
                            <span className="text-[10px] text-gray-400 font-medium">
                                {step.timestamp}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
