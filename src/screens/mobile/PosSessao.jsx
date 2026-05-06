import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Weight, Stethoscope, Activity, ChevronRight } from 'lucide-react'

const sintomasOpcoes = ['Fadiga', 'Cãibras', 'Tontura', 'Sede intensa', 'Náusea', 'Nenhum']
const tolerancias = ['Ótima', 'Boa', 'Regular', 'Ruim']

export default function PosSessao() {
  const navigate = useNavigate()
  const [massaPos, setMassaPos] = useState('')
  const [sintomasSelecionados, setSintomasSelecionados] = useState([])
  const [toleranciaSel, setToleranciaSel] = useState('Boa')

  const toggleSintoma = (sintoma) => {
    if (sintoma === 'Nenhum') {
      setSintomasSelecionados(['Nenhum'])
      return
    }

    let novosSintomas = sintomasSelecionados.filter(s => s !== 'Nenhum')
    
    if (novosSintomas.includes(sintoma)) {
      novosSintomas = novosSintomas.filter(s => s !== sintoma)
    } else {
      novosSintomas.push(sintoma)
    }
    
    setSintomasSelecionados(novosSintomas)
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-6 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">Pós-Sessão</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">Etapa 3 de 3</p>
        </div>
        
        <div className="mt-6 mx-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#F5E84A] rounded-full shadow-[0_0_8px_#F5E84A]" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Card: Massa Corporal Pós-Exercício */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <Weight className="w-5 h-5 text-gray-400" />
              Massa Corporal Pós-Exercício
            </h2>
            <p className="text-gray-400 text-xs mt-1 ml-7">Mesmas condições da pesagem inicial</p>
          </div>
          <div className="relative ml-7">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Ex: 73.3"
              value={massaPos}
              onChange={(e) => setMassaPos(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
          </div>
        </div>

        {/* Card: Sintomas Pós-Sessão */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-gray-400" />
              Sintomas Pós-Sessão
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 ml-7">
            {sintomasOpcoes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSintoma(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  sintomasSelecionados.includes(s)
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-500/30' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200/50'
                } ${s === 'Nenhum' && sintomasSelecionados.includes('Nenhum') ? 'bg-green-600 shadow-green-500/30' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Card: Tolerância ao Plano Hídrico */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4">
            <h2 className="text-[var(--color-primary-dark)] font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              Tolerância ao Plano Hídrico
            </h2>
          </div>
          <div className="flex justify-between gap-2 ml-7">
            {tolerancias.map((t) => (
              <button
                key={t}
                onClick={() => setToleranciaSel(t)}
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                  toleranciaSel === t 
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-500/30' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer / Botão de Ação */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 pb-8">
        <button 
          className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center gap-2"
          onClick={() => navigate('/resultado-sessao')}
        >
          Calcular Taxa de Sudorese
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
