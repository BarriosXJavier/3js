import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MoonlitNight from './projects/MoonlitNight'
import ParticleGalaxy from './projects/ParticleGalaxy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/moonlit-night" element={<MoonlitNight />} />
      <Route path="/particle-galaxy" element={<ParticleGalaxy />} />
    </Routes>
  )
}

export default App
