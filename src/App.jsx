import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './screens/Splash'
import Dashboard from './screens/Dashboard'
import PreSessao from './screens/PreSessao'
import DuranteSessao from './screens/DuranteSessao'
import PosSessao from './screens/PosSessao'
import ResultadoSessao from './screens/ResultadoSessao'
import Historico from './screens/Historico'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pre-sessao" element={<PreSessao />} />
        <Route path="/durante-sessao" element={<DuranteSessao />} />
        <Route path="/pos-sessao" element={<PosSessao />} />
        <Route path="/resultado-sessao" element={<ResultadoSessao />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </BrowserRouter>
  )
}
