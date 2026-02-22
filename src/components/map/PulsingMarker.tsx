import React from 'react';
import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface PulsingMarkerProps {
    position: [number, number];
    color?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export const PulsingMarker: React.FC<PulsingMarkerProps> = ({
    position,
    color = '#0D7377',
    onClick,
    children
}) => {

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-12 h-12">
            <div
                className="absolute inset-0 rounded-full opacity-40 animate-ping"
                style={{ backgroundColor: color }}
            />
            <div
                className="absolute inset-2 rounded-full opacity-60 animate-pulse"
                style={{ backgroundColor: color }}
            />
            <div className="relative z-10 text-white drop-shadow-md">
                <MapPin size={24} fill={color} strokeWidth={2.5} />
            </div>
        </div>
    );

    const customIcon = divIcon({
        html: iconMarkup,
        className: 'custom-pulsing-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 48], // Center bottom
        popupAnchor: [0, -48]
    });

    return (
        <Marker
            position={position}
            icon={customIcon}
            eventHandlers={{
                click: onClick
            }}
        >
            {children}
        </Marker>
    );
};
