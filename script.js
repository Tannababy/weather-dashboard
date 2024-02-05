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
          console.log("Weather Data:", data);

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
  console.log("Weather Data:", data); // Add this line for debugging

  // Display the current weather
  displayCurrentWeather(data);

  // Display the 5-day forecast
  displayForecast(data.list.slice(1, 6));
}

// function displayCurrentWeather(data) {
//   console.log("Current weather Data:", data);
//   const currentWeatherDiv = document.getElementById("currentWeather");

//   //   if (data && data.name) {
//   //     const city = data.name;
//   //     const date = new Date(data.city.sunset * 1000); // Use sys.sunset for date
//   //     const icon = data.list[0].weather[0].icon; // Access the first element of the weather array
//   //     const temperature = data.list[0].main.temp;
//   //     const humidity = data.list[0].main.humidity;
//   //     const windSpeed = data.list[0].wind.speed;
//   if (data && data.name) {
//     const city = data.name;
//     console.log("City:", city);

//     const date = new Date(data.city.sunset * 1000); // Use sys.sunset for date
//     console.log("Date:", date);

//     const icon = data.list[0].weather[0].icon; // Access the first element of the weather array
//     console.log("Icon:", icon);

//     const temperature = data.list[0].main.temp;
//     console.log("Temperature:", temperature);

//     const humidity = data.list[0].main.humidity;
//     console.log("Humidity:", humidity);

//     const windSpeed = data.list[0].wind.speed;
//     console.log("Wind Speed:", windSpeed);

//     currentWeatherDiv.innerHTML = `
//           <h2>${city}</h2>
//           <p>Date: ${date.toLocaleDateString()}</p>
//           <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
//           <p>Temperature: ${temperature}°C</p>
//           <p>Humidity: ${humidity}%</p>
//           <p>Wind Speed: ${windSpeed} m/s</p>
//         `;
//   } else {
//     currentWeatherDiv.innerHTML = "<p>No weather data available</p>";
//   }
// }

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
    const windSpeed = data.list[0].wind.speed;

    currentWeatherDiv.innerHTML = `
            <h2>${city}</h2>
            <p>${date.toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${temperatureCelsius}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
          `;
  } else {
    currentWeatherDiv.innerHTML = "<p>No weather data available</p>";
  }
}

function displayForecast(forecastData) {
  console.log("Forecast data:", forecastData);
  const forecastDiv = document.getElementById("forecast");

  // Clear previous forecast data
  forecastDiv.innerHTML = "";

  // Create and append the header
  const headerDiv = document.createElement("div");
  headerDiv.innerHTML = "<h2>5-Day Forecast</h2>";
  forecastDiv.appendChild(headerDiv);

  const forecastList = forecastData || []; // Ensure forecastList is an array

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    console.log("Forecast Date:", date);

    const icon = item.weather[0].icon;
    console.log("Forecast Icon:", icon);

    const temperature = item.main.temp;
    console.log("Forecast Temperature:", temperature);

    const humidity = item.main.humidity;
    console.log("Forecast Humidity:", humidity);

    // Create a new div for each forecast item with styling
    const forecastItemDiv = document.createElement("div");
    forecastItemDiv.classList.add("forecast-item");
    forecastItemDiv.innerHTML = `
         <p>${date.toLocaleDateString()}</p>
         <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
         <p>Temperature: ${temperature}°C</p>
         <p>Humidity: ${humidity}%</p>
       `;

    // Append the forecast item div to the forecastDiv
    forecastDiv.appendChild(forecastItemDiv);
  });
}
