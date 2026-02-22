/**
 * Weather Service
 * Integrates with Open-Meteo API to fetch real-time weather data
 * No API key required!
 */

const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

export interface WeatherData {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    city: string;
    country: string;
    timestamp: number;
}

interface GeocodingResponse {
    results?: Array<{
        latitude: number;
        longitude: number;
        name: string;
        country: string;
        country_code: string;
    }>;
}

interface WeatherResponse {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        surface_pressure: number;
        weather_code: number;
    };
    current_units: {
        temperature_2m: string;
    };
}

// Weather code to condition mapping (WMO Weather interpretation codes)
const weatherCodeMap: Record<number, { condition: string; description: string; icon: string }> = {
    0: { condition: 'Clear', description: 'ciel dégagé', icon: '01d' },
    1: { condition: 'Clear', description: 'principalement dégagé', icon: '01d' },
    2: { condition: 'Clouds', description: 'partiellement nuageux', icon: '02d' },
    3: { condition: 'Clouds', description: 'couvert', icon: '03d' },
    45: { condition: 'Fog', description: 'brouillard', icon: '50d' },
    48: { condition: 'Fog', description: 'brouillard givrant', icon: '50d' },
    51: { condition: 'Drizzle', description: 'bruine légère', icon: '09d' },
    53: { condition: 'Drizzle', description: 'bruine modérée', icon: '09d' },
    55: { condition: 'Drizzle', description: 'bruine dense', icon: '09d' },
    61: { condition: 'Rain', description: 'pluie légère', icon: '10d' },
    63: { condition: 'Rain', description: 'pluie modérée', icon: '10d' },
    65: { condition: 'Rain', description: 'pluie forte', icon: '10d' },
    71: { condition: 'Snow', description: 'neige légère', icon: '13d' },
    73: { condition: 'Snow', description: 'neige modérée', icon: '13d' },
    75: { condition: 'Snow', description: 'neige forte', icon: '13d' },
    80: { condition: 'Rain', description: 'averses légères', icon: '09d' },
    81: { condition: 'Rain', description: 'averses modérées', icon: '09d' },
    82: { condition: 'Rain', description: 'averses violentes', icon: '09d' },
    95: { condition: 'Thunderstorm', description: 'orage', icon: '11d' },
    96: { condition: 'Thunderstorm', description: 'orage avec grêle légère', icon: '11d' },
    99: { condition: 'Thunderstorm', description: 'orage avec grêle forte', icon: '11d' },
};

class WeatherService {
    private cache: { data: WeatherData | null; timestamp: number } = {
        data: null,
        timestamp: 0,
    };
    private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

    /**
     * Get coordinates for a city
     */
    private async getCoordinates(city: string, countryCode: string): Promise<{ lat: number; lon: number }> {
        const response = await fetch(
            `${GEOCODING_URL}/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`
        );

        if (!response.ok) {
            throw new Error(`Geocoding error: ${response.status}`);
        }

        const data: GeocodingResponse = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error(`City not found: ${city}`);
        }

        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
        };
    }

    /**
     * Fetch current weather for a city
     */
    async getCurrentWeather(city: string = 'Casablanca', countryCode: string = 'MA'): Promise<WeatherData> {
        // Check cache first
        const now = Date.now();
        if (this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
            return this.cache.data;
        }

        try {
            // Get coordinates
            const { lat, lon } = await getCoordinates(city, countryCode);

            // Fetch weather data
            const response = await fetch(
                `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&timezone=auto`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data: WeatherResponse = await response.json();
            const weatherCode = data.current.weather_code;
            const weatherInfo = weatherCodeMap[weatherCode] || weatherCodeMap[0];

            const weatherData: WeatherData = {
                temperature: Math.round(data.current.temperature_2m),
                feelsLike: Math.round(data.current.apparent_temperature),
                condition: weatherInfo.condition,
                description: weatherInfo.description,
                icon: weatherInfo.icon,
                humidity: data.current.relative_humidity_2m,
                windSpeed: Math.round(data.current.wind_speed_10m),
                pressure: Math.round(data.current.surface_pressure),
                city: city,
                country: countryCode,
                timestamp: now,
            };

            // Update cache
            this.cache = {
                data: weatherData,
                timestamp: now,
            };

            return weatherData;
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            throw error;
        }
    }

    /**
     * Get weather icon URL (using OpenWeatherMap icons for consistency)
     */
    getIconUrl(iconCode: string): string {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    /**
     * Clear cache (useful for manual refresh)
     */
    clearCache(): void {
        this.cache = { data: null, timestamp: 0 };
    }
}

// Helper function for geocoding
async function getCoordinates(city: string, countryCode: string): Promise<{ lat: number; lon: number }> {
    const response = await fetch(
        `${GEOCODING_URL}/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`
    );

    if (!response.ok) {
        throw new Error(`Geocoding error: ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`City not found: ${city}`);
    }

    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
    };
}

export const weatherService = new WeatherService();
