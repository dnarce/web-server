const fetch = require("node-fetch");
const ACCESS_TOKEN = 'pk.eyJ1IjoiZG5hcmNlIiwiYSI6ImNrajh2bzMzNzI4aTcycnNidmNrOG81Y3YifQ.iTLm3NtCqsIaEnrpXUmDeA';

const BASE_URL = 'https://api.mapbox.com';
const getGeoCodingUrl = (searchText) =>
    `${BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?limit=1&access_token=${ACCESS_TOKEN}`;

const transformGeoCodingLocationData = ({ features }) => {
    const [placeData] = features;
    const [longitude, latitude] = placeData.center;
    return {
        placeName: placeData.place_name,
        longitude,
        latitude,
    };
};

const checkStatus = (res) => {
    if (res.ok) {
        return res;
    } else {
        throw Error(res.statusText);
    }
};

const fetchGeoCodingLocation = (locationName) =>
    fetch(getGeoCodingUrl(locationName))
        .then(checkStatus)
        .then((res) => res.json())
        .then((geoCodingJsonData) => {
            if (geoCodingJsonData.features.length > 0) {
                return transformGeoCodingLocationData(geoCodingJsonData);
            }
            throw Error(
                "Unable to find location. Try again with a different one."
            );
        })
        .catch(({ message }) => {
            throw Error(message);
        });
       
module.exports = {
    fetchGeoCodingLocation,
};