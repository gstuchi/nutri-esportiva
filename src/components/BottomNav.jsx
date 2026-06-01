import { Home, History, Plus, FileText, User, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around pb-6 pt-2 px-1 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <button 
        className={`flex flex-col items-center gap-1 flex-1 p-2 transition-colors ${location.pathname === '/dashboard' || location.pathname === '/' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/dashboard')}
      >
        <Home className="w-6 h-6" strokeWidth={location.pathname === '/dashboard' || location.pathname === '/' ? 2.5 : 2} />
        <span className="text-[9px] font-medium">Início</span>
      </button>

      <button 
        className={`flex flex-col items-center gap-1 flex-1 p-2 transition-colors ${location.pathname === '/historico' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/historico')}
      >
        <History className="w-6 h-6" strokeWidth={location.pathname === '/historico' ? 2.5 : 2} />
        <span className="text-[9px] font-medium">Histórico</span>
      </button>

      <button 
        className={`flex flex-col items-center gap-1 flex-1 p-2 transition-colors ${location.pathname === '/grupo' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/grupo')}
      >
        <Users className="w-6 h-6" strokeWidth={location.pathname === '/grupo' ? 2.5 : 2} />
        <span className="text-[9px] font-medium">Grupos</span>
      </button>

      {/* FAB Button */}
      <div className="relative -top-6 flex-1 flex justify-center">
        <button 
          className="flex items-center justify-center w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg shadow-red-500/30 transform transition-transform hover:scale-105 active:scale-95"
          onClick={() => navigate('/pre-sessao')}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <button 
        className={`flex flex-col items-center gap-1 flex-1 p-2 transition-colors ${location.pathname === '/relatorio' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/relatorio')}
      >
        <FileText className="w-6 h-6" strokeWidth={location.pathname === '/relatorio' ? 2.5 : 2} />
        <span className="text-[9px] font-medium">Relatório</span>
      </button>

      <button 
        className={`flex flex-col items-center gap-1 flex-1 p-2 transition-colors ${location.pathname === '/perfil' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
        onClick={() => navigate('/perfil')}
      >
        <User className="w-6 h-6" strokeWidth={location.pathname === '/perfil' ? 2.5 : 2} />
        <span className="text-[9px] font-medium">Perfil</span>
      </button>
    </nav>
  );
}


