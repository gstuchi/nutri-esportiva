import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FileText, History, Droplet, ClipboardList, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useSessionStore } from '../../store/sessionStore'

export default function ResultadoSessao() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('id')
  const { sessionResults, fetchSessionResults, isLoading } = useSessionStore()

  useEffect(() => {
    if (sessionId) {
      fetchSessionResults(sessionId)
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-primary)] font-bold">
        Carregando resultados...
      </div>
    )
  }

  // Use fallback values if sessionResults is missing (e.g. direct access without ID)
  const sweatRate = sessionResults?.sweat_rate_ml_per_h 
    ? (sessionResults.sweat_rate_ml_per_h / 1000).toFixed(2) 
    : '0.00';
  const dehydrationPct = sessionResults?.dehydration_pct 
    ? sessionResults.dehydration_pct.toFixed(1) 
    : '0.0';
  const duration = sessionResults?.duration_minutes || 0;
  const rehydrationTarget = sessionResults?.rehydration_target_ml || 0;
  const postFluid = sessionResults?.post?.post_session_fluid_ml || sessionResults?.postSessionFluidMl || 0;
  const sport = sessionResults?.sport_modality || 'Treino';
  const formattedDate = sessionResults?.session_date 
    ? new Date(sessionResults.session_date).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : 'Sem data';

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-24 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Resultado da Sessão</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">{sport} · {formattedDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-16 space-y-6 relative z-20">

        {/* Main Card: Taxa de Sudorese */}
        <div className="bg-[var(--color-primary-dark)] text-white rounded-[24px] p-6 shadow-xl shadow-red-900/20 text-center relative overflow-hidden border border-red-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-lg" />
          
          <h2 className="text-white/80 text-sm font-semibold mb-2 relative z-10">Taxa de Sudorese</h2>
          <div className="flex items-end justify-center gap-1 mb-2 relative z-10">
            <span className="text-6xl font-black tracking-tighter">{sweatRate}</span>
            <span className="text-xl font-bold text-white/80 pb-1">L/h</span>
          </div>
          <div className="inline-block bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm relative z-10 border border-white/10">
            <p className="text-white text-xs font-medium">
              {parseFloat(sweatRate) > 1.2 ? 'Elevada' : parseFloat(sweatRate) > 0.6 ? 'Moderada' : 'Leve'} · calculada cientificamente
            </p>
          </div>
        </div>

        {/* 3 Metrics Row */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 flex justify-between divide-x divide-gray-100 text-center">
          <div className="flex-1 px-2">
            <p className="text-orange-500 font-bold text-lg">-{dehydrationPct}%</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Perda de Massa</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-[var(--color-primary)] font-bold text-lg">{postFluid} mL</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Ingestão Total</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-gray-800 font-bold text-lg">{duration} min</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Duração</p>
          </div>
        </div>

        {/* Card: Recomendações */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              Recomendações de Hidratação
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm font-medium">Beba 250–300 mL a cada 15 minutos na próxima sessão de {sport}</span>
            </li>
            {sessionResults?.risk_level === 'high' || sessionResults?.risk_level === 'critical' ? (
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <span className="text-red-600 text-sm font-bold">Risco {sessionResults?.risk_level === 'critical' ? 'Crítico' : 'Alto'}! Hidrate-se imediatamente e monitore sintomas de desidratação extrema.</span>
              </li>
            ) : null}
            {rehydrationTarget > 0 && (
              <li className="flex items-start gap-3">
                <Droplet className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm font-medium">Reidrate com {(rehydrationTarget / 1000).toFixed(2)} L de fluidos nas próximas 2 horas</span>
              </li>
            )}
            {sessionResults?.electrolyte_risk === 'high' ? (
              <li className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm font-medium">Considere bebidas esportivas isotônicas (Eletrólitos necessários para evitar hiponatremia)</span>
              </li>
            ) : null}
          </ul>
        </div>

        {/* Card: Estado Hídrico */}
        {sessionResults?.dehydration_score !== undefined && (
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-3">
              <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                Pontuação do Estado Hídrico
              </h2>
            </div>
            
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div className={`h-full w-1/3 bg-green-400 ${sessionResults?.dehydration_score < 40 ? 'opacity-30' : ''}`} />
              <div className={`h-full w-1/3 bg-yellow-400 ${sessionResults?.dehydration_score >= 40 && sessionResults?.dehydration_score < 80 ? 'opacity-100' : 'opacity-30'}`} />
              <div className={`h-full w-1/3 bg-red-500 ${sessionResults?.dehydration_score < 40 ? 'opacity-100' : 'opacity-30'}`} />
            </div>
            <p className="text-gray-700 text-xs font-semibold mt-2">
              Score: <span className="font-bold text-gray-900">{sessionResults?.dehydration_score?.toFixed(0)} / 100</span> (
              {sessionResults?.dehydration_score >= 80 ? 'Ótimo estado' : sessionResults?.dehydration_score >= 40 ? 'Desidratação leve' : 'Alerta de desidratação crítica'}
              )
            </p>
          </div>
        )}

        {/* Ações Extra */}
        <div className="flex gap-4 mb-20">
          <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FileText className="w-5 h-5 text-gray-400" />
            PDF
          </button>
          <button 
            onClick={() => navigate('/historico')}
            className="flex-1 bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <History className="w-5 h-5" />
            Histórico
          </button>
        </div>

      </div>

      {/* Footer / Botão Principal */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-30 pb-8">
        <button 
          className="w-full bg-[var(--color-primary-dark)] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-black/20 hover:bg-red-900 active:scale-95 transition-all flex items-center justify-center gap-2"
          onClick={() => navigate('/dashboard')}
        >
          Concluir
        </button>
      </div>
    </div>
  )
}
