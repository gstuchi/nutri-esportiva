import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Bell,
  Activity,
  BarChart2,
  FileDown,
  FileSpreadsheet,
  Medal,
  Bike,
  Trophy,
  Waves
} from 'lucide-react';

export default function Relatorio() {
  const navigate = useNavigate();

  const relatoriosDisponiveis = [
    { id: 1, nome: 'Avaliação de Hidratação — Equipe Completa', tipo: 'Equipe', periodo: '1–30 Mar', geradoEm: 'Hoje 08:00', status: 'Pronto' },
    { id: 2, nome: 'Triagem de Risco — João Silva', tipo: 'Individual', periodo: '1–30 Mar', geradoEm: 'Hoje 08:00', status: 'Pronto' },
    { id: 3, nome: 'Análise de Eletrólitos — Equipe', tipo: 'Equipe', periodo: '1–30 Mar', geradoEm: 'Ontem 18:00', status: 'Pronto' },
    { id: 4, nome: 'Perfil de Sudorese — Marcos Souza', tipo: 'Individual', periodo: 'Fev–Mar', geradoEm: 'Ontem 10:00', status: 'Pronto' },
    { id: 5, nome: 'Resumo Mensal — Fevereiro', tipo: 'Equipe', periodo: 'Fev 2026', geradoEm: '01 Mar', status: 'Pronto' },
  ];

  const modalidades = [
    { nome: 'Corrida', icon: <Activity className="w-3 h-3" />, valor: 62, cor: 'bg-[#B91C1C]', width: 'w-[80%]' },
    { nome: 'Ciclismo', icon: <Bike className="w-3 h-3" />, valor: 28, cor: 'bg-emerald-500', width: 'w-[40%]' },
    { nome: 'Futebol', icon: <Trophy className="w-3 h-3" />, valor: 18, cor: 'bg-amber-500', width: 'w-[25%]' },
    { nome: 'Natação', icon: <Waves className="w-3 h-3" />, valor: 12, cor: 'bg-purple-500', width: 'w-[15%]' },
    { nome: 'Triathlon', icon: <Medal className="w-3 h-3" />, valor: 8, cor: 'bg-gray-500', width: 'w-[10%]' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#B91C1C] text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-full">
            <Activity className="w-6 h-6 text-[#B91C1C]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Nutri-Esportiva</h1>
            <p className="text-white/70 text-xs">Painel Web</p>
          </div>
        </div>

        {/* Search */}
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

        {/* Menu */}
        <div className="px-4 mb-3 text-[10px] font-bold text-white/50 tracking-wider">
          MENU
        </div>
        
        <nav className="flex-1 px-2 space-y-1">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
            <Users className="w-5 h-5" /> Atletas
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
            <Calendar className="w-5 h-5" /> Sessões
          </button>
          <button onClick={() => navigate('/triagem-de-risco')} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm font-medium">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" /> Triagem de Risco
            </div>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#991B1B] text-white transition-colors text-sm font-medium relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
            <div className="flex items-center gap-3 ml-1">
              <FileText className="w-5 h-5" /> Relatórios
            </div>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div className="bg-[#991B1B] rounded-xl p-3 flex items-center gap-3">
            <div className="bg-[#D01F25] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner border border-red-400/20">
              MR
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate text-white">Dra. Marina R.</p>
              <p className="text-white/60 text-xs truncate">Nutricionista</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="p-1.5 rounded-lg text-gray-500">
               <BarChart2 className="w-7 h-7" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-800 leading-tight">Relatórios</h1>
               <p className="text-sm text-gray-500 mt-0.5">Gere e exporte relatórios da equipe</p>
             </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-[#B91C1C] text-white rounded-full flex items-center justify-center font-bold text-sm">
              AL
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] w-full space-y-6">
          
          {/* Filters Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 px-2">
              <span className="text-sm font-semibold text-gray-500">Período:</span>
              <div className="flex bg-gray-100/80 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors rounded-lg">7 dias</button>
                <button className="px-4 py-1.5 text-sm font-bold text-white bg-[#B91C1C] rounded-lg shadow-sm">30 dias</button>
                <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors rounded-lg">3 meses</button>
                <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors rounded-lg">Personalizado</button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(185,28,28,0.3)]">
                <FileDown className="w-4 h-4" /> PDF
              </button>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.3)]">
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-[#B91C1C]">
              <div className="text-sm text-gray-500 font-bold mb-1">Taxa Média</div>
              <div className="text-4xl font-bold text-[#B91C1C]">0.98 L/h</div>
              <div className="text-xs text-gray-400 font-medium mt-2">+0.05 vs mês ant.</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-[#B91C1C]">
              <div className="text-sm text-gray-500 font-bold mb-1">Atletas em Risco</div>
              <div className="text-4xl font-bold text-[#B91C1C]">3 atletas</div>
              <div className="text-xs text-gray-400 font-medium mt-2">2 críticos, 1 atenção</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-emerald-500">
              <div className="text-sm text-gray-500 font-bold mb-1">Sessões Registradas</div>
              <div className="text-4xl font-bold text-emerald-500">142</div>
              <div className="text-xs text-gray-400 font-medium mt-2">+18 vs mês ant.</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Line Chart Panel */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <BarChart2 className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-sm text-gray-700">Evolução da Taxa Média</h3>
              </div>
              
              <div className="h-48 w-full flex items-end justify-center px-4">
                {/* Mocked SVG Line Chart */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <path 
                    d="M 0,80 Q 50,75 100,80 T 200,75 T 300,80 T 400,75 T 500,70" 
                    fill="none" 
                    stroke="#B91C1C" 
                    strokeWidth="2" 
                    className="drop-shadow-sm"
                  />
                  <line x1="0" y1="95" x2="500" y2="95" stroke="#E5E7EB" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* Modalidades Panel */}
            <div className="col-span-1 bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100">
               <div className="flex items-center gap-2 mb-6">
                <Medal className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-gray-700">Sessões por Modalidade</h3>
              </div>
              
              <div className="space-y-4">
                {modalidades.map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 w-28">
                      <span className="text-gray-600 font-medium">{mod.nome}</span>
                      <span className="text-gray-400">{mod.icon}</span>
                    </div>
                    
                    <div className="flex-1 px-4">
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${mod.cor} rounded-full ${mod.width}`}></div>
                      </div>
                    </div>
                    
                    <div className="w-6 text-right font-bold text-gray-600 text-xs">
                      {mod.valor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mt-6">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-800">Relatórios Disponíveis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                    <th className="p-4 pl-6 font-bold">Relatório</th>
                    <th className="p-4 font-bold">Tipo</th>
                    <th className="p-4 font-bold">Período</th>
                    <th className="p-4 font-bold">Gerado em</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 pr-6 font-bold">Exportar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {relatoriosDisponiveis.map((rel) => (
                    <tr key={rel.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gray-800 text-xs">{rel.nome}</td>
                      <td className="p-4 text-xs text-gray-500">{rel.tipo}</td>
                      <td className="p-4 text-xs text-gray-500">{rel.periodo}</td>
                      <td className="p-4 text-xs text-gray-500">{rel.geradoEm}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 inline-flex items-center">
                          {rel.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2">
                           <button className="bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
                            <FileDown className="w-3 h-3" /> PDF
                          </button>
                          <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
                            <FileSpreadsheet className="w-3 h-3" /> Excel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
