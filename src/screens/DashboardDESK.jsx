import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Activity, AlertTriangle,
  FileText, Droplets, Search, Download, Bell, ChevronRight,
  TrendingUp,
} from 'lucide-react'

function CompassLogo({ size = 28 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <polygon points="60,10 66,52 60,60 54,52" fill="white" />
      <polygon points="60,110 66,68 60,60 54,68" fill="white" />
      <polygon points="110,60 68,54 60,60 68,66" fill="white" />
      <polygon points="10,60 52,54 60,60 52,66" fill="white" />
      <polygon points="97,23 66,55 60,60 65,53" fill="rgba(255,255,255,0.5)" />
      <polygon points="23,97 54,65 60,60 55,67" fill="rgba(255,255,255,0.5)" />
      <polygon points="23,23 55,55 60,60 53,55" fill="rgba(255,255,255,0.5)" />
      <polygon points="97,97 65,65 60,60 67,65" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/dashboard', active: true  },
  { icon: Users,           label: 'Atletas',          path: null,         active: false },
  { icon: Activity,        label: 'Sessões',          path: null,         active: false },
  { icon: AlertTriangle,   label: 'Triagem de Risco', path: null,         active: false },
  { icon: FileText,        label: 'Relatórios',       path: null,         active: false },
  { icon: Droplets,        label: 'Eletrólitos',      path: null,         active: false },
]

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

      {/* Sidebar */}
      <aside className="w-56 bg-[#1a0a0b] flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <CompassLogo size={28} />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Nutri-Esportiva</p>
            <p className="text-white/50 text-xs">Painel Web</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
            <input
              placeholder="Buscar atleta"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-transparent text-white/80 text-xs placeholder-white/40 outline-none w-full"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            --
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Usuário</p>
            <p className="text-white/40 text-xs truncate">Perfil</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[var(--color-text)]">Dashboard</h1>
            <p className="text-xs text-[var(--color-text-light)]">Painel Web</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-[var(--color-text)] bg-white focus:outline-none">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
              --
            </div>
            <button className="flex items-center gap-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
          </div>
        </header>

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
