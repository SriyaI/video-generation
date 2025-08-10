type ForecastItem = {
  date: string;
  condition: string;
  temp: number;
};

const conditionIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return "☀";
    case "cloudy":
      return "☁";
    case "rain":
      return "🌧";
    case "snow":
      return "❄";
    default:
      return "🌡";
  }
};

export const WeatherForecastItem: React.FC<{
  day: ForecastItem;
  opacity: number;
}> = ({ day, opacity }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(255,255,255,0.2)",
        borderRadius: "16px",
        padding: "18px 28px",
        fontSize: "26px",
        fontWeight: 600,
        color: "#fff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
        transition: "all 0.6s ease",
      }}
    >
      <span>{day.date}</span>
      <span>
        {conditionIcon(day.condition)} {day.condition} | {day.temp}°C
      </span>
    </div>
  );
};
