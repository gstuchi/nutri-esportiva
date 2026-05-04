import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './screens/Splash'
import Dashboard from './screens/Dashboard'
import PreSessao from './screens/PreSessao'
import DuranteSessao from './screens/DuranteSessao'
import PosSessao from './screens/PosSessao'
import ResultadoSessao from './screens/ResultadoSessao'
import Triagem from './screens/Triagem'
import Relatorio from './screens/Relatorio'
import TriagemRiscoMOB from './screens/TriagemRiscoMOB'
import SudoreseAtletaDESK from './screens/SudoreseAtletaDESK'

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
        <Route path="/triagem-de-risco" element={<Triagem />} />
        <Route path="/relatorios" element={<Relatorio />} />
        <Route path="/triagem-risco-mob" element={<TriagemRiscoMOB />} />
        <Route path="/sudorese-atleta" element={<SudoreseAtletaDESK />} />
      </Routes>
    </BrowserRouter>
  )
}
