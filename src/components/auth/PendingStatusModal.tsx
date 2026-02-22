import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Mail } from 'lucide-react';
import { Button, Card, DataPulseLoader } from '../common';
import { useNavigate } from 'react-router-dom';

interface PendingStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PendingStatusModal: React.FC<PendingStatusModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGotIt = () => {
        onClose();
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                <Card className="w-full max-w-md mx-4" padding="lg" accentBorder="top">
                    {/* Animated Icon */}
                    <div className="flex justify-center mb-6">
                        <DataPulseLoader size={80} />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#0D7377] font-['Noto_Sans_JP'] mb-3">
                            Profile Under Review
                        </h2>

                        <p className="text-[#546E7A] mb-6">
                            Your registration has been received. Our admin team will review your profile shortly.
                            You'll receive an email with your login credentials once approved.
                        </p>

                        {/* Timeline */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center">
                                    <CheckCircle size={20} className="text-white" />
                                </div>
                                <span className="text-xs text-[#4CAF50] mt-1 font-medium">Submitted</span>
                            </div>

                            <div className="w-8 h-0.5 bg-[#5FD19B]" />

                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-[#FF9800] flex items-center justify-center animate-pulse">
                                    <Clock size={20} className="text-white" />
                                </div>
                                <span className="text-xs text-[#FF9800] mt-1 font-medium">Review</span>
                            </div>

                            <div className="w-8 h-0.5 bg-[#B0BEC5]" />

                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-[#B0BEC5] flex items-center justify-center">
                                    <Mail size={20} className="text-[#546E7A]" />
                                </div>
                                <span className="text-xs text-[#546E7A] mt-1">Activation</span>
                            </div>
                        </div>

                        {/* Estimated time */}
                        <div className="flex items-center justify-center gap-2 text-sm text-[#546E7A] mb-6">
                            <Clock size={16} />
                            <span>Usually within 24 hours</span>
                        </div>

                        {/* Button */}
                        <Button variant="primary" fullWidth onClick={handleGotIt}>
                            Got It
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};
