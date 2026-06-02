import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Droplet, FlaskConical, Heart, Brain, Lightbulb, CheckCircle2, ClipboardList } from 'lucide-react'
import { useSessionStore } from '../../store/sessionStore'

const RISK_CONFIG = {
  low: {
    label: 'Risco Baixo',
    bg: 'bg-green-50',
    border: 'border-green-200',
    titleColor: 'text-green-800',
    descColor: 'text-green-600',
    iconColor: 'text-green-500',
  },
  moderate: {
    label: 'Risco Moderado',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    titleColor: 'text-amber-800',
    descColor: 'text-amber-600',
    iconColor: 'text-amber-500',
  },
  high: {
    label: 'Risco Alto',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    titleColor: 'text-orange-800',
    descColor: 'text-orange-600',
    iconColor: 'text-orange-500',
  },
  critical: {
    label: 'Risco Crítico',
    bg: 'bg-red-50',
    border: 'border-red-200',
    titleColor: 'text-red-800',
    descColor: 'text-red-600',
    iconColor: 'text-red-500',
  },
}

function statusBadge(status) {
  const map = {
    'OK':      { text: 'text-green-600', dot: 'bg-green-500' },
    'ATENÇÃO': { text: 'text-amber-600', dot: 'bg-amber-400' },
    'ALERTA':  { text: 'text-red-600',   dot: 'bg-red-500'   },
    'CRÍTICO': { text: 'text-red-700',   dot: 'bg-red-700'   },
  }
  return map[status] || map['OK']
}

function Card({ icon, iconBg, title, desc, note, status }) {
  const badge = statusBadge(status)
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
        <p className="text-gray-400 text-[11px] mt-0.5">{note}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`text-[11px] font-bold ${badge.text}`}>{status}</span>
        <div className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
      </div>
    </div>
  )
}

export default function TriagemRisco() {
  const navigate = useNavigate()
  const { sessionResults } = useSessionStore()

  if (!sessionResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <p className="text-gray-700 font-semibold">Nenhuma sessão encontrada.</p>
        <button
          className="text-[var(--color-primary)] font-bold underline text-sm"
          onClick={() => navigate('/dashboard')}
        >
          Voltar ao início
        </button>
      </div>
    )
  }

  const dehydrationPct  = sessionResults.dehydration_pct          ?? 0
  const riskLevel       = sessionResults.risk_level                ?? 'low'
  const electrolyteRisk = sessionResults.electrolyte_risk          ?? 'low'
  const waterIngested   = sessionResults.during?.water_ingested_ml ?? 0

  // --- Hipoidratação ---
  const hypoStatus = dehydrationPct >= 3 ? 'CRÍTICO' : dehydrationPct >= 2 ? 'ALERTA' : 'OK'
  const hypoDesc   = `Perda de massa corporal: ${dehydrationPct.toFixed(1)}%${dehydrationPct < 2 ? ' — dentro do limite' : ''}`

  // --- Sódio / Eletrólitos ---
  const sodioStatus = electrolyteRisk === 'high' ? 'ALERTA' : electrolyteRisk === 'moderate' ? 'ATENÇÃO' : 'OK'
  const sodioDesc   = electrolyteRisk === 'high'
    ? 'Sessão longa sem eletrólitos — risco de hiponatremia'
    : electrolyteRisk === 'moderate'
    ? 'Histórico de suor salgado ou cãibras detectado'
    : 'Sem indicadores de risco eletrolítico'
  const sodioNote   = electrolyteRisk !== 'low'
    ? 'Considere bebida esportiva com eletrólitos'
    : 'Reposição eletrolítica dentro do esperado'

  // --- Hiperidratação ---
  const potentialHyper = dehydrationPct === 0 && waterIngested > 1000
  const hyperStatus    = potentialHyper ? 'ATENÇÃO' : 'OK'
  const hyperDesc      = potentialHyper ? 'Ingestão elevada sem perda de peso registrada' : 'Sem sinais detectados'
  const hyperNote      = potentialHyper ? 'Monitore: náusea, inchaço ou confusão mental' : 'Ingestão dentro da faixa segura'

  // --- Hiponatremia ---
  const hyponatrStatus = electrolyteRisk === 'high' ? 'ALERTA' : electrolyteRisk === 'moderate' ? 'ATENÇÃO' : 'OK'
  const hyponatrDesc   = electrolyteRisk === 'high'
    ? 'Alto risco: treino longo com água pura'
    : electrolyteRisk === 'moderate'
    ? 'Risco moderado: histórico de cãibras'
    : 'Sem sinais detectados'
  const hyponatrNote   = electrolyteRisk === 'high'
    ? 'Sódio sérico estimado: atenção necessária'
    : 'Sódio sérico estimado: normal'

  const risk = RISK_CONFIG[riskLevel] || RISK_CONFIG.low

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans">

      {/* HEADER */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-20 px-4 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/80 text-sm font-medium mb-3 relative z-10 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Triagem de Risco</h1>
          <p className="text-white/80 text-xs mt-0.5">Avaliação automática pós-sessão</p>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 -mt-10 space-y-4 relative z-20">

        {/* Alerta principal */}
        <div className={`${risk.bg} border ${risk.border} rounded-2xl p-4 flex items-start gap-3 shadow-sm`}>
          <AlertTriangle className={`w-5 h-5 ${risk.iconColor} shrink-0 mt-0.5`} />
          <div>
            <p className={`${risk.titleColor} font-bold text-sm`}>{risk.label} detectado</p>
            <p className={`${risk.descColor} text-xs mt-0.5`}>
              Perda de massa: {dehydrationPct.toFixed(1)}% · Sessão de hoje
            </p>
          </div>
        </div>

        {/* Título da seção */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wide">Sinais Identificados</h2>
        </div>

        <Card
          icon={<Droplet className="w-5 h-5 text-blue-500" />}
          iconBg="bg-blue-50"
          title="Hipoidratação"
          desc={hypoDesc}
          note="Limite de atenção: 2% / Crítico: 3%"
          status={hypoStatus}
        />

        <Card
          icon={<FlaskConical className="w-5 h-5 text-gray-500" />}
          iconBg="bg-gray-100"
          title="Sódio"
          desc={sodioDesc}
          note={sodioNote}
          status={sodioStatus}
        />

        <Card
          icon={<Heart className="w-5 h-5 text-rose-400" />}
          iconBg="bg-rose-50"
          title="Hiperidratação"
          desc={hyperDesc}
          note={hyperNote}
          status={hyperStatus}
        />

        <Card
          icon={<Brain className="w-5 h-5 text-purple-500" />}
          iconBg="bg-purple-50"
          title="Hiponatremia"
          desc={hyponatrDesc}
          note={hyponatrNote}
          status={hyponatrStatus}
        />

        {/* Orientação de encaminhamento */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <p className="text-yellow-700 font-bold text-sm">Orientação de Encaminhamento</p>
          </div>
          <div className="space-y-2">
            {dehydrationPct >= 3 ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs font-medium">
                  Perda &gt; 3% detectada. Procure nutricionista ou médico imediatamente.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 text-xs font-medium">
                  Perda de massa dentro do limite seguro (&lt; 3%).
                </p>
              </div>
            )}
            {electrolyteRisk !== 'low' ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs font-medium">
                  Risco eletrolítico identificado. Agendar avaliação de composição corporal.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 text-xs font-medium">
                  Sem indicações de encaminhamento urgente. Continue monitorando.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-30 pb-8">
        <button
          className="w-full bg-[var(--color-primary)] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all"
          onClick={() => navigate('/eletrolitos')}
        >
          Registrar e Continuar
        </button>
      </div>

    </div>
  )
}
