import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Droplet, FlaskConical, Heart, Brain, Lightbulb, CheckCircle2, ClipboardList } from 'lucide-react'

export default function TriagemRiscoMOB() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans">

      {/* header */}
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

      <div className="px-4 -mt-10 space-y-4 relative z-20">

        {/* alerta principal */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-bold text-sm">Risco Moderado detectado</p>
            <p className="text-amber-600 text-xs mt-0.5">Perda de massa &gt; 2% · Sessão de hoje</p>
          </div>
        </div>

        {/* título da seção */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wide">Sinais Identificados</h2>
        </div>

        {/* card hipoidratação */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm">Hipoidratação</p>
            <p className="text-gray-500 text-xs mt-0.5">Perda de massa corporal: 2,1%</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Limite de atenção: 2% / Crítico: 3%</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-red-600">ALERTA</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
        </div>

        {/* card sódio */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm">Sódio</p>
            <p className="text-gray-500 text-xs mt-0.5">Suor salgado + histórico de cãibras</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Considere bebida esportiva com eletrólitos</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-amber-600">ATENÇÃO</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
        </div>

        {/* card hiperidratação */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm">Hiperidratação</p>
            <p className="text-gray-500 text-xs mt-0.5">Sem sinais detectados</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Ingestão dentro da faixa segura</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-green-600">OK</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* card hiponatremia */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-semibold text-sm">Hiponatremia</p>
            <p className="text-gray-500 text-xs mt-0.5">Sem sinais detectados</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Sódio sérico estimado: normal</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-green-600">OK</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* orientação de encaminhamento */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <p className="text-yellow-700 font-bold text-sm">Orientação de Encaminhamento</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs font-medium">Perda &gt; 3%? Procure nutricionista ou médico imediatamente.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs font-medium">Histórico recorrente? Agendar avaliação de composição corporal.</p>
            </div>
          </div>
        </div>

      </div>

      {/* botão de ação */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-30 pb-8">
        <button
          className="w-full bg-[var(--color-primary)] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all"
          onClick={() => navigate('/dashboard')}
        >
          Registrar e Continuar
        </button>
      </div>

    </div>
  )
}
