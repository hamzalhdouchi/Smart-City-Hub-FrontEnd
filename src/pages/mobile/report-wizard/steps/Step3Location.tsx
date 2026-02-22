import React, { useState } from 'react';
import { MapPin, Search, Navigation, Crosshair, Sparkles, Radar } from 'lucide-react';
import { LocationIcon } from '../../../../components/icons/WizardIcons';
import type { ReportWizardState } from '../types';

interface Step3LocationProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

export const Step3Location: React.FC<Step3LocationProps> = ({ state, onUpdate, onNext }) => {
    const [manualAddress, setManualAddress] = useState(state.location?.address || '');
    const [isLocating, setIsLocating] = useState(false);

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;


                try {
                    // Reverse geocode using BigDataCloud API (free, no API key needed)
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );

                    if (!response.ok) {
                        throw new Error('Geocoding API request failed');
                    }

                    const data = await response.json();

                    // Build a readable address from the response
                    let formattedAddress = '';

                    // Try to build address from available components
                    if (data.locality) {
                        formattedAddress = data.locality;
                    } else if (data.city) {
                        formattedAddress = data.city;
                    }

                    // Add street/road if available
                    if (data.localityInfo?.administrative?.[3]?.name) {
                        const street = data.localityInfo.administrative[3].name;
                        formattedAddress = street + (formattedAddress ? `, ${formattedAddress}` : '');
                    }

                    // Fallback to principal subdivision or country
                    if (!formattedAddress && data.principalSubdivision) {
                        formattedAddress = data.principalSubdivision;
                    }

                    const finalAddress = formattedAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                    onUpdate({
                        location: {
                            latitude,
                            longitude,
                            address: finalAddress
                        }
                    });
                    setManualAddress(finalAddress);
                } catch (error) {
                    console.error('Reverse geocoding failed:', error);
                    // Fallback to coordinates if geocoding fails
                    const fallbackAddress = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    onUpdate({
                        location: {
                            latitude,
                            longitude,
                            address: fallbackAddress
                        }
                    });
                    setManualAddress(fallbackAddress);
                }


                setIsLocating(false);
            }, () => {
                setIsLocating(false);
            });
        }
    };


    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Premium Header */}
            <div className="mb-6 lg:mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#0D7377' }}>
                        <LocationIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100">
                        <Radar size={10} className="inline mr-1 animate-pulse" />
                        Geo-Targeting
                    </span>
                </div>
                <h2 className="text-[28px] lg:text-[32px] font-black text-slate-800 mb-2 leading-tight">
                    Pin the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Exact Location</span>
                </h2>
                <p className="text-slate-500 font-semibold text-sm lg:text-base">
                    Help us locate the issue precisely on the map
                </p>
            </div>

            {/* Interactive Map Container */}
            <div className="relative h-[280px] lg:h-[320px] rounded-[28px] overflow-hidden mb-6 shadow-2xl group">
                {/* Map Background — dark teal to match app theme */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a3d40 0%, #0d5c60 50%, #0a4548 100%)' }} />

                {/* Animated Grid Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(13,115,119,0.3) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(13,115,119,0.3) 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Scanning Animation */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan-y opacity-60" />

                {/* Radar Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-32 h-32 border-2 border-teal-500/20 rounded-full animate-ping-slow" />
                    <div className="absolute w-48 h-48 border border-teal-500/10 rounded-full animate-ping-slower" />
                    <div className="absolute w-64 h-64 border border-teal-500/5 rounded-full animate-ping-slowest" />

                    {/* Central Pin with Glow */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-50 animate-pulse" />
                        <div className="relative">
                            <MapPin size={56} className="text-white drop-shadow-[0_0_20px_rgba(20,255,236,0.8)]" fill="#0D7377" strokeWidth={2.5} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-ping" />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 rounded-full blur-sm" />
                    </div>
                </div>

                {/* GPS Coordinates Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-teal-300 tracking-tight">
                        {state.location?.latitude.toFixed(4) || '33.5731'}, {state.location?.longitude.toFixed(4) || '-7.5898'}
                    </span>
                </div>

                {/* Location Button */}
                <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="absolute bottom-4 right-4 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 active:scale-90 transition-all disabled:opacity-50"
                >
                    {isLocating ? (
                        <Crosshair size={24} className="animate-spin" />
                    ) : (
                        <Navigation size={24} />
                    )}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse border-2 border-[#0a3d40]" />
                </button>
            </div>

            {/* Address Input */}
            <div className="space-y-4 mb-6">
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors z-10">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="Search address or landmark..."
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Current Location Quick Action */}
                <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="w-full p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-100 rounded-2xl flex items-center gap-3 hover:from-teal-100 hover:to-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        {isLocating ? (
                            <Crosshair size={20} className="text-teal-600 animate-spin" />
                        ) : (
                            <Navigation size={20} className="text-teal-600" />
                        )}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-black text-teal-800">Use My Current Location</p>
                        <p className="text-xs font-semibold text-teal-600/70">Automatic GPS detection</p>
                    </div>
                    <Sparkles size={18} className="text-teal-500 animate-pulse" />
                </button>

                {/* Confirmed Location Display */}
                {state.location && (
                    <div className="p-5 rounded-2xl shadow-lg text-white animate-in slide-in-from-bottom-2 duration-500" style={{ background: '#0D7377' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="block text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                                    ✓ Location Confirmed
                                </span>
                                <span className="block text-base font-black truncate">
                                    {state.location.address}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Continue Button */}
            <button
                onClick={() => {
                    if (!state.location && manualAddress) {
                        onUpdate({ location: { latitude: 33.5731, longitude: -7.5898, address: manualAddress } });
                    }
                    onNext();
                }}
                className={`lg:hidden mt-auto w-full py-5 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${state.location || manualAddress
                    ? 'text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                style={(state.location || manualAddress) ? { background: '#0D7377' } : undefined}
                disabled={!state.location && !manualAddress}
            >
                Continue →
            </button>
        </div>
    );
};

export default Step3Location;
