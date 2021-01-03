const fetch = require("node-fetch");

/* https://weatherstack.com/ */
const API_KEY = "a0d46a01ef0af918823c976f93871b7a";
const WEATHER_BASE_URL = "http://api.weatherstack.com/current";

const checkStatus = (res) => {
    if (res.ok) {
        return res;
    } else {
        throw Error(res.statusText);
    }
};

const fetchCurrentWeather = ({ latitude, longitude }) =>
    fetch(
        `${WEATHER_BASE_URL}?access_key=${API_KEY}&query=${latitude},${longitude}`
    )
        .then(checkStatus)
        .then((res) => res.json())
        .then((weatherJsonData) => {
            if (
                weatherJsonData.hasOwnProperty("success") &&
                !weatherJsonData.success
            ) {
                throw Error(weatherJsonData.error.info);
            }
            return weatherJsonData.current;
        })
        .catch(({ message }) => {
            throw Error(message);
        });

module.exports = {fetchCurrentWeather};
