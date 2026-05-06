import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Activity, AlertTriangle,
  Droplets, ChevronRight,
  TrendingUp,
} from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'

const stats = [
  { label: 'Atletas Ativos',         icon: Users         },
  { label: 'Taxa Médio de Sudorese', icon: Droplets      },
  { label: 'Alertas de Risco',       icon: AlertTriangle },
  { label: 'Sessões Semanais',       icon: Activity      },
]

const modalCores = {
  Corrida:  '#D01F25',
  Ciclismo: '#F5A623',
  Futebol:  '#4A90D9',
  Natação:  '#7ED321',
}

const tabelaColunas = ['Atleta', 'Modalidade', 'Duração', 'Taxa', 'Perda', 'Status']

const acoesRapidas = [
  { cor: 'text-blue-600',   label: 'Cadastrar atleta'     },
  { cor: 'text-green-600',  label: 'Relatório semanal'    },
  { cor: 'text-yellow-600', label: 'Exportar dados (CSV)' },
  { cor: 'text-purple-600', label: 'Avaliar eletrólitos'  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  return (
    <div className="flex h-screen bg-[var(--color-bg)] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Dashboard" subtitle="Painel Web" />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-[var(--color-text-light)] font-medium leading-tight">{s.label}</p>
                    <Icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>
                  <p className="text-2xl font-bold text-gray-300 mb-1">--</p>
                  <p className="text-xs flex items-center gap-1 text-gray-300">
                    <TrendingUp className="w-3 h-3" />
                    Aguardando dados
                  </p>
                </div>
              )
            })}
          </div>

          {/* Linha 2: Gráfico + Atletas em Risco */}
          <div className="grid grid-cols-3 gap-4">

            {/* Gráfico */}
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text)]">Taxa de Sudorese Média da Equipe</h2>
                  <p className="text-xs text-[var(--color-text-light)]">por modalidade</p>
                </div>
                <div className="flex items-center gap-3">
                  {Object.entries(modalCores).map(([key, cor]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: cor }} />
                      <span className="text-xs text-[var(--color-text-light)]">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-36 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-xs text-gray-300">Gráfico disponível após integração com banco de dados</p>
              </div>
            </div>

            {/* Atletas em Risco */}
            <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[var(--color-text)]">Atletas em Risco</h2>
                <button className="text-xs text-[var(--color-primary)] font-medium">Ver todos</button>
              </div>
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-xs text-gray-300 text-center px-4">Nenhum dado disponível</p>
              </div>
            </div>
          </div>

          {/* Linha 3: Sessões + Ações Rápidas */}
          <div className="grid grid-cols-3 gap-4">

            {/* Tabela de sessões */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-[var(--color-text)]">Sessões Recentes</h2>
                <button className="text-xs text-[var(--color-primary)] font-medium">Ver todos +</button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-50">
                    {tabelaColunas.map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[var(--color-text-light)] font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-300 text-xs">
                      Nenhuma sessão registrada
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Ações rápidas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-sm font-bold text-[var(--color-text)] mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                {acoesRapidas.map((a) => (
                  <button
                    key={a.label}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className={`text-xs font-semibold ${a.cor}`}>{a.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
