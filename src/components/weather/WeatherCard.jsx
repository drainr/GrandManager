import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from './WeatherManager';

const WeatherCard = ({ location, onLocationChange }) => {
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const [weather, setWeather] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchWeatherData(location).then(data => setWeather(data));
  }, [location]);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 3) return setSuggestions([]);
    const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${val}`);
    const data = await res.json();
    setSuggestions(data);
  };

  if (!weather) return <div className="text-[#EBB537]">Loading...</div>;
  const { current, forecast, location: locDetails } = weather;

  return (
    <div style={{ position: 'relative' }}>
      {isEditing && (
        <div style={{
          position: 'absolute', zIndex: 10, width: '100%',
          background: '#4d2c72', borderRadius: '16px', padding: '15px',
          border: '1px solid #EBB537'
        }}>
          <input
            autoFocus
            className="w-full bg-transparent border-b border-[#EBB537] text-[#EBB537] outline-none shrikhand-regular"
            placeholder="Type city..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="mt-2 max-h-40 overflow-y-auto">
            {suggestions.map(city => (
              <div
                key={city.id}
                onClick={() => {
                  onLocationChange(city.name);
                  setIsEditing(false);
                  setSuggestions([]);
                }}
                className="p-2 cursor-pointer hover:bg-[#EBB537] hover:text-[#4d2c72] text-[#EBB537] text-xs"
              >
                {city.name}, {city.region}
              </div>
            ))}
            <button onClick={() => setIsEditing(false)} className="text-[10px] mt-2 opacity-70 text-[#EBB537]">Cancel</button>
          </div>
        </div>
      )}

      <div
        onClick={() => setIsEditing(true)}
        style={{
          width: '280px', padding: '20px', borderRadius: '16px',
          background: '#4d2c72', border: '1px solid #EBB537', cursor: 'pointer',
          color: '#EBB537'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className='shrikhand-regular text-sm opacity-80'>Click to Change</h4>
            <h4 className='shrikhand-regular text-lg'>{locDetails.name}</h4>
            <p className='shrikhand-regular text-2xl font-bold'>{current.temp_f}°F</p>
          </div>
          <img src={current.condition.icon} alt="weather" style={{ width: '64px' }} />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;