const apiKey = "e013b8bd171c003b20b1cc74f3b407c7";
const searchForm = document.getElementById("searchForm");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const searchHistoryDiv = document.getElementById("searchHistory");

// Load search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Function to update search history in both the UI and localStorage
function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

// Function to render search history in the UI
function renderSearchHistory() {
  searchHistoryDiv.innerHTML = "";
  searchHistory.forEach((city) => {
    searchHistoryDiv.innerHTML += `<p class="search-history-item" onclick="getWeatherData('${city}')">${city}</p>`;
  });
}

// Load the initial search history
renderSearchHistory();

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  getWeatherData(city);
});

function getWeatherData(city) {
  const geocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geocodingApiUrl)
    .then((response) => response.json())
    .then((geocodingData) => {
      const latitude = geocodingData.coord.lat;
      const longitude = geocodingData.coord.lon;

      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      fetch(weatherApiUrl)
        .then((weatherResponse) => weatherResponse.json())
        .then((data) => {
          displayCurrentWeather(data);
          displayForecast(data);
          updateSearchHistory(city);
        })
        .catch((error) => console.error("Error fetching data:", error));
    })
    .catch((error) => console.error("Error fetching geocoding data:", error));
}

function displayWeatherData(data) {
  // Display the current weather
  displayCurrentWeather(data.list[0]);

  // Display the 5-day forecast
  displayForecast(data.list.slice(1, 6));

  //Update the display logic
  updateSearchHistory(data.city.name);
}

function displayCurrentWeather(data) {
  const currentWeatherDiv = document.getElementById("currentWeather");

  if (data.list && data.list.length > 0) {
    const city = data.city.name;
    const date = new Date(data.list[0].dt * 1000); // Convert timestamp to date
    const icon = data.list[0].weather[0].icon;
    const temperature = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;

    currentWeatherDiv.innerHTML = `
        <h2>${city}</h2>
        <p>Date: ${date.toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
  } else {
    currentWeatherDiv.innerHTML = "<p>No weather data available</p>";
  }
}

function displayForecast(forecastData) {
  const forecastDiv = document.getElementById("forecast");

  forecastDiv.innerHTML = "<h2>5-Day Forecast</h2>";

  forecastData.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const icon = item.weather[0].icon;
    const temperature = item.main.temp;
    const humidity = item.main.humidity;

    forecastDiv.innerHTML += `
      <div class="forecast-item">
        <p>Date: ${date.toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
  });
}
