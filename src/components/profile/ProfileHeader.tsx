import React from 'react';
import { Camera, User, CheckCircle, Clock, MinusCircle } from 'lucide-react';
import type { User as UserType } from '../../services/userService';

interface ProfileHeaderProps {
    user: UserType | null;
    onPhotoClick: () => void;
    photoUrl?: string | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onPhotoClick, photoUrl }) => {
    if (!user) return null;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return { icon: <CheckCircle size={14} />, text: 'Active', color: 'bg-green-100 text-green-700' };
            case 'PENDING':
                return { icon: <Clock size={14} />, text: 'Pending Approval', color: 'bg-amber-100 text-amber-700' };
            case 'INACTIVE':
                return { icon: <MinusCircle size={14} />, text: 'Inactive', color: 'bg-gray-100 text-gray-500' };
            default:
                return { icon: <User size={14} />, text: status, color: 'bg-blue-100 text-blue-700' };
        }
    };

    const statusConfig = getStatusConfig(user.status);
    const initials = user.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="relative mb-32">
            {/* Gradient Banner */}
            <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-sm group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D7377] to-[#32936F]">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}></div>
                </div>
            </div>

            {/* Overlapping Content */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-24 flex flex-col items-center w-full">

                {/* Avatar with White Border */}
                <div className="relative mb-4 group/avatar">
                    <div className="w-[124px] h-[124px] rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0D7377] to-[#14FFEC] flex items-center justify-center">
                                <span className="text-4xl font-bold text-white tracking-widest">{initials}</span>
                            </div>
                        )}
                    </div>

                    {/* Change Photo Button */}
                    <button
                        onClick={onPhotoClick}
                        className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md border border-gray-100 text-[#0D7377] hover:bg-[#0D7377] hover:text-white transition-all duration-200"
                        title="Change Profile Photo"
                    >
                        <Camera size={16} />
                    </button>
                </div>

                {/* Name & Info (Dark Text) */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#263238] mb-2">{user.fullName}</h1>
                    <div className="flex items-center justify-center gap-3 text-sm font-medium">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#546E7A]">
                            <User size={14} />
                            <span className="uppercase tracking-wider text-xs">{user.role.replace('ROLE_', '')}</span>
                        </span>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.text}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
