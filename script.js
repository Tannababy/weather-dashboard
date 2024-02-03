const apiKey = "YOUR_OPENWEATHERMAP_API_KEY-e013b8bd171c003b20b1cc74f3b407c7";
const searchForm = document.getElementById("searchForm");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const searchHistory = document.getElementById("searchHistory");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  getWeatherData(city);
});

function getWeatherData(city) {
  // Use the OpenWeatherMap API to get weather data
  // Construct the URL with the provided base URL and your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Use fetch to make the API call
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process the data and update the UI
      displayCurrentWeather(data);
      displayForecast(data);
      updateSearchHistory(city);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayCurrentWeather(data) {
  const currentWeatherDiv = document.getElementById("currentWeather");
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
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  const forecastData = data.list.slice(1, 6); // Get the next 5 days

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

function updateSearchHistory(city) {
  const searchHistoryDiv = document.getElementById("searchHistory");

  // Check if the city is already in the search history
  const existingCities = searchHistoryDiv.innerHTML;
  if (!existingCities.includes(city)) {
    searchHistoryDiv.innerHTML += `<p class="search-history-item" onclick="getWeatherData('${city}')">${city}</p>`;
  }
}
