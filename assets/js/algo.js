// Algorithm to find the best possible sunset location using api.weather.gov

const screen1 = document.querySelector('.button-screen');
const screen2 = document.querySelector('.loading-screen');
const screen3 = document.querySelector('.results-screen');
const button = document.querySelector('#view-button');

button.addEventListener('click', async () => {
  screen1.style.display = 'none';
  screen2.style.display = 'block';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (lat && lon) {
        const url = `https://vmb9debil6.execute-api.us-east-2.amazonaws.com/sunset-app-staging/get-location?lat=${lat}&lon=${lon}`;
        const placesUrl = `https://vmb9debil6.execute-api.us-east-2.amazonaws.com/sunset-app-staging/get-google-places?lat=${lat}&lon=${lon}`;

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lon })
          });
          const data = await response.json();

          const placesResponse = await fetch(placesUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lon })
          });
          const placesData = await placesResponse.json();

          screen2.style.display = 'none';
          screen3.style.display = 'block';

          const resultsContainer = screen3.querySelector('#results-content');

          var ranking;

          if (data.score < 4) {
            ranking = 'Poor';
          } else if (data.score >= 4 && data.score <= 7) {
            ranking = 'Fair';
          } else if (data.score >= 8 && data.score <= 10) {
            ranking = 'Very Good';
          } else {
            ranking = 'Unknown';
          }

          resultsContainer.innerHTML = `
            <h1>${data.name}</h1>
            <p style="font-size:350%">${data.score}</p>
            <p>Your sunset score (${ranking})</p>
            <p>Sunset Time: ${new Date(data.openWeather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Conditions: ${data.conditions}</p><br />
            <h3>Nearby Places:</h3>
            <ul>
              ${placesData.places.map(place => `<li>${place.name} - ${place.rating}</li>`).join('')}
            </ul>
            `;
        } catch (error) {
          console.error('Error fetching sunset location:', error);
          screen2.style.display = 'none';
          screen1.style.display = 'block';
          alert('Failed to fetch sunset location. Please try again.');
        }
      } else {
        alert('Latitude and Longitude are required to fetch the sunset location.');
        screen2.style.display = 'none';
        screen1.style.display = 'block';
      }
    }, error => {
      console.error('Error getting location:', error);
      alert('Failed to get your location. Please enter it manually.');
    });
  } else {
    alert('Latitude and Longitude are required to fetch the sunset location.');
    screen2.style.display = 'none';
    screen1.style.display = 'block';
  }
});