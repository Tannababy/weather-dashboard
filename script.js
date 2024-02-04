const apiKey = "e013b8bd171c003b20b1cc74f3b407c7";
const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  if (cityInput) {
    const city = cityInput.value;
    getWeatherData(city);
  } else {
    console.error("City input element not found.");
  }
});

function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayWeatherData(data) {
  // Display the current weather
  displayCurrentWeather(data.list[0]);

  // Display the 5-day forecast
  displayForecast(data.list.slice(1, 6));
}

function displayCurrentWeather(currentWeatherData) {
  const currentWeather = document.getElementById("currentWeather");
  const city = currentWeatherData.name;
  const date = new Date(currentWeatherData.dt * 1000);
  const icon = currentWeatherData.weather[0].icon;
  const temperature = currentWeatherData.main.temp;
  const humidity = currentWeatherData.main.humidity;
  const windSpeed = currentWeatherData.wind.speed;

  currentWeather.innerHTML = `
    <h2>${city}</h2>
    <p>Date: ${date.toLocaleDateString()}</p>
    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
    <p>Temperature: ${temperature}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;
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
