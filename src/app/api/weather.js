export default async function handler(req, res) {
  const { city = "Delhi" } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  // Step 1: Get lat/lon from city name
  const geoResp = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
  );
  const geoData = await geoResp.json();

  if (!geoData.length) {
    return res.status(404).json({ error: "City not found" });
  }

  const { lat, lon } = geoData[0];

  // Step 2: Get 7-day forecast
  const weatherResp = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`,
  );
  const weatherData = await weatherResp.json();

  // Step 3: Format data
  const forecast = weatherData.daily.slice(0, 7).map((day) => ({
    date: new Date(day.dt * 1000).toLocaleDateString(),
    temp: day.temp.day.toFixed(1),
    condition: day.weather[0].main,
  }));

  res.status(200).json(forecast);
}
