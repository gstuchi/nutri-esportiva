import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Hash, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import BottomNav from '../../components/mobile/BottomNav';

export default function Grupo() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, success, error
  
  // Mock data for current group
  const [currentGroup, setCurrentGroup] = useState({
    name: 'Elite Runners SP',
    coach: 'Roberto Silva',
    members: 24,
    id: 'GRP-9922'
  });

  const handleJoin = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      setStatus('success');
      // TODO: integrar com API para entrar no grupo
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans pb-24">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-16 px-4 rounded-b-[40px] shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <button 
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Meus Grupos</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-8 relative z-20 space-y-6">
        
        {/* Join Group Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold text-lg flex items-center gap-2">
              <Hash className="w-5 h-5 text-[var(--color-primary)]" />
              Entrar em um Grupo
            </h2>
            <p className="text-gray-400 text-xs mt-1">Insira o código de 6 dígitos fornecido pelo seu treinador</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 882941"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={`w-full bg-gray-50 border text-center tracking-widest text-2xl font-black rounded-2xl px-4 py-4 focus:outline-none transition-all ${
                  status === 'error' ? 'border-red-500 ring-4 ring-red-50' : 
                  status === 'success' ? 'border-green-500 ring-4 ring-green-50' : 
                  'border-gray-100 focus:ring-4 focus:ring-red-50 focus:border-[var(--color-primary)]'
                }`}
              />
              
              {status === 'success' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              {status === 'error' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in shake-1">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
            </div>

            {status === 'error' && <p className="text-red-500 text-xs font-bold text-center">Código inválido. Tente novamente.</p>}
            {status === 'success' && <p className="text-green-600 text-xs font-bold text-center">Solicitação enviada com sucesso!</p>}

            <button 
              type="submit"
              disabled={code.length < 6}
              className={`w-full font-bold text-base py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                code.length === 6 
                  ? 'bg-[var(--color-primary)] text-white shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Confirmar Código
            </button>
          </form>
        </div>

        {/* Current Group Info */}
        <div className="space-y-3">
          <h2 className="text-gray-800 font-bold ml-1">Grupo Atual</h2>
          
          {currentGroup ? (
            <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-100 flex items-center gap-4 relative group">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[var(--color-primary)]">
                <Users className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-gray-800 font-bold text-lg leading-tight">{currentGroup.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5">Prof. {currentGroup.coach}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {currentGroup.members} Atletas
                  </span>
                  <span className="text-gray-300 font-medium text-[10px]">{currentGroup.id}</span>
                </div>
              </div>

              <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <Users className="w-12 h-12 text-gray-200 mb-2" />
              <p className="text-gray-400 font-medium text-sm">Você ainda não faz parte<br/>de nenhum grupo.</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs leading-relaxed font-medium">
            Ao entrar em um grupo, seu treinador terá acesso aos seus relatórios de hidratação e histórico de treinos para melhor acompanhamento.
          </p>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
