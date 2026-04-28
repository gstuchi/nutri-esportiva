import { Home, History, Plus, FileText, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Início', path: '/dashboard', icon: Home },
    { label: 'Histórico', path: '/historico', icon: History },
    { label: 'Relatório', path: '/relatorio', icon: FileText },
    { label: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-6 pt-2 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <button 
        className={`flex flex-col items-center gap-1 min-w-[64px] p-2 transition-colors ${location.pathname === '/dashboard' || location.pathname === '/' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/dashboard')}
      >
        <Home className="w-6 h-6" strokeWidth={location.pathname === '/dashboard' || location.pathname === '/' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      <button 
        className={`flex flex-col items-center gap-1 min-w-[64px] p-2 transition-colors ${location.pathname === '/historico' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/historico')}
      >
        <History className="w-6 h-6" strokeWidth={location.pathname === '/historico' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Histórico</span>
      </button>

      {/* FAB Button */}
      <div className="relative -top-6">
        <button 
          className="flex items-center justify-center w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg shadow-red-500/30 transform transition-transform hover:scale-105 active:scale-95"
          onClick={() => navigate('/pre-sessao')}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <button 
        className={`flex flex-col items-center gap-1 min-w-[64px] p-2 transition-colors ${location.pathname === '/relatorio' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/relatorio')}
      >
        <FileText className="w-6 h-6" strokeWidth={location.pathname === '/relatorio' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Relatório</span>
      </button>

      <button 
        className={`flex flex-col items-center gap-1 min-w-[64px] p-2 transition-colors ${location.pathname === '/perfil' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/perfil')}
      >
        <User className="w-6 h-6" strokeWidth={location.pathname === '/perfil' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Perfil</span>
      </button>
    </nav>
  );
}
