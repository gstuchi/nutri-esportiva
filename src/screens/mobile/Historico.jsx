import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Bike, Trophy, Waves, BarChart2 } from 'lucide-react'
import BottomNav from '../../components/mobile/BottomNav'

const filtros = ['7 dias', '30 dias', '3 meses', 'Tudo']

const sessoes = [
  { modalidade: 'Corrida', Icon: Activity, data: 'Hoje, 09:14', taxa: 1.04, massa: -1.2 },
  { modalidade: 'Ciclismo', Icon: Bike, data: '28 Mar, 18:30', taxa: 1.20, massa: -2.1 },
  { modalidade: 'Corrida', Icon: Activity, data: '26 Mar, 07:00', taxa: 0.85, massa: -0.8 },
  { modalidade: 'Futebol', Icon: Trophy, data: '24 Mar, 17:00', taxa: 0.95, massa: -1.0 },
  { modalidade: 'Natação', Icon: Waves, data: '22 Mar, 08:00', taxa: 0.70, massa: -0.6 },
  { modalidade: 'Corrida', Icon: Activity, data: '20 Mar, 07:15', taxa: 1.10, massa: -1.5 },
  { modalidade: 'Ciclismo', Icon: Bike, data: '18 Mar, 17:00', taxa: 0.90, massa: -1.1 },
  { modalidade: 'Futebol', Icon: Trophy, data: '16 Mar, 16:30', taxa: 1.05, massa: -1.3 },
]

const dadosGrafico = [0.90, 0.85, 1.20, 0.80, 1.04, 0.88, 0.95, 1.04]

export default function Historico() {
  const navigate = useNavigate()
  const [filtroAtivo, setFiltroAtivo] = useState('30 dias')
  const [verTudo, setVerTudo] = useState(false)

  const media = (dadosGrafico.reduce((a, b) => a + b, 0) / dadosGrafico.length).toFixed(2)
  const maximo = Math.max(...dadosGrafico).toFixed(2)
  const minimo = Math.min(...dadosGrafico).toFixed(2)
  const maxValor = Math.max(...dadosGrafico)

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-bg)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-14 pb-6 px-5 rounded-b-[30px]">
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-white/70 text-sm mt-0.5">Últimas 8 semanas</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* Filtros de período */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm ring-1 ring-gray-100 gap-1">
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroAtivo(f)}
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

        {/* Gráfico de Taxa de Sudorese */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <p className="text-xs font-semibold text-[var(--color-primary)] flex items-center gap-1">
              <BarChart2 className="w-4 h-4" /> Taxa de Sudorese (L/h)
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Últimas 8 sessões</p>
          </div>

          {/* Gráfico de barras com linhas de referência */}
          <div className="relative h-28 mb-4">
            {/* Linhas horizontais de referência */}
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

            {/* Barras */}
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

          <div className="h-[1px] bg-gray-100 mb-4" />

          {/* Estatísticas */}
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

        {/* Sessões Recentes */}
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)] mb-3">Sessões Recentes</h2>
          <div className="space-y-3">
            {(verTudo ? sessoes : sessoes.slice(0, 3)).map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl px-4 py-3.5 shadow-sm ring-1 ring-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                    {s.modalidade} <s.Icon className="w-4 h-4 text-gray-400" />
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.data}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                    {s.taxa.toFixed(2)} L/h
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] inline-block" />
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.massa.toFixed(1)}% massa</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setVerTudo((v) => !v)}
            className="w-full mt-3 py-3 text-sm font-semibold text-[var(--color-primary)] bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm active:scale-95 transition-all"
          >
            {verTudo ? 'Ver menos' : `Ver mais (${sessoes.length - 3} sessões)`}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
