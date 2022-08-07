var searchBtn = document.getElementById("search-btn");
var apiKey = "d4f0a867ce4cfa7304c028826c6a3551";
var weatherReportEl = $("#weather-report");
var searchHistoryBtns = $("#search-history-btns");

//Assign the existing array in local storage as the value for seaarchedcities variable
//If array is not in local starage, then assign an empty array as value
var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];


searchBtn.addEventListener("click", formHandler);

function formHandler() {
  var cityInput = document.getElementById("search-input").value;


  if (!searchedCities.includes(cityInput)) {
    if (!cityInput.trim() || !cityInput) {
      alert("Please enter a city!");
    } else {
      searchedCities.push(cityInput)

      displaySearchedHistory();
    }
  }
  localStorage.setItem('searchedCities', JSON.stringify(searchedCities))


  getCity(cityInput);
};

function displaySearchedHistory() {
  searchHistoryBtns.empty()
  //Loop through searchedCities array
  searchedCities.map(function (city) {
    console.log(city)

    //create empty button
    var btn = $('<button class="searched-city-btn"/>')
    btn.data("city", city);
    //display text on the buttons
    btn.text(city)
    searchHistoryBtns.append(btn)

  })
}

$(document).on("click", ".searched-city-btn", function () {

  var city = $(this).data("city");
  getCity(city);
})

function getCity(city) {
  var geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

  fetch(geocodeUrl)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      getUVIndex(data[0].lat, data[0].lon)
      getFiveDayWeather(data[0].lat, data[0].lon);

    });
}

function getWeather(lat, lon, uvResponse) {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  fetch(weatherUrl)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);

      displayWeather(data, uvResponse);
    });

}

function getUVIndex(lat, lon) {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    beforeSend: function (request) {
      request.setRequestHeader('x-access-token', '994fe516af98bba1d1d3447365693bca');
    },
    url: `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`,
    success: function (response) {
      //handle successful response
      console.log(response);
      getWeather(lat, lon, response);

    },
  });
}

function displayWeather(data, uv) {
  var currentForecastEl = $("#current-forecast");
  currentForecastEl.empty();

  currentForecastEl.addClass("current-forecast row col-md-8")

  var cityName = data.name;
  currentForecastEl.append($(`<h2>${cityName}</h2>`));

  var currentIconEl = document.createElement("img");
  currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
  currentIconEl.style.height = "100px";
  currentIconEl.style.width = "130px";
  currentForecastEl.append(currentIconEl);

  var currentTemp = data.main.temp;
  currentForecastEl.append($(`<p>Temp: ${currentTemp}&#8457</p>`));

  var currentWind = data.wind.speed;
  currentForecastEl.append($(`<p>Wind: ${currentWind}mph</p>`));
  var currentHumidity = data.main.humidity;
  currentForecastEl.append($(`<p>Humidity: ${currentHumidity}%</p>`));

  var currentUV = uv.result.uv;
  var currentUVEl = document.createElement("p");
  currentUVEl.textContent = `UV: ${currentUV}`
  currentForecastEl.append(currentUVEl)

  if (currentUV <= 2.9) {
    currentUVEl.classList.add("bg-success");
  } else if (currentUV > 2.9 && currentUV <= 5.9) {
    currentUVEl.classList.add("bg-warning");
  } else {
    currentUVEl.classList.add("bg-danger");
  }
}

function getFiveDayWeather(lat, lon) {
  var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(fiveDayUrl)
    .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayFiveDayWeather(data);
    });
}



function displayFiveDayWeather(data) {
  var fiveDayEl = document.getElementById("five-day-forecast");
  fiveDayEl.innerHTML = ""

  var fiveDayHeader = document.createElement("h2");
  fiveDayEl.appendChild(fiveDayHeader).textContent = "Five Day Forecast";

  // creating this array objects because the api returns 40 results, 5 days w/3 hour increments... only need the 5 day data

  var forecastArr = [{
    date: data.list[5].dt_txt,
    icon: data.list[5].weather[0].icon,
    temp: data.list[5].main.temp,
    wind: data.list[5].wind.speed,
    humidity: data.list[5].main.humidity,
  },
  {
    date: data.list[13].dt_txt,
    icon: data.list[13].weather[0].icon,
    temp: data.list[13].main.temp,
    wind: data.list[13].wind.speed,
    humidity: data.list[13].main.humidity,
  },
  {
    date: data.list[21].dt_txt,
    icon: data.list[21].weather[0].icon,
    temp: data.list[21].main.temp,
    wind: data.list[21].wind.speed,
    humidity: data.list[21].main.humidity,
  },
  {
    date: data.list[29].dt_txt,
    icon: data.list[29].weather[0].icon,
    temp: data.list[29].main.temp,
    wind: data.list[29].wind.speed,
    humidity: data.list[29].main.humidity,
  },
  {
    date: data.list[37].dt_txt,
    icon: data.list[37].weather[0].icon,
    temp: data.list[37].main.temp,
    wind: data.list[37].wind.speed,
    humidity: data.list[37].main.humidity,
  }];

  for (let i = 0; i < forecastArr.length; i++) {
    var fiveForecastCol = document.createElement("div");
    fiveForecastCol.classList = "card col-12 col-sm-6 col-lg-4 mb-3 bg-primary";
    fiveDayEl.appendChild(fiveForecastCol);

    var eachDayForecastEl = document.createElement("div");
    eachDayForecastEl.classList = "w-100 h-100 bg-secondary";
    fiveForecastCol.appendChild(eachDayForecastEl);

    var eachDayDate = forecastArr[i].date;
    var eachDayDateEl = document.createElement("p");
    eachDayForecastEl.appendChild(eachDayDateEl).textContent = eachDayDate;

    var eachDayIconEl = document.createElement("img");
    eachDayIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastArr[i].icon + "@2x.png")
    eachDayForecastEl.appendChild(eachDayIconEl);


    var fiveDayTemp = forecastArr[i].temp;
    var fiveDayTempEl = document.createElement("p");
    eachDayForecastEl.appendChild(fiveDayTempEl).textContent = `Temp: ${fiveDayTemp}`;

    var fiveDayWind = forecastArr[i].wind;
    var fiveDayWindEl = document.createElement("p");
    eachDayForecastEl.appendChild(fiveDayWindEl).textContent = `Wind: ${fiveDayWind}mph`;

    var fiveDayHumidity = forecastArr[i].humidity;
    var fiveDayHumidityEl = document.createElement("p");
    eachDayForecastEl.appendChild(fiveDayHumidityEl).textContent = `Humidity: ${fiveDayHumidity}%`;

  }
}


displaySearchedHistory();