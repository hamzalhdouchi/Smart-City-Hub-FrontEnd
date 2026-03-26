import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Crosshair, Radar, PenLine, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LocationIcon } from '../../../../components/icons/WizardIcons';
import type { ReportWizardState } from '../types';
const MARRAKECH_CENTER: [number, number] = [31.6295, -7.9811];
const MARRAKECH_BOUNDS = L.latLngBounds(
    L.latLng(31.54, -8.10),  // SW corner
    L.latLng(31.72, -7.87)   // NE corner
);

function isInsideMarrakech(lat: number, lng: number): boolean {
    return MARRAKECH_BOUNDS.contains(L.latLng(lat, lng));
}
const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D7377" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:40px;height:40px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();

    let address = '';
    if (data.locality) address = data.locality;
    else if (data.city) address = data.city;

    if (data.localityInfo?.administrative?.[3]?.name) {
        const street = data.localityInfo.administrative[3].name;
        address = street + (address ? `, ${address}` : '');
    }

    if (!address && data.principalSubdivision) address = data.principalSubdivision;
    return address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
interface MapClickHandlerProps {
    onPick: (lat: number, lng: number) => void;
    onOutOfBounds: () => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onPick, onOutOfBounds }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            if (isInsideMarrakech(lat, lng)) {
                onPick(lat, lng);
            } else {
                onOutOfBounds();
            }
        },
    });
    return null;
};
interface Step3LocationProps {
    state: ReportWizardState;
    onUpdate: (updates: Partial<ReportWizardState>) => void;
    onNext: () => void;
}

type Mode = 'choose' | 'gps' | 'manual';

export const Step3Location: React.FC<Step3LocationProps> = ({ state, onUpdate, onNext }) => {
    const [mode, setMode] = useState<Mode>(state.location ? 'gps' : 'choose');
    const [isLocating, setIsLocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [outOfBounds, setOutOfBounds] = useState(false);
    const [manualAddress, setManualAddress] = useState(state.location?.address || '');
    const [markerPos, setMarkerPos] = useState<[number, number] | null>(
        state.location ? [state.location.latitude, state.location.longitude] : null
    );
    const handleGPS = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        setOutOfBounds(false);
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                if (!isInsideMarrakech(latitude, longitude)) {
                    setOutOfBounds(true);
                    setIsLocating(false);
                    return;
                }
                try {
                    const address = await reverseGeocode(latitude, longitude);
                    onUpdate({ location: { latitude, longitude, address } });
                    setManualAddress(address);
                    setMarkerPos([latitude, longitude]);
                } catch {
                    const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    onUpdate({ location: { latitude, longitude, address } });
                    setManualAddress(address);
                    setMarkerPos([latitude, longitude]);
                } finally {
                    setIsLocating(false);
                }
            },
            () => setIsLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };
    const handleMapPick = useCallback(async (lat: number, lng: number) => {
        setOutOfBounds(false);
        setMarkerPos([lat, lng]);
        setIsGeocoding(true);
        try {
            const address = await reverseGeocode(lat, lng);
            setManualAddress(address);
            onUpdate({ location: { latitude: lat, longitude: lng, address } });
        } catch {
            const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setManualAddress(address);
            onUpdate({ location: { latitude: lat, longitude: lng, address } });
        } finally {
            setIsGeocoding(false);
        }
    }, [onUpdate]);
    const handleContinue = () => {
        if (!state.location && manualAddress) {
            const pos = markerPos ?? MARRAKECH_CENTER;
            onUpdate({ location: { latitude: pos[0], longitude: pos[1], address: manualAddress } });
        }
        onNext();
    };

    const canContinue = !!state.location || !!manualAddress;
    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">

            
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: '#0D7377' }}>
                        <LocationIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100">
                        <Radar size={10} className="inline mr-1 animate-pulse" />
                        Geo-Targeting
                    </span>
                </div>
                <h2 className="text-[28px] lg:text-[32px] font-black text-slate-800 mb-1 leading-tight">
                    Pin the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Exact Location</span>
                </h2>
                <p className="text-slate-500 font-semibold text-sm">
                    Choose how you want to set the location
                </p>
            </div>

            
            <div className="grid grid-cols-2 gap-3 mb-6">
                
                <button
                    onClick={() => {
                        setMode('gps');
                        if (!state.location) handleGPS();
                    }}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all active:scale-[0.97] ${mode === 'gps'
                        ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100'
                        : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${mode === 'gps' ? 'bg-teal-600' : 'bg-slate-100'}`}>
                        <Navigation size={24} className={mode === 'gps' ? 'text-white' : 'text-slate-500'} />
                    </div>
                    <div className="text-center">
                        <p className={`text-sm font-black ${mode === 'gps' ? 'text-teal-800' : 'text-slate-700'}`}>
                            Detect Automatically
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Use GPS</p>
                    </div>
                    {mode === 'gps' && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                    )}
                </button>

                
                <button
                    onClick={() => setMode('manual')}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all active:scale-[0.97] ${mode === 'manual'
                        ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-100'
                        : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${mode === 'manual' ? 'bg-teal-600' : 'bg-slate-100'}`}>
                        <PenLine size={24} className={mode === 'manual' ? 'text-white' : 'text-slate-500'} />
                    </div>
                    <div className="text-center">
                        <p className={`text-sm font-black ${mode === 'manual' ? 'text-teal-800' : 'text-slate-700'}`}>
                            Pick on Map
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Tap to place pin</p>
                    </div>
                    {mode === 'manual' && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                    )}
                </button>
            </div>

            
            {outOfBounds && (
                <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <AlertTriangle size={20} className="text-red-500 shrink-0" />
                    <div>
                        <p className="text-sm font-black text-red-700">Outside Marrakech</p>
                        <p className="text-xs font-semibold text-red-500">This app only accepts incident reports within Marrakech city.</p>
                    </div>
                </div>
            )}

            
            {mode === 'gps' && (
                <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button
                        onClick={handleGPS}
                        disabled={isLocating}
                        className="w-full p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-100 rounded-2xl flex items-center gap-3 hover:from-teal-100 hover:to-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            {isLocating
                                ? <Crosshair size={20} className="text-teal-600 animate-spin" />
                                : <Navigation size={20} className="text-teal-600" />
                            }
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-black text-teal-800">
                                {isLocating ? 'Detecting your location…' : 'Use My Current Location'}
                            </p>
                            <p className="text-xs font-semibold text-teal-600/70">Automatic GPS detection</p>
                        </div>
                    </button>
                </div>
            )}

            
            {mode === 'manual' && (
                <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-xs font-semibold text-slate-500 text-center">
                        Tap anywhere inside Marrakech to place the pin
                    </p>

                    <div className="rounded-2xl overflow-hidden border-2 border-teal-100 shadow-lg" style={{ height: 260 }}>
                        <MapContainer
                            center={markerPos ?? MARRAKECH_CENTER}
                            zoom={13}
                            minZoom={12}
                            maxZoom={18}
                            maxBounds={MARRAKECH_BOUNDS}
                            maxBoundsViscosity={1.0}
                            scrollWheelZoom
                            className="h-full w-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler
                                onPick={handleMapPick}
                                onOutOfBounds={() => setOutOfBounds(true)}
                            />
                            {markerPos && (
                                <Marker position={markerPos} icon={customIcon} />
                            )}
                        </MapContainer>
                    </div>

                    
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors z-10">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            value={isGeocoding ? 'Getting address…' : manualAddress}
                            onChange={(e) => {
                                setManualAddress(e.target.value);
                                if (markerPos) {
                                    onUpdate({
                                        location: {
                                            latitude: markerPos[0],
                                            longitude: markerPos[1],
                                            address: e.target.value,
                                        }
                                    });
                                }
                            }}
                            readOnly={isGeocoding}
                            placeholder="Address will appear after tapping the map…"
                            className="w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            )}

            
            {state.location && (
                <div className="p-4 rounded-2xl shadow-md text-white mb-4 animate-in slide-in-from-bottom-2 duration-500" style={{ background: '#0D7377' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="block text-[10px] font-black uppercase tracking-widest opacity-75 mb-0.5">
                                ✓ Location Confirmed
                            </span>
                            <span className="block text-sm font-black truncate">
                                {state.location.address}
                            </span>
                            <span className="block text-[11px] opacity-70 font-mono mt-0.5">
                                {state.location.latitude.toFixed(5)}, {state.location.longitude.toFixed(5)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            
            <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`lg:hidden mt-auto w-full py-5 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${canContinue
                    ? 'text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                style={canContinue ? { background: '#0D7377' } : undefined}
            >
                Continue →
            </button>
        </div>
    );
};

export default Step3Location;
