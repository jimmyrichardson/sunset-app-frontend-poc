// Algorithm to find the best possible sunset location using api.weather.gov

const screen1 = document.querySelector('.button-screen');
const screen2 = document.querySelector('.loading-screen');
const screen3 = document.querySelector('.results-screen');
const button = document.querySelector('#view-button');

button.addEventListener('click', async () => {
  screen1.style.display = 'none';
  screen2.style.display = 'block';

  const lat = 43.0879869;
  const lon = -87.8922292;
  const url = `https://vmb9debil6.execute-api.us-east-2.amazonaws.com/sunset-app-staging/get-location?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    screen2.style.display = 'none';
    screen3.style.display = 'block';

    const resultsContainer = screen3.querySelector('.results-container');
    resultsContainer.innerHTML = `
      <h2>Sunset Location</h2>
      <p>Latitude: ${data.latitude}</p>
      <p>Longitude: ${data.longitude}</p>
      <p>Sunset Time: ${data.sunsetTime}</p>
    `;
  } catch (error) {
    console.error('Error fetching sunset location:', error);
    screen2.style.display = 'none';
    screen1.style.display = 'block';
    alert('Failed to fetch sunset location. Please try again.');
  }
});