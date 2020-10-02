/* =========================================
   Weather Dashboard Application  - main.js
           By: Henry Jean Logique
   ========================================= */

//Define Variables
var apiKey = "ecc6ea6df0f6575783a80a7b389d9b67";
var queryUrlCurrent = "";
var queryUrlFuture = "";
var searchInput = "";

// Retrieve the last searched city from the local storage and populate the information
$(document).ready(function(){

    if(localStorage.getItem("lastSearchedCity")){ // Check if a city name is saved in the local storage
        
        searchInput = localStorage.getItem("lastSearchedCity");
        queryUrlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
        queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
        updateSearchList();
        updateCurrentWeather();
        updateFutureForecast();
        searchInput = ""; // Clear the variables
        queryUrlWeather = "";
        queryUrlForecast = "";
    }
});

// Call other functions if the entry is valid 
$("#searchBtn").on("click", function () {

    searchInput = $("input:text").val();

    if (searchInput == null || searchInput == "" || !isNaN(searchInput)) {
        alert("Your entry is not valid. Try again!");
    } else {
        queryUrlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
        queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
        updateSearchList();
        updateCurrentWeather();
        updateFutureForecast();
        $("input:text").val("");
    }
});

// Update list of cities
function updateSearchList() {
    
    var newSeatchedCity = $('<a class="list-group-item list-group-item-action" data-toggle="list" href="#list-home" role="tab" aria-controls="home">' + searchInput + '</a>');
    newSeatchedCity.attr("style", "color: #E7E6E6; background-color: #343434; border: #E7E6E6 solid 1px; margin-bottom: 5px;");
    
    // Store the value of the last searched city to the local storage
    localStorage.setItem("lastSearchedCity", searchInput);

    $(".list-group").append(newSeatchedCity);
    $("#searchField").text(" ");
    $(".list-group-item").on("click", function () {
        
        queryUrlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).html() + "&Appid=" + apiKey + "&units=imperial";
        queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + $(this).html() + "&Appid=" + apiKey + "&units=imperial";
       
       updateCurrentWeather();
       updateFutureForecast();
    });
}

// Query and update the weather information
function updateCurrentWeather() {
    
    // Perform an AJAX request for the weather
    $.ajax({
        url: queryUrlWeather,
        method: "GET"
    })
        .then(function (response) {

            var currentWeather = $("#currentWeather");
            currentWeather.empty(); // Clear the Weather area

            // Query and display City Name, Temprature, Humidity, Wind Speed and UV Index
            currentWeather.append('<h4 id="currentCity" style="float: left;">' + response.name + ' (' + moment().format('l') + ')' + '</h4><img src="https://openweathermap.org/img/w/' + response.weather[0].icon + '.png" style="margin-top: -10px;"><br><br>');
            currentWeather.append('<p id="currentTemp">Temprature: ' + response.main.temp + '</p>');
            currentWeather.append('<p id="currentHumid">Humidity: ' + response.main.humidity + '%</p>');
            currentWeather.append('<p id="currentWind">Wind Speed: ' + response.wind.speed + '</p>');
            console.log(response.wind);
          
            // Create UV Index URL based on the response from the first query
            var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // Perform an AJAX request for UV index
            $.ajax({
                url: uvUrl,
                method: "GET"
            }).then(function (response) {

                $("#currentIndex").empty();

                // Query and display UV index
                currentWeather.append('<p id="currentIndex">UV Index: <span style="padding:5px; margin-left: 3px;" class="badge badge-danger" id="indexColor">' + response.value + '</span></p>');
            });
        });
}

// Query and update the next five day's forecast information
function updateFutureForecast() {

    // Perform an AJAX request for the forecast
    $.ajax({
        url: queryUrlForecast,
        method: "GET"
    }).then(function (response) {

        $("#forecastLabel").text("5-Day Forecast:");
        $("#forecastLabel").attr("style", "margin-bottom: 18px;");

        var nextFiveDayForecast = $("#futureForecast");
        nextFiveDayForecast.empty(); // Clear the Forecast area
       
        // Query and display the next five days' forecast
        for (var i = 0; i < 33; i += 8){

            // Add columns for the future forecast
            var forecastColumn = '<div class="card text-white bg-primary mb-3" style="max-width: 18rem;" id="forecastColumn' + i + '">';
            nextFiveDayForecast.append(forecastColumn);

            // Query dates of the city in UTC format and reformat it to US format
            var timeUTC = new Date(response.list[i].dt * 1000);
            timeUTC = timeUTC.toLocaleDateString("en-US");

            // Query and display dates, weather icons, temperature and humidity for each column
            $("#forecastColumn" + i).append('<div class="card-header" style = "text-align: center;">'+ timeUTC +'</div>');
            $("#forecastColumn" + i).append('<div class="card-body" style = "text-align: center; margin-top: -5px;"><img src="https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '.png"></div>');
            $("#forecastColumn" + i).append('<p class="card-text" style = "padding-left: 15px; margin-top: -15px;"><small>Temperature: ' + response.list[i].main.temp + '</small></p>');
            $("#forecastColumn" + i).append('<p class="card-text" style = "padding-left: 15px; margin-top: -10px; margin-bottom: 15px;"><small>Humidity: ' + response.list[i].main.humidity + '%</small></p>');

        }

    });   

}













