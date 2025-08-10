import { useCurrentFrame, interpolate } from "remotion";
import { WeatherForecastItem } from "./WeatherForecastItem";

type ForecastItem = {
  date: string;
  condition: string;
  temp: number;
};

export const WeatherForecastList: React.FC<{ forecast: ForecastItem[] }> = ({
  forecast,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "stretch",
      }}
    >
      {forecast.map((day, index) => {
        const start = index * 20; // Delay for each item
        const opacity = interpolate(frame, [start, start + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={index} style={{ opacity }}>
            <WeatherForecastItem day={day} opacity={opacity} />
          </div>
        );
      })}
    </div>
  );
};
