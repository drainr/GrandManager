import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from './WeatherManager';

const WeatherCard = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchWeatherData(location).then(data => setWeather(data));
  }, [location]);

  if (!weather) return <div style={{ padding: '20px', color: '#888' }}>Loading weather...</div>;

  const { current, forecast, location: locDetails } = weather;

 return (
  <>
    {/* MINI CARD */}
    <div 
      onClick={() => setIsExpanded(true)}
      style={{
        width: '280px', padding: '20px', borderRadius: '16px',
        background: '#4d2c72', border: '1px solid #EBB537', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s', color: '#EBB537'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px' }} className='shrikhand-regular'>{locDetails.name}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}  className='shrikhand-regular'>{current.temp_f}°F</p>
          </div>
        </div>
        <img src={current.condition.icon} alt="weather" style={{ width: '64px' }} />
      </div>
      <div style={{ marginTop: '10px', fontSize: '13px', color: '#EBB537' }}  className='shrikhand-regular'>
        H: {forecast.forecastday[0].day.maxtemp_f.toFixed(0)}° | L: {forecast.forecastday[0].day.mintemp_f.toFixed(0)}°
      </div>
    </div>

    {/* EXPANDED MODAL */}
    {isExpanded && (
      <div 
        onClick={() => setIsExpanded(false)}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div 
          onClick={e => e.stopPropagation()} 
          style={{
            background: '#4d2c72', padding: '30px', borderRadius: '24px', border: '1px solid #EBB537',
            width: '90%', maxWidth: '500px', textAlign: 'center', color: '#EBB537'
          }}
        >
          <h2 style={{ marginBottom: '20px' }} className='shrikhand-regular'>{locDetails.name}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: '', gap: '100px', marginBottom: '10px' }}>
            <img src={current.condition.icon} alt="icon" style={{ width: '60px' }} />
            <h1 style={{ fontSize: '48px', margin: 0 }} className='shrikhand-regular'>{current.temp_f}°F</h1>
          </div>
          
          <p style={{ marginBottom: '20px' }}  className='shrikhand-regular'>{current.condition.text} </p>
          
          <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid rgba(255,255,255,0.3)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {forecast.forecastday.slice(1).map(day => (
              <div key={day.date}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}  className='shrikhand-regular'>
                  {new Date(day.date + "T00:00:00").toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img src={day.day.condition.icon} alt="tab" style={{ width: '35px' }} />
                <p style={{ fontSize: '12px', marginTop: '5px' }}>{Math.round(day.day.maxtemp_f)}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default WeatherCard;