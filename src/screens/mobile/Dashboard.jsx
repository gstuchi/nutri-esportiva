import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, Droplets, ClipboardList, ChevronRight, User } from 'lucide-react'
import BottomNav from '../../components/mobile/BottomNav'
import { useAuthStore } from '../../store/authStore'
import { useSessionStore } from '../../store/sessionStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const userName = user?.name?.split(' ')[0] || 'Atleta'

  const { 
    athleteHistory, 
    currentSession, 
    fetchAthleteHistory, 
    fetchActiveSession 
  } = useSessionStore()

  useEffect(() => {
    fetchAthleteHistory()
    fetchActiveSession()
  }, [])

  // Cálculos dinâmicos a partir do histórico de sessões completadas
  const completedSessions = athleteHistory || []
  const totalSweatRate = completedSessions.reduce((acc, s) => acc + (s.sweat_rate_ml_per_h || 0), 0)
  const avgSweatRate = completedSessions.length > 0 ? (totalSweatRate / completedSessions.length) : 0
  const avgSweatRateText = avgSweatRate > 0 ? `${(avgSweatRate / 1000).toFixed(1)} L/h` : '0.0 L/h'

  let lastSessionText = 'Sem treinos'
  if (completedSessions.length > 0) {
    const lastSessionDate = new Date(completedSessions[0].session_date)
    const diffTime = Math.abs(new Date() - lastSessionDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    lastSessionText = diffDays === 1 ? '1 dia atrás' : `${diffDays} dias atrás`
  }

  let lastDehydrationText = '0.0%'
  if (completedSessions.length > 0) {
    const pct = completedSessions[0].dehydration_pct || 0
    lastDehydrationText = `-${pct.toFixed(1)}%`
  }

  const dynamicStats = [
    { value: avgSweatRateText, label: 'Taxa Média' },
    { value: lastSessionText, label: 'Última sessão' },
    { value: lastDehydrationText, label: 'Desidratação' },
  ]

  const hasActive = !!currentSession

  const dynamicFluxo = [
    {
      id: 1,
      title: 'Pré-Sessão',
      sub: 'Pesagem + condições ambientais',
      badge: hasActive ? 'CONCLUÍDO' : 'FAZER',
      path: hasActive ? null : '/pre-sessao',
      icon: Scale,
      active: !hasActive
    },
    {
      id: 2,
      title: 'Durante a Sessão',
      sub: 'Registro de fluidos em tempo real',
      badge: hasActive ? 'EM ANDAMENTO' : null,
      path: hasActive ? '/durante-sessao' : null,
      icon: Droplets,
      active: hasActive
    },
    {
      id: 3,
      title: 'Pós-Sessão',
      sub: 'Pesagem final + sintomas',
      badge: hasActive ? 'PENDENTE' : null,
      path: hasActive ? '/pos-sessao' : null,
      icon: Scale,
      active: hasActive
    },
    {
      id: 4,
      title: 'Relatório',
      sub: 'Taxa de sudorese + recomendações',
      badge: null,
      path: completedSessions.length > 0 ? '/relatorio' : null,
      icon: ClipboardList,
      active: completedSessions.length > 0
    },
  ]

  return (
    <div className="min-h-screen pb-24 bg-[var(--color-bg)] font-sans">
      
      {/* Header curvado */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-20 px-6 rounded-b-[40px] shadow-md relative overflow-hidden">
        {/* Elemento decorativo */}
        <div className="absolute -top-24 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Botão de Perfil - Topo Direito */}
        <button 
          onClick={() => navigate('/perfil')}
          className="absolute top-10 right-6 z-20 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all active:scale-95"
        >
          <User className="w-5 h-5 text-white" />
        </button>

        <div className="relative z-10 flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">Olá, {userName}</h1>
          <span className="text-2xl animate-bounce">👋</span>
        </div>
        <p className="text-white/90 text-sm font-medium">
          {hasActive ? 'Você tem uma sessão em andamento!' : 'Pronto para registrar a sessão de hoje?'}
        </p>
      </div>

      {/* Stats Card flutuante */}
      <div className="px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 flex justify-between items-center ring-1 ring-gray-100 backdrop-blur-xl">
          {dynamicStats.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center flex-1 ${i !== dynamicStats.length - 1 ? 'border-r border-gray-100' : ''}`}>
              <span className="text-gray-800 font-bold text-base">{s.value}</span>
              <span className="text-gray-400 text-[10px] mt-0.5 font-semibold uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session flow */}
      <div className="px-6 mt-8">
        <h2 className="text-gray-800 font-bold text-lg mb-4">Fluxo da Sessão</h2>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
          {dynamicFluxo.map((item, i) => (
            <div key={item.id} className="relative">
              <button
                className={`w-full text-left p-4 flex items-center gap-4 transition-colors ${item.active ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.active}
              >
                <div className={`p-3 rounded-full ${item.active ? 'bg-red-50 text-[var(--color-primary)]' : 'bg-gray-50 text-gray-400'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${item.active ? 'text-gray-800' : 'text-gray-500'}`}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badge === 'CONCLUÍDO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-[var(--color-primary)]'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-0.5 block">{item.sub}</span>
                </div>

                <div className="text-gray-300">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
              {i < dynamicFluxo.length - 1 && <div className="h-[1px] bg-gray-100 ml-16" />}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
