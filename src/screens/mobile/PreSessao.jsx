import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Info, CloudRain, Sun, Cloud, CloudSun } from 'lucide-react'

const urineColors = [
  { id: 1, color: '#FEFBD0', label: '1' },
  { id: 2, color: '#F5E84A', label: '2' },
  { id: 3, color: '#E8C832', label: '3' },
  { id: 4, color: '#D4A420', label: '4' },
  { id: 5, color: '#9B7010', label: '5' },
  { id: 6, color: '#5C3A10', label: '6' },
]

const modalidades = ['Corrida', 'Ciclismo', 'Futebol', 'Natação', 'Outro']

import { useSessionStore } from '../../store/sessionStore'

export default function PreSessao() {
  const navigate = useNavigate()
  const { startSession, isLoading } = useSessionStore()
  
  const [massa, setMassa] = useState('')
  const [urineSel, setUrineSel] = useState(null)
  const [modalidade, setModalidade] = useState('Corrida')
  const [preSessionFluidMl, setPreSessionFluidMl] = useState('')

  const handleStartSession = async () => {
    try {
      await startSession({
        sport_modality: modalidade,
        body_weight_kg: parseFloat(massa),
        urine_color: urineSel,
        temperature_celsius: 28.5,
        humidity_percent: 65,
        solar_exposure: 'full',
        pre_session_fluid_ml: preSessionFluidMl ? parseInt(preSessionFluidMl) : null,
        pre_session_urine_color: urineSel
      });
      navigate('/durante-sessao');
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar sessão');
    }
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">
      
      {}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-6 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <button 
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pré-Sessão</h1>
            <p className="text-white/80 text-xs font-medium mt-0.5">Etapa 1 de 3</p>
          </div>
        </div>
        
        <div className="mt-6 mx-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-white rounded-full" />
        </div>
      </div>

      {}
      <div className="px-4 mt-6 space-y-6">

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold flex items-center gap-2">
              Massa Corporal Pré-Exercício
            </h2>
            <p className="text-gray-400 text-xs mt-1">Após esvaziamento vesical, vestimenta mínima</p>
          </div>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Ex: 74.5"
              value={massa}
              onChange={(e) => setMassa(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold">Líquido Ingerido nas últimas 2h-4h</h2>
            <p className="text-gray-400 text-xs mt-1">Total acumulado antes do início do treino (literatura recomenda 500-700ml)</p>
          </div>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Ex: 500"
              value={preSessionFluidMl}
              onChange={(e) => setPreSessionFluidMl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">ml</span>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-gray-800 font-bold">Cor da Urina</h2>
              <p className="text-gray-400 text-xs mt-1">Selecione a tonalidade mais próxima</p>
            </div>
            <button className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 justify-between">
            {urineColors.map((u) => (
              <button
                key={u.id}
                onClick={() => setUrineSel(u.id)}
                className={`relative w-10 h-14 rounded-lg transition-all duration-200 transform ${urineSel === u.id ? 'scale-110 ring-2 ring-offset-2 ring-gray-800 shadow-md' : 'hover:scale-105 hover:shadow-sm'}`}
                style={{ backgroundColor: u.color }}
                aria-label={`Cor ${u.id}`}
              >
                {urineSel === u.id && (
                   <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">{u.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100 opacity-90">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-gray-500" />
              Condições Ambientais
            </h2>
            <p className="text-[var(--color-primary)] text-xs mt-1 font-medium bg-red-50 inline-block px-2 py-0.5 rounded-full">Sincronizado via API Local</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-xs font-semibold mb-1.5 block">Temperatura</label>
              <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-4 py-3 flex items-center justify-between cursor-not-allowed">
                <span className="text-gray-600 font-medium">28.5</span>
                <span className="text-gray-400">°C</span>
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-xs font-semibold mb-1.5 block">Umidade</label>
              <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-4 py-3 flex items-center justify-between cursor-not-allowed">
                <span className="text-gray-600 font-medium">65</span>
                <span className="text-gray-400">%</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-500 text-xs font-semibold mb-1.5 block">Exposição Solar</label>
             <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-4 py-3 flex items-center gap-2 cursor-not-allowed">
                <Sun className="w-4 h-4 text-orange-400" />
                <span className="text-gray-600 font-medium text-sm">Sol Pleno</span>
              </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-gray-800 font-bold">Modalidade</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {modalidades.map((m) => (
              <button
                key={m}
                onClick={() => setModalidade(m)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  modalidade === m 
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-500/30' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </div>

      {}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 pb-8">
        <button 
          className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleStartSession}
          disabled={isLoading || !massa || !urineSel}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar Sessão'}
        </button>
      </div>
    </div>
  )
}
