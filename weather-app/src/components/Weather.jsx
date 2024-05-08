import React, { useState, useEffect } from 'react';
import './WeatherAndNews.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


const Weather = () => {
    const [input, setInput] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews();
        getUserLocation();
    }, []);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchCurrentWeather(latitude, longitude);
                fetchHourlyForecast(latitude, longitude);
                fetchDailyForecast(latitude, longitude);
            }, () => {
                setError('Unable to retrieve your location');
            });
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const fetchCurrentWeather = async (lat, lon) => {
        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch current weather. Please try again.');
        }
    };

    const fetchHourlyForecast = async (lat, lon) => {
        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setHourlyData(data.list.slice(0, 24));
        } catch (err) {
            setError('Failed to fetch hourly forecast. Please try again.');
        }
    };

    const fetchDailyForecast = async (lat, lon) => {
        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setDailyData(data.list);
        } catch (err) {
            setError('Failed to fetch daily forecast. Please try again.');
        }
    };

    const fetchCoordinates = async () => {
        if (!input) {
            setError('Please enter a location.');
            return;
        }

        const isPostalCode = /^\d+$/.test(input);
        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        let geocodeUrl = "";

        if (isPostalCode) {
            geocodeUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${input}&appid=${apiKey}`;
        } else {
            geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${apiKey}`;
        }

        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (Array.isArray(data) && data.length === 0) {
                setError('No results found. Please check your input.');
            } else if (!Array.isArray(data) && data.lat && data.lon) {
                fetchCurrentWeather(data.lat, data.lon);
                fetchHourlyForecast(data.lat, data.lon);
                fetchDailyForecast(data.lat, data.lon);
                setError(null);
            } else if (Array.isArray(data) && data.length > 0) {
                fetchCurrentWeather(data[0].lat, data[0].lon);
                fetchHourlyForecast(data[0].lat, data[0].lon);
                fetchDailyForecast(data[0].lat, data[0].lon);
                setError(null);
            } else {
                setError('Unexpected response format. Please try again.');
            }
        } catch (err) {
            setError('Failed to fetch coordinates. Please try again.');
        }
    };

    const fetchNews = async () => {
        const newsApiKey = 'BFlMRHfyx8roPEIHd1zWgrV13Vi3Gpf2';
        const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${newsApiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setNewsData(data.results.slice(0, 5));
        } catch (error) {
            setError('Failed to fetch news. Please try again later.');
        }
    };

    return (
        <div className="page">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            </meta>

            <div className="header">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search by City or Postal Code"
                    className={"input"}
                />
                <button className= "btn" onClick={fetchCoordinates}>Get Weather</button>
            </div>
            <div className="content">
                <div className="weather-section">
                    {weatherData && (
                        <div>
                            <h3>It's currently {weatherData.main.temp}°C</h3>
                            <div>
                                <h4 className="section-header">Hourly Forecast (Next 24 hours):</h4>
                                <div className="scrollable-row">
                                    {hourlyData.slice(0, 24).map((hour, index) => (
                                        <div key={index} className="forecast-card">
                                            <p>{new Date(hour.dt * 1000).toLocaleTimeString()}</p>
                                            <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="Weather icon" />
                                            <p>{hour.main.temp}°C</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        <div>
                            <h4 className="section-header">Daily Forecast (Next 7 days):</h4>
                            <div className="scrollable-row">
                                {dailyData.slice(0, 7).map((day, index) => (
                                    <div key={index} className="forecast-card">
                                        <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                                        <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather icon" />
                                        <p>High of {day.temp.max}°C</p>
                                        <p>Low of {day.temp.min}°C</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {error && <p>{error}</p>}
            </div>
                <div className="news-section">
                    {newsData.map((story, index) => (
                        <div key={index} className="news-card">
                            {story.multimedia && <img src={story.multimedia[0].url} alt={story.title} />}
                            <a href={story.url} target="_blank" rel="noopener noreferrer"><h4>{story.title}</h4></a>
                            <p>{story.byline}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Weather;