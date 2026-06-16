import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Activity, AlertTriangle,
  Droplets, ChevronRight,
  TrendingUp, BarChart2, ShieldCheck,
  Calendar, CheckCircle
} from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'
import { useGroupStore } from '../../store/groupStore'

const modalCores = {
  Corrida:  '#D01F25',
  Ciclismo: '#F5A623',
  Futebol:  '#4A90D9',
  Natação:  '#7ED321',
}

const tabelaColunas = ['Atleta', 'Modalidade', 'Duração', 'Taxa', 'Perda', 'Risco']

export default function Dashboard() {
  const navigate = useNavigate()
  const { groups, currentGroupAthletes, fetchCoachGroups, fetchGroupAthletes, isLoading } = useGroupStore()
  const [selectedGroupId, setSelectedGroupId] = useState('')

  useEffect(() => {
    fetchCoachGroups()
  }, [])

  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id)
      fetchGroupAthletes(groups[0].id)
    }
  }, [groups, selectedGroupId])

  const totalAthletes = currentGroupAthletes.length

  const athletesWithSessions = currentGroupAthletes.filter(a => a.latestSession?.calculated)
  const totalSweatRate = athletesWithSessions.reduce((acc, a) => acc + (a.latestSession.calculated.sweatRateMlPerHour || 0), 0)
  const avgSweatRate = athletesWithSessions.length > 0 ? (totalSweatRate / athletesWithSessions.length) : 0
  const avgSweatRateText = avgSweatRate > 0 ? `${(avgSweatRate / 1000).toFixed(2)} L/h` : '0.00 L/h'

  const riskAthletes = currentGroupAthletes.filter(a => {
    const risk = a.latestSession?.calculated?.riskLevel
    return risk === 'high' || risk === 'critical'
  })
  const riskCount = riskAthletes.length

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  let weeklySessionsCount = 0
  currentGroupAthletes.forEach(a => {
    a.recentSessions?.forEach(s => {
      if (new Date(s.sessionDate) >= oneWeekAgo) {
        weeklySessionsCount++
      }
    })
  })

  const modalityTotals = {
    Corrida: { total: 0, count: 0 },
    Ciclismo: { total: 0, count: 0 },
    Futebol: { total: 0, count: 0 },
    Natação: { total: 0, count: 0 },
  }

  currentGroupAthletes.forEach(a => {
    a.recentSessions?.forEach(s => {
      if (s.calculated) {
        const modality = s.sportModality || 'Corrida'
        const key = modality.charAt(0).toUpperCase() + modality.slice(1).toLowerCase()
        if (modalityTotals[key] !== undefined) {
          modalityTotals[key].total += s.calculated.sweatRateMlPerHour || 0
          modalityTotals[key].count += 1
        }
      }
    })
  })

  const modalityAverages = {}
  Object.keys(modalityTotals).forEach(key => {
    const item = modalityTotals[key]
    modalityAverages[key] = item.count > 0 ? (item.total / item.count / 1000) : 0
  })

  const maxModalityValue = Math.max(...Object.values(modalityAverages), 1)

  const allRecentSessions = []
  currentGroupAthletes.forEach(a => {
    a.recentSessions?.forEach(s => {
      allRecentSessions.push({
        athleteName: a.name,
        sportModality: s.sportModality,
        durationMinutes: (s.calculated?.durationMinutes !== undefined && s.calculated?.durationMinutes !== null) ? s.calculated.durationMinutes : null,
        sweatRate: s.calculated?.sweatRateMlPerHour ? (s.calculated.sweatRateMlPerHour / 1000).toFixed(2) + ' L/h' : 'N/A',
        dehydrationPct: s.calculated?.dehydrationPct ? `-${s.calculated.dehydrationPct.toFixed(1)}%` : 'N/A',
        riskLevel: s.calculated?.riskLevel || 'low',
        date: new Date(s.sessionDate),
      })
    })
  })

  allRecentSessions.sort((a, b) => b.date.getTime() - a.date.getTime())
  const displayedSessions = allRecentSessions.slice(0, 5)

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId)
    fetchGroupAthletes(groupId)
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Dashboard" subtitle="Painel Web de Monitoramento de Hidratação" />

        {}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Selecione o Grupo de Atletas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Analise e gerencie a hidratação por equipes</p>
            </div>
            {groups.length > 0 ? (
              <select
                value={selectedGroupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer min-w-[200px]"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                Nenhum grupo cadastrado
              </span>
            )}
          </div>

          {}
          <div className="grid grid-cols-4 gap-4">
            {}
            <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[var(--color-text-light)] font-bold uppercase tracking-wider">Atletas no Grupo</p>
                <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
              </div>
              <p className="text-3xl font-extrabold text-gray-800 mb-1">{totalAthletes}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold uppercase">
                <CheckCircle className="w-3 h-3 text-green-500" /> Integrados com sucesso
              </p>
            </div>

            {}
            <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[var(--color-text-light)] font-bold uppercase tracking-wider">Taxa Média de Sudorese</p>
                <Droplets className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </div>
              <p className="text-3xl font-extrabold text-gray-800 mb-1">{avgSweatRateText}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold uppercase">
                <TrendingUp className="w-3 h-3 text-blue-500" /> Média geral da equipe
              </p>
            </div>

            {}
            <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[var(--color-text-light)] font-bold uppercase tracking-wider">Atletas em Risco</p>
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${riskCount > 0 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`} />
              </div>
              <p className={`text-3xl font-extrabold mb-1 ${riskCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>{riskCount}</p>
              <p className={`text-[10px] font-bold uppercase flex items-center gap-1 ${riskCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {riskCount > 0 ? 'Necessita intervenção imediata' : 'Todos os atletas em nível seguro'}
              </p>
            </div>

            {}
            <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[var(--color-text-light)] font-bold uppercase tracking-wider">Sessões Recentes (7d)</p>
                <Activity className="w-5 h-5 text-purple-400 flex-shrink-0" />
              </div>
              <p className="text-3xl font-extrabold text-gray-800 mb-1">{weeklySessionsCount}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold uppercase">
                <Calendar className="w-3 h-3 text-purple-500" /> Registro de treinos ativos
              </p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-3 gap-4">

            {}
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                    Taxa Média de Sudorese por Modalidade
                  </h2>
                  <p className="text-xs text-[var(--color-text-light)]">Valores expressos em Litros por Hora (L/h)</p>
                </div>
                <div className="flex items-center gap-3">
                  {Object.entries(modalCores).map(([key, cor]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cor }} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {}
              {Object.values(modalityAverages).some(val => val > 0) ? (
                <div className="h-44 flex items-end gap-6 px-6 pt-4 border-b border-gray-100">
                  {Object.entries(modalityAverages).map(([modalidade, mediaVal]) => {
                    const cor = modalCores[modalidade]
                    const porcentagem = (mediaVal / maxModalityValue) * 100
                    return (
                      <div key={modalidade} className="flex-1 flex flex-col items-center group relative h-full justify-end pb-1">
                        {}
                        <div className="absolute -top-4 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                          {mediaVal.toFixed(2)} L/h
                        </div>
                        {}
                        <div 
                          className="w-12 rounded-t-lg transition-all duration-500 hover:brightness-95 cursor-pointer shadow-sm"
                          style={{ height: `${porcentagem}%`, background: cor }}
                        />
                        <span className="text-[10px] font-bold text-gray-500 mt-2">{modalidade}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-400">Nenhum dado de taxa de sudorese disponível neste grupo</p>
                </div>
              )}
            </div>

            {}
            <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Atenção / Risco
                </h2>
                <button onClick={() => navigate('/atletas')} className="text-xs text-[var(--color-primary)] font-bold">Ver todos</button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[160px] space-y-2 pr-1">
                {riskAthletes.length > 0 ? (
                  riskAthletes.map(a => (
                    <div key={a.id} className="flex items-center justify-between bg-red-50/50 p-2.5 rounded-xl border border-red-100/50">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{a.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{a.latestSession.sportModality}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded bg-red-500 text-white">
                          {a.latestSession.calculated.riskLevel === 'critical' ? 'Crítico' : 'Alto'}
                        </span>
                        <p className="text-[10px] font-bold text-red-600 mt-1">-{a.latestSession.calculated.dehydrationPct.toFixed(1)}% peso</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6">
                    <ShieldCheck className="w-10 h-10 text-green-500 mb-2" />
                    <p className="text-xs font-bold text-green-600">Equipe Segura</p>
                    <p className="text-[10px] text-gray-400 max-w-[200px] mt-0.5">Nenhum atleta apresenta desidratação crítica.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-3 gap-4">

            {}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Sessões Recentes da Equipe
                </h2>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      {tabelaColunas.map(h => (
                        <th key={h} className="px-4 py-3 text-left text-gray-400 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedSessions.length > 0 ? (
                      displayedSessions.map((s, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-800">{s.athleteName}</td>
                          <td className="px-4 py-3 text-gray-500 font-semibold">{s.sportModality}</td>
                          <td className="px-4 py-3 text-gray-500 font-semibold">{s.durationMinutes !== null ? `${s.durationMinutes} min` : 'N/A'}</td>
                          <td className="px-4 py-3 text-blue-600 font-extrabold">{s.sweatRate}</td>
                          <td className="px-4 py-3 text-orange-600 font-extrabold">{s.dehydrationPct}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              s.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                              s.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                              s.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {s.riskLevel === 'critical' ? 'Crítico' :
                               s.riskLevel === 'high' ? 'Alto' :
                               s.riskLevel === 'moderate' ? 'Moderado' : 'Saudável'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-gray-300 font-medium">
                          Nenhuma sessão de treino concluída neste grupo
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 flex flex-col justify-between">
              <h2 className="text-sm font-bold text-[var(--color-text)] mb-3">Ações Rápidas do Técnico</h2>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/atletas')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-blue-600">Ver Perfil de Atletas</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </button>
                <button
                  onClick={() => navigate('/sudorese')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-green-600">Análise de Sudorese</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </button>
                <button
                  onClick={() => navigate('/triagem-de-risco')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-xs font-semibold text-purple-600">Triagem de Risco</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
