import { useState, useEffect, useRef } from 'react'
import { User, Cake, Scale, Ruler, Trophy, ChevronRight, Check, X, Venus, Mars, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/mobile/BottomNav'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../services/api'

const modalidades = ['Corrida de Rua', 'Ciclismo', 'Futebol', 'Natação', 'Triathlon', 'Outro']

const camposConfig = [
  { key: 'idade',      icon: Cake,   label: 'Idade',               sufixo: 'anos', tipo: 'number'  },
  { key: 'peso',       icon: Scale,  label: 'Peso Habitual',        sufixo: 'kg',   tipo: 'decimal' },
  { key: 'altura',     icon: Ruler,  label: 'Altura',               sufixo: 'm',    tipo: 'altura'  },
  { key: 'modalidade', icon: Trophy, label: 'Modalidade Principal', sufixo: '',     tipo: 'select'  },
]

function maskAltura(value) {
  const digits = value.replace(/\D/g, '').slice(0, 3)
  if (digits.length <= 1) return digits
  return digits[0] + ',' + digits.slice(1)
}

export default function Perfil() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const [dados, setDados] = useState({
    idade:      '',
    peso:       '',
    altura:     '',
    modalidade: '',
    modalidadeCustom: '',
    sexo: '',
  })
  const [editando, setEditando]     = useState(null)
  const [temp, setTemp]             = useState('')
  const [tempCustom, setTempCustom] = useState('')
  const [salvando, setSalvando]     = useState(false)
  const [mensagem, setMensagem]     = useState('')
  const [temAlteracao, setTemAlteracao] = useState(false)
  const salvandoRef = useRef(false)
  const dadosRef    = useRef(dados)

  useEffect(() => { dadosRef.current = dados }, [dados])

  useEffect(() => {
    api.get('/athletes/profile').then(res => {
      const p = res.data.profile
      // Só carrega dados se o usuário já salvou o perfil antes (sexo preenchido)
      if (!p || !p.sexo) return
      const heightM = p.heightCm ? (p.heightCm / 100).toFixed(2).replace('.', ',') : ''
      let idade = ''
      if (p.birthDate) {
        const nasc = new Date(p.birthDate)
        const hoje = new Date()
        idade = String(hoje.getUTCFullYear() - nasc.getUTCFullYear())
      }
      setDados(prev => ({
        ...prev,
        idade,
        peso:       p.weightKg ? String(p.weightKg) : '',
        altura:     heightM,
        sexo:       p.sexo,
        modalidade: p.modalidadePrincipal || '',
      }))
    }).catch(() => {})
  }, [])

  function iniciarEdicao(key) {
    setEditando(key)
    setTemp(dados[key])
    setTempCustom(dados.modalidadeCustom)
  }

  function confirmar() {
    if (editando === 'modalidade') {
      const valor = temp === 'Outro' && tempCustom.trim() ? `Outro: ${tempCustom.trim()}` : temp
      if (valor) { setDados(prev => ({ ...prev, modalidade: valor, modalidadeCustom: tempCustom.trim() })); setTemAlteracao(true) }
    } else {
      if (temp.trim()) { setDados(prev => ({ ...prev, [editando]: temp.trim() })); setTemAlteracao(true) }
    }
    setEditando(null)
  }

  function cancelar() {
    setEditando(null)
    setTemp('')
    setTempCustom('')
  }

  async function salvar() {
    if (salvandoRef.current) return
    salvandoRef.current = true
    setSalvando(true)
    setMensagem('')
    const d = dadosRef.current
    try {
      await api.patch('/athletes/profile', {
        idade:      d.idade,
        peso:       d.peso,
        altura:     d.altura,
        sexo:       d.sexo,
        modalidade: d.modalidade,
      })
      setMensagem('Perfil salvo com sucesso!')
      setTemAlteracao(false)
      setTimeout(() => navigate(-1), 1200)
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao salvar. Tente novamente.'
      setMensagem(msg)
    } finally {
      salvandoRef.current = false
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans">

      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-10 pb-5 px-4 rounded-b-[30px] shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/80 hover:text-white mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Voltar</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-white/80 text-xs font-medium mt-0.5">Dados do atleta</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-4 flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-dark)] flex items-center justify-center shadow-lg shadow-red-500/30 mb-2">
          <User className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-bold text-[var(--color-text)]">{user?.name || '—'}</p>
        <span className="text-xs text-[var(--color-text-light)] mt-0.5">{user?.email || ''}</span>
      </div>

      {/* Sexo */}
      <div className="px-4 mb-2">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs text-[var(--color-text-light)] font-medium mb-2">Sexo</p>
          <div className="flex gap-2">
            {[
              { value: 'masculino', label: 'Masculino', Icon: Mars },
              { value: 'feminino',  label: 'Feminino',  Icon: Venus },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => { setDados(prev => ({ ...prev, sexo: value })); setTemAlteracao(true) }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  dados.sexo === value
                    ? 'bg-[var(--color-primary)] text-white shadow-sm shadow-red-500/30'
                    : 'bg-gray-50 text-gray-500 ring-1 ring-gray-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
          {!dados.sexo && (
            <p className="text-xs text-gray-300 font-bold mt-2">Não informado</p>
          )}
        </div>
      </div>

      {/* Campos */}
      <div className="px-4 flex flex-col gap-2">
        {camposConfig.map((c) => {
          const Icon = c.icon
          const emEdicao = editando === c.key
          return (
            <div
              key={c.key}
              onClick={() => !emEdicao && iniciarEdicao(c.key)}
              className={`bg-white rounded-2xl px-4 py-3 shadow-sm ring-1 transition-all flex-shrink-0 ${emEdicao ? 'ring-[var(--color-primary)]' : 'ring-gray-100 active:bg-gray-50 cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-light)] font-medium">{c.label}</p>
                  {emEdicao ? (
                    c.tipo === 'select' ? (
                      <div className="flex flex-col gap-2 mt-1.5">
                        <div className="flex flex-wrap gap-1.5">
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
                        {temp === 'Outro' && (
                          <input
                            type="text"
                            placeholder="Digite a modalidade..."
                            value={tempCustom}
                            onChange={(e) => setTempCustom(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && confirmar()}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-semibold"
                          />
                        )}
                      </div>
                    ) : c.tipo === 'altura' ? (
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="ex: 1,78"
                        value={temp}
                        onChange={(e) => setTemp(maskAltura(e.target.value))}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && confirmar()}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all font-semibold mt-1"
                      />
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
                    <p className={`font-bold text-sm ${dados[c.key] ? 'text-[var(--color-primary)]' : 'text-gray-300'}`}>
                      {dados[c.key] ? `${dados[c.key]}${c.sufixo ? ` ${c.sufixo}` : ''}` : 'Não informado'}
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
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
              </div>
            </div>
          )
        })}

        {/* Feedback */}
        {mensagem && (
          <p className={`text-xs font-semibold text-center mt-2 ${mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>
            {mensagem}
          </p>
        )}

        {/* Botão salvar */}
        <div className="mt-4 pb-4">
          <button
            onClick={salvar}
            disabled={salvando || !temAlteracao}
            className="w-full bg-[var(--color-primary)] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
