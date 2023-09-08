const express = require('express');
const cors = require('cors');
const axios = require('axios');

const path = require('path'); // Add this line to import the path module


const app = express();
const port = process.env.PORT || 4000;

// Enable CORS to allow requests from your frontend
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// Define a route to fetch weather data
app.get('/weather/:city', async (req, res) => {
  const cityName = req.params.city;
  const apiKey = '08a0b2aa3cefa4aa44d5a937755ba3d9'; // Replace with your API key

  try {
    const response = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});

// Define a route to handle the root URL ("/")
app.get('/', (req, res) => {
    res.send('Welcome to the Weather Forecast App');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
