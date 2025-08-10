interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface WeatherEntry {
  dt: number; // UNIX timestamp (seconds)
  main: { temp: number };
  weather: { main: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let city = searchParams.get("city") || "Delhi";
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "API_KEY environment variable not set" }),
      { status: 500 },
    );
  }

  // 1️⃣ Get geo coordinates (try city as-is)
  let geoResp = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city,
    )}&limit=1&appid=${API_KEY}`,
  );

  if (!geoResp.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch geolocation data" }),
      { status: geoResp.status },
    );
  }

  let geoData: GeoLocation[] = await geoResp.json();

  // 2️⃣ If no result and city does NOT already end with ",IN", try with ",IN"
  if (!geoData.length && !city.toLowerCase().endsWith(",in")) {
    city = city + ",IN";
    geoResp = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city,
      )}&limit=1&appid=${API_KEY}`,
    );
    if (!geoResp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch geolocation data" }),
        { status: geoResp.status },
      );
    }
    geoData = await geoResp.json();
  }

  // if (!geoData.length) {
  //   return new Response(JSON.stringify({ error: "City not found" }), {
  //     status: 404,
  //   });
  // }

  const { lat, lon } = geoData[0];

  // 3️⃣ Get 5-day forecast (3-hour intervals)
  const forecastResp = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );

  if (!forecastResp.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch forecast data" }),
      { status: forecastResp.status },
    );
  }

  const forecastData: { list: WeatherEntry[] } = await forecastResp.json();

  if (!forecastData.list || !forecastData.list.length) {
    return new Response(JSON.stringify({ error: "No forecast data found" }), {
      status: 500,
    });
  }

  // 4️⃣ Pick the entry closest to 12:00 each day
  const dailyMap: Record<string, WeatherEntry> = {};
  forecastData.list.forEach((entry) => {
    // Use UTC date string for consistency
    const date = new Date(entry.dt * 1000);
    const dateStr = date.toISOString().substring(0, 10); // YYYY-MM-DD
    const hour = date.getUTCHours();

    if (
      !dailyMap[dateStr] ||
      Math.abs(hour - 12) <
        Math.abs(new Date(dailyMap[dateStr].dt * 1000).getUTCHours() - 12)
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
