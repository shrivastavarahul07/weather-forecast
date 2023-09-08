        // Your OpenWeatherMap API Key
        const apiKey = '08a0b2aa3cefa4aa44d5a937755ba3d9';

        // Function to fetch weather data for a city
    async function fetchWeather(cityName) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

        // Function to fetch 5-day forecast data for a city
    async function fetchForecast(cityName) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    }

    // Function to calculate the 5-day average temperature
    function calculateAverageTemperature(forecastData) {
      const temperatures = [];

      for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecastItem = forecastData.list[i];
        const forecastTemperature = forecastItem.main.temp;
        temperatures.push(forecastTemperature);
      }

      if (temperatures.length === 0) {
        return null;
      }

      const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
      const average = sum / temperatures.length;
      return average.toFixed(1);
    }

        // Function to update the weather information on the HTML
    async function updateWeather(cityName) {
      const weatherData = await fetchWeather(cityName);
      const forecastData = await fetchForecast(cityName);

      if (weatherData && forecastData) {
        const weatherElement = document.getElementById('weatherData');
        const temperatureCelsius = weatherData.main.temp;
        const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
        const city = weatherData.name;
        const humdity = weatherData.main.humidity;
        const description = weatherData.weather.description;
        const icon = weatherData.weather[0].icon;

        const weatherHtml = `
        <h2 class="display-2 temperature" data-celsius="${temperatureCelsius}" data-units="Celsius"><strong>${temperatureCelsius.toFixed(1)}°C</strong></h2>
        <p>Humidity:${humdity} | Description:${description}</p>
        <p class="mb-0" style="color:black">${city}</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" width="100px">
        `;

        weatherElement.innerHTML = weatherHtml;

       // Calculate and display the 5-day average temperature
        const averageTemperature = calculateAverageTemperature(forecastData);
        if (averageTemperature !== null) {
          const averageElement = document.createElement('div');
          averageElement.className = 'mt-2';
          averageElement.innerHTML = `<p><strong>5-Day Average: ${averageTemperature}°C</strong></p>`;
          weatherElement.appendChild(averageElement);
        }

        // Display the next 5 days' weather
        const forecastElement = document.createElement('div');
        forecastElement.className = 'mt-4';

        for (let i = 0; i < forecastData.list.length; i += 8) {
          const forecastItem = forecastData.list[i];
          const forecastDate = new Date(forecastItem.dt * 1000);
          const forecastTemperature = forecastItem.main.temp;
          const forecastIcon = forecastItem.weather[0].icon;

          const forecastHtml = `
          <div class="d-inline-block mx-3 text-center">
          <p>${forecastDate.toLocaleDateString('en-US', { weekday: 'short' })}</p>
          <p><strong>${forecastTemperature.toFixed(1)}°C</strong></p>
          <img src="https://openweathermap.org/img/w/${forecastIcon}.png" width="50px">
          </div>
          `;

          forecastElement.innerHTML += forecastHtml;
        }

        weatherElement.appendChild(forecastElement);
      }
    }

        // Get weather data when the button is clicked
    document.getElementById('getWeatherButton').addEventListener('click', () => {
      const cityName = document.getElementById('cityInput').value;
      updateWeather(cityName);
    });

    // Add an event listener to the toggle button
    document.getElementById('toggleUnitsButton').addEventListener('click', toggleTemperatureUnits);

