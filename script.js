let apikey = "6ec2c4dc2af55b596da69cd5edd99106"; // API key
let wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = document.getElementById("cityInput"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    arrowBack = wrapper.querySelector("header i"),
    getWeatherBtn = document.getElementById("getWeatherBtn");

let api;

// Wait for the DOM content to load
document.addEventListener("DOMContentLoaded", () => {
    // Check if geolocation is supported
    if (navigator.geolocation) {
        // Ask for confirmation synchronously
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation API");
    }
});

// function for weather find on find weather button to find any city weather
getWeatherBtn.addEventListener("click", () => {
    let cityName = inputField.value.trim();
    if (cityName) {
        requestApi(cityName);
    } else {
        alert("Weather name cannot be empty");
    }
});

// API request
function requestApi(cityName) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apikey}`;
    fetchData();
}

// function for success
function onSuccess(position) {
    let {
        latitude,
        longitude
    } = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`)
        .then(res => res.json())
        .then(result => {
            weatherDetails(result);
            updateTimeDate();
        })
        .catch(() => {
            infoTxt.innerText = "Something went wrong plz check again ! ";
            infoTxt.classList.replace("pending", "error");
        });
}

// error function
function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

// fetch data from API
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then(res => res.json())
        .then(result => {
            weatherDetails(result);
            updateTimeDate();
        })
        .catch(() => {
            infoTxt.innerText = "Something went wrong it's not valid.";
            infoTxt.classList.replace("pending", "error");
        });
}

// functions for weather details
function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid`;
    } else {
        let city = info.name;
        let country = info.sys.country;
        let {
            description,
            id
        } = info.weather[0];
        let {
            temp,
            feels_like,
            humidity
        } = info.main;

        let {
            speed
        } = info.wind;
        if (id == 800) {
            wIcon.src = "clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "rain.svg";
        }
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".wind-speed .speed").innerText = speed;
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

// if weather display move to back 
arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});