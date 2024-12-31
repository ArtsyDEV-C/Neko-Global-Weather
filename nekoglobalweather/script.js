document.addEventListener("DOMContentLoaded", () => {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const loadingSpinner = document.getElementById('loading');

    const weatherContainer = document.querySelector('.weather-container');
    const cityName = document.getElementById('city-name');
    const dateTime = document.getElementById('date-time');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemperature = document.getElementById('weather-temperature');
    const weatherDescription = document.getElementById('weather-description');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const uvIndex = document.getElementById('uv-index');
    const pressure = document.getElementById('pressure');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const forecastContainer = document.getElementById('forecast');

    const weatherVideo = document.getElementById('weather-video');
    const weatherMusic = document.getElementById('weather-music');

    const weatherVideos = {
        'Clear': 'videos/sunny-cat.mp4',
        'Clouds': 'videos/cloudy-cat.mp4',
        'Rain': 'videos/rainy-cat.mp4',
        'Snow': 'videos/snowy-cat.mp4',
        'Thunderstorm': 'videos/thunderstorm-cat.mp4',
        'Drizzle': 'videos/rainy-cat.mp4',
        'Mist': 'videos/foggy-cat.mp4',
        'Fog': 'videos/foggy-cat.mp4',
        'Haze': 'videos/hazy-cat.mp4',
        'Wind': 'videos/windy-cat.mp4'
    };

    const weatherMusicTracks = {
        'Clear': 'music/sunny.mp3',
        'Clouds': 'music/cloudy.mp3',
        'Rain': 'music/rain.mp3',
        'Snow': 'music/snow.mp3',
        'Thunderstorm': 'music/thunderstorm.mp3',
        'Drizzle': 'music/rain.mp3',
        'Mist': 'music/fog.mp3',
        'Fog': 'music/fog.mp3',
        'Haze': 'music/hazy.mp3',
        'Wind': 'music/windy.mp3'
    };

    async function fetchWeather(city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        try {
            loadingSpinner.style.display = 'flex';
            const weatherResponse = await fetch(weatherUrl);
            const forecastResponse = await fetch(forecastUrl);
            if (!weatherResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            updateWeather(weatherData);
            updateForecast(forecastData);

            loadingSpinner.style.display = 'none';
        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert(error.message);
        }
    }

    function updateWeather(data) {
        const weather = data.weather[0];
        const main = data.main;
        const wind = data.wind;
        const sys = data.sys;

        weatherContainer.style.display = 'block';
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        dateTime.textContent = new Date(data.dt * 1000).toLocaleString();
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}">`;
        weatherTemperature.textContent = `${main.temp}°C`;
        weatherDescription.textContent = weather.description;
        windSpeed.textContent = `${wind.speed} m/s`;
        humidity.textContent = `${main.humidity}%`;
        pressure.textContent = `${main.pressure} hPa`;
        sunrise.textContent = new Date(sys.sunrise * 1000).toLocaleTimeString();
        sunset.textContent = new Date(sys.sunset * 1000).toLocaleTimeString();

        // Update video and music
        weatherVideo.src = weatherVideos[weather.main] || 'videos/default.mp4';
        weatherMusic.src = weatherMusicTracks[weather.main] || 'music/default.mp3';
        weatherVideo.play();
        weatherMusic.play();
    }

    function updateForecast(data) {
        forecastContainer.innerHTML = '';
        const forecastList = data.list.filter((_, index) => index % 8 === 0); // Get forecast for every next day

        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const temp = `${forecast.main.temp}°C`;
            const icon = forecast.weather[0].icon;

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p>${date}</p>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${forecast.weather[0].description}">
                <p>${temp}</p>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    }

    searchButton.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeather(city);
            }
        }
    });
});
