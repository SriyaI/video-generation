interface GeoLocation {
  lat: number;
  lon: number;
}

interface WeatherEntry {
  dt: number; // UNIX timestamp (seconds)
  main: { temp: number };
  weather: { main: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Delhi,IN";
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "API_KEY environment variable not set" }),
      { status: 500 },
    );
  }
  // 1️⃣ Get geo coordinates (try plain city, then with ",IN" if empty)
  let geoResp = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
  );
  let geoData: GeoLocation[] = await geoResp.json();

  if (!geoData.length) {
    geoResp = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${API_KEY}`,
    );
    geoData = await geoResp.json();
  }

  if (!geoData.length) {
    return new Response(JSON.stringify({ error: "City not found" }), {
      status: 404,
    });
  }

  const { lat, lon } = geoData[0];

  // 2️⃣ Get 5-day forecast (3-hour intervals)
  const forecastResp = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );
  const forecastData: { list: WeatherEntry[] } = await forecastResp.json();

  if (!forecastData.list || !forecastData.list.length) {
    return new Response(JSON.stringify({ error: "No forecast data found" }), {
      status: 500,
    });
  }

  // 3️⃣ Pick the entry closest to 12:00 each day
  const dailyMap: Record<string, WeatherEntry> = {};
  forecastData.list.forEach((entry) => {
    const dateStr = new Date(entry.dt * 1000).toLocaleDateString();
    const hour = new Date(entry.dt * 1000).getHours();

    if (
      !dailyMap[dateStr] ||
      Math.abs(hour - 12) <
        Math.abs(new Date(dailyMap[dateStr].dt * 1000).getHours() - 12)
    ) {
      dailyMap[dateStr] = entry;
    }
  });

  const dailyForecast = Object.entries(dailyMap).map(([date, entry]) => ({
    date,
    temp: entry.main.temp.toFixed(1),
    condition: entry.weather[0]?.main || "Unknown",
  }));

  return new Response(JSON.stringify(dailyForecast), {
    headers: { "Content-Type": "application/json" },
  });
}
