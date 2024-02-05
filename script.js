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
  if (!city) {
    console.error("City is empty.");
    return;
  }

  const geocodingApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geocodingApiUrl)
    .then((response) => response.json())
    .then((geocodingData) => {
      if (!geocodingData || geocodingData.cod !== 200) {
        const errorMessage =
          geocodingData?.message ||
          "Unexpected error in geocoding API response";
        console.error(`Error in geocoding API response: ${errorMessage}`);
        return;
      }

      const latitude = geocodingData.coord.lat;
      const longitude = geocodingData.coord.lon;

      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      fetch(weatherApiUrl)
        .then((weatherResponse) => weatherResponse.json())
        .then((data) => {
          if (data.cod === "200") {
            // Process the data...
            displayCurrentWeather(data);
            displayForecast(data.list.slice(1, 6));
            updateSearchHistory(data.city.name);
          } else {
            console.error("Error in API response:", data.message);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    })
    .catch((error) => console.error("Error fetching geocoding data:", error));
}

function displayWeatherData(data) {
  // Display the current weather
  displayCurrentWeather(data);

  // Display the 5-day forecast
  displayForecast(data.list.slice(1, 6));
}

function displayCurrentWeather(data) {
  const currentWeatherDiv = document.getElementById("currentWeather");
  currentWeatherDiv.classList.add("currentWeatherStyle");

  if (data && data.city) {
    const city = data.city.name;
    const date = new Date(data.city.sunset * 1000); // Use sys.sunset for date
    const icon = data.list[0].weather[0].icon; // Access the first element of the weather array

    //Convert temperature from Kelvin to Celcius
    const temperatureKelvin = data.list[0].main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);

    const humidity = data.list[0].main.humidity;

    // Convert wind speed from m/s to kph
    const windSpeedMetersPerSecond = data.list[0].wind.speed;
    const windSpeedKilometersPerHour = (windSpeedMetersPerSecond * 3.6).toFixed(
      2
    );

    currentWeatherDiv.innerHTML = `
            <h2>${city}</h2>
            <p>${date.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${temperatureCelsius}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windSpeedKilometersPerHour} KPH</p>
          `;
  } else {
    currentWeatherDiv.innerHTML = "<p>No weather data available</p>";
  }
}

function displayForecast(forecastData) {
  const forecastDiv = document.getElementById("forecast");

  // Clear previous forecast data
  forecastDiv.innerHTML = "";

  // Create wrapper div for the header
  const headerWrapperDiv = document.createElement("div");
  headerWrapperDiv.id = "forecast-header";

  // Create and append the header
  const headerDiv = document.createElement("h2");
  headerDiv.textContent = "5-Day Forecast:";
  headerWrapperDiv.appendChild(headerDiv);

  // Append the header wrapper div to the forecastDiv
  forecastDiv.appendChild(headerWrapperDiv);

  // Create wrapper div for the forecast elements
  const forecastElementsDiv = document.createElement("div");
  forecastElementsDiv.id = "forecast-elements";
  forecastElementsDiv.classList.add("flex-container");

  // Append the forecast elements wrapper div to the forecastDiv
  forecastDiv.appendChild(forecastElementsDiv);

  const forecastList = forecastData || []; // Ensure forecastList is an array

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const icon = item.weather[0].icon;

    //Convert temperature from Kelvin to Celcius
    const temperatureKelvin = item.main.temp;
    const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
    const humidity = item.main.humidity;

    // Convert wind speed from m/s to kph
    const windSpeedMetersPerSecond = item.wind.speed;
    const windSpeedKilometersPerHour = (windSpeedMetersPerSecond * 3.6).toFixed(
      2
    );

    // Create a new div for each forecast item with styling
    const forecastItemDiv = document.createElement("div");
    forecastItemDiv.classList.add("forecast-item");
    forecastItemDiv.innerHTML = `
         <p>${date.toLocaleDateString()}</p>
         <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
         <p>Temperature: ${temperatureCelsius}°C</p>
         <p>Humidity: ${humidity}%</p>
         <p>Wind: ${windSpeedKilometersPerHour} KPH</p>
        
       `;

    // Append the forecast item div to the forecastDiv
    forecastElementsDiv.appendChild(forecastItemDiv);
  });
}
