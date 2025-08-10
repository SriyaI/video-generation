"use client";

import { AbsoluteFill } from "remotion";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherForecastList } from "./WeatherForecastList";
import { useWeatherData } from "../app/hooks/useWeatherData";

export const WeatherVideo: React.FC<{ city?: string }> = ({
  city = "Delhi",
}) => {
  const forecast = useWeatherData(city);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #6DD5FA, #2980B9)",
        padding: "50px",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <WeatherHeader city={city} />
      <WeatherForecastList forecast={forecast} />
    </AbsoluteFill>
  );
};
