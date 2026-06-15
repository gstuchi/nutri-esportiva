import React, { useState, useEffect } from 'react';
import { 
  BarChart2,
  FileDown,
  FileSpreadsheet,
  Medal,
  Bike,
  Trophy,
  Waves,
  Activity,
  Loader2
} from 'lucide-react';
import Sidebar from '../../components/desktop/Sidebar';
import TopBar from '../../components/desktop/TopBar';
import { api } from '../../services/api';

export default function RelatorioDesk() {
  const [allAthletes, setAllAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const resGroups = await api.get('/groups/coach');
        const compiled = [];
        const seenIds = new Set();

        for (const g of resGroups.data) {
          const resAthletes = await api.get(`/groups/${g.id}/athletes`);
          for (const a of resAthletes.data) {
            if (!seenIds.has(a.id)) {
              seenIds.add(a.id);
              compiled.push(a);
            }
          }
        }
        setAllAthletes(compiled);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - period);
  limitDate.setHours(0, 0, 0, 0);

  const allSessions = [];
  allAthletes.forEach(ath => {
    ath.recentSessions?.forEach(s => {
      if (s.calculated && new Date(s.sessionDate) >= limitDate) {
        allSessions.push({
          ...s,
          athleteName: ath.name
        });
      }
    });
  });

  const totalSessionsCount = allSessions.length;

  const totalSweatRate = allSessions.reduce((acc, s) => acc + (s.calculated?.sweatRateMlPerHour || 0), 0);
  const avgSweatRateVal = totalSessionsCount > 0 ? (totalSweatRate / totalSessionsCount / 1000) : 0;
  const avgSweatRateText = avgSweatRateVal > 0 ? `${avgSweatRateVal.toFixed(2)} L/h` : '0.00 L/h';

  const riskAthletes = allAthletes.filter(ath => {
    const latest = ath.latestSession;
    if (!latest || !latest.calculated) return false;
    if (new Date(latest.sessionDate) < limitDate) return false;
    return latest.calculated.riskLevel === 'high' || latest.calculated.riskLevel === 'critical';
  });

  const criticalCount = riskAthletes.filter(ath => ath.latestSession?.calculated?.riskLevel === 'critical').length;
  const attentionCount = riskAthletes.filter(ath => ath.latestSession?.calculated?.riskLevel === 'high').length;

  const modalityCounts = {
    Corrida: 0,
    Ciclismo: 0,
    Futebol: 0,
    Natação: 0,
  };

  allSessions.forEach(s => {
    const mod = s.sportModality || 'Corrida';
    const key = mod.charAt(0).toUpperCase() + mod.slice(1).toLowerCase();
    if (modalityCounts[key] !== undefined) {
      modalityCounts[key] += 1;
    } else {
      modalityCounts.Corrida += 1;
    }
  });

  const maxModalityCount = Math.max(...Object.values(modalityCounts), 1);

  const getIcon = (name) => {
    switch (name) {
      case 'Corrida': return <Activity className="w-3.5 h-3.5" />;
      case 'Ciclismo': return <Bike className="w-3.5 h-3.5" />;
      case 'Futebol': return <Trophy className="w-3.5 h-3.5" />;
      case 'Natação': return <Waves className="w-3.5 h-3.5" />;
      default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const colors = {
    Corrida: 'bg-[#B91C1C]',
    Ciclismo: 'bg-emerald-500',
    Futebol: 'bg-amber-500',
    Natação: 'bg-purple-500',
  };

  const modalidadesList = Object.entries(modalityCounts).map(([nome, valor]) => {
    const pct = maxModalityCount > 0 ? (valor / maxModalityCount) * 100 : 0;
    return {
      nome,
      valor,
      icon: getIcon(nome),
      cor: colors[nome] || 'bg-gray-500',
      width: `${pct}%`,
    };
  }).sort((a, b) => b.valor - a.valor);

  const generateChartPath = () => {
    // Ordenar sessões por data
    const sortedSessions = [...allSessions].sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
    if (sortedSessions.length === 0) return "M 0,95 L 500,95";
    
    const sweatRates = sortedSessions.map(s => (s.calculated?.sweatRateMlPerHour || 0) / 1000);
    const maxRate = Math.max(...sweatRates, 1.5); // Garante um visual melhor se os valores forem muito baixos
    const minRate = 0;
    
    const stepX = sortedSessions.length > 1 ? 500 / (sortedSessions.length - 1) : 250;
    
    const points = sortedSessions.map((s, i) => {
      const rate = (s.calculated?.sweatRateMlPerHour || 0) / 1000;
      const x = i * stepX;
      // Mapeia Y de maxRate (altura 10) a minRate (altura 90)
      const y = 90 - ((rate - minRate) / (maxRate - minRate)) * 80;
      return `${x},${y}`;
    });

    if (points.length === 1) {
      return `M 0,${points[0].split(',')[1]} L 500,${points[0].split(',')[1]}`;
    }

    return `M ${points.join(' L ')}`;
  };

  const relatoriosDisponiveis = [
    { id: 1, nome: `Avaliação de Hidratação — ${period} dias`, tipo: 'Equipe', periodo: `${period} dias`, geradoEm: 'Hoje 08:00', status: 'Pronto' },
    { id: 2, nome: 'Triagem de Risco Clínico Completa', tipo: 'Equipe', periodo: `${period} dias`, geradoEm: 'Hoje 08:00', status: 'Pronto' },
    { id: 3, nome: 'Análise de Reposição Eletrolítica Equipe', tipo: 'Equipe', periodo: `${period} dias`, geradoEm: 'Ontem 18:00', status: 'Pronto' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <TopBar title="Relatórios" subtitle="Monitore estatísticas e exporte relatórios fisiológicos" />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            Processando estatísticas gerais da equipe...
          </div>
        ) : (
          <div className="p-8 max-w-[1400px] w-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 px-2">
                <span className="text-sm font-semibold text-gray-500">Período:</span>
                <div className="flex bg-gray-100/80 p-1 rounded-xl">
                  <button 
                    onClick={() => setPeriod(7)}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-lg ${period === 7 ? 'text-white bg-[#B91C1C] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    7 dias
                  </button>
                  <button 
                    onClick={() => setPeriod(30)}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-lg ${period === 30 ? 'text-white bg-[#B91C1C] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    30 dias
                  </button>
                  <button 
                    onClick={() => setPeriod(90)}
                    className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-lg ${period === 90 ? 'text-white bg-[#B91C1C] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    3 meses
                  </button>
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

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-[#B91C1C]">
                <div className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">Taxa Média de Sudorese</div>
                <div className="text-4xl font-extrabold text-[#B91C1C] mt-2">{avgSweatRateText}</div>
                <div className="text-xs text-gray-400 font-semibold mt-2">Média da equipe no período</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-amber-400">
                <div className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">Atletas em Risco</div>
                <div className="text-4xl font-extrabold text-amber-500 mt-2">{riskAthletes.length} atletas</div>
                <div className="text-xs text-gray-400 font-semibold mt-2">{criticalCount} críticos · {attentionCount} em atenção</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 border-t-4 border-t-emerald-500">
                <div className="text-sm text-gray-400 font-bold mb-1 uppercase tracking-wider">Sessões Registradas</div>
                <div className="text-4xl font-extrabold text-emerald-500 mt-2">{totalSessionsCount} treinos</div>
                <div className="text-xs text-gray-400 font-semibold mt-2">Sincronizados pelo app mobile</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-8">
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                  <h3 className="font-bold text-sm text-gray-700">Evolução Histórica da Taxa de Sudorese (L/h)</h3>
                </div>
                
                <div className="h-48 w-full flex items-end justify-center px-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                    <path 
                      d={generateChartPath()}
                      fill="none" 
                      stroke="#B91C1C" 
                      strokeWidth="2" 
                      className="drop-shadow-sm transition-all duration-500 ease-in-out"
                    />
                    {/* Eixo X com linha suave base */}
                    <line x1="0" y1="95" x2="500" y2="95" stroke="#E5E7EB" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              <div className="col-span-1 bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Medal className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-gray-700">Sessões por Modalidade</h3>
                </div>
                
                <div className="space-y-4">
                  {modalidadesList.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 w-28">
                        <span className="text-gray-600 font-bold text-xs">{mod.nome}</span>
                        <span className="text-gray-400">{mod.icon}</span>
                      </div>
                      
                      <div className="flex-1 px-4">
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${mod.cor} rounded-full`} style={{ width: mod.width }}></div>
                        </div>
                      </div>
                      
                      <div className="w-6 text-right font-black text-gray-600 text-xs">
                        {mod.valor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mt-6">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-800">Relatórios de Exportação Disponíveis</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                      <th className="p-4 pl-6 font-bold">Relatório</th>
                      <th className="p-4 font-bold">Tipo</th>
                      <th className="p-4 font-bold">Período de Análise</th>
                      <th className="p-4 font-bold">Gerado em</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 pr-6 font-bold">Exportar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {relatoriosDisponiveis.map((rel) => (
                      <tr key={rel.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-gray-800 text-xs">{rel.nome}</td>
                        <td className="p-4 text-xs text-gray-500 font-bold">{rel.tipo}</td>
                        <td className="p-4 text-xs text-gray-500 font-bold">{rel.periodo}</td>
                        <td className="p-4 text-xs text-gray-500 font-medium">{rel.geradoEm}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 inline-flex items-center">
                            {rel.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center gap-2">
                            <button className="bg-[#B91C1C] hover:bg-[#991B1B] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
                              <FileDown className="w-3 h-3" /> PDF
                            </button>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm">
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
        )}
      </main>
    </div>
  );
}
