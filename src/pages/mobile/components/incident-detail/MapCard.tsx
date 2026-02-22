import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapCardProps {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
}

export const MapCard: React.FC<MapCardProps> = ({
    latitude,
    longitude,
    address,
    city
}) => {
    const position: [number, number] = [latitude, longitude];

    const openInMaps = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            if (isIOS) {
                window.open(`maps://maps.apple.com/?q=${latitude},${longitude}`, '_blank');
            } else {
                window.open(`geo:${latitude},${longitude}`, '_blank');
            }
        } else {
            window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        }
    };

    const getDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    };

    // Custom green marker icon
    const customIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#32936F;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#14FFEC;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path fill="url(#grad)" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        `),
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header */}
            <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                    background: '#E8F5E9'
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: '#32936F',
                        boxShadow: '0 4px 12px rgba(50, 147, 111, 0.3)'
                    }}
                >
                    <MapPin size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#263238]">Exact Location</h2>
                    <p className="text-xs text-[#546E7A]">Pinpoint accuracy on the map</p>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative" style={{ height: '220px' }}>
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            <strong>{address}</strong><br />
                            {city}
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Compass indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Compass size={16} className="text-[#32936F]" />
                </div>
            </div>

            {/* Address & Coordinates */}
            <div className="px-5 py-4 border-t border-[#ECEFF1]">
                <p className="text-sm font-semibold text-[#263238] mb-1">{address}</p>
                <p className="text-xs text-[#546E7A] font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#32936F]" />
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
                <button
                    onClick={openInMaps}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#32936F] text-[#32936F] rounded-xl font-semibold text-sm hover:bg-[#32936F10] transition-all active:scale-95"
                >
                    <ExternalLink size={16} />
                    Open Maps
                </button>
                <button
                    onClick={getDirections}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
                    style={{
                        background: '#32936F',
                        boxShadow: '0 4px 12px rgba(50, 147, 111, 0.3)'
                    }}
                >
                    <Navigation size={16} />
                    Directions
                </button>
            </div>
        </div>
    );
};
