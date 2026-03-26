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
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
            
            <div className="profile-left-panel">
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a4f52] via-[#0D7377] to-[#053B3E]">
                    
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                    }} />
                    
                    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#32936F]/15 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/3 blur-2xl" />
                </div>

                
                <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-8">

                    
                    <div className="self-start">
                        <span className="text-white/40 text-[11px] font-semibold tracking-[4px] uppercase">
                            Profile
                        </span>
                    </div>

                    
                    <div className="flex flex-col items-center gap-7 text-center">

                        
                        <div className="relative profile-photo-wrapper">
                            
                            <div
                                className="absolute inset-0 rounded-full border-2 border-white/20 scale-[1.22] animate-pulse"
                                style={{ animationDuration: '3s' }}
                            />
                            
                            <div className="absolute inset-0 rounded-full border border-white/30 scale-[1.1]" />

                            <button
                                onClick={() => setIsPhotoModalOpen(true)}
                                title="Change Profile Photo"
                                className="profile-photo-container rounded-full border-[3px] border-white/80 overflow-hidden bg-white/10 cursor-pointer relative group/photo"
                                style={{ boxShadow: '0 0 0 6px rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.25)' }}
                            >
                                {photoUrl ? (
                                    <img src={photoUrl} alt={profileUser.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-white/25 to-white/5 flex items-center justify-center">
                                        <span className="profile-initials font-bold text-white tracking-widest">
                                            {initials}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200">
                                    <Camera size={24} className="text-white" />
                                    <span className="text-white text-[11px] font-semibold">Change</span>
                                </div>
                            </button>
                        </div>

                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                                {profileUser.fullName}
                            </h1>
                            <p className="text-white/55 text-sm">{profileUser.email}</p>
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold">
                                    {profileUser.role.replace('ROLE_', '')}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[#32936F]/35 border border-[#32936F]/50 text-emerald-200 text-xs font-semibold">
                                    Active
                                </span>
                            </div>
                        </div>

                        
                        <div className="flex items-center gap-3 w-48">
                            <div className="flex-1 h-px bg-white/15" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                            <div className="flex-1 h-px bg-white/15" />
                        </div>

                        
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-white font-semibold text-sm">
                                    {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                                <p className="text-white/45 text-[11px] mt-0.5 uppercase tracking-wide">Member since</p>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="text-center">
                                <p className="text-white font-semibold text-sm">{profileUser.status}</p>
                                <p className="text-white/45 text-[11px] mt-0.5 uppercase tracking-wide">Status</p>
                            </div>
                        </div>

                    </div>

                    
                    <div className="text-center space-y-1">
                        <p className="text-[#C9A961] text-base font-light tracking-[3px] uppercase">
                            Smart City Hub
                        </p>
                        <p className="text-white/35 text-[10px] tracking-[2px] uppercase">
                            Connected · Sustainable · Innovative
                        </p>
                    </div>

                </div>
            </div>

            
            <div className="profile-right-panel">
                <div className="max-w-3xl mx-auto p-8 md:p-12 space-y-6 animate-in slide-in-from-right duration-500">
                    
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#263238] mb-2">Profile Settings</h1>
                        <p className="text-xs text-[#546E7A]">Manage your personal information and account preferences</p>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#0D7377] to-transparent mt-3 rounded-full" />
                    </div>

                    
                    <PersonalInfoCard
                        user={profileUser}
                        onUpdate={handleUpdateProfile}
                    />

                    
                    <AccountInfoCard user={profileUser} />

                    
                    <SecuritySettingsCard
                        onChangePassword={() => setIsPasswordModalOpen(true)}
                    />


                    
                    <div className="text-center pt-8 text-xs text-[#90A4AE]">
                        <p>© 2024 Smart City Hub • Profile Management</p>
                    </div>
                </div>
            </div>

            
            <PhotoUploadModal
                isOpen={isPhotoModalOpen}
                onClose={() => setIsPhotoModalOpen(false)}
                onUpload={handlePhotoUpload}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />

            
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

                
                @media (max-width: 767px) {
                    .profile-split-container {
                        display: block;
                        height: auto;
                        overflow: visible;
                    }

                    .profile-left-panel {
                        height: auto;
                        min-height: 380px;
                        padding-bottom: 32px;
                    }

                    .profile-photo-container {
                        width: 100px !important;
                        height: 100px !important;
                    }

                    .profile-initials {
                        font-size: 2rem !important;
                    }

                    .profile-right-panel {
                        height: auto;
                        min-height: calc(100vh - 380px);
                        padding-bottom: 100px;
                    }

                    .profile-right-panel > div {
                        padding: 16px;
                    }
                }

                
                @media (min-width: 768px) {
                    .profile-photo-container {
                        width: 148px;
                        height: 148px;
                    }

                    .profile-initials {
                        font-size: 2.8rem;
                    }
                }

                
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
