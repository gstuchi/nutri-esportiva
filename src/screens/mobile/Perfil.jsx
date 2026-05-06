import { useState } from 'react'
import { User, Cake, Scale, Ruler, Trophy, ChevronRight, Check, X } from 'lucide-react'

const modalidades = ['Corrida de Rua', 'Ciclismo', 'Futebol', 'Natação', 'Triathlon', 'Outro']

const camposConfig = [
  { key: 'idade',      icon: Cake,   label: 'Idade',               sufixo: 'anos', tipo: 'number'  },
  { key: 'peso',       icon: Scale,  label: 'Peso Habitual',        sufixo: 'kg',   tipo: 'decimal' },
  { key: 'altura',     icon: Ruler,  label: 'Altura',               sufixo: 'cm',   tipo: 'number'  },
  { key: 'modalidade', icon: Trophy, label: 'Modalidade Principal', sufixo: '',     tipo: 'select'  },
]

export default function Perfil() {
  const [dados, setDados] = useState({
    idade:      '24',
    peso:       '74.5',
    altura:     '178',
    modalidade: 'Corrida de Rua',
  })
  const [editando, setEditando]     = useState(null)
  const [temp, setTemp]             = useState('')
  const [roleAtleta, setRoleAtleta] = useState(true)

  function iniciarEdicao(key) {
    setEditando(key)
    setTemp(dados[key])
  }

  function confirmar() {
    if (temp.trim()) setDados(prev => ({ ...prev, [editando]: temp.trim() }))
    setEditando(null)
  }

  function cancelar() {
    setEditando(null)
    setTemp('')
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)] font-sans overflow-hidden">

      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-10 pb-5 px-4 rounded-b-[30px] shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">Dados do atleta</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-4 flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-red-500/30 mb-2">
          <User className="w-8 h-8 text-white" />
        </div>
        <span className="text-xs text-[var(--color-text-light)] tracking-widest font-medium">ATL-00142</span>
      </div>

      {/* Campos — ocupa o espaço restante */}
      <div className="flex-1 flex flex-col px-4 gap-2 overflow-hidden">
        {camposConfig.map((c) => {
          const Icon = c.icon
          const emEdicao = editando === c.key
          return (
            <div key={c.key} className={`bg-white rounded-2xl px-4 py-3 shadow-sm ring-1 transition-all flex-shrink-0 ${emEdicao ? 'ring-[var(--color-primary)]' : 'ring-gray-100'}`}>
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-light)] font-medium">{c.label}</p>
                  {emEdicao ? (
                    c.tipo === 'select' ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {modalidades.map((m) => (
                          <button
                            key={m}
                            onClick={() => setTemp(m)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              temp === m
                                ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-red-500/30'
                                : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/50'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="number"
                        inputMode={c.tipo === 'decimal' ? 'decimal' : 'numeric'}
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && confirmar()}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-semibold mt-1"
                      />
                    )
                  ) : (
                    <p className="text-[var(--color-primary)] font-bold text-sm">
                      {dados[c.key]}{c.sufixo ? ` ${c.sufixo}` : ''}
                    </p>
                  )}
                </div>

                {emEdicao ? (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={confirmar} className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={cancelar} className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => iniciarEdicao(c.key)} className="text-gray-300 hover:text-[var(--color-primary)] transition-colors flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Perfil de acesso */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm ring-1 ring-gray-100 flex-shrink-0">
          <p className="text-xs text-[var(--color-text-light)] font-medium mb-2">Perfil de acesso</p>
          <div className="flex gap-2">
            {['Atleta', 'Nutricionista'].map((role) => {
              const ativo = roleAtleta ? role === 'Atleta' : role === 'Nutricionista'
              return (
                <button
                  key={role}
                  onClick={() => setRoleAtleta(role === 'Atleta')}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                    ativo
                      ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-500/30'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/50'
                  }`}
                >
                  {role}
                </button>
              )
            })}
          </div>
        </div>

        {/* Botão salvar — empurrado para o fundo */}
        <div className="mt-auto pb-4 flex-shrink-0">
          <button className="w-full bg-[var(--color-primary)] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all">
            Salvar Alterações
          </button>
        </div>
      </div>

    </div>
  )
}
