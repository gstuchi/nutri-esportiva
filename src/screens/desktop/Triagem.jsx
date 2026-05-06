import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight,
} from 'lucide-react';
import Sidebar from '../../components/desktop/Sidebar';
import TopBar from '../../components/desktop/TopBar';

export default function Triagem() {
  const navigate = useNavigate();

  const athletes = [
    { id: 1, name: 'Marcos Souza', initials: 'M', signal: 'Hipoidratação', indicator: '-2.1% massa', limit: '> 2%', severity: 'Crítico', recommendation: 'Reidratação imediata 1.5L/2h. Avaliar eletrólitos.' },
    { id: 2, name: 'Ana Ferreira', initials: 'A', signal: 'Hipoidratação', indicator: '-2.8% massa', limit: '> 2%', severity: 'Crítico', recommendation: 'Perda crítica > 2.5%. Notificar equipe médica.' },
    { id: 3, name: 'João Silva', initials: 'J', signal: 'Hipoidratação', indicator: '-1.2% massa', limit: '> 1%', severity: 'Atenção', recommendation: 'Aumentar ingestão. Monitorar próxima sessão.' },
    { id: 4, name: 'Lucas Costa', initials: 'L', signal: 'Sódio Elevado', indicator: 'Histórico cãibras', limit: 'Recorrente', severity: 'Atenção', recommendation: 'Incluir isotônico. Avaliar dieta.' },
    { id: 5, name: 'Pedro Lima', initials: 'P', signal: 'Urina Escura', indicator: 'Cor 4-5 escala', limit: '> 3', severity: 'Atenção', recommendation: 'Hidratação pré-sessão insuficiente.' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <TopBar title="Triagem de Risco" subtitle="Avaliação automática pós-sessão - Hoje" />


        <div className="p-8 max-w-[1400px] w-full space-y-6">
          
          {/* Alert Banner */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-800 font-bold text-sm">3 atletas com risco moderado ou crítico detectado hoje</h3>
              <p className="text-amber-700/80 text-xs mt-1">Verifique os alertas abaixo e tome as ações recomendadas.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-red-500">
              <div className="text-3xl font-bold text-red-500">3</div>
              <div className="text-sm text-gray-400 font-medium mt-1">Crítico</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-amber-400">
              <div className="text-3xl font-bold text-amber-400">5</div>
              <div className="text-sm text-gray-400 font-medium mt-1">Atenção</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-emerald-400">
              <div className="text-3xl font-bold text-emerald-400">16</div>
              <div className="text-sm text-gray-400 font-medium mt-1">OK</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-[#B91C1C]">
              <div className="text-3xl font-bold text-[#B91C1C]">24</div>
              <div className="text-sm text-gray-400 font-medium mt-1">Total</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden mt-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                    <th className="p-5 font-bold">Atleta</th>
                    <th className="p-5 font-bold">Sinal</th>
                    <th className="p-5 font-bold">Indicador</th>
                    <th className="p-5 font-bold">Limiar</th>
                    <th className="p-5 font-bold">Severidade</th>
                    <th className="p-5 font-bold">Recomendação</th>
                    <th className="p-5 font-bold text-right pr-8">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {athletes.map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#B91C1C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {athlete.initials}
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{athlete.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-sm text-gray-600 font-medium">{athlete.signal}</td>
                      <td className="p-5 text-sm text-gray-600">{athlete.indicator}</td>
                      <td className="p-5 text-sm text-gray-600">{athlete.limit}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center
                          ${athlete.severity === 'Crítico' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                        `}>
                          {athlete.severity}
                        </span>
                      </td>
                      <td className="p-5 text-xs text-gray-500 max-w-xs leading-relaxed">{athlete.recommendation}</td>
                      <td className="p-5 pr-5 text-right">
                        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm">
                          Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
