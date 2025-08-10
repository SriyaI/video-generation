import { Player } from "@remotion/player";
import { WeatherVideo } from "../components/WeatherVideo";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at center, #e0f7fa, #80deea, #26c6da)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#004d40",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: 30,
          textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        Remotion Player Demo
      </h1>

      <div
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        <Player
          component={WeatherVideo}
          durationInFrames={150}
          compositionWidth={1080}
          compositionHeight={1080}
          fps={30}
          controls
          style={{ width: 600, height: 600 }}
        />
      </div>
    </div>
  );
}
