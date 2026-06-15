import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ROLE_LABEL = { coach: 'Treinador', athlete: 'Atleta' };

export default function TopBar({ title, subtitle }) {
  const { user } = useAuthStore();

  const userName = user?.name || 'Usuário';
  const userRole = ROLE_LABEL[user?.role] || user?.role || '';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-50">
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-red-50 rounded-full transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-gray-100" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{userName}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-red-500/20 ring-2 ring-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

