document.addEventListener("DOMContentLoaded", function() {
    function setupToggleButtons() {
        // Get all toggle buttons
        const toggleButtons = document.querySelectorAll('.toggle-button');

        // Loop through each toggle button
        toggleButtons.forEach(button => {
            // Add click event listener
            button.addEventListener('click', function() {
                // Toggle the src attribute of the clicked button to switch between on and off states
                const src = this.src;
                const newSrc = src.includes('Toggle-on.png') ? 'Toggle-off.png' : 'Toggle-on.png';
                this.src = newSrc;
            });
        });
    }

    // Call the function when the document is loaded
    setupToggleButtons();

    // Get references to the settings button and close button
    const settingsButton = document.getElementById('settings');
    const closeButton = document.getElementById('close');
    const settingsSection = document.getElementById('settings-section');
    const container = document.getElementById('container');

    // Add click event listener to settings button
    settingsButton.addEventListener('click', function() {
        // Show settings section and hide container
        settingsSection.style.display = 'flex';
        container.style.display = 'none';
    });

    // Add click event listener to close button
    closeButton.addEventListener('click', function() {
        // Show container and hide settings section
        container.style.display = 'flex';
        settingsSection.style.display = 'none';
        
        // Update displayed weather statistics based on settings
        updateWeatherDisplay();
    });

    function checkTemperatureAndDisplayWarning(temperature) {
        const heatWarning = document.getElementById('heat-warning');
        const coldWarning = document.getElementById('cold-warning');

        // If temperature exceeds certain thresholds, display the corresponding warning box
        if (temperature > 30) {
            heatWarning.style.display = 'block'; // Show heat warning
            coldWarning.style.display = 'none'; // Hide cold warning
        } else if (temperature < 3) {
            coldWarning.style.display = 'block'; // Show cold warning
            heatWarning.style.display = 'none'; // Hide heat warning
        } else {
            // Hide both warning boxes if temperature is within normal range
            heatWarning.style.display = 'none';
            coldWarning.style.display = 'none';
        }
    }

   // Function to update weather display based on settings
function updateWeatherDisplay() {
    const enabledStatistics = [];
    const toggleButtons = document.querySelectorAll('.toggle-button');

    // Loop through toggle buttons to identify enabled statistics
    toggleButtons.forEach(button => {
        if (button.src.includes('Toggle-on.png')) {
            // Get the corresponding statistic label and add it to enabledStatistics
            const statisticLabel = button.parentElement.querySelector('p').textContent.trim();
            enabledStatistics.push(statisticLabel);
        }
    });

    // Get all weather statistics elements
    const weatherStatistics = document.querySelectorAll('.box');

// Loop through weather statistics elements to update display
weatherStatistics.forEach(statistic => {
    // Get the statistic label associated with the current element
    const statisticLabelElement = statistic.querySelector('.location, .Temperature, .Summary, .Feels-Like, .Humidity, .Pressure, .Temp-max, .Temp-min, .Rain, .Wind-speed, .Sunrise, .Sunset');
    const statisticLabel = statisticLabelElement ? statisticLabelElement.classList[0] : null;
    console.log("Stat Label: ", statisticLabel);
    
    // Check if the statistic is enabled, if yes, display it, otherwise hide it
    if (enabledStatistics.includes(statisticLabel)) {
        statistic.style.display = 'flex';
        // Show all children of the statistic
        statistic.querySelectorAll('.location, .Temperature, .Summary, .Feels-Like, .Humidity, .Pressure, .Temp-max, .Temp-min, .Rain, .Wind-speed, .Sunrise, .Sunset').forEach(child => {
            child.style.display = 'block';
        });
    } else {
        statistic.style.display = 'none';
        // Hide all children of the statistic
        statistic.querySelectorAll('.location, .Temperature, .Summary, .Feels-Like, .Humidity, .Pressure, .Temp-max, .Temp-min, .Rain, .Wind-speed, .Sunrise, .Sunset').forEach(child => {
            child.style.display = 'none';
        });
    }
});


}

    // Call the function to initially update weather display based on settings
    updateWeatherDisplay();

    function setWeather(sunny, rainy, snowy, cloudy) {
        // Update weather icons
        if (sunny) {
            document.getElementById("sunny").style.display = "block";
        } else {
            document.getElementById("sunny").style.display = "none";
        }

        if (rainy) {
            document.getElementById("rainy").style.display = "block";
        } else {
            document.getElementById("rainy").style.display = "none";
        }

        if (snowy) {
            document.getElementById("snow").style.display = "block";
        } else {
            document.getElementById("snow").style.display = "none";
        }

        if (cloudy) {
            document.getElementById("cloudy").style.display = "block";
        } else {
            document.getElementById("cloudy").style.display = "none";
        }

        // Update background animation
        const backgroundElements = document.querySelectorAll(".background-wrap");
        backgroundElements.forEach(element => {
            element.style.display = "none";
        });

        if (sunny) {
            document.getElementById("sunny").style.display = "block";
        } else if (rainy) {
            document.getElementById("rainy").style.display = "block";
        } else if (snowy) {
            document.getElementById("snow").style.display = "block";
        } else if (cloudy) {
            document.getElementById("cloudy").style.display = "block";
        }
    }

    async function getUserCoordinates() {
        try {
            // Fetch IP address information from ipinfo.io
            const response = await fetch('https://ipinfo.io/json');
            if (!response.ok) {
                throw new Error('Failed to fetch IP address information');
            }
            
            // Parse the response JSON
            const data = await response.json();

            // Extract latitude and longitude from the response
            const coordinates = data.loc.split(',');
            const latitude = parseFloat(coordinates[0]);
            const longitude = parseFloat(coordinates[1]);

            return { latitude, longitude };
        } catch (error) {
            console.error('Error getting user coordinates:', error);
            return null;
        }
    }

    async function getCoordinatesFromSearch(searchQuery) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=6b5b252a322150bfc49b05e1714871f1`);
            if (!response.ok) {
                throw new Error('Failed to fetch coordinates from search');
            }
            
            const data = await response.json();

            const latitude = data[0].lat;
            const longitude = data[0].lon;

            return { latitude, longitude };
        } catch (error) {
            console.error('Error getting coordinates from search:', error);
            return null;
        }
    }
    
    async function getWeatherData(lat, lon) {
        const apiKey = '6b5b252a322150bfc49b05e1714871f1';
        const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        try {
            const response = await fetch(base);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    function displayWeatherData(data) {
        if (!data) return;
    
        const kelvin = 273;
        const boxes = document.querySelectorAll('.box');
    
        boxes.forEach(box => {
            const className = box.firstElementChild.className; // Get the class name of the child element
            switch (className) {
                case 'location':
                    box.firstElementChild.textContent = `${data.name}, ${data.sys.country}`;
                    break;
                case 'Temperature':
                    box.firstElementChild.textContent = `${Math.floor(data.main.temp - kelvin)}°C`;
                    checkTemperatureAndDisplayWarning(Math.floor(data.main.temp - kelvin));
                    break;
                case 'Summary':
                    box.firstElementChild.textContent = data.weather[0].description;
                    break;
                case 'Feels-Like':
                    box.firstElementChild.textContent = `Feels like: ${Math.floor(data.main.feels_like - kelvin)}°C`;
                    break;
                case 'Humidity':
                    box.firstElementChild.textContent = `Humidity: ${data.main.humidity}%`;
                    break;
                case 'Pressure':
                    box.firstElementChild.textContent = `Pressure: ${data.main.pressure} hPa`;
                    break;
                case 'Temp-max':
                    box.firstElementChild.textContent = `Max Temp: ${Math.floor(data.main.temp_max - kelvin)}°C`;
                    break;
                case 'Temp-min':
                    box.firstElementChild.textContent = `Min Temp: ${Math.floor(data.main.temp_min - kelvin)}°C`;
                    break;
                case 'Rain':
                    box.firstElementChild.textContent = data.rain ? `Rain (1h): ${data.rain['1h']}mm` : "Precipitation: 0";
                    break;
                case 'Wind-speed':
                    box.firstElementChild.textContent = `Wind Speed: ${data.wind.speed} m/s`;
                    break;
                case 'Sunrise':
                    box.firstElementChild.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
                    break;
                case 'Sunset':
                    box.firstElementChild.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
                    break;
                default:
                    break;
            }
        });
    
    
    
        const weatherSummary = data.weather[0].description.toLowerCase();
        const sunny = weatherSummary.includes('sun') || weatherSummary.includes('clear');
        const rainy = weatherSummary.includes('rain');
        const cloudy = weatherSummary.includes('cloud') || weatherSummary.includes('clouds');
        const snowy = weatherSummary.includes('snow');
    
        console.log(sunny, rainy, cloudy, snowy);
    
        if (sunny || rainy || cloudy || snowy) {
            setWeather(sunny, rainy, snowy, cloudy);
        }
    }
    async function getUserCityName() {
        try {
            // Fetch IP address information from ipinfo.io
            const response = await fetch('https://ipinfo.io/json');
            if (!response.ok) {
                throw new Error('Failed to fetch IP address information');
            }
            
            // Parse the response JSON
            const data = await response.json();
    
            // Extract city name from the response
            const cityName = data.city;
    
            return cityName;
        } catch (error) {
            console.error('Error getting user city name:', error);
            return null;
        }
    }

//get the forcast data for a city
async function getForecastData(city) {
    const apiKey = '6b5b252a322150bfc49b05e1714871f1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        return null;
    }
}

// load the forcast data on the page
async function fillForecastData(city) {

    const forecastData = await getForecastData(city);
    const forecastContainer = document.getElementById('forecast-container');

    if (!forecastData || !forecastData.list) {
        console.error('No forecast data available');
        return;
    }

    const firstForecastTemperature = forecastData.list[0].main.temp;
    const firstForecastTemperatureCelsius = Math.round(firstForecastTemperature - 273.15);
    console.log(firstForecastTemperatureCelsius);
    checkTemperatureAndDisplayWarning(firstForecastTemperatureCelsius);

    for (let i = 0; i < 7; i++) {
        const dayElement = forecastContainer.children[i];
        const forecast = forecastData.list[i * 8]; // Adjusted to get data for every 24 hours
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const weatherDescription = forecast.weather[0].description;
        
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short' });
        const formattedTemperature = Math.round(temperature - 273.15);

        dayElement.innerHTML = `
            <h3>${formattedDate}</h3>
            <p>${formattedTemperature}°C</p>
            <p>${weatherDescription}</p>
        `;
    }
    
}
// Get user's coordinates and display weather data
    (async () => {
        const userCoordinates = await getUserCoordinates();
        if (userCoordinates) {
                const { latitude, longitude } = userCoordinates;
                const weatherData = await getWeatherData(latitude, longitude);
                displayWeatherData(weatherData);
        }
        })().catch(error => console.error('Error', error));
//on load fill with current city name
    (async () => {
        const city = await getUserCityName();
        fillForecastData(city);
    })().catch(error => console.error('Error getting user city name:', error));

//search button
document.getElementById("search-btn").addEventListener("click", async () => {
    const searchQuery = document.getElementById("search-bar").value.trim();
    
    if (searchQuery) {
        try {
            const coordinates = await getCoordinatesFromSearch(searchQuery);
            
            if (coordinates) {
                const { latitude, longitude } = coordinates;
                const weatherData = await getWeatherData(latitude, longitude);
                displayWeatherData(weatherData);
                console.log(searchQuery);
                // Update forecast data based on the searched city
                await fillForecastData(searchQuery); // Pass the searched location
            } else {
                console.log('Error: Coordinates not available');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    } else {
        console.log('Error: Please enter a city');
    }
});
})



