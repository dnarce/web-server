

const fetchWeather = (location) =>
    fetch(`/weather?search=${location}`).then((response) => response.json());

const renderWeather = (weather) => {

    const locationName = document.getElementById('location').value;
    const weatherInfo = `<h3> The weather in ${locationName} is ${weather.weather_descriptions[0]}</h3>
    <p>The temperature is ${weather.temperature} ºC.</p>`;


    const iconHTML = `<img src="${weather.weather_icons[0]}" />`;
    document.getElementById('weather').innerHTML = weatherInfo;
}

const handleFindWeatherLocation = (e) => {
    e.preventDefault();
    const locationName = document.getElementById('location').value;

    fetchWeather(locationName).then((weatherJson)=>{
        renderWeather(weatherJson);
        document.getElementById('location').value = '';
    });
}

document.addEventListener("DOMContentLoaded", (e) => {
    document
        .getElementById("locationForm")
        .addEventListener("submit", handleFindWeatherLocation);
});



