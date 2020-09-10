feather.replace();

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayShortform = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const currentDate = new Date();
const apiKey = "fb140c58b06d9db665b7713138ae69ea";
const lat = "40.730610";
const lon = "-73.935242";

let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`;

const weatherHeaderDiv = document.getElementById("weatherHeader");
const todayDetailsDiv = document.getElementById("todayDetails");
const forecastDiv = document.getElementById("forecast");

window.addEventListener("load", (e) => {
  postWeather();
});

async function postWeather() {
  const res = await fetch(url);
  const data = await res.json();
  const { current, daily } = data;
  console.log("[current, daily ]", current, daily, data);
  weatherHeaderDiv.innerHTML = renderWeatherHeader(data);
  todayDetailsDiv.innerHTML = renderTodayDetails(current);
  forecastDiv.innerHTML = daily.map(renderDailyForecast).join("\n");
}

function renderWeatherHeader(data) {
  const { current } = data;
  return `
    <div class="weather-side">
      <div class="weather-gradient"></div>
      <div class="date-container">
        <h2 class="date-dayname">${days[currentDate.getDay()]}</h2>
        <span class="date-day">${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  } /${currentDate.getFullYear()}</span
        ><i class="location-icon" data-feather="map-pin"></i
        ><span class="location">${data.timezone}</span>
      </div>
      <div class="weather-container">
        <i class="weather-icon" data-feather="sun"></i>
        <h1 class="weather-temp">${parseInt(current.temp, 10)}°C</h1>
        <h3 class="weather-desc">${current.weather[0].description}</h3>
      </div>
    </div>
  `;
}

function renderTodayDetails(current) {
  return `
    <div class="today-info">
      <div class="precipitation">
        <span class="title">PRECIPITATION</span
        ><span class="value">${current.dew_point} %</span>
        <div class="clear"></div>
      </div>
      <div class="humidity">
        <span class="title">HUMIDITY</span><span class="value">${current.humidity} %</span>
        <div class="clear"></div>
      </div>
      <div class="wind">
        <span class="title">WIND</span><span class="value">${current.wind_speed} km/h</span>
        <div class="clear"></div>
      </div>
    </div>
  `;
}

function renderDailyForecast(forecast) {
  let date = new Date(forecast.dt);
  return `
  <li class="active">
    <i class="day-icon" data-feather="sun"></i
    ><span class="day-name">${dayShortform[date.getDay()]}</span
    ><span class="day-temp">${parseInt(forecast.temp.max, 10)}°C</span>
  </li>
  `;
}

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(function () {
//     console.log("Service Worker registered");
//   });
// }
