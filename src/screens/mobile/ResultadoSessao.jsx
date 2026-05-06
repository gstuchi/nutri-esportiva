import { useNavigate } from 'react-router-dom'
import { FileText, History, Droplet, ArrowDown, ClipboardList, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export default function ResultadoSessao() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-24 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Resultado da Sessão</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">Corrida · Hoje 09:14 – 10:02</p>
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
            <span className="text-6xl font-black tracking-tighter">1.04</span>
            <span className="text-xl font-bold text-white/80 pb-1">L/h</span>
          </div>
          <div className="inline-block bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm relative z-10 border border-white/10">
            <p className="text-white text-xs font-medium">Moderada · dentro da faixa esperada</p>
          </div>
        </div>

        {/* 3 Metrics Row */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 flex justify-between divide-x divide-gray-100 text-center">
          <div className="flex-1 px-2">
            <p className="text-orange-500 font-bold text-lg">-1.2%</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Perda de Massa</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-[var(--color-primary)] font-bold text-lg">850 mL</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Ingestão Total</p>
          </div>
          <div className="flex-1 px-2">
            <p className="text-gray-800 font-bold text-lg">48 min</p>
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mt-1">Duração</p>
          </div>
        </div>

        {/* Card: Recomendações */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              Recomendações
            </h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm font-medium">Beba 250–300 mL a cada 15 minutos</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm font-medium">Perda {'>'} 2%? Monitore de perto</span>
            </li>
            <li className="flex items-start gap-3">
              <Droplet className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm font-medium">Reidrate com 1.4 L nas próximas 2h</span>
            </li>
            <li className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm font-medium">Considere bebida esportiva</span>
            </li>
          </ul>
        </div>

        {/* Card: Estado Hídrico */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-3">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Estado Hídrico Atual
            </h2>
          </div>
          
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-400 w-1/3" />
            <div className="h-full bg-[#F5E84A] w-1/3" />
            <div className="h-full bg-transparent w-1/3" />
          </div>
          <p className="text-yellow-600 text-xs font-semibold mt-2">Levemente desidratado (1.2%)</p>
        </div>

        {/* Ações Extra */}
        <div className="flex gap-4 mb-20">
          <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FileText className="w-5 h-5 text-gray-400" />
            PDF
          </button>
          <button className="flex-1 bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-500/20 hover:bg-[var(--color-primary-dark)] transition-colors">
            <History className="w-5 h-5" />
            Histórico
          </button>
        </div>

      </div>

      {/* Footer / Botão Principal */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-30 pb-8">
        <button 
          className="w-full bg-[var(--color-primary-dark)] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-black/20 hover:bg-red-900 active:scale-95 transition-all flex items-center justify-center gap-2"
          onClick={() => navigate('/triagem-risco-mob')}
        >
          Concluir
        </button>
      </div>
    </div>
  )
}
