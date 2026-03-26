import React, { useState } from 'react';
import { useWeatherBit } from 'react-open-weather';
import WeatherCard from './WeatherCard';

const WeatherComponent = () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const [activeModal, setActiveModal] = useState(null);

    const { data: data1, isLoading: isLoading1 } = useWeatherBit({
        key: apiKey, lat: '34.1760563', lon: '-118.837593', lang: 'en', unit: 'I',
    });

    const { data: data2, isLoading: isLoading2 } = useWeatherBit({
        key: apiKey, lat: '27.341274', lon: '-82.528267', lang: 'en', unit: 'I',
    });

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <WeatherCard 
                    isExpanded={activeModal === 'TO'}
                    toggleExpand={() => setActiveModal(activeModal === 'TO' ? null : 'TO')}
                    isLoading={isLoading1}
                    data={data1}
                    locationLabel="Thousand Oaks"
                />
                <WeatherCard 
                    isExpanded={activeModal === 'SR'}
                    toggleExpand={() => setActiveModal(activeModal === 'SR' ? null : 'SR')}
                    isLoading={isLoading2}
                    data={data2}
                    locationLabel="Sarasota"
                />
            </div>
        </div>
    );
};

export default WeatherComponent;