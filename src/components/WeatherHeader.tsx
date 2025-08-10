export const WeatherHeader: React.FC<{ city: string }> = ({ city }) => {
  return (
    <h1
      style={{
        textAlign: "center",
        marginBottom: "50px",
        fontSize: "54px",
        fontWeight: 800,
        letterSpacing: "2px",
        color: "#fff",
        textShadow: "0 4px 15px rgba(0,0,0,0.4)",
      }}
    >
      ☀ 7-Day Weather Forecast for {city} ☀
    </h1>
  );
};
