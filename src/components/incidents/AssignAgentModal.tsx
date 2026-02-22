import React, { useState, useEffect } from 'react';
import { X, Search, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '../common';
import userService from '../../services/userService';
import type { User as UserType } from '../../services/userService';
import toast from 'react-hot-toast';

interface AssignAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (agentId: string) => Promise<void>;
    currentAgentId?: string;
}

const AssignAgentModal: React.FC<AssignAgentModalProps> = ({
    isOpen,
    onClose,
    onAssign,
    currentAgentId,
}) => {
    const [agents, setAgents] = useState<UserType[]>([]);
    const [filteredAgents, setFilteredAgents] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadAgents();
        }
    }, [isOpen]);

    useEffect(() => {
        const filtered = agents.filter(agent =>
            `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredAgents(filtered);
    }, [searchQuery, agents]);

    const loadAgents = async () => {
        try {
            setIsLoading(true);
            // Get users with ROLE_AGENT
            const data = await userService.getAgents();
            setAgents(data);
            setFilteredAgents(data);
        } catch (error) {
            console.error('Failed to load agents:', error);
            toast.error('Failed to load agents');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedAgentId) return;

        try {
            setIsAssigning(true);
            await onAssign(selectedAgentId);
            onClose();
        } catch (error) {
            console.error('Failed to assign agent:', error);
        } finally {
            setIsAssigning(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#ECEFF1]">
                    <h2 className="text-lg font-semibold text-[#263238] flex items-center gap-2">
                        <UserCheck size={20} className="text-[#00ACC1]" />
                        Assign Agent
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-[#ECEFF1] rounded-lg transition-colors"
                    >
                        <X size={20} className="text-[#546E7A]" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-[#ECEFF1]">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78909C]" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ACC1]/30 focus:border-[#00ACC1]"
                        />
                    </div>
                </div>

                {/* Agent list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-[#ECEFF1]" />
                                <div className="flex-1">
                                    <div className="h-4 bg-[#ECEFF1] rounded w-32 mb-1" />
                                    <div className="h-3 bg-[#ECEFF1] rounded w-48" />
                                </div>
                            </div>
                        ))
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-8">
                            <AlertCircle size={40} className="mx-auto mb-2 text-[#B0BEC5]" />
                            <p className="text-[#546E7A]">No agents found</p>
                        </div>
                    ) : (
                        filteredAgents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedAgentId === agent.id
                                    ? 'bg-[#00ACC1]/10 border-2 border-[#00ACC1]'
                                    : agent.id === currentAgentId
                                        ? 'bg-green-50 border-2 border-green-200'
                                        : 'bg-[#F5F7FA] hover:bg-[#ECEFF1] border-2 border-transparent'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ACC1] to-[#26A69A] flex items-center justify-center text-white font-semibold text-sm">
                                    {getInitials(agent.firstName, agent.lastName)}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-[#263238]">
                                        {agent.firstName} {agent.lastName}
                                        {agent.id === currentAgentId && (
                                            <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                Currently Assigned
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-[#78909C]">{agent.email}</p>
                                </div>
                                {selectedAgentId === agent.id && (
                                    <div className="w-5 h-5 rounded-full bg-[#00ACC1] flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#ECEFF1] flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedAgentId || isAssigning || selectedAgentId === currentAgentId}
                        className="flex-1"
                    >
                        {isAssigning ? 'Assigning...' : 'Assign Agent'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AssignAgentModal;
