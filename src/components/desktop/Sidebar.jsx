import { useNavigate, useLocation } from 'react-router-dom';
import { Search, LayoutDashboard, Users, AlertTriangle, FileText } from 'lucide-react';
import CompassLogo from '../CompassLogo';
import { useAuthStore } from '../../store/authStore';

const ROLE_LABEL = { coach: 'Treinador', athlete: 'Atleta' };

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const userName = user?.name || 'Usuário';
  const userRole = ROLE_LABEL[user?.role] || user?.role || '';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Atletas', icon: Users, path: '/atletas' },
    { label: 'Triagem de Risco', icon: AlertTriangle, path: '/triagem-de-risco', alert: '3' },
    { label: 'Relatórios', icon: FileText, path: '/relatorios' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#B91C1C] text-white flex flex-col flex-shrink-0 h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-full">
          <CompassLogo size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Nutri-Esportiva</h1>
          <p className="text-white/70 text-xs">Painel Web</p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-[#991B1B] rounded-lg flex items-center px-3 py-2.5">
          <Search className="w-4 h-4 text-white/60" />
          <input 
            type="text" 
            placeholder="Buscar atleta..." 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/60 ml-2 text-sm w-full" 
          />
        </div>
      </div>

      <p className="px-4 mb-2 text-[10px] font-bold text-white/50 tracking-wider">MENU</p>

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative overflow-hidden ${
              isActive(item.path)
                ? 'bg-[#991B1B] text-white'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {isActive(item.path) && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r" />
            )}
            <div className={`flex items-center gap-3 ${isActive(item.path) ? 'ml-1' : ''}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>
            {item.alert && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.alert}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#991B1B] rounded-xl p-3 flex items-center gap-3">
          <div className="bg-[#D01F25] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{initials}</div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{userName}</p>
            <p className="text-white/60 text-xs capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
