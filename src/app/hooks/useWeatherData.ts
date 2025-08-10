import { useEffect, useState } from "react";

type ForecastItem = {
  date: string;
  condition: string;
  temp: number;
};

export const useWeatherData = (city: string) => {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  useEffect(() => {
    fetch(`/api/weather?city=${city}`)
      .then((res) => res.json())
      .then((data: ForecastItem[]) => setForecast(data))
      .catch(() => setForecast([]));
  }, [city]);

  return forecast;
};
