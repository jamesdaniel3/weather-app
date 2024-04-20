import React, { useState } from 'react';

const Weather = () => {
    // [city, state, country]
    const [location, setLocation] = useState(["", "", ""]);

    const handleLocationChange = (index) => (event) => {
        const newLocation = [...location];
        newLocation[index] = event.target.value;
        setLocation(newLocation);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        console.log('Searching for weather in', location.join(', '));
    };

    return (
        <>
            <h1 className="header">Weather App</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={location[0]}
                    onChange={handleLocationChange(0)}
                    placeholder="Enter your city"
                />
                <input
                    type="text"
                    value={location[1]}
                    onChange={handleLocationChange(1)}
                    placeholder="Enter your state"
                />
                <input
                    type="text"
                    value={location[2]}
                    onChange={handleLocationChange(2)}
                    placeholder="Enter your country"
                />
                <button type="submit">Search</button>
            </form>
        </>
    );
};

export default Weather;