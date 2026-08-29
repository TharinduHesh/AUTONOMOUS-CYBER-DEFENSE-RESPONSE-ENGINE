import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ThreatSimulation from './pages/ThreatSimulation'
import Architecture from './pages/Architecture'
import Research from './pages/Research'
import Evaluation from './pages/Evaluation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/threat-simulation" element={<ThreatSimulation />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/research" element={<Research />} />
          <Route path="/evaluation" element={<Evaluation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
