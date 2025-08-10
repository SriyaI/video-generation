import { Player } from "@remotion/player";
import { WeatherVideo } from "../components/WeatherVideo";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Remotion Player Demo</h1>
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
  );
}
