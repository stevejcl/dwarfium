var calendarData = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var currentDay = {};
var currentYear = 2021;
var currentMonth = 5; //June
var calendarDay = document.getElementsByClassName("days");
var calendar = document.querySelector(".calendar");

var clearCityButtonEl = document.querySelector('#clear-city');
var cityNameEl = document.querySelector('#city-name');
var weatherTodayEl = document.querySelector('#weather-today');
var cloudCoverEl = document.querySelector('#cloud-coverage');
var airTempEl = document.querySelector('#air-temp');
var precipitationEl = document.querySelector('#precipitation')
var moonPhaseEl = document.querySelector('#moon-phase');
var moonRiseEl = document.querySelector('#moon-rise');
var moonSetEl = document.querySelector('#moon-set');

var sixthWeek = document.getElementsByClassName("sixth");
var monthEl = document.querySelector(".month");
var yearEl = document.querySelector(".year");
var selectedMonth = document.getElementById("start");
var clearCityButtonEl = document.querySelector('#clear-city');
var weatherDataContainerEl = document.getElementById('weather-data-container');
var weatherEl = document.getElementById('weather-container');

document.getElementById('start').valueAsDate = new Date();

//retrieves data from the calendarData array for a given day
//uses day of week(dOW) and week of month(wOM) data tags in thecalendar HTML
let getData = function (dOW, wOM) {

    calendarData.forEach(function (entry) {
        if ((entry.dayOfWeek == dOW) && (entry.weekOfMonth == wOM)) {
            currentDay = entry;
            return true;
        }
    });
}

//Load calendar objects with data from the calendarData array
let loadCalendar = function () {
    monthEl.innerHTML = months[parseInt(currentMonth) - 1];
    yearEl.textContent = currentYear;
    //for each record in the calendarData array assigns data to the coresponding HTML object
    for (let i = 0; i < calendarDay.length; i++) {
        //gets data for given day
        getData(calendarDay[i].dataset.dow, calendarDay[i].dataset.wom);
        let dayEl = calendarDay[i].querySelector(".dayBox");
        let imgEl = calendarDay[i].querySelector(".img-moon");

        //if do data fro given day, hide objects in HTML
        if (!currentDay.day) {
            imgEl.style.visibility = "hidden";
            dayEl.textContent = "";
        }
        //assigns values to HTML
        else {
            dayEl.textContent = currentDay.day;
            dayEl.dataset.stage = currentDay.stage;
            imgEl.src = '../assets/images/Moon/' + currentDay.image;
            imgEl.alt = 'Description';
            imgEl.style.visibility = "visible";
        }

        //checks if a sixth week is required for the calendar and changes week to visible
        if (currentDay.weekOfMonth == "6") {
            sixthWeek[0].style.visibility = "visible";
            calendar.style.height = "735px";
            weatherEl.style.height = "735px";
        }
        //clears the currentDay object
        currentDay = {};

    }
}

//variable for the submit button
var submitButton = document.querySelector("#search-btn");
// variable for the close button on city search error modal
var errorCloseButton = document.querySelector("#error-close");
//variable for the input to search a city 
var cityInputEl = document.querySelector("#input_city");
// variable for the error modal box
var errorBox = document.querySelector(".error-modal-container");

// calculate julian month to get moon phase 
const julianDate = (date) => {
    const time = date.getTime();
    const timeZone = date.getTimezoneOffset()

    return (time / 86400000) - (timeZone / 1440) + 2440587.5;
}

// create lunar month  
const lunarMonth = 29.53;


const LunarAgePercent = (date) => {
    return normalize((julianDate(date) - 2451550.1) / lunarMonth);
}

const normalize = value => {
    value = value - Math.floor(value);
    if (value < 0)
        value = value + 1
    return value;
}

//get percentages for various phases to tell moon type 
// if statement  use lunar age variable to call 
const lunarPhase = (x) => {

    if (x < 1.845)
        return "New Moon";
    else if (x < 5.53)
        return "Waxing Crescent";
    else if (x < 9.228)
        return "First Quarter";
    else if (x < 12.919)
        return "Waxing Gibbious";
    else if (x < 16.61)
        return "Full Moon";
    else if (x < 20.30)
        return "Waning Gibbious";
    else if (x < 23.99)
        return "Last Quarter";
    else if (x < 30.01)
        return "Waning Crescent";

    return "";

}

//Function to return the days since lsat new mood to determine which image to display on calendar
const moonAge = (date = new Date(newdate)) => {
    const percent = LunarAgePercent(date);
    const age = percent * lunarMonth;
    return age;
}

//Load the calendarData array for the selected month/year
let loadArray = function () {
    //Clear the array of previous data
    calendarData = [];
    let selected = selectedMonth.value.split('-');
    currentYear = selected[0];
    currentMonth = selected[1];
    //finds the last day in the selected month
    let lastDay = new Date(currentYear, parseInt(currentMonth), 0).getDate();

    //Create array object for each day in the selected month/year
    for (let i = 1; i <= lastDay; i++) {
        var d = new Date(currentYear, parseInt(currentMonth) - 1, i);
        var date = d.getDate();
        var day = d.getDay();
        var moonDate = new Date(currentYear + '-' + String(currentMonth).padStart(2, '0') + '-' + String(i).padStart(2, '0') + 'T23:59:59Z');
        var mAge = moonAge(moonDate);

        var weekOfMonth = Math.ceil((date - 1 - day) / 7) + 1;
        var moonImage = "Moon-" + Math.floor(mAge) + ".jpg";
        calendarData.push({ day: i, dayOfWeek: day, weekOfMonth: weekOfMonth, image: moonImage, stage: mAge });

    };
}

document.addEventListener("DOMContentLoaded", () => {
    const phase = lunarPhase();

});











// document.getElementsByTagName('BODY')[0].addEventListener

//function to open modal 


//resets calendate styles and loads the calendarData array and loads the calendar HTML
let loadPage = function () {
    sixthWeek[0].style.visibility = "hidden";
    calendar.style.height = "630px";
    weatherEl.style.height = "630px";
    loadArray();
    loadCalendar();
}
//Calls functioon to load initial calendar data for the current month/year
loadPage();



document.addEventListener("DOMContentLoaded", () => {
    const phase = lunarPhase();

})


// this function runs when the submit button is clicked 
// this function runs when the submit button is clicked 
var submitButtonHandler = function (event) {
    event.preventDefault();
    // get city value from input element
    var selectedCity = cityInputEl.value.trim();

    // if a city is entered then run code 
    if (selectedCity) {
        getLatLong(selectedCity);

        localStorage.setItem('savedCity', selectedCity);
        // errorBox.setAttribute("class", "display: none");

    }
    else {
        // error modal appears 

        errorBox.setAttribute("class", "display: block");
    }

};


// this function will get the latitude and longitude to be used in the weather search 
var getLatLong = function (selectedCity) {
    // this creates a URL for the api request based off of the city entered
    var apiUrl = "http://api.positionstack.com/v1/forward?access_key=API_KEY&query=" + selectedCity + "&limit=1";

    // fetch request to get lat and long from url we just created
    fetch(apiUrl).then(function (response) {
        // take response and convert it to data we cna use
        response.json().then(function (data) {

            // Hey Corrie, you can use these variables in your api call for the weather information. This will give you the latitude and longitude based on their search 
            let lat = data.data[0].latitude;
            let lon = data.data[0].longitude;




            localStorage.setItem('savedLat', lat);
            localStorage.setItem('savedLon', lon);

            cityNameEl.textContent = "Your daily moon and weather information is populating!"
            getWeather();

        })
    })
        .catch(function (error) {
            errorCatchBox.setAttribute("style", "display: block");
        })


};

// Pulling the weather information
function getWeather() {
    const lat = localStorage.getItem('savedLat');
    const lng = localStorage.getItem('savedLon');

    if (lat && lng) {
        // Storm Glass API  
        let params = 'cloudCover,precipitation,airTemperature';

        // Weather Fetch
        fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
            headers: {
                'Authorization': 'API_KEY' // 10request =>day
            }
        }).then((response) => response.json()).then((res) => {


            // Pulling in Cloud Coverage
            const cloudCoverage = res.hours[0].cloudCover.noaa + '%'
            // Saving Cloud Coverage
            localStorage.setItem('savedCloudCoverage', cloudCoverage);



            // Pulling in Air Temp
            const airTemp = res.hours[0].airTemperature.noaa
            // Saving Temp
            localStorage.setItem('savedAirTemperature', airTemp);
        })
            .catch(() => {
                errorCatchBox.setAttribute("style", "display: block");
            });


        // Precipitation Fetch
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minute,hourly,alert&appid=API_KEY`, {
        }).then((response) => response.json()).then((res) => {
            // Pulling in Precipitation
            const precipitation = res.daily[0].rain

            if (precipitation) {
                // Saving Precipitation
                localStorage.setItem('savedPrecipitation', (precipitation));
            }




        })
            .catch(() => {
                errorCatchBox.setAttribute("style", "display: block");
            });



        // Astronomy Fetch 
        let end = '2024-04-01';

        fetch(`https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lng}&end=${end}`, {
            headers: {
                'Authorization': 'API_KEY'
            }
        }).then((response) => response.json()).then((res) => {
            // Pulling in Moon Phase
            const moonPhase = res.data[0].moonPhase.current.text
            // Saving Moon Phase
            localStorage.setItem('savedMoonPhase', moonPhase);

            // Pulling in Moon Rise
            const moonRise = res.data[0].moonrise
            const moonRiseDate = moonRise.replace(/202.+?-.+?-.+?T0/, '');
            const moonRiseTime = moonRiseDate.slice(0, -9)
            // Saving Moon Rise
            localStorage.setItem('savedMoonRise', moonRiseTime);

            // Pulling in Moon Rise
            const moonSet = res.data[0].moonset
            const moonSetDate = moonSet.replace(/202.+?-.+?-.+?T/, '');
            const moonSetTime = moonSetDate.slice(0, -9)
            // Saving Moon Rise
            localStorage.setItem('savedMoonSet', moonSetTime);


        })
            .catch(() => {
                errorCatchBox.setAttribute("style", "display: block");
            });

    }
    setTimeout(showWeather, 5000);
};

// Function to display saved Weather/Astrology info
function showWeather() {
    const cityName = localStorage.getItem('savedCity');

    if (cityName) {
        // Displaying City Weather is pulling

        cityNameEl.textContent = cityName;
        cityInputEl.value = "";

        // Displaying Today's Date

        const today = new Date();
        weatherTodayEl.textContent = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

        // Display Cloud Coverage Information
        const cloudCoverageDisplay = localStorage.getItem('savedCloudCoverage')
        cloudCoverEl.textContent = `Cloud Coverage: ${cloudCoverageDisplay}`;

        // Display Air Temparature Information
        const airTempDisplay = localStorage.getItem('savedAirTemperature')
        const celsius = Math.round(parseInt(airTempDisplay));
        const fahrenheit = Math.round(celsius * 9 / 5 + 32);
        airTempEl.textContent = `Temperature: ${celsius}°C/ ${fahrenheit}°F`;

        // Display Precipitation
        const precipitationDisplay = localStorage.getItem('savedPrecipitation');
        var precipitationEl = document.querySelector('#precipitation')

        if (precipitationDisplay) {
            precipitationEl.textContent = `Precipitation: ${precipitationDisplay}mm`;
        }
        else {
            precipitationEl.textContent = `Precipitation: None forecasted`;
        }


        // Displaying Moon Phase
        const moonPhaseDisplay = localStorage.getItem('savedMoonPhase');
        moonPhaseEl.textContent = `Moon Phase: ${moonPhaseDisplay}`;

        // Displaying Moon Rise
        const moonRiseDisplay = localStorage.getItem('savedMoonRise');
        moonRiseEl.textContent = `Moon Rise: ${moonRiseDisplay} am`;

        // Displaying Moon Set
        const moonSetDisplay = localStorage.getItem('savedMoonSet');
        moonSetEl.textContent = `Moon Set: ${moonSetDisplay} pm`;
    }
    else {
        cityNameEl.textContent = "Enter a City to Get Started!"
    };
};

getWeather();
// event listener for error modal close button
errorCloseButton.addEventListener("click", function () {
    errorBox.setAttribute("style", "display: none");
});


// variables for the box to catch general errors
var errorCatchBox = document.querySelector("#error-catch-container");
var errorCatchCloseButton = document.querySelector("#error-catch-close");

// event listener for general error modal close button 
errorCatchCloseButton.addEventListener("click", function () {
    errorCatchBox.setAttribute("style", "display: none");
})


// Clear City Data
clearCityButtonEl.addEventListener('click', function () {
    localStorage.clear();
    cityNameEl.textContent = "Enter a City to Get Started!";
    weatherTodayEl.textContent = "";
    cloudCoverEl.textContent = "";
    airTempEl.textContent = "";
    precipitationEl.textContent = "";
    moonPhaseEl.textContent = "";
    moonRiseEl.textContent = "";
    moonSetEl.textContent = "";
});
// event listener for the submit button-- needs to be near bottom of page 
submitButton.addEventListener("click", submitButtonHandler);




