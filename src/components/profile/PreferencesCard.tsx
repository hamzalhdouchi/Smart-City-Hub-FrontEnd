import React, { useState, useEffect } from 'react';
import { Settings, Globe, Bell, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { Card, Button } from '../common';
import toast from 'react-hot-toast';

interface Preferences {
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    dateFormat: string;
    timezone: string;
}

const DEFAULT_PREFERENCES: Preferences = {
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    dateFormat: 'DD/MM/YYYY',
    timezone: 'GMT+1'
};

const PreferencesCard: React.FC = () => {
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user_preferences');
        if (saved) {
            try {
                setPreferences(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse preferences', e);
            }
        }
    }, []);

    const handleChange = (key: keyof Preferences, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        localStorage.setItem('user_preferences', JSON.stringify(preferences));
        toast.success('Preferences saved successfully');
        setHasChanges(false);
        setIsSaving(false);
    };

    return (
        <Card className="mb-6">
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#FFF3E0] rounded-lg text-[#EF6C00]">
                        <Settings size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-[#263238]">Preferences</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-2 flex items-center gap-2">
                            <Globe size={16} /> Language
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                            value={preferences.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                        >
                            <option value="en">🇬🇧 English</option>
                            <option value="fr">🇫🇷 Français</option>
                            <option value="ar">🇲🇦 العربية</option>
                        </select>
                    </div>

                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-2 flex items-center gap-2">
                            <Clock size={16} /> Time Zone
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                            value={preferences.timezone}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                        >
                            <option value="GMT+1">(GMT+1) Casablanca</option>
                            <option value="GMT">GMT London</option>
                            <option value="UTC">UTC Coordinated Universal Time</option>
                        </select>
                    </div>

                    {/* Date Format */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-2 flex items-center gap-2">
                            <Calendar size={16} /> Date Format
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-white border border-[#B0BEC5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 focus:border-[#0D7377]"
                            value={preferences.dateFormat}
                            onChange={(e) => handleChange('dateFormat', e.target.value)}
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (31/01/2026)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (01/31/2026)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-31)</option>
                        </select>
                    </div>

                    {/* Notifications */}
                    <div>
                        <label className="block text-sm font-medium text-[#546E7A] mb-2 flex items-center gap-2">
                            <Bell size={16} /> Notifications
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-sm font-medium text-[#263238]">Email Notifications</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[#0D7377] rounded focus:ring-[#0D7377]"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-sm font-medium text-[#263238]">Push Notifications</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[#0D7377] rounded focus:ring-[#0D7377]"
                                    checked={preferences.pushNotifications}
                                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`transition-all ${!hasChanges ? 'opacity-50' : ''}`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Preferences
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PreferencesCard;
