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

// default NY coords
let lat = "40.730610";
let lon = "-73.935242";
let cityName = "";

const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`;

const weatherHeaderDiv = document.getElementById("weatherHeader");
const todayDetailsDiv = document.getElementById("todayDetails");
const forecastDiv = document.getElementById("forecast");

// search
const searchInput = document.getElementById("location-input");
const button = document.getElementById("search-btn");
button.addEventListener(
  "click",
  function () {
    const searchQuery = searchInput.value;
    if (searchQuery !== "") {
      reverseGeocode(searchQuery);
    } else {
      // console.log("[No Search!");
    }
  },
  false
);

async function reverseGeocode(query) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyBeSALB4UQwj0ezwUtuAKYJbpR6ZGyQuSE`
  );
  const data = await res.json();
  if (
    data &&
    data.results[0] &&
    data.results[0].geometry &&
    data.results[0].geometry.location
  ) {
    lat = data.results[0].geometry.location.lat;
    lon = data.results[0].geometry.location.lng;
    cityName = data.results[0].formatted_address;

    postWeather();
  } else {
    // console.log("Error message!!");
  }
}

window.addEventListener("load", (e) => {
  postWeather();
  feather.replace();
});

async function postWeather() {
  const res = await fetch(url);
  const data = await res.json();
  const { current, daily } = data;

  weatherHeaderDiv.innerHTML = renderWeatherHeader(data);
  todayDetailsDiv.innerHTML = renderTodayDetails(current);
  forecastDiv.innerHTML = daily
    .slice(0, 5)
    .map((f, i) => renderDailyForecast(f, i))
    .join("\n");
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
  } /${currentDate.getFullYear()}</span>
        ${feather.icons.map.toSvg({ class: "location-icon" })}
        <span class="location">${
          cityName === "" ? data.timezone : cityName
        }</span>
      </div>
      <div class="weather-container">
        ${feather.icons.sun.toSvg({ class: "weather-icon" })}
        <h1 class="weather-temp">${parseInt(current.temp, 10)}°C</h1>
        <h2 class="weather-desc">${current.weather[0].description}</h2>
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

function renderDailyForecast(forecast, i) {
  let today = (currentDate.getDay() + i) % 6;
  return `
  <li class="active">
    ${feather.icons.sun.toSvg({ class: "weather-icon" })}
    <span class="day-name">${dayShortform[today]}</span
    ><span class="day-temp">${parseInt(forecast.temp.max, 10)}°C</span>
  </li>
  `;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").then(function () {
    console.log("Service Worker registered");
  });
}
