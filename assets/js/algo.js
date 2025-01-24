// Algorithm to find the best possible sunset location using api.weather.gov

const buttonScreen = document.querySelector('.button-screen');
const loadingScreen = document.querySelector('.loading-screen');
const resultsScreen = document.querySelector('.results-screen');

// Helper function to fetch weather data
async function fetchWeatherData(lat, lon) {
  const apiUrl = `https://api.weather.gov/points/${lat},${lon}`;
  try {
    // Fetch the gridpoint data to get forecast URL
    const pointResponse = await fetch(apiUrl);
    const pointData = await pointResponse.json();

    if (pointData.properties && pointData.properties.forecastHourly) {
      const hourlyForecastUrl = pointData.properties.forecastHourly;
      const forecastResponse = await fetch(hourlyForecastUrl);
      const forecastData = await forecastResponse.json();
      return forecastData.properties.periods;
    } else {
      throw new Error("Unable to fetch forecast URL");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

// Function to evaluate sunset quality
function evaluateSunsetQuality(period) {
  const { cloudCover, visibility, shortForecast } = period;
  let score = 0;

  // Favor partial clouds (e.g., 30-70% cloud cover)
  if (cloudCover >= 30 && cloudCover <= 70) score += 50;

  // High visibility is a big plus
  if (visibility >= 10) score += 30;

  // Check if the short forecast mentions favorable conditions (e.g., clear or partly cloudy)
  if (shortForecast.toLowerCase().includes("clear") || shortForecast.toLowerCase().includes("partly cloudy")) {
    score += 20;
  }
  console.log(score);
  return score;
}

// Main function to find the best sunset location
async function findBestSunsetLocation(currentLat, currentLon) {
  try {
    // Fetch weather data for the current location
    const weatherData = await fetchWeatherData(currentLat, currentLon);

    if (!weatherData) {
      console.error("No weather data available");
      return null;
    }

    // Filter for sunset hours (e.g., 1-2 hours before sunset)
    const sunsetHours = weatherData.filter((period) => {
      const hour = new Date(period.startTime).getHours();
      return hour >= 16 && hour <= 19; // Adjust for sunset time in your location
    });

    // Evaluate each period and find the best one
    let bestPeriod = null;
    let highestScore = 0;

    sunsetHours.forEach((period) => {
      const score = evaluateSunsetQuality(period);
      if (score > highestScore) {
        highestScore = score;
        bestPeriod = period;
      }
    });

    if (bestPeriod) {

      const sunsetTime = new Date(bestPeriod.startTime);
      let hours = sunsetTime.getHours();
      const minutes = sunsetTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      document.querySelector('[data-best-sunset-time]').innerHTML = formattedTime;
      document.querySelector('[data-forecast]').innerHTML = `Forecast: ${bestPeriod.shortForecast}`;

      console.log("Best sunset time:", bestPeriod.startTime);
      console.log("Forecast:", bestPeriod.shortForecast);
      return bestPeriod;
    } else {
      console.log("No optimal sunset conditions found");
      return null;
    }
  } catch (error) {
    console.error("Error finding best sunset location:", error);
    return null;
  }
}


// Tie the functionality to a button click
document.querySelector('#view-button').addEventListener('click', () => {
  buttonScreen.style.display = 'none';
  loadingScreen.style.display = 'flex';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;

      findBestSunsetLocation(currentLat, currentLon).then((result) => {

        loadingScreen.style.display = 'none';
        resultsScreen.style.display = 'block';

        if (result) {
          console.log("Best sunset period:", result);
        } else {
          console.log("No ideal sunset conditions found.");
        }
      });
    }, (error) => {
      console.error("Error getting user's location:", error);
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
});

