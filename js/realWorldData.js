/**
 * Live context adapters for public, no-key data sources.
 * Weather is contextual information only; it is not a water-quality measurement.
 */

const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm'
};

export async function fetchLiveWeather(area) {
  if (!area?.center?.length) return null;

  const [latitude, longitude] = area.center;
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    timezone: 'auto'
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    const payload = await response.json();
    const current = payload.current;
    if (!current) return null;

    return {
      source: 'Open-Meteo',
      observedAt: current.time,
      timezone: payload.timezone,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      condition: WEATHER_CODES[current.weather_code] || 'Variable conditions'
    };
  } catch (error) {
    console.warn('Live weather context unavailable:', error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
