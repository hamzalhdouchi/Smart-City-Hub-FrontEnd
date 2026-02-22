import React, { useState } from 'react';
import { Star, Sparkles, Send, CheckCircle } from 'lucide-react';

interface RatingSectionProps {
    canRate: boolean;
    existingRating?: {
        rating: number;
        feedback?: string;
        createdAt: Date;
    };
    onSubmitRating: (rating: number, feedback?: string) => Promise<void>;
}

export const RatingSection: React.FC<RatingSectionProps> = ({
    canRate,
    existingRating,
    onSubmitRating
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmitRating(rating, feedback || undefined);
            setShowSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Already rated
    if (existingRating) {
        return (
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: '#FFF3E0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
            >
                <div className="p-6 text-center">
                    <div className="flex justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={28}
                                fill={star <= existingRating.rating ? '#FFB347' : 'transparent'}
                                className={star <= existingRating.rating ? 'text-[#FFB347]' : 'text-[#DDD]'}
                            />
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-[#263238] mb-1">Thanks for Rating!</h3>
                    <p className="text-sm text-[#546E7A]">Your feedback helps improve our service</p>
                    {existingRating.feedback && (
                        <p className="mt-3 text-sm text-[#263238] italic bg-white/50 p-3 rounded-lg">
                            "{existingRating.feedback}"
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Success state
    if (showSuccess) {
        return (
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: '#E8F5E9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
            >
                <div className="p-8 text-center">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                            background: '#32936F',
                            boxShadow: '0 4px 15px rgba(50, 147, 111, 0.4)'
                        }}
                    >
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#32936F] mb-2">Thank You! 🎉</h3>
                    <p className="text-sm text-[#546E7A]">Your rating has been submitted successfully</p>
                </div>
            </div>
        );
    }

    // Can't rate
    if (!canRate) {
        return null;
    }

    // Rating form
    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header */}
            <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                    background: '#FFF3E0'
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: '#FFB347',
                        boxShadow: '0 4px 12px rgba(255, 179, 71, 0.3)'
                    }}
                >
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#263238]">Rate Resolution</h2>
                    <p className="text-xs text-[#546E7A]">How did we do?</p>
                </div>
            </div>

            <div className="p-5">
                {/* Stars */}
                <div className="flex justify-center gap-2 mb-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={36}
                                fill={(hoverRating || rating) >= star ? '#FFB347' : 'transparent'}
                                className={`transition-colors ${(hoverRating || rating) >= star
                                    ? 'text-[#FFB347]'
                                    : 'text-[#DDD]'
                                    }`}
                                style={(hoverRating || rating) >= star ? {
                                    filter: 'drop-shadow(0 2px 4px rgba(255, 179, 71, 0.4))'
                                } : {}}
                            />
                        </button>
                    ))}
                </div>

                {/* Rating Labels */}
                <p className="text-center text-sm font-medium text-[#546E7A] mb-4">
                    {rating === 0 && 'Tap a star to rate'}
                    {rating === 1 && '😞 Poor'}
                    {rating === 2 && '😕 Fair'}
                    {rating === 3 && '😐 Good'}
                    {rating === 4 && '😊 Great'}
                    {rating === 5 && '🤩 Excellent!'}
                </p>

                {/* Feedback */}
                {rating > 0 && (
                    <div className="mb-4">
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Optional: Tell us more about your experience..."
                            className="w-full p-4 rounded-xl bg-[#F5F7FA] text-sm text-[#263238] placeholder-[#B0BEC5] focus:outline-none focus:ring-2 focus:ring-[#FFB347] resize-none"
                            rows={3}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${rating > 0 && !isSubmitting
                        ? 'text-white active:scale-95'
                        : 'bg-[#ECEFF1] text-[#B0BEC5] cursor-not-allowed'
                        }`}
                    style={rating > 0 && !isSubmitting ? {
                        background: '#FFB347',
                        boxShadow: '0 4px 12px rgba(255, 179, 71, 0.3)'
                    } : {}}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Submit Rating
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
