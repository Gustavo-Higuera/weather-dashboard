var searchBtn = $("#search-btn");
var apiKey = "d4f0a867ce4cfa7304c028826c6a3551";

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
      var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

      fetch(weatherUrl)
      .then(function (response) {
        console.log(response.status);
      
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
    }

    searchBtn.on("click", function(){
      var cityInput = $(this).siblings("#search-input").val();

      getCity(cityInput);
    });


