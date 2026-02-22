import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { User as UserServiceUser } from '../services/userService';
import { DataPulseLoader } from '../components/common';
import {
    PersonalInfoCard,
    AccountInfoCard,
    SecuritySettingsCard,
    PhotoUploadModal,
    ChangePasswordModal
} from '../components/profile';
import {
    CityScapeIllustration,
    NetworkNodesPattern,
    GeometricPattern
} from '../components/profile/decorative';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();

    // Modals
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Profile Photo URL
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            const url = await userService.getMyProfilePhoto();
            if (url) setPhotoUrl(url);
        };
        fetchPhoto();
    }, []);

    const handleUpdateProfile = async (data: { firstName: string; lastName: string; phone: string }) => {
        if (!user) return;
        try {
            const updatedUser = await userService.updateProfile(data.firstName, data.lastName, data.phone);
            updateUser(updatedUser);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handlePhotoUpload = (url: string) => {
        setPhotoUrl(url);
        setIsPhotoModalOpen(false);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    const profileUser = user as unknown as UserServiceUser;
    const initials = profileUser.fullName
        ? profileUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="profile-split-container">
            {/* LEFT PANEL - Japanese Visual Section */}
            <div className="profile-left-panel">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2C8D7D] via-[#0D7377] to-[#053B3E]">
                    {/* Washi paper texture overlay */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between p-12">
                    {/* Top Section - Decorative Pattern */}
                    <div className="absolute top-8 right-8 w-32 h-32 animate-in fade-in duration-700 delay-200">
                        <GeometricPattern />
                    </div>

                    {/* Middle Section - Profile Photo & Text */}
                    <div className="flex-1 flex items-center justify-center profile-hero-content">
                        <div className="flex items-center gap-16 desktop-layout">
                            {/* Vertical Name Text - Japanese Style (DESKTOP ONLY) */}
                            <div className="vertical-text-container animate-in slide-in-from-left duration-700 delay-300">
                                <div className="vertical-text-backdrop">
                                    <h1 className="vertical-text">
                                        {profileUser.fullName}
                                    </h1>
                                </div>
                            </div>

                            {/* Profile Photo with enhanced border */}
                            <div className="relative group animate-in zoom-in duration-700 delay-400 profile-photo-wrapper">
                                {/* Outer decorative ring */}
                                <div className="absolute inset-0 rounded-full border border-white/30 scale-[1.15] outer-ring" />

                                <div className="profile-photo-container rounded-full border-4 border-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden bg-white/10 backdrop-blur-sm" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.3)' }}>
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={profileUser.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
                                            <span className="profile-initials font-bold text-white tracking-widest">
                                                {initials}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Change Photo Button */}
                                <button
                                    onClick={() => setIsPhotoModalOpen(true)}
                                    className="absolute bottom-1 right-1 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-[#0D7377] hover:bg-white hover:scale-110 transition-all duration-300 photo-change-btn"
                                    title="Change Profile Photo"
                                >
                                    <Camera size={16} />
                                </button>

                                {/* Decorative ring */}
                                <div className="absolute inset-0 rounded-full border border-white/10 scale-110 animate-pulse outer-pulse"
                                    style={{ animationDuration: '3s' }}
                                />
                            </div>
                        </div>

                        {/* Mobile Name Display (horizontal, shown only on mobile) */}
                        <div className="mobile-name-display">
                            <h2 className="text-xl font-semibold text-white text-center mt-3">
                                {profileUser.fullName}
                            </h2>
                            <p className="text-sm text-white/70 text-center mt-1">
                                {profileUser.role?.replace('ROLE_', '')}
                            </p>
                        </div>
                    </div>

                    {/* Decorative Illustrations - Enhanced visibility */}
                    <div className="absolute bottom-32 left-8 w-80 h-40 animate-in slide-in-from-bottom duration-700 delay-500">
                        <CityScapeIllustration opacity={0.22} />
                    </div>

                    <div className="absolute top-1/3 right-12 w-56 h-56 animate-in fade-in duration-700 delay-600">
                        <NetworkNodesPattern opacity={0.25} />
                    </div>

                    {/* Additional balance element - middle left */}
                    <div className="absolute top-1/4 left-12 w-40 h-40 animate-in fade-in duration-700 delay-550">
                        <GeometricPattern opacity={0.18} />
                    </div>

                    {/* Bottom Section - Enhanced Branding */}
                    <div className="text-center space-y-4 animate-in slide-in-from-bottom duration-700 delay-700">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-3 h-3 rounded-full bg-[#C9A961]" />
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
                            <div className="w-3 h-3 rounded-full bg-[#C9A961]" />
                        </div>
                        <h2 className="text-3xl font-light tracking-wider" style={{ color: '#C9A961' }}>
                            Smart City Hub
                        </h2>
                        <p className="text-sm text-white/70 tracking-wide uppercase mt-4">
                            Connected • Sustainable • Innovative
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-3">
                            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/90 border border-white/20">
                                {profileUser.role.replace('ROLE_', '')}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-[#C9A961]/20 backdrop-blur-sm text-xs text-white/90 border border-[#C9A961]/30">
                                v2.0
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Functional Content with lighter background */}
            <div className="profile-right-panel">
                <div className="max-w-3xl mx-auto p-8 md:p-12 space-y-6 animate-in slide-in-from-right duration-500">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#263238] mb-2">Profile Settings</h1>
                        <p className="text-xs text-[#546E7A]">Manage your personal information and account preferences</p>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#0D7377] to-transparent mt-3 rounded-full" />
                    </div>

                    {/* Personal Information */}
                    <PersonalInfoCard
                        user={profileUser}
                        onUpdate={handleUpdateProfile}
                    />

                    {/* Account Information */}
                    <AccountInfoCard user={profileUser} />

                    {/* Security Settings */}
                    <SecuritySettingsCard
                        onChangePassword={() => setIsPasswordModalOpen(true)}
                    />


                    {/* Footer */}
                    <div className="text-center pt-8 text-xs text-[#90A4AE]">
                        <p>© 2024 Smart City Hub • Profile Management</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PhotoUploadModal
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
                onUpload={handlePhotoUpload}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />

            {/* Styles */}
            <style>{`
                .profile-split-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    height: 100vh;
                    width: 100%;
                    overflow: hidden;
                }

                .profile-left-panel {
                    position: relative;
                    height: 100vh;
                    overflow: hidden;
                }

                .profile-right-panel {
                    background: #FAFAFA;
                    overflow-y: auto;
                    overflow-x: hidden;
                    height: 100vh;
                }

                /* Vertical Text - Japanese Style with improved readability */
                .vertical-text-container {
                    writing-mode: vertical-rl;
                    text-orientation: upright;
                }

                .vertical-text-backdrop {
                    background: rgba(0, 0, 0, 0.15);
                    padding: 20px 16px;
                    border-radius: 8px;
                    backdrop-filter: blur(4px);
                }

                .vertical-text {
                    font-family: 'Noto Sans JP', sans-serif;
                    font-size: 2rem;
                    font-weight: 300;
                    color: white;
                    letter-spacing: 0.05em;
                }

                /* Smooth scrollbar for right panel */
                .profile-right-panel::-webkit-scrollbar {
                    width: 8px;
                }

                .profile-right-panel::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .profile-right-panel::-webkit-scrollbar-thumb {
                    background: #0D7377;
                    border-radius: 4px;
                }

                .profile-right-panel::-webkit-scrollbar-thumb:hover {
                    background: #2C8D7D;
                }

                /* Tablet - 40/60 split */
                @media (max-width: 1024px) and (min-width: 768px) {
                    .profile-split-container {
                        grid-template-columns: 2fr 3fr;
                    }

                    .profile-left-panel {
                        position: relative;
                        height: auto;
                        min-height: 100vh;
                    }
                }

                /* Mobile - Compact Header Layout */
                @media (max-width: 767px) {
                    .profile-split-container {
                        display: block;
                        height: auto;
                        overflow: visible;
                    }

                    .profile-left-panel {
                        position: relative;
                        height: auto;
                        min-height: 280px;
                        padding-bottom: 32px;
                        overflow: visible; /* Allow rings/shadows to show */
                    }

                    .profile-left-panel > div:first-child + div {
                        padding: 16px;
                        justify-content: center;
                        flex-direction: column;
                    }

                    .profile-hero-content {
                        flex-direction: column;
                        gap: 0 !important;
                    }

                    /* Hide desktop layout on mobile */
                    .desktop-layout {
                        flex-direction: column;
                        gap: 0 !important;
                    }

                    /* Hide vertical text on mobile */
                    .vertical-text-container {
                        display: none !important;
                    }

                    .vertical-text-backdrop {
                        display: none;
                    }

                    /* Smaller profile photo on mobile */
                    .profile-photo-wrapper {
                        margin-top: 0;
                    }

                    .profile-photo-container {
                        width: 80px !important;
                        height: 80px !important;
                    }

                    .profile-initials {
                        font-size: 1.5rem !important;
                    }

                    .photo-change-btn {
                        opacity: 1 !important;
                        bottom: 0 !important;
                        right: 0 !important;
                    }

                    .outer-ring,
                    .outer-pulse {
                        display: none;
                    }

                    /* Show mobile name display */
                    .mobile-name-display {
                        display: block !important;
                    }

                    /* Hide decorative elements on mobile */
                    .profile-left-panel .absolute.top-8,
                    .profile-left-panel .absolute.bottom-32,
                    .profile-left-panel .absolute.top-1\\/3,
                    .profile-left-panel .absolute.top-1\\/4 {
                        display: none !important;
                    }

                    .profile-right-panel {
                        height: auto;
                        min-height: calc(100vh - 200px);
                        padding-bottom: 100px;
                    }

                    .profile-right-panel > div {
                        padding: 16px;
                    }
                }

                /* Hide mobile name display on desktop */
                @media (min-width: 768px) {
                    .mobile-name-display {
                        display: none;
                    }

                    .profile-photo-container {
                        width: 160px;
                        height: 160px;
                    }

                    .profile-initials {
                        font-size: 3rem;
                    }

                    .photo-change-btn {
                        opacity: 0;
                    }

                    .photo-change-btn:hover,
                    .profile-photo-wrapper:hover .photo-change-btn {
                        opacity: 1;
                    }
                }

                /* Animation keyframes */
                @keyframes slide-in-from-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-in-from-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-in-from-bottom {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes zoom-in {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-in {
                    animation-fill-mode: both;
                }

                .fade-in {
                    animation-name: fadeIn;
                }

                .slide-in-from-left {
                    animation-name: slide-in-from-left;
                }

                .slide-in-from-right {
                    animation-name: slide-in-from-right;
                }

                .slide-in-from-bottom {
                    animation-name: slide-in-from-bottom;
                }

                .zoom-in {
                    animation-name: zoom-in;
                }

                .duration-500 {
                    animation-duration: 500ms;
                }

                .duration-700 {
                    animation-duration: 700ms;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }

                .delay-400 {
                    animation-delay: 400ms;
                }

                .delay-500 {
                    animation-delay: 500ms;
                }

                .delay-600 {
                    animation-delay: 600ms;
                }

                .delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
