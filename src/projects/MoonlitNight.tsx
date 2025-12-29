import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import MoonScene from '../components/MoonScene'

export default function MoonlitNight() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Link
        to="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg hover:bg-slate-800/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
      <MoonScene />
    </div>
  )
}
