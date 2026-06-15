import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../screens/desktop/Login';
import DashboardDesk from '../screens/desktop/DashboardDesk';
import Atletas from '../screens/desktop/Atletas';
import Sudorese from '../screens/desktop/Sudorese';
import Triagem from '../screens/desktop/Triagem';
import RelatorioDesk from '../screens/desktop/RelatorioDesk';
import PerfilDesk from '../screens/desktop/PerfilDesk';

export default function DesktopRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardDesk />} />
      <Route path="/atletas" element={<Atletas />} />
      <Route path="/sudorese-atleta" element={<Sudorese />} />
      <Route path="/sudorese" element={<Sudorese />} />
      <Route path="/triagem-de-risco" element={<Triagem />} />
      <Route path="/relatorios" element={<RelatorioDesk />} />
      <Route path="/perfil" element={<PerfilDesk />} />
    </Routes>
  );
}
