import ReactWeather, { useWeatherBit } from 'react-open-weather';

const WeatherComponent = () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const customStyles = {
        fontFamily: 'Helvetica, sans-serif',
        gradientStart: '#0181C2',
        gradientMid: '#04A7F9',
        gradientEnd: '#4BC4F7',
        locationFontColor: '#FFF',
        todayTempFontColor: '#FFF',
        todayDateFontColor: '#B5DEF4',
        todayRangeFontColor: '#B5DEF4',
        todayDescFontColor: '#B5DEF4',
        todayInfoFontColor: '#B5DEF4',
        todayIconColor: '#FFF', // This is the specific property causing your crash!
        forecastItemBgColor: '#FFF',
        forecastTempColor: '#111',
        forecastTextSize: 16,
        forecastIconColor: '#4BC4F7',
        forecastDateColor: '#777',
        forecastDescColor: '#777',
        forecastRangeColor: '#777',
        forecastIconSize: 40,
    };
    console.log('VITE_WEATHER_API_KEY', apiKey);
    if (!apiKey) {
      return <div>
        Missing API key, please check .env for VITE_WEATHER_API_KEY
      </div>
    }
    

    const { data, isLoading, errorMessage } = useWeatherBit({
        key: apiKey,  // thousand oaks weather
        lat: '34.1760563',
        lon: '-118.837593',
        lang: 'en',
        unit: 'I',
    });

    const { data: data2, isLoading: isLoading2, errorMessage: errorMessage2 } = useWeatherBit({
        key: apiKey,  // sarasota weather
        lat: '27.341274',
        lon: '-82.528267',
        lang: 'en',
        unit: 'I',
    });

    return (
        <div>
        <ReactWeather
            theme={customStyles}
            isLoading={isLoading}
            errorMessage={errorMessage}
            data={data}
            lang="en"
            locationLabel="Thousand Oaks, CA"
            unitsLabels={{ temperature: 'F', windSpeed: 'mi/h' }}
            showForecast
        />
        <ReactWeather
            theme={customStyles}
            isLoading={isLoading2}
            errorMessage={errorMessage2}
            data={data2}
            lang="en"
            locationLabel="Sarasota, FL"
            unitsLabels={{ temperature: 'F', windSpeed: 'mi/h' }}
            showForecast
            />
        </div>
    );
};

export default WeatherComponent;