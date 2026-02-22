import React, { useState } from 'react';
import { Shield, Lock, Smartphone, Monitor, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react';
import { Card, Button } from '../common';

interface SecuritySettingsCardProps {
    onChangePassword: () => void;
}

const SecuritySettingsCard: React.FC<SecuritySettingsCardProps> = ({ onChangePassword }) => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <Card className="mb-6">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#F3E5F5] rounded-lg text-[#7B1FA2]">
                        <Shield size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-[#263238]">Security Settings</h2>
                </div>

                <div className="space-y-6">

                    {/* Password */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                        <div>
                            <h3 className="font-semibold text-[#263238] mb-1">Password</h3>
                            <p className="text-sm text-[#546E7A]">
                                Keep your account secure by using a strong, unique password.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={onChangePassword}
                            className="text-[#0D7377] border-[#0D7377]/30 hover:bg-[#0D7377]/5"
                        >
                            <Lock size={16} className="mr-2" />
                            Change Password
                            <ChevronRight size={16} className="ml-1 opacity-50" />
                        </Button>
                    </div>

                    {/* 2FA - UI only (not yet implemented) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                        <div>
                            <h3 className="font-semibold text-[#263238] mb-1">Two-Factor Authentication</h3>
                            <p className="text-sm text-[#546E7A] max-w-md">
                                Add an extra layer of security to your account by requiring a code from your phone.
                            </p>
                            <p className="mt-1 text-xs text-[#B0BEC5]">
                                Coming soon – this option is not active yet.
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-[#B0BEC5] cursor-not-allowed"
                        >
                            <Smartphone size={18} />
                            <span>Disabled</span>
                            <ToggleLeft size={24} />
                        </div>
                    </div>



                </div>
            </div>
        </Card>
    );
};

export default SecuritySettingsCard;
