import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MoonlitNight from "./projects/moonlit-night";
import ParticleGalaxy from "./projects/particle-galaxy/components/particle-galaxy";
import OceanSunset from "./projects/ocean-sunset";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/moonlit-night" element={<MoonlitNight />} />
      <Route path="/particle-galaxy/" element={<ParticleGalaxy />} />
      <Route path="/ocean-sunset/" element={<OceanSunset />} />
    </Routes>
  );
}

export default App;
