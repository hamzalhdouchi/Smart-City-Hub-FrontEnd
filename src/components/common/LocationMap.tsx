import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
// Depending on your build setup, you might need to import images directly
// or use a custom icon. This is a common workaround.


// Custom Teal Marker Icon to match theme
const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D7377" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 drop-shadow-lg filter"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

interface LocationMapProps {
    address: string;
    latitude: number;
    longitude: number;
    height?: string;
    className?: string;
}

// Helper component to update map center when props change
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
    address,
    latitude,
    longitude,
    height = "400px",
    className = ""
}) => {
    const position: [number, number] = [latitude, longitude];

    return (
        <div className={`w-full rounded-xl overflow-hidden shadow-md border border-gray-200 ${className}`} style={{ height }}>
            {/* 
                NOTE: You must ensure 'leaflet/dist/leaflet.css' is imported.
                This is usually done in this file or a global top-level file.
            */}
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full z-0" // z-0 to avoid overlapping other UI elements like sticky headers
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        <div className="text-sm font-sans">
                            <strong className="block text-[#0D7377] mb-1">Incident Location</strong>
                            {address}
                        </div>
                    </Popup>
                </Marker>
                <MapUpdater center={position} />
            </MapContainer>
        </div>
    );
};

export default LocationMap;
