import React from 'react';
import { LoginForm, SmartCityIllustration } from '../components/auth';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex">
            {/* Left Section - Nighttime Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#053B3E] to-[#263238] relative overflow-hidden">
                <div className="absolute inset-0 pattern-circuit opacity-20" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    <SmartCityIllustration variant="night" className="max-w-lg w-full mb-8" />

                    <h2 className="text-3xl font-bold text-white text-center font-['Noto_Sans_JP'] mb-4">
                        Smart City Hub
                    </h2>

                    <p className="text-[#5FD19B] text-center max-w-sm">
                        Monitor and manage urban infrastructure with real-time insights and intelligent reporting.
                    </p>

                    {/* Connection lines animation */}
                    <div className="absolute top-16 left-32 w-2 h-2 bg-[#14FFEC] rounded-full animate-sensor-pulse" />
                    <div className="absolute top-24 right-40 w-1.5 h-1.5 bg-[#00D9FF] rounded-full animate-sensor-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-40 right-20 w-2 h-2 bg-[#7DDF64] rounded-full animate-sensor-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#ECEFF1]">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
