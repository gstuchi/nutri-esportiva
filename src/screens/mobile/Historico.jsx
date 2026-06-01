import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Bike, Trophy, Waves, BarChart2, ChevronRight } from 'lucide-react'
import BottomNav from '../../components/mobile/BottomNav'
import { useSessionStore } from '../../store/sessionStore'

const filtros = ['7 dias', '30 dias', '3 meses', 'Tudo']

export default function Historico() {
  const navigate = useNavigate()
  const [filtroAtivo, setFiltroAtivo] = useState('Tudo')
  const [verTudo, setVerTudo] = useState(false)

  const { athleteHistory, fetchAthleteHistory } = useSessionStore()

  useEffect(() => {
    fetchAthleteHistory()
  }, [])

  const getIcon = (modality) => {
    switch (modality?.toLowerCase()) {
      case 'corrida': return Activity
      case 'ciclismo': return Bike
      case 'futebol': return Trophy
      case 'natação': return Waves
      default: return Activity
    }
  }

  const filtrarSessoes = (sessoes) => {
    const agora = new Date()
    return sessoes.filter((s) => {
      const dataSessao = new Date(s.session_date)
      const diffTime = Math.abs(agora.getTime() - dataSessao.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (filtroAtivo === '7 dias') return diffDays <= 7
      if (filtroAtivo === '30 dias') return diffDays <= 30
      if (filtroAtivo === '3 meses') return diffDays <= 90
      return true
    })
  }

  const sessoesFiltradas = filtrarSessoes(athleteHistory || [])

  const ultimasSessoesGrafico = [...sessoesFiltradas].reverse().slice(-8)
  const dadosGrafico = ultimasSessoesGrafico.map(s => (s.sweat_rate_ml_per_h || 0) / 1000)

  const media = dadosGrafico.length > 0 
    ? (dadosGrafico.reduce((a, b) => a + b, 0) / dadosGrafico.length).toFixed(2) 
    : '0.00'
  const maximo = dadosGrafico.length > 0 
    ? Math.max(...dadosGrafico).toFixed(2) 
    : '0.00'
  const minimo = dadosGrafico.length > 0 
    ? Math.min(...dadosGrafico).toFixed(2) 
    : '0.00'
  const maxValor = dadosGrafico.length > 0 
    ? Math.max(...dadosGrafico) 
    : 1

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-bg)]">
      {}
      <div className="bg-[var(--color-primary)] text-white pt-14 pb-6 px-5 rounded-b-[30px]">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-white/70 text-sm mt-0.5">Sua evolução de hidratação</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm ring-1 ring-gray-100 gap-1">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFiltroAtivo(f)
                setVerTudo(false)
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                filtroAtivo === f
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <p className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1">
              <BarChart2 className="w-4 h-4" /> Taxa de Sudorese (L/h)
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Últimas {dadosGrafico.length} sessões</p>
          </div>

          {}
          {dadosGrafico.length > 0 ? (
            <div className="relative h-28 mb-4">
              {}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-[1px] bg-gray-100" />
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{maximo} L/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-[1px] bg-gray-100" />
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{minimo} L/h</span>
                </div>
              </div>

              {}
              <div className="flex items-end gap-1.5 h-full pr-12">
                {dadosGrafico.map((val, i) => {
                  const altura = (val / maxValor) * 100
                  const isMax = val === maxValor
                  return (
                    <div key={i} className="flex-1 h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isMax ? 'bg-[var(--color-primary)]' : 'bg-red-200'
                        }`}
                        style={{ height: `${altura}%` }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl mb-4">
              Nenhuma sessão no período selecionado
            </div>
          )}

          <div className="h-[1px] bg-gray-100 mb-4" />

          {}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Média</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">{media} L/h</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Máx</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">{maximo} L/h</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-1">Mín</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">{minimo} L/h</p>
            </div>
          </div>
        </div>

        {}
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)] mb-3">Sessões Recentes</h2>
          {sessoesFiltradas.length > 0 ? (
            <div className="space-y-3">
              {(verTudo ? sessoesFiltradas : sessoesFiltradas.slice(0, 3)).map((s, i) => {
                const Icon = getIcon(s.sport_modality)
                const dataFormatada = new Date(s.session_date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                const taxaLitros = (s.sweat_rate_ml_per_h || 0) / 1000
                const perdaPesoPct = s.dehydration_pct || 0

                return (
                  <div
                    key={s.id || i}
                    onClick={() => navigate(`/resultado-sessao?id=${s.id}`)}
                    className="bg-white rounded-2xl px-4 py-3.5 shadow-sm ring-1 ring-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-98 transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                        {s.sport_modality} <Icon className="w-4 h-4 text-gray-400" />
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{dataFormatada}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-1.5 justify-end">
                          {taxaLitros.toFixed(2)} L/h
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">-{perdaPesoPct.toFixed(1)}% peso</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                )
              })}

              {sessoesFiltradas.length > 3 && (
                <button
                  onClick={() => setVerTudo((v) => !v)}
                  className="w-full mt-3 py-3 text-sm font-semibold text-[var(--color-primary)] bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm active:scale-95 transition-all"
                >
                  {verTudo ? 'Ver menos' : `Ver mais (${sessoesFiltradas.length - 3} sessões)`}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm font-medium border border-dashed border-gray-200">
              Nenhuma sessão registrada
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
