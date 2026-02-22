import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { DataPulseLoader, Card, Button } from '../../components/common';
import {
    PersonalInfoCard,
    SecuritySettingsCard,
    PhotoUploadModal,
    ChangePasswordModal,
} from '../../components/profile';
import { Camera, ShieldCheck, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AgentProfilePage: React.FC = () => {
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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` || 'AG';

    const handleUpdateProfile = async (data: { firstName: string; lastName: string; phone: string }) => {
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

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                        Agent Profile
                    </h1>
                    <p className="text-sm text-[#546E7A]">
                        Manage your contact details and security settings for field operations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D7377]/10 text-[#0D7377] text-xs font-semibold">
                        <ShieldCheck size={14} />
                        <span>{user.role.replace('ROLE_', '')}</span>
                    </div>
                </div>
            </div>

            {/* Top summary card */}
            <Card>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0D7377] to-[#32936F] flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
                            {photoUrl ? (
                                <img src={photoUrl} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsPhotoModalOpen(true)}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#0D7377] border border-[#ECEFF1]"
                            title="Change profile photo"
                        >
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                        <h2 className="text-lg font-semibold text-[#263238]">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-sm text-[#546E7A] flex items-center gap-1 mt-1">
                            <UserIcon size={14} /> {user.email}
                        </p>
                        <p className="text-xs text-[#90A4AE] mt-1">
                            ID: {user.id}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Update Password
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Details grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <PersonalInfoCard
                        user={user as any}
                        onUpdate={handleUpdateProfile}
                    />
                </div>
                <div className="space-y-4">
                    <Card>
                        <h3 className="text-sm font-semibold text-[#263238] mb-2">
                            Account Information
                        </h3>
                        <p className="text-xs text-[#546E7A] mb-3">
                            Basic details used by supervisors to assign and follow up incidents.
                        </p>
                        <div className="space-y-1 text-xs text-[#455A64]">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="font-medium">{user.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Registered</span>
                                <span className="font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <SecuritySettingsCard
                        onChangePassword={() => setIsPasswordModalOpen(true)}
                    />
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
        </div>
    );
};

export default AgentProfilePage;

