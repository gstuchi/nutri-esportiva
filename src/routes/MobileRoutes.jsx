import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

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
import LoginCadastro from '../screens/mobile/LoginCadastro';
import Grupo from '../screens/mobile/Grupo';

// Simple Route Guard
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function MobileRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Splash />} />
      <Route path="/login" element={<LoginCadastro />} />
      
      {/* Private Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pre-sessao" element={<PrivateRoute><PreSessao /></PrivateRoute>} />
      <Route path="/durante-sessao" element={<PrivateRoute><DuranteSessao /></PrivateRoute>} />
      <Route path="/pos-sessao" element={<PrivateRoute><PosSessao /></PrivateRoute>} />
      <Route path="/resultado-sessao" element={<PrivateRoute><ResultadoSessao /></PrivateRoute>} />
      <Route path="/relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
      <Route path="/historico" element={<PrivateRoute><Historico /></PrivateRoute>} />
      <Route path="/triagem-risco-mob" element={<PrivateRoute><TriagemRisco /></PrivateRoute>} />
      <Route path="/eletrolitos" element={<PrivateRoute><Eletrolitos /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/grupo" element={<PrivateRoute><Grupo /></PrivateRoute>} />
    </Routes>
  );
}



