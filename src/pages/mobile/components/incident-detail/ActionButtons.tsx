import React from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActionButtonsProps {
    lastUpdated: Date;
    incidentId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    lastUpdated,
    incidentId
}) => {
    const [copied, setCopied] = React.useState(false);

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            <div className="p-5">
                {/* Last Updated */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock size={14} className="text-[#546E7A]" />
                    <span className="text-xs text-[#546E7A]">
                        Last updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
                    </span>
                </div>

                {/* Incident ID */}
                <div className="mt-0 text-center">
                    <button
                        onClick={async () => {
                            await navigator.clipboard.writeText(incidentId);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F5F7FA] text-[#546E7A] text-xs font-medium hover:bg-[#ECEFF1] transition-colors"
                    >
                        <span>ID: {incidentId}</span>
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>

                {/* Incident ID */}
                <div className="mt-4 text-center">
                    <button
                        onClick={async () => {
                            await navigator.clipboard.writeText(incidentId);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-[#B0BEC5] hover:text-[#546E7A] transition-colors"
                    >
                        <span>ID: {incidentId.slice(0, 8)}...</span>
                        <Copy size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
