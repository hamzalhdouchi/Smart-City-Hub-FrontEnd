import React, { useState } from 'react';
import { RegistrationForm, PendingStatusModal, SmartCityIllustration } from '../components/auth';

const RegisterPage: React.FC = () => {
    const [showPendingModal, setShowPendingModal] = useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D7377] to-[#32936F] relative overflow-hidden">
                <div className="absolute inset-0 pattern-circuit opacity-30" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    <SmartCityIllustration variant="day" className="max-w-lg w-full mb-8" />

                    <h2 className="text-3xl font-bold text-white text-center font-['Noto_Sans_JP'] mb-4">
                        Connected Urban<br />Sustainability
                    </h2>

                    <p className="text-[#E0F7FA] text-center max-w-sm">
                        Join our smart city initiative and help create a connected, sustainable urban future.
                    </p>

                    {/* Tech elements */}
                    <div className="absolute top-20 left-20 w-4 h-4 rounded-full bg-[#14FFEC] animate-sensor-pulse opacity-50" />
                    <div className="absolute bottom-32 right-24 w-3 h-3 rounded-full bg-[#7DDF64] animate-sensor-pulse opacity-40" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-10 w-2 h-2 rounded-full bg-[#00D9FF] animate-sensor-pulse opacity-30" style={{ animationDelay: '0.5s' }} />
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#ECEFF1]">
                <RegistrationForm onSuccess={() => setShowPendingModal(true)} />
            </div>

            {/* Pending Status Modal */}
            <PendingStatusModal
                isOpen={showPendingModal}
                onClose={() => setShowPendingModal(false)}
            />
        </div>
    );
};

export default RegisterPage;
