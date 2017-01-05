// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 Ripple 或 Android 设备/仿真程序中调试代码: 启用你的应用程序，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function () {
    "use strict";

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        $('#get-weather-btn').click(getWeatherWithZipCode);
        
        getWeatherWithGeoLocation();

    };
    window.onload = function () {
        $.getJSON("json/loadContent.json", function (data) {
            var html = template('contentlist', data)
            $('#datalist').empty();
            document.getElementById('datalist').innerHTML = html;
            //$("#home").page();
            $('#datalist').listview('refresh');
        }).fail(function (jqXHR) {

        });
    }
    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
    };

    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
    };
    
    var OpenWeatherAppKey = "5e9e3786feae463e933b33db2c62f7f7";

    function getWeatherWithZipCode() {

        var zipcode = $('#zip-code-input').val();

        var queryString =
            'http://api.openweathermap.org/data/2.5/weather?zip='
            + zipcode + ',us&appid=' + OpenWeatherAppKey + '&units=imperial';

        $.getJSON(queryString, function (results) {

            showWeatherData(results);

        }).fail(function (jqXHR) {
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        });

        return false;
    }

    function showWeatherData(results) {

        if (results.weather.length) {

            $('#error-msg').hide();
            $('#weather-data').show();

            $('#title').text(results.name);
            $('#temperature').text(results.main.temp);
            $('#wind').text(results.wind.speed);
            $('#humidity').text(results.main.humidity);
            $('#visibility').text(results.weather[0].main);

            var sunriseDate = new Date(results.sys.sunrise * 1000);
            $('#sunrise').text(sunriseDate.toLocaleTimeString());

            var sunsetDate = new Date(results.sys.sunset * 1000);
            $('#sunset').text(sunsetDate.toLocaleTimeString());

        } else {
            $('#weather-data').hide();
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. ");
        }
    }

    function getWeatherWithGeoLocation() {

        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError,
          { enableHighAccuracy: true });

        $('#error-msg').show();
        $('#error-msg').text('Determining your current location ...');

        $('#get-weather-btn').prop('disabled', true);
    }
    function onGetLocationSuccess(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var queryString =
          'http://api.openweathermap.org/data/2.5/weather?lat='
            + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

        $('#get-weather-btn').prop('disabled', false);

        $.getJSON(queryString, function (results) {

            showWeatherData(results);

        }).fail(function (jqXHR) {
            $('#error-msg').show();
            $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
        });

    }
    function onGetLocationError(error) {

        $('#error-msg').text('Error getting location');
        $('#get-weather-btn').prop('disabled', false);
    }
    
} )();