// improve data intake for getting coordinates

import React, { useState } from 'react';
import './WeatherAndNews.css';

const Weather = () => {
    const [input, setInput] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setInput(event.target.value);
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

        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${apiKey}`;

        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.length === 0) {
                setError('No results found. Please check your input.');
            } else {
                fetchCurrentWeather(data[0].lat, data[0].lon);
                fetchHourlyForecast(data[0].lat, data[0].lon);
                fetchDailyForecast(data[0].lat, data[0].lon);
                setError(null);
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
            setNewsData(data.results.slice(0, 5)); // Get only the top 5 stories
        } catch (error) {
            setError('Failed to fetch news. Please try again later.');
        }
    };

    return (
        <div className="container">
            <div className="weather-section">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter location (address, city, zip code)"
                />
                <button onClick={fetchCoordinates}>Get Weather</button>
                <button onClick={fetchNews}>Get News</button>
                {weatherData && (
                    <div>
                        <h3>Current Weather:</h3>
                        <p>Temperature: {weatherData.main.temp}°C</p>
                        <p>Description: {weatherData.weather[0].description}</p>
                        <div>
                            <h3>Hourly Forecast (Next 24 hours):</h3>
                            <div className="scrollable-row">
                                {hourlyData.slice(0, 24).map((hour, index) => (
                                    <div key={index} className="forecast-card">
                                        <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} alt="Weather icon" />
                                        <p>{new Date(hour.dt * 1000).toLocaleTimeString()}: {hour.main.temp}°C</p>
                                        <p>{hour.weather[0].description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3>Daily Forecast (Next 7 days):</h3>
                            <div className="scrollable-row">
                                {dailyData.slice(0, 7).map((day, index) => (
                                    <div key={index} className="forecast-card">
                                        <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather icon" />
                                        <p>{new Date(day.dt * 1000).toLocaleDateString()}: High of {day.temp.max}°C, Low of {day.temp.min}°C</p>
                                        <p>{day.weather[0].description}</p>
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
    );
};

export default Weather;