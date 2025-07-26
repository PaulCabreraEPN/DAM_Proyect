import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Topografos from './pages/Topografos'
import Terrenos from './pages/Terrenos'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topografos" element={<Topografos />} />
        <Route path="/terrenos" element={<Terrenos />} />
      </Routes>
    </Router>
  )
}

export default App
