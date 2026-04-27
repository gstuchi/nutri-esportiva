import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './screens/Splash'
import Dashboard from './screens/Dashboard'
import PreSessao from './screens/PreSessao'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pre-sessao" element={<PreSessao />} />
      </Routes>
    </BrowserRouter>
  )
}
