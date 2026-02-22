import React, { useState, useEffect } from 'react';
import { weatherService, type WeatherData } from '../../services/weatherService';
import { theme } from '../../styles/theme';
import { Cloud, Droplets, Wind, Gauge, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWeather = async (isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                weatherService.clearCache();
            } else {
                setLoading(true);
            }

            const data = await weatherService.getCurrentWeather();
            setWeather(data);
            setError(null);
        } catch (err: any) {
            console.error('Weather fetch error:', err);
            setError(err.message || 'Impossible de charger la météo');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWeather();

        // Auto-refresh every 30 minutes
        const interval = setInterval(() => {
            fetchWeather();
        }, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchWeather(true);
    };

    if (loading && !weather) {
        return (
            <div
                className="rounded-3xl p-5 animate-pulse"
                style={{
                    background: 'linear-gradient(135deg, #0a4f54 0%, #0d7377 55%, #0e9e8e 100%)',
                    boxShadow: theme.shadows.level2,
                }}
            >
                <div className="space-y-3">
                    <div className="h-4 bg-white/30 rounded w-1/2" />
                    <div className="h-12 bg-white/30 rounded w-3/4" />
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-white/30 rounded" />
                        <div className="h-8 bg-white/30 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div
                className="rounded-3xl p-5"
                style={{
                    background: `linear-gradient(135deg, ${theme.colors.neutral.steel} 0%, ${theme.colors.neutral.asphalt} 100%)`,
                    boxShadow: theme.shadows.level2,
                }}
            >
                <div className="text-center text-white">
                    <Cloud size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-80">
                        {error || 'Weather unavailable'}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="mt-3 px-4 py-2 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Format current date in French
    const formattedDate = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });

    return (
        <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0a4f54 0%, #0d7377 55%, #0e9e8e 100%)',
                boxShadow: theme.shadows.level2,
            }}
        >
            {/* Decorative background pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                     radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-white text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>
                            {weather.city}
                        </h3>
                        <p className="text-white/80 text-xs capitalize">
                            {formattedDate}
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all active:scale-95"
                        aria-label="Refresh"
                    >
                        <RefreshCw
                            size={16}
                            className={`text-white ${refreshing ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>

                {/* Main Weather Display */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={weatherService.getIconUrl(weather.icon)}
                            alt={weather.description}
                            className="w-20 h-20 drop-shadow-lg"
                        />
                        <div>
                            <div className="text-5xl font-bold text-white" style={{ fontFamily: theme.fonts.heading }}>
                                {weather.temperature}°
                            </div>
                            <p className="text-white/90 text-sm capitalize mt-1">
                                {weather.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/20 mb-4" />

                {/* Weather Details Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Humidity */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Droplets size={16} className="text-white/80" />
                            <span className="text-white/70 text-xs">Humidité</span>
                        </div>
                        <p className="text-white text-lg font-bold">
                            {weather.humidity}%
                        </p>
                    </div>

                    {/* Wind Speed */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Wind size={16} className="text-white/80" />
                            <span className="text-white/70 text-xs">Vent</span>
                        </div>
                        <p className="text-white text-lg font-bold">
                            {weather.windSpeed} <span className="text-sm font-normal">km/h</span>
                        </p>
                    </div>

                    {/* Pressure */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Gauge size={16} className="text-white/80" />
                            <span className="text-white/70 text-xs">Pression</span>
                        </div>
                        <p className="text-white text-lg font-bold">
                            {weather.pressure} <span className="text-sm font-normal">hPa</span>
                        </p>
                    </div>
                </div>

                {/* Feels Like */}
                <p className="text-white/70 text-xs text-center mt-3">
                    Feels like: {weather.feelsLike}°C
                </p>
            </div>
        </div>
    );
};

export default WeatherWidget;
