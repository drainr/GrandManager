import ReactWeather from 'react-open-weather';

const WeatherCard = ({ data, isLoading, errorMessage, locationLabel, isExpanded, toggleExpand }) => {
  const variant = isExpanded ? 'expanded' : 'mini';

  const baseStyles = {
    fontFamily: 'Helvetica, sans-serif',
    gradientStart: variant === 'mini' ? '#f2f2f2' : '#0181C2',
    gradientMid: variant === 'mini' ? '#f2f2f2' : '#04A7F9',
    gradientEnd: variant === 'mini' ? '#f2f2f2' : '#4BC4F7',
    locationFontColor: variant === 'mini' ? '#333' : '#FFF',
    todayTempFontColor: variant === 'mini' ? '#333' : '#FFF',
    todayDateFontColor: variant === 'mini' ? '#777' : '#B5DEF4',
    todayIconColor: variant === 'mini' ? '#4BC4F7' : '#FFF',
    forecastItemBgColor: '#FFF',
    forecastTempColor: '#111',
    forecastIconColor: '#4BC4F7',
  };

  const miniContainerStyle = {
    width: '320px',
    height: '240px',
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: '16px',
    background: '#f2f2f2',
    overflow: 'hidden',
    position: 'relative',
    transition: 'transform 0.2s ease',
  };

  return (
  <>
    {/* THE MINI CARD */}
    <div 
      style={miniContainerStyle} 
      onClick={toggleExpand}
      className="weather-card mini"
    >
      <style>
        {`
          .weather-card.mini .rw-container { height: 220px !important; border: none !important; background: #f2f2f2 !important; }
          .weather-card.mini .rw-today { height: 100% !important; background: #f2f2f2 !important; }
          .weather-card.mini .rw-today-left { background: #f2f2f2 !important; border: none !important; }
          .weather-card.mini .rw-today-right { background: #f2f2f2 !important; justify-content: center !important; }
          
          /* Keep High/Low visible but hide wind/humidity in mini to prevent overflow */
          .weather-card.mini .rw-today-info > div:not(:last-child) { display: none !important; } 
          .weather-card.mini .rw-today-desc { display: none !important; }
          
          .weather-card.mini .rw-today svg { width: 60px !important; height: 60px !important; }
        `}
      </style>
      <ReactWeather
        theme={baseStyles}
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        locationLabel={locationLabel}
        unitsLabels={{ temperature: 'F', windSpeed: 'mi/h' }}
        showForecast={false} 
      />
    </div>

    {/* THE MODAL */}
    {isExpanded && (
      <div 
        onClick={toggleExpand}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 2000, padding: '20px'
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          style={{
            width: '100%', maxWidth: '800px', borderRadius: '20px',
            overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            background: '#808080' 
          }}
        >
          <style>
            {`
              .weather-card-modal .rw-container { background: #ffffff !important; }
              .weather-card-modal .rw-forecast { background: #ffffff !important; }
              .weather-card-modal .rw-today-info { display: flex !important; }
            `}
          </style>
          <div className="weather-card-modal">
            <ReactWeather
              theme={baseStyles}
              isLoading={isLoading}
              errorMessage={errorMessage}
              data={data}
              locationLabel={locationLabel}
              unitsLabels={{ temperature: 'F', windSpeed: 'mi/h' }}
              showForecast={true} 
            />
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default WeatherCard;