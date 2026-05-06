import { Routes, Route } from 'react-router-dom';

// Import mobile and shared screens
import Splash from '../screens/mobile/Splash';
import Dashboard from '../screens/mobile/Dashboard';
import PreSessao from '../screens/mobile/PreSessao';
import DuranteSessao from '../screens/mobile/DuranteSessao';
import PosSessao from '../screens/mobile/PosSessao';
import ResultadoSessao from '../screens/mobile/ResultadoSessao';
import Relatorio from '../screens/mobile/Relatorio';
import Historico from '../screens/mobile/Historico';
import TriagemRisco from '../screens/mobile/TriagemRisco';
import Eletrolitos from '../screens/mobile/Eletrolitos';
import Perfil from '../screens/mobile/Perfil';

export default function MobileRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pre-sessao" element={<PreSessao />} />
      <Route path="/durante-sessao" element={<DuranteSessao />} />
      <Route path="/pos-sessao" element={<PosSessao />} />
      <Route path="/resultado-sessao" element={<ResultadoSessao />} />
      <Route path="/relatorios" element={<Relatorio />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/triagem-risco-mob" element={<TriagemRisco />} />
      <Route path="/eletrolitos" element={<Eletrolitos />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

