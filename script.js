// variables

var APIKey = "&appid=b3009d97f09f74390db8509f36816dc8";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();

$(document).ready(function() {
  var city = citiesArray[citiesArray.length - 1];
  fiveDay(city);
  citySearch(city);
});

// functions
function citySearch(city) {
  $(".city").empty();
  $(".temp").empty();
  $(".humidity").empty();
  $(".wind").empty();
  $(".uvIndex").empty();

  var citySearch = queryURL + city + APIKey;
  console.log(citySearch);

  // ajax for searching for new city to display
  $.ajax({
    url: citySearch,
    method: "GET"
  }).then(function(response) {
    var cityInfo = response.name;
    console.log(cityInfo);
    var dateInfo = response.dt;
    console.log(dateInfo);
    var currentDate = moment.unix(dateInfo).format("L");
    console.log("current date" + currentDate);

    var iconDummy = "https://openweathermap.org/img/wn/";
    var iconPng = "@2x.png";
    var iconWeather = response.weather[0].icon;
    var iconUrl = iconDummy + iconWeather + iconPng;
    console.log(iconUrl);
    var iconImg = $("<img>");
    iconImg.attr("src", iconUrl);
    $(".city").append(cityInfo + " ");
    $(".city").append(currentDate + " ");
    $(".city").append(iconImg);

    console.log(response.main.temp);
    var K = response.main.temp;
    console.log(K);
    var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
    console.log(F);
    $(".temp").append("Temperature: " + F + " °F");

    //   humidity
    var humidityInfo = response.main.humidity;
    $(".humidity").append("Humidity: " + humidityInfo + "%");

    //  wind speed
    console.log(response.wind.speed);
    var oldSpeed = response.wind.speed;
    console.log(oldSpeed);
    var newSpeed = (oldSpeed * 2.2369).toFixed(2);
    $(".wind").append("Wind Speed: " + newSpeed + " MPH");

    //   UV index
    var lon = response.coord.lon;
    var lat = response.coord.lat;

    uvIndex(lon, lat);
  });
}
// recieves lat & lon

function uvIndex(lon, lat) {
  // searches
  var indexURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=8c9bb7e0eeb10862d148cd62de471c05&lat=";
  var middle = "&lon=";
  var indexSearch = indexURL + lat + middle + lon;
  console.log(indexSearch);

  $.ajax({
    url: indexSearch,
    method: "GET"
  }).then(function(response) {
    var uvFinal = response.value;

    $(".uvIndex").append("UV Index: ");
    var uvBtn = $("<button>").text(uvFinal);
    $(".uvIndex").append(uvBtn);
    if (uvFinal < 3) {
      uvBtn.attr("class", "uvGreen");
    } else if (uvFinal < 6) {
      uvBtn.attr("class", "uvYellow");
    } else if (uvFinal < 8) {
      uvBtn.attr("class", "uvOrange");
    } else if (uvFinal < 11) {
      uvBtn.attr("class", "uvRed");
    } else {
      uvBtn.attr("class", "uvPurple");
    }
  });
}

function renderButtons() {
  $(".list-group").empty();

  for (var i = 0; i < citiesArray.length; i++) {
    var a = $("<li>");
    a.addClass("cityName");
    a.addClass("list-group-item");
    a.attr("data-name", citiesArray[i]);
    a.text(citiesArray[i]);
    $(".list-group").append(a);
  }

  $(".cityName").on("click", function(event) {
    event.preventDefault();

    var city = $(this).data("name");
    console.log("prev searched city" + city);

    fiveDay(city);
    citySearch(city);
  });
}

function fiveDay(city) {
  var fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
  var fiveURL = fiveFront + city + APIKey;
  console.log(fiveURL);

  $(".card-text").empty();
  $(".card-title").empty();

  $.ajax({
    url: fiveURL,
    method: "GET"
  }).then(function(response) {
    //dates
    var dateOne = moment
      .unix(response.list[1].dt)
      .utc()
      .format("L");
    $(".dateOne").append(dateOne);
    var dateTwo = moment
      .unix(response.list[9].dt)
      .utc()
      .format("L");
    $(".dateTwo").append(dateTwo);
    var dateThree = moment
      .unix(response.list[17].dt)
      .utc()
      .format("L");
    $(".dateThree").append(dateThree);
    var dateFour = moment
      .unix(response.list[25].dt)
      .utc()
      .format("L");
    $(".dateFour").append(dateFour);
    var dateFive = moment
      .unix(response.list[33].dt)
      .utc()
      .format("L");
    $(".dateFive").append(dateFive);

    //temp
    $(".tempOne").append("Temperature: ");
    $(".tempOne").append(
      tempAvg(
        response.list[2].main.temp,
        response.list[4].main.temp,
        response.list[6].main.temp
      )
    );
    $(".tempOne").append(" °F");

    $(".tempTwo").append("Temperature: ");
    $(".tempTwo").append(
      tempAvg(
        response.list[10].main.temp,
        response.list[12].main.temp,
        response.list[14].main.temp
      )
    );
    $(".tempTwo").append(" °F");

    $(".tempThree").append("Temperature: ");
    $(".tempThree").append(
      tempAvg(
        response.list[18].main.temp,
        response.list[20].main.temp,
        response.list[22].main.temp
      )
    );
    $(".tempThree").append(" °F");

    $(".tempFour").append("Temperature: ");
    $(".tempFour").append(
      tempAvg(
        response.list[26].main.temp,
        response.list[28].main.temp,
        response.list[30].main.temp
      )
    );
    $(".tempFour").append(" °F");

    $(".tempFive").append("Temperature: ");
    $(".tempFive").append(
      tempAvg(
        response.list[34].main.temp,
        response.list[36].main.temp,
        response.list[38].main.temp
      )
    );
    $(".tempFive").append(" °F");

    //humidity
    $(".humidityOne").append("Humidity: ");
    $(".humidityOne").append(
      humidityAvg(
        response.list[2].main.humidity,
        response.list[4].main.humidity,
        response.list[6].main.humidity
      )
    );
    $(".humidityOne").append("%");

    $(".humidityTwo").append("Humidity: ");
    $(".humidityTwo").append(
      humidityAvg(
        response.list[10].main.humidity,
        response.list[12].main.humidity,
        response.list[14].main.humidity
      )
    );
    $(".humidityTwo").append("%");

    $(".humidityThree").append("Humidity: ");
    $(".humidityThree").append(
      humidityAvg(
        response.list[18].main.humidity,
        response.list[20].main.humidity,
        response.list[22].main.humidity
      )
    );
    $(".humidityThree").append("%");

    $(".humidityFour").append("Humidity: ");
    $(".humidityFour").append(
      humidityAvg(
        response.list[26].main.humidity,
        response.list[28].main.humidity,
        response.list[30].main.humidity
      )
    );
    $(".humidityFour").append("%");

    $(".humidityFive").append("Humidity: ");
    $(".humidityFive").append(
      humidityAvg(
        response.list[34].main.humidity,
        response.list[36].main.humidity,
        response.list[38].main.humidity
      )
    );
    $(".humidityFive").append("%");
  });
}

function tempAvg(x, y, z) {
  var avgThree = (x + y + z) / 3.0;
  var avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
  return avgReturn;
}

function humidityAvg(x, y, z) {
  var avgHum = (x + y + z) / 3.0;
  return avgHum.toFixed(0);
}

// events

$("#add-city").on("click", function(event) {
  event.preventDefault();

  var city = $("#city-input")
    .val()
    .trim();

  var containsCity = false;

  if (citiesArray != null) {
    $(citiesArray).each(function(x) {
      if (citiesArray[x] === city) {
        containsCity = true;
      }
    });
  }

  if (containsCity === false) {
    citiesArray.push(city);
  }

  // local storage
  localStorage.setItem("cities", JSON.stringify(citiesArray));

  renderButtons();
});

renderButtons();
