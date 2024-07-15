const apiKey = '9250ab6d031d622f93fe083912169b0c';
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const historyDiv = document.getElementById('history');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const currentWeatherIcon = document.getElementById('currentWeatherIcon');
const currentTemp = document.getElementById('currentTemp');
const currentWind = document.getElementById('currentWind');
const currentHumidity = document.getElementById('currentHumidity');
const forecastDiv = document.getElementById('forecast');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function displayHistory() {
    historyDiv.innerHTML = '';
    searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => getWeatherData(city));
        historyDiv.appendChild(button);
    });
}

function addCityToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displayHistory();
    }
}

async function getWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`);
    const currentData = await response.json();

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
    addCityToHistory(city);
}

function updateCurrentWeather(data) {
    cityName.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    currentWeatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
    currentTemp.textContent = `Temp: ${data.main.temp}°F`;
    currentWind.textContent = `Wind: ${data.wind.speed} MPH`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
}

function updateForecast(data) {
    forecastDiv.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
            <p><img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}"></p>
            <p>Temp: ${forecast.main.temp}°F</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        forecastDiv.appendChild(card);
    }
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

displayHistory();
