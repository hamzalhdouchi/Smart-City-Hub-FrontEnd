import React, { useState } from 'react';
import { X, AlertCircle, Play, CheckCircle, XCircle, FileCheck } from 'lucide-react';
import { Button } from '../common';
import type { IncidentStatus } from '../../services/incidentService';

interface ChangeStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: IncidentStatus, comment?: string) => Promise<void>;
    currentStatus: IncidentStatus;
}

const statusOptions: { value: IncidentStatus; label: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
        value: 'NEW',
        label: 'New',
        description: 'Incident has been reported and awaiting review',
        icon: <AlertCircle size={20} />,
        color: 'text-blue-600 bg-blue-100',
    },
    {
        value: 'IN_PROGRESS',
        label: 'In Progress',
        description: 'An agent is actively working on this incident',
        icon: <Play size={20} />,
        color: 'text-amber-600 bg-amber-100',
    },
    {
        value: 'RESOLVED',
        label: 'Resolved',
        description: 'The issue has been addressed and fixed',
        icon: <CheckCircle size={20} />,
        color: 'text-green-600 bg-green-100',
    },
    {
        value: 'CLOSED',
        label: 'Closed',
        description: 'Incident is closed and archived',
        icon: <XCircle size={20} />,
        color: 'text-gray-600 bg-gray-100',
    },
];

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentStatus,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedStatus) return;

        try {
            setIsSubmitting(true);
            await onConfirm(selectedStatus, comment || undefined);
            onClose();
        } catch (error) {
            console.error('Failed to change status:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedStatus(null);
        setComment('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#ECEFF1]">
                    <h2 className="text-lg font-semibold text-[#263238] flex items-center gap-2">
                        <FileCheck size={20} className="text-[#00ACC1]" />
                        Change Status
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                    >
                        <X size={20} className="text-[#546E7A]" />
                    </button>
                </div>

                {/* Current status */}
                <div className="p-4 bg-[#F5F7FA] border-b border-[#ECEFF1]">
                    <p className="text-sm text-[#78909C] mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium ${statusOptions.find(s => s.value === currentStatus)?.color}`}>
                            {statusOptions.find(s => s.value === currentStatus)?.icon}
                            {currentStatus.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Status options */}
                <div className="p-4 space-y-2">
                    <p className="text-sm font-medium text-[#546E7A] mb-3">Select New Status</p>
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedStatus(option.value)}
                            disabled={option.value === currentStatus}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${option.value === currentStatus
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                    : selectedStatus === option.value
                                        ? 'bg-[#00ACC1]/10 border-2 border-[#00ACC1]'
                                        : 'bg-[#F5F7FA] hover:bg-[#ECEFF1] border-2 border-transparent'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${option.color}`}>
                                {option.icon}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-[#263238]">{option.label}</p>
                                <p className="text-sm text-[#78909C]">{option.description}</p>
                            </div>
                            {selectedStatus === option.value && (
                                <div className="w-5 h-5 rounded-full bg-[#00ACC1] flex items-center justify-center self-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Comment */}
                {selectedStatus && (
                    <div className="px-4 pb-4">
                        <label className="block text-sm font-medium text-[#546E7A] mb-2">
                            Add a note (optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Reason for status change..."
                            className="w-full px-4 py-3 border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1]/30 focus:border-[#00ACC1] resize-none"
                            rows={3}
                        />
                    </div>
                )}

                {/* Warning for closing without resolution */}
                {selectedStatus === 'CLOSED' && currentStatus !== 'RESOLVED' && (
                    <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            This incident hasn't been resolved yet. Are you sure you want to close it?
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t border-[#ECEFF1] flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || selectedStatus === currentStatus || isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChangeStatusModal;
