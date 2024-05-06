// improve data intake for getting coordinates

import React, { useState } from 'react';
import './WeatherAndNews.css';

const Weather = () => {
    const [input, setInput] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const fetchWeather = async (lat, lon) => {
        const apiKey = 'd9146e33f2d8cb3c5703c3a8078fdb24';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
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
                fetchWeather(data[0].lat, data[0].lon);
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