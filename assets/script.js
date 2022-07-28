var searchBtn = document.getElementById("search-btn");
var apiKey = "d4f0a867ce4cfa7304c028826c6a3551";


searchBtn.addEventListener("click", formHandler);

function formHandler (){
  var cityInput = document.getElementById("search-input").value;

  getCity(cityInput);
};

function getCity(city){
  var geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

  fetch(geocodeUrl)
    .then(function (response) {
      console.log(response.status);
    
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      getWeather(data[0].lat, data[0].lon);
    });
  }

    function getWeather(lat, lon){
      var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

      fetch(weatherUrl)
      .then(function (response) {
        console.log(response.status);
      
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        displayWeather(data);
      });
    }

    function displayWeather (data){
      var currentForecastEl = $("#current-forecast");
      currentForecastEl.addClass("current-forecast")
      currentForecastEl.append($("<h2>Current Weather</h2>"));

      var cityName = data.name;
      currentForecastEl.append($(`<h3>${cityName}</h3>`));

      var currentTemp = data.main.temp;
      currentForecastEl.append($(`<p>Temp: ${currentTemp}&#8457</p>`));

      var currentWind = data.wind.speed;
      currentForecastEl.append($(`<p>Wind: ${currentWind}mph</p>`));

      var currentHumidity = data.main.humidity;
      currentForecastEl.append($(`<p>Humidity: ${currentHumidity}%</p>`));
    }



