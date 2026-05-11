import { Home, History, Plus, FileText, User, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-white/20 flex items-center justify-between px-2 py-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] pointer-events-auto">
        <button 
          className={`flex flex-col items-center gap-1 flex-1 p-2 transition-all duration-300 ${isActive('/dashboard') || isActive('/') ? 'text-[var(--color-primary)] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => navigate('/dashboard')}
        >
          <Home className="w-5 h-5" strokeWidth={isActive('/dashboard') || isActive('/') ? 2.5 : 2} />
          <span className="text-[9px] font-bold">Início</span>
        </button>

        <button 
          className={`flex flex-col items-center gap-1 flex-1 p-2 transition-all duration-300 ${isActive('/historico') ? 'text-[var(--color-primary)] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => navigate('/historico')}
        >
          <History className="w-5 h-5" strokeWidth={isActive('/historico') ? 2.5 : 2} />
          <span className="text-[9px] font-bold">Histórico</span>
        </button>

        {/* FAB Central */}
        <div className="relative -top-2 px-2">
          <button 
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(208,31,37,0.5)] transform transition-all duration-300 hover:scale-110 active:scale-90 ring-4 ring-white"
            onClick={() => navigate('/pre-sessao')}
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>

        <button 
          className={`flex flex-col items-center gap-1 flex-1 p-2 transition-all duration-300 ${isActive('/grupo') ? 'text-[var(--color-primary)] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => navigate('/grupo')}
        >
          <Users className="w-5 h-5" strokeWidth={isActive('/grupo') ? 2.5 : 2} />
          <span className="text-[9px] font-bold">Grupos</span>
        </button>

        <button 
          className={`flex flex-col items-center gap-1 flex-1 p-2 transition-all duration-300 ${isActive('/relatorio') ? 'text-[var(--color-primary)] scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => navigate('/relatorio')}
        >
          <FileText className="w-5 h-5" strokeWidth={isActive('/relatorio') ? 2.5 : 2} />
          <span className="text-[9px] font-bold">Relatório</span>
        </button>
      </nav>
    </div>
  );
}




