const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export const fetchWeatherData = async (location) => {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`
    );
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
  } catch (error) {
    console.error("Weather Manager Error:", error);
    return null;
  }
};