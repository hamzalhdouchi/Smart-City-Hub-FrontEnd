import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { incidentService, type Incident } from '../../../services/incidentService';
import { PulsingMarker } from '../../../components/map/PulsingMarker';
import { Radar, Navigation } from 'lucide-react';
import { DEMO_INCIDENTS } from './demoData';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

import L from 'leaflet';

const MARRAKECH_CENTER: [number, number] = [31.6295, -7.9811];
const MARRAKECH_BOUNDS = L.latLngBounds(
    L.latLng(31.54, -8.10),
    L.latLng(31.72, -7.87)
);

export const MapDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<{ id: string, label: string }[]>([
        { id: 'All', label: 'All' }
    ]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await incidentService.getCategories();
                const formatted = fetchedCategories.map(c => ({
                    id: c.id,
                    label: c.name
                }));
                setCategories([{ id: 'All', label: 'All' }, ...formatted]);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                setCategories([
                    { id: 'All', label: 'All' },
                    { id: 'LIGHTING', label: 'Lighting' },
                    { id: 'INFRASTRUCTURE', label: 'Roads' },
                    { id: 'SAFETY', label: 'Safety' },
                    { id: 'SANITATION', label: 'Trash' }
                ]);
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                setLoading(true);
                const isAgent = user?.role === 'ROLE_AGENT';
                const data = isAgent
                    ? await incidentService.getAssignedIncidents(0, 50)
                    : await incidentService.getIncidents(undefined, undefined, 0, 20);

                if (data.content && data.content.length > 0) {
                    setIncidents(data.content);
                } else {
                    console.warn("API returned empty, using Demo Data");
                    setIncidents(DEMO_INCIDENTS);
                    toast.success('Loaded Demo Map Data', { icon: '🗺️' });
                }
            } catch (error) {
                console.error("Failed to load map data, using fallback", error);
                setIncidents(DEMO_INCIDENTS);
                toast.error('Offline Mode: Using Demo Data');
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchIncidents();
        }
    }, [user]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return '#EF4444'; // Red-500
            case 'MEDIUM': return '#F59E0B'; // Amber-500
            case 'LOW': return '#10B981'; // Emerald-500
            default: return '#0D7377'; // Teal-700
        }
    };
    const filteredIncidents = selectedCategory === 'All'
        ? incidents
        : incidents.filter(i => i.category?.id === selectedCategory);

    return (
        <div className="relative w-full h-[100dvh] lg:h-screen bg-slate-900 overflow-hidden">
            
            <MapContainer
                center={MARRAKECH_CENTER}
                zoom={13}
                minZoom={12}
                maxZoom={18}
                maxBounds={MARRAKECH_BOUNDS}
                maxBoundsViscosity={1.0}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                className="z-0"
            >
                
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <ZoomControl position="topright" />

                
                {filteredIncidents.map((incident) => {
                    const lat = incident.latitude;
                    const lng = incident.longitude;

                    if (!lat || !lng) return null;

                    return (
                        <PulsingMarker
                            key={incident.id}
                            position={[lat, lng]}
                            color={getPriorityColor(incident.priority)}
                            onClick={() => setSelectedIncident(incident)}
                        />
                    );
                })}
            </MapContainer>

            
            <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent animate-scan-y opacity-30" />
            </div>

            
            <div className="absolute top-4 left-4 right-4 z-[500] flex justify-between items-start pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl pointer-events-auto">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Radar className="text-white animate-spin-slow" size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-sm uppercase tracking-wider">Live Map</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-teal-400 text-xs font-bold">{filteredIncidents.length} Active</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="absolute bottom-24 lg:bottom-6 left-0 right-0 z-[500] px-4 overflow-x-auto no-scrollbar pb-2 pointer-events-auto">
                <div className="flex gap-2 w-max mx-auto">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg backdrop-blur-md border ${selectedCategory === cat.id
                                ? 'bg-teal-500 text-white border-teal-400 shadow-teal-500/30 scale-105'
                                : 'bg-black/60 text-slate-300 border-white/10 hover:bg-black/80 hover:scale-105'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            
            {loading && (
                <div className="absolute inset-0 z-[1000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                        <p className="text-teal-400 font-bold tracking-widest animate-pulse">Scanning Grid...</p>
                    </div>
                </div>
            )}

            
            {selectedIncident && (
                <div className="absolute bottom-24 lg:bottom-20 left-4 right-4 z-[600] animate-in slide-in-from-bottom-10 duration-300 pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-lg line-clamp-1">{selectedIncident.title}</h3>
                                <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
                                    <Navigation size={12} /> {selectedIncident.address || 'Unknown Location'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedIncident(null)}
                                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold hover:bg-slate-200"
                            >✕</button>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                            {selectedIncident.description}
                        </p>
                        <button
                            onClick={() => {
                                const isAgent = user?.role === 'ROLE_AGENT';
                                navigate(isAgent ? `/agent/incidents/${selectedIncident.id}` : `/incidents/${selectedIncident.id}`);
                            }}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
                        >
                            View Full Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
