// Constants for weather media directories
const weatherBackgrounds = {
    "clear-day": "images/clear-sky-day.jpg",
    "clear-night": "images/clear-sky-night.jpg",
    "clear-evening": "images/clear-sky-evening.jpg",
    "cloudy-day": "images/cloudy-sky-day.jpg",
    "cloudy-night": "images/cloudy-sky-night.jpg",
    "cloudy-evening": "images/cloudy-sky-evening.jpg",
    "sunny-day": "images/sunny-sky-day.jpg",
    "sunny-night": "images/sunny-sky-night.jpg",
    "rainy-day": "images/rainy-sky-day.jpg",
    "rainy-night": "images/rainy-sky-night.jpg",
    "rainy-evening": "images/rain-sky-evening.jpg",
    "snowy-day": "images/snowy-sky-day.jpg",
    "snowy-night": "images/snowy-sky-night.jpg",
    "snowy-evening": "images/snowy-sky-evening.jpg",
    "thunderstorm-day": "images/thunderstorm-sky-day.jpg",
    "thunderstorm-night": "images/thunderstorm-sky-night.jpg",
    "thunderstorm-evening": "images/thunderstorm-sky-evening.jpg",
    "windy-day": "images/windy-sky-day.jpg",
    "windy-night": "images/windy-sky-night.jpg",
    "hazy-day": "images/hazy-sky-day.jpg",
    "hazy-night": "images/hazy-sky-night.jpg",
    "foggy-day": "images/foggy-sky-day.jpg",
    "foggy-night": "images/foggy-sky-night.jpg"
};

const weatherVideos = {
    "clear": "videos/logo.mp4",
    "sunny": "videos/sunny-cat.mp4",
    "windy": "videos/windy-cat.mp4",
    "rainy": "videos/rainy-cat.mp4",
    "cloudy": "videos/cloudy-cat.mp4",
    "snowy": "videos/snowy-cat.mp4",
    "thunderstorm": "videos/thunderstorm-cat.mp4",
    "hazy": "videos/hazy-cat.mp4",
    "foggy": "videos/foggy-cat.mp4"
};

const weatherMusic = {
    "clear": "music/sunny.mp3",
    "sunny": "music/sunny.mp3",
    "windy": "music/windy.mp3",
    "rainy": "music/rain.mp3",
    "cloudy": "music/cloudy.mp3",
    "snowy": "music/snow.mp3",
    "thunderstorm": "music/thunderstorm.mp3",
    "hazy": "music/hazy.mp3",
    "foggy": "music/foggy.mp3"
};

// Elements
const searchBar = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const weatherContainer = document.querySelector('.weather-container');
const weatherVideo = document.querySelector('#weather-video');
const weatherMusicElement = document.querySelector('#weather-music');
const weatherIcon = document.querySelector('#weather-icon');
const temperatureElement = document.querySelector('#weather-temperature');
const weatherDescription = document.querySelector('#weather-description');
const cityElement = document.querySelector('#city-name');
const windSpeedElement = document.querySelector('#wind-speed');
const humidityElement = document.querySelector('#humidity');
const uvIndexElement = document.querySelector('#uv-index');
const pressureElement = document.querySelector('#pressure');
const sunriseElement = document.querySelector('#sunrise');
const sunsetElement = document.querySelector('#sunset');
const forecastContainer = document.querySelector('#forecast');
const loadingSpinner = document.querySelector('#loading');
const dateTimeElement = document.querySelector('#date-time');

// API key for weather data (get your own from https://openweathermap.org/api)
const API_KEY = '2149cbc5da7384b8ef7bcccf62b0bf68';

// Function to get the current date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    dateTimeElement.innerText = now.toLocaleString('en-US', options);
}

// Function to update weather data on the page
function updateWeatherUI(data) {
    const weather = data.weather[0];
    const main = data.main;
    const wind = data.wind;
    const sys = data.sys;

    // City name
    cityElement.innerText = `${data.name}, ${data.sys.country}`;

    // Determine if it's day, evening, or night
    const now = new Date();
    const sunrise = new Date(sys.sunrise * 1000);
    const sunset = new Date(sys.sunset * 1000);
    const eveningStart = new Date(sunset.getTime() - 2 * 60 * 60 * 1000); // 2 hours before sunset
    const isDayTime = now >= sunrise && now < eveningStart;
    const isEveningTime = now >= eveningStart && now < sunset;
    const isNightTime = now >= sunset || now < sunrise;

    // Set weather background
    const weatherCondition = weather.main.toLowerCase();
    let backgroundImage = weatherBackgrounds["clear-day"]; // Default
    if (isDayTime) {
        if (weatherCondition.includes('cloud')) backgroundImage = weatherBackgrounds["cloudy-day"];
        if (weatherCondition.includes('rain')) backgroundImage = weatherBackgrounds["rainy-day"];
        if (weatherCondition.includes('clear')) backgroundImage = weatherBackgrounds["clear-day"];
        if (weatherCondition.includes('snow')) backgroundImage = weatherBackgrounds["snowy-day"];
        if (weatherCondition.includes('thunderstorm')) backgroundImage = weatherBackgrounds["thunderstorm-day"];
        if (weatherCondition.includes('windy')) backgroundImage = weatherBackgrounds["windy-day"];
        if (weatherCondition.includes('hazy')) backgroundImage = weatherBackgrounds["hazy-day"];
        if (weatherCondition.includes('foggy')) backgroundImage = weatherBackgrounds["foggy-day"];
    } else if (isEveningTime) {
        if (weatherCondition.includes('cloud')) backgroundImage = weatherBackgrounds["cloudy-evening"];
        if (weatherCondition.includes('rain')) backgroundImage = weatherBackgrounds["rainy-evening"];
        if (weatherCondition.includes('clear')) backgroundImage = weatherBackgrounds["clear-evening"];
        if (weatherCondition.includes('snow')) backgroundImage = weatherBackgrounds["snowy-evening"];
        if (weatherCondition.includes('thunderstorm')) backgroundImage = weatherBackgrounds["thunderstorm-evening"];
    } else if (isNightTime) {
        if (weatherCondition.includes('cloud')) backgroundImage = weatherBackgrounds["cloudy-night"];
        if (weatherCondition.includes('rain')) backgroundImage = weatherBackgrounds["rainy-night"];
        if (weatherCondition.includes('clear')) backgroundImage = weatherBackgrounds["clear-night"];
        if (weatherCondition.includes('snow')) backgroundImage = weatherBackgrounds["snowy-night"];
        if (weatherCondition.includes('thunderstorm')) backgroundImage = weatherBackgrounds["thunderstorm-night"];
        if (weatherCondition.includes('windy')) backgroundImage = weatherBackgrounds["windy-night"];
        if (weatherCondition.includes('hazy')) backgroundImage = weatherBackgrounds["hazy-night"];
        if (weatherCondition.includes('foggy')) backgroundImage = weatherBackgrounds["foggy-night"];
    }

    document.body.style.backgroundImage = `url(${backgroundImage})`;

    // Set video and music based on weather
    let video = weatherVideos["clear"];
    let music = weatherMusic["sunny"];
    if (weatherCondition.includes('rain')) {
        video = weatherVideos["rainy"];
        music = weatherMusic["rainy"];
    } else if (weatherCondition.includes('cloud')) {
        video = weatherVideos["cloudy"];
        music = weatherMusic["cloudy"];
    } else if (weatherCondition.includes('snow')) {
        video = weatherVideos["snowy"];
        music = weatherMusic["snowy"];
    } else if (weatherCondition.includes('thunderstorm')) {
        video = weatherVideos["thunderstorm"];
        music = weatherMusic["thunderstorm"];
    } else if (weatherCondition.includes('windy')) {
        video = weatherVideos["windy"];
        music = weatherMusic["windy"];
    } else if (weatherCondition.includes('hazy')) {
        video = weatherVideos["hazy"];
        music = weatherMusic["hazy"];
    } else if (weatherCondition.includes('foggy')) {
        video = weatherVideos["foggy"];
        music = weatherMusic["foggy"];
    }

    // Set video
    weatherVideo.src = video;

    // Set music (play automatically)
    weatherMusicElement.src = music;
    weatherMusicElement.play();

    // Set temperature in Celsius and Fahrenheit
    const tempCelsius = Math.round(main.temp - 273.15);
    const tempFahrenheit = Math.round((tempCelsius * 9 / 5) + 32);
    temperatureElement.innerHTML = `${tempCelsius}°C / ${tempFahrenheit}°F`;

    // Set weather description and icon
    weatherDescription.innerHTML = weather.description;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather Icon">`;

    // Set other weather data
    windSpeedElement.innerText = `${wind.speed} m/s`;
    humidityElement.innerText = `${main.humidity}%`;
    uvIndexElement.innerText = 'N/A'; // UV Index requires a separate API call
    pressureElement.innerText = `${main.pressure} hPa`;
    sunriseElement.innerText = new Date(sys.sunrise * 1000).toLocaleTimeString();
    sunsetElement.innerText = new Date(sys.sunset * 1000).toLocaleTimeString();

    // Display weather forecast (dummy data here, you should replace with actual forecast data)
    forecastContainer.innerHTML = `
        <div><strong>Day 1:</strong> Sunny - 25°C</div>
        <div><strong>Day 2:</strong> Cloudy - 23°C</div>
        <div><strong>Day 3:</strong> Rainy - 18°C</div>
        <div><strong>Day 4:</strong> Snowy - 10°C</div>
        <div><strong>Day 5:</strong> Thunderstorm - 12°C</div>
        <div><strong>Day 6:</strong> Sunny - 26°C</div>
        <div><strong>Day 7:</strong> Cloudy - 22°C</div>
        <div><strong>Day 8:</strong> Rainy - 19°C</div>
        <div><strong>Day 9:</strong> Clear - 24°C</div>
        <div><strong>Day 10:</strong> Snowy - 5°C</div>
    `;
}

// Fetch weather data from API
async function fetchWeather(city) {
    loadingSpinner.style.display = 'flex';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found!');
        } else {
            updateWeatherUI(data);
        }
    } catch (error) {
        alert('Error fetching weather data!');
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Event listener for search button
searchButton.addEventListener('click', () => {
    const city = searchBar.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city!');
    }
});

// Update date and time every second
setInterval(updateDateTime, 1000);

// Initial default weather
updateDateTime();