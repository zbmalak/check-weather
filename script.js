"use strict";

const btn = document.querySelector(".btn--check--weather");
const parentEl = document.querySelector(".weather--container");
const btnContainer = document.querySelector(".btn--container");
const spinnerContainer = document.querySelector(".spinner--container");

const renderWeather = function (city, temperature, description) {
  const markup = `
  
    <h1>Now in ${city} is ${temperature} and ${description}!</h1>
    `;

  parentEl.insertAdjacentHTML("afterbegin", markup);
  btn.classList.add("hidden");
};

const renderError = function () {
  const markup = `

    <h1>Oooops! Something went wrong! Reload page and try again!</h1>
    `;
  parentEl.insertAdjacentHTML("afterbegin", markup);
  btn.classList.add("hidden");
};

const renderSpinner = function () {
  const markup = `
    
      <img  src="/img/spinner.png" alt="spinner" />
    
  `;
  btnContainer.innerHTML = "";
  spinnerContainer.insertAdjacentHTML("afterbegin", markup);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const weather = async function () {
  try {
    renderSpinner();
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error("Problem getting location data!");

    const dataGeo = await resGeo.json();
    const { city } = dataGeo;

    const resWeather = await fetch(
      `https://goweather.herokuapp.com/weather/${dataGeo.city}`
    );

    if (!resWeather.ok) throw new Error("Problem getting weather!");

    const dataWeather = await resWeather.json();
    const { temperature } = dataWeather;
    const { description } = dataWeather;
    spinnerContainer.classList.add("hidden");
    renderWeather(city, temperature, description.toLowerCase());
  } catch (err) {
    spinnerContainer.classList.add("hidden");
    renderError();
  }
};

btn.addEventListener("click", weather);
