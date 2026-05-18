import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplet, AlertTriangle, CupSoda, Milk, GlassWater } from 'lucide-react'
import { useSessionStore } from '../../store/sessionStore'

export default function DuranteSessao() {
  const navigate = useNavigate()
  const { currentSession, updateDuring, isLoading } = useSessionStore()
  const [segundos, setSegundos] = useState(0)
  const [ingestaoTotal, setIngestaoTotal] = useState(0)
  const [rpe, setRpe] = useState(5)
  const [fluidType, setFluidType] = useState('water')

  const handleEndSession = async () => {
    try {
      if (currentSession?.id) {
        await updateDuring(currentSession.id, {
          water_ingested_ml: ingestaoTotal,
          fluid_type: fluidType,
          perceived_exertion_rpe: rpe
        });
      }
      navigate('/pos-sessao');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar dados da sessão');
    }
  }

  // Timer simulado
  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatarTempo = (totalSegundos) => {
    const horas = Math.floor(totalSegundos / 3600)
    const minutos = Math.floor((totalSegundos % 3600) / 60)
    const segs = totalSegundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const adicionarFluido = (ml) => {
    setIngestaoTotal((prev) => prev + ml)
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-6 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Durante a Sessão</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">Sessão em andamento</p>
        </div>
        
        <div className="mt-6 mx-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-white rounded-full transition-all duration-1000" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Card: Timer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col items-center justify-center">
          <span className="text-[var(--color-primary-dark)] font-black text-5xl tracking-tighter font-mono">
            {formatarTempo(segundos)}
          </span>
          <p className="text-gray-400 text-xs mt-2 font-medium">Corrida · Início 09:14</p>
        </div>

        {/* Card: Fluidos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Registrar Ingestão de Fluidos
            </h2>
            <p className="text-gray-400 text-xs mt-1">Toque no volume correspondente</p>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Gole', ml: 50, icon: <Droplet className="w-6 h-6 text-blue-400 mb-1" /> },
              { label: 'Copo', ml: 200, icon: <GlassWater className="w-6 h-6 text-blue-400 mb-1" /> },
              { label: 'Garrafa', ml: 500, icon: <CupSoda className="w-6 h-6 text-blue-400 mb-1" /> },
              { label: 'Squeeze', ml: 750, icon: <Milk className="w-6 h-6 text-blue-400 mb-1" /> },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => adicionarFluido(item.ml)}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
              >
                {item.icon}
                <span className="text-gray-600 text-xs font-semibold">{item.label}</span>
                <span className="text-gray-400 text-[10px] font-medium">{item.ml}mL</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 text-sm font-semibold">Total ingerido até agora:</span>
            <span className="text-[var(--color-primary)] font-black text-xl">{ingestaoTotal} mL</span>
          </div>
        </div>

        {/* Card: Tipo de Bebida */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold">Tipo de Bebida Consumida</h2>
            <p className="text-gray-400 text-xs mt-1">Selecione o tipo de líquido que está ingerindo</p>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'water', label: 'Água' },
              { id: 'isotonic', label: 'Isotônico' },
              { id: 'hypertonic', label: 'Hipertônico' },
              { id: 'other', label: 'Outro' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFluidType(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  fluidType === f.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card: Percepção de Esforço (Escala de Borg) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold">Percepção de Esforço (Borg)</h2>
            <p className="text-gray-400 text-xs mt-1">Como você classifica o esforço do treino até agora? ({rpe}/10)</p>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={rpe}
            onChange={(e) => setRpe(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-2">
            <span>0 - Repouso</span>
            <span>5 - Moderado</span>
            <span>8 - Intenso</span>
            <span>10 - Limite</span>
          </div>
        </div>

        {/* Lembrete */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800 text-sm font-semibold">Beba 200 mL nos próximos 8 min</span>
        </div>

      </div>

      {/* Footer / Botão de Ação */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 pb-8">
        <button 
          className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleEndSession}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Encerrar Sessão'}
        </button>
      </div>
    </div>
  )
}
