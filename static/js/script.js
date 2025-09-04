const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecast");

function updateURL(city) {
  const newURL = `${window.location.pathname}?city=${encodeURIComponent(city)}`;
  history.pushState(null, "", newURL);
}

async function getWeather(city) {
  try {
    const res = await fetch(`/weather?city=${city}`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

    const forecastRes = await fetch(`/forecast?city=${city}`);
    const forecastData = await forecastRes.json();

    forecastContainer.innerHTML = "";
    const dailyForecast = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyForecast[date] && item.dt_txt.includes("12:00:00")) {
        dailyForecast[date] = item;
      }
    });

    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
      const day = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
      const item = dailyForecast[date];
      const div = document.createElement("div");
      div.classList.add("forecast-day");
      div.innerHTML = `
        <p>${day}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
        <p>${Math.round(item.main.temp)}°C</p>
      `;
      forecastContainer.appendChild(div);
    });

    cityInput.value = "";

  } catch (error) {
    console.error("Weather fetch error:", error);
    cityName.textContent = "Error";
    temperature.textContent = "--°C";
    weatherDesc.textContent = "City not found";
    weatherIcon.src = "";
    humidity.textContent = "--%";
    wind.textContent = "-- km/h";
    forecastContainer.innerHTML = "";
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    updateURL(city);
    cityInput.value = "";
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
      updateURL(city);
      cityInput.value = "";
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const cityFromURL = params.get("city");
  if (cityFromURL) {
    getWeather(cityFromURL);
  } else {
    getWeather("Vilnius");
  }
});