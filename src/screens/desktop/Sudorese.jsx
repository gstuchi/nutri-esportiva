import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, Droplets, Bike, Trophy, Waves, Users, Loader2, ArrowLeft, FlaskConical } from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'
import { api } from '../../services/api'

const SWEAT_TASTE_LABEL = { salty: 'Salgado', normal: 'Normal', not_sure: 'Não sei' }
const SWEAT_MARKS_LABEL = { always: 'Sempre', sometimes: 'Às vezes', rarely: 'Raramente' }
const CRAMP_LABEL = { never: 'Nunca', during: 'Durante o treino', after: 'Após o treino', both: 'Durante e após' }
const ELECTROLYTE_RISK_BADGE = {
  low:      'bg-green-50 text-green-700',
  moderate: 'bg-amber-50 text-amber-700',
  high:     'bg-red-100 text-red-700 font-bold',
}
const ELECTROLYTE_RISK_LABEL = { low: 'Baixo', moderate: 'Moderado', high: 'Alto' }

export default function SudoreseAtleta() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const athleteId = searchParams.get('athleteId')

  const [allAthletes, setAllAthletes] = useState([])
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadAllAthletes = async () => {
      setIsLoading(true)
      try {
        const resGroups = await api.get('/groups/coach')
        const compiledAthletes = []
        const seenIds = new Set()

        for (const g of resGroups.data) {
          const resAthletes = await api.get(`/groups/${g.id}/athletes`)
          for (const a of resAthletes.data) {
            if (!seenIds.has(a.id)) {
              seenIds.add(a.id)
              compiledAthletes.push(a)
            }
          }
        }
        setAllAthletes(compiledAthletes)

        if (athleteId) {
          const found = compiledAthletes.find(a => a.id === athleteId)
          if (found) setSelectedAthlete(found)
        } else if (compiledAthletes.length > 0) {
          setSelectedAthlete(compiledAthletes[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAllAthletes()
  }, [athleteId])

  const getIcon = (modality) => {
    switch (modality?.toLowerCase()) {
      case 'corrida': return Activity
      case 'ciclismo': return Bike
      case 'futebol': return Trophy
      case 'natação': return Waves
      default: return Activity
    }
  }

  const profile = selectedAthlete?.profile || {}
  const latestAssessment = selectedAthlete?.latestElectrolyteAssessment || null
  const age = profile.birthDate
    ? Math.floor((Date.now() - new Date(profile.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null
  const sessions = selectedAthlete?.recentSessions || []
  const completedSessions = sessions.filter(s => s.calculated)

  const totalRate = completedSessions.reduce((acc, s) => acc + (s.calculated.sweatRateMlPerHour || 0), 0)
  const avgRateVal = completedSessions.length > 0 ? (totalRate / completedSessions.length) : 0
  const avgRateText = avgRateVal > 0 ? `${(avgRateVal / 1000).toFixed(2)} L/h` : '0.00 L/h'

  const totalLoss = completedSessions.reduce((acc, s) => acc + (s.calculated.dehydrationPct || 0), 0)
  const avgLossVal = completedSessions.length > 0 ? (totalLoss / completedSessions.length) : 0
  const avgLossText = avgLossVal > 0 ? `-${avgLossVal.toFixed(1)}%` : '0.0%'

  const alertsCount = completedSessions.filter(s => s.calculated.riskLevel === 'high' || s.calculated.riskLevel === 'critical').length

  const chartSessions = [...completedSessions]
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
    .slice(-8)

  const maxChartVal = Math.max(...chartSessions.map(s => s.calculated?.sweatRateMlPerHour || 0), 1000)

  const barras = chartSessions.map((s, idx) => {
    const rate = s.calculated?.sweatRateMlPerHour ? (s.calculated.sweatRateMlPerHour / 1000) : 0
    const dateLabel = new Date(s.sessionDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    const percentHeight = maxChartVal > 0 ? ((s.calculated?.sweatRateMlPerHour || 0) / maxChartVal) * 100 : 0
    return {
      label: dateLabel,
      valor: `${rate.toFixed(2)}`,
      altura: `${Math.max(percentHeight, 6)}%`,
      destaque: idx === chartSessions.length - 1,
    }
  })

  const colors = ['bg-blue-500', 'bg-teal-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500']
  const userColor = selectedAthlete ? colors[selectedAthlete.name.charCodeAt(0) % colors.length] : 'bg-red-600'
  const inicial = selectedAthlete ? selectedAthlete.name[0] : 'JS'

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title={selectedAthlete ? selectedAthlete.name : 'Análise de Sudorese'} 
          subtitle="Histórico e evolução fisiológica do atleta" 
        />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            Carregando dados fisiológicos...
          </div>
        ) : !selectedAthlete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Users className="w-12 h-12 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700">Nenhum atleta integrado</h2>
            <p className="text-gray-400 text-sm max-w-sm">Você precisa cadastrar um grupo de atletas e convidá-los a sincronizar treinos no app mobile.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
              <button 
                onClick={() => navigate('/atletas')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para atletas
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Selecionar Atleta:</span>
                <select
                  value={selectedAthlete.id}
                  onChange={(e) => {
                    const found = allAthletes.find(a => a.id === e.target.value)
                    if (found) setSelectedAthlete(found)
                  }}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer min-w-[150px]"
                >
                  {allAthletes.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Taxa Média</p>
                <p className="text-3xl font-extrabold text-[#B91C1C]">{avgRateText}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Sessões (Sincronizadas)</p>
                <p className="text-3xl font-extrabold text-emerald-500">{completedSessions.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Desidratação Média</p>
                <p className="text-3xl font-extrabold text-amber-500">{avgLossText}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Desidratações Críticas</p>
                <p className="text-3xl font-extrabold text-blue-500">{alertsCount}</p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-56 flex-shrink-0 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <div className={`${userColor} h-16 relative transition-colors`}>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-6 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow ${userColor}`}>
                    {inicial}
                  </div>
                </div>
                <div className="pt-12 pb-6 px-5 space-y-3.5">
                  <p className="text-sm font-extrabold text-gray-800 text-center mb-1">{selectedAthlete.name}</p>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Idade</p>
                    <p className="text-sm font-bold text-gray-700">{age ? `${age} anos` : 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Peso Fisiológico</p>
                    <p className="text-sm font-bold text-gray-700">{profile.weightKg ? `${profile.weightKg} kg` : 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Altura</p>
                    <p className="text-sm font-bold text-gray-700">{profile.heightCm ? `${profile.heightCm} cm` : 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Modalidade</p>
                    <p className="text-sm font-bold text-gray-700 capitalize">{profile.modalidadePrincipal || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Contato</p>
                    <p className="text-[10px] font-bold text-gray-500 select-all truncate">{selectedAthlete.email}</p>
                  </div>

                  {/* Perfil Eletrolítico */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <FlaskConical className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-wide font-black">Perfil Eletrolítico</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold">Gosto do suor</p>
                        <p className="text-xs font-semibold text-gray-700">{SWEAT_TASTE_LABEL[profile.sweatTaste] || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold">Manchas de sal</p>
                        <p className="text-xs font-semibold text-gray-700">{SWEAT_MARKS_LABEL[profile.sweatMarks] || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold">Histórico de cãibras</p>
                        <p className="text-xs font-semibold text-gray-700">{CRAMP_LABEL[profile.crampHistory] || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Última Avaliação Eletrolítica */}
                  {latestAssessment && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-black mb-2">Última Avaliação</p>
                      {[
                        { label: 'Manchas', val: latestAssessment.sweatMarksScore, max: 2 },
                        { label: 'Cãibras', val: latestAssessment.crampScore, max: 3 },
                        { label: 'Salgado', val: latestAssessment.saltyScore, max: 2 },
                        { label: 'Conc.', val: latestAssessment.concentration, max: 2 },
                      ].map(({ label, val, max }) => (
                        <div key={label} className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] text-gray-400 w-14 shrink-0">{label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all"
                              style={{ width: `${(val / max) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{val}/{max}</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        Total: {latestAssessment.sweatMarksScore + latestAssessment.crampScore + latestAssessment.saltyScore + latestAssessment.concentration}/9
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-4 h-4 text-[#B91C1C]" />
                    <p className="font-bold text-sm text-gray-800">Histórico de Taxa de Sudorese (L/h)</p>
                  </div>
                  {barras.length > 0 ? (
                    <>
                      <div className="flex gap-1">
                        {barras.map((b, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <span className="text-[10px] font-bold text-gray-500">{b.valor}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-end gap-1.5 h-28 mt-1 border-b border-gray-100 px-2">
                        {barras.map((b, idx) => (
                          <div 
                            key={idx} 
                            className={`flex-1 rounded-t transition-all duration-300 ${b.destaque ? 'bg-[#B91C1C]' : 'bg-red-100 hover:bg-red-200'}`} 
                            style={{ height: b.altura }} 
                          />
                        ))}
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {barras.map((b, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <span className="text-[10px] font-bold text-gray-400">{b.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-xs text-gray-400">Nenhum treino concluído para gerar gráficos fisiológicos</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                  <p className="font-bold text-sm text-gray-800 px-5 py-4 border-b border-gray-100">Sessões Recentes Realizadas</p>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] uppercase tracking-wider text-gray-400">
                        <th className="px-5 py-3 font-bold">Data</th>
                        <th className="px-5 py-3 font-bold">Modalidade</th>
                        <th className="px-5 py-3 font-bold">Duração</th>
                        <th className="px-5 py-3 font-bold">Taxa</th>
                        <th className="px-5 py-3 font-bold">Perda de Peso</th>
                        <th className="px-5 py-3 font-bold">Risco Hídrico</th>
                        <th className="px-5 py-3 font-bold">Risco Eletrólitos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {completedSessions.length > 0 ? (
                        completedSessions.map((s) => {
                          const dateText = new Date(s.sessionDate).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                          const modality = s.sportModality || 'Treino'
                          const Icone = getIcon(modality)
                          const duration = s.calculated?.durationMinutes ? `${s.calculated.durationMinutes} min` : '--'
                          const sweatRate = s.calculated?.sweatRateMlPerHour ? `${(s.calculated.sweatRateMlPerHour / 1000).toFixed(2)} L/h` : '--'
                          const loss = s.calculated?.dehydrationPct ? `-${s.calculated.dehydrationPct.toFixed(1)}%` : '--'
                          
                          const risk = s.calculated?.riskLevel || 'low'
                          let badgeColor = 'bg-green-50 text-green-700'
                          let label = 'Saudável'
                          if (risk === 'critical') {
                            badgeColor = 'bg-red-100 text-red-700 font-bold'
                            label = 'Crítico'
                          } else if (risk === 'high') {
                            badgeColor = 'bg-orange-100 text-orange-700 font-bold'
                            label = 'Alto'
                          } else if (risk === 'moderate') {
                            badgeColor = 'bg-yellow-100 text-yellow-700'
                            label = 'Moderado'
                          }

                          return (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-3.5 text-xs font-semibold text-gray-700">{dateText}</td>
                              <td className="px-5 py-3.5 text-xs text-gray-700">
                                <div className="flex items-center gap-1.5">
                                  <Icone className="w-3.5 h-3.5 text-gray-400" />
                                  {modality}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-500">{duration}</td>
                              <td className="px-5 py-3.5 text-xs font-bold text-[var(--color-primary-dark)]">{sweatRate}</td>
                              <td className="px-5 py-3.5 text-xs text-gray-500 font-bold">{loss}</td>
                              <td className="px-5 py-3.5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${badgeColor}`}>
                                  {label}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                {s.calculated?.electrolyteRisk ? (
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${ELECTROLYTE_RISK_BADGE[s.calculated.electrolyteRisk] || 'bg-gray-50 text-gray-500'}`}>
                                    {ELECTROLYTE_RISK_LABEL[s.calculated.electrolyteRisk] || s.calculated.electrolyteRisk}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-5 py-8 text-center text-gray-400 text-xs font-semibold">
                            Nenhum treino concluído por este atleta
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
