import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Clock } from 'lucide-react'
import { api } from '../../services/api'

const questions = [
  {
    id: 'marcas',
    text: 'Você nota marcas de suor nas roupas após treinar?',
    options: [
      { label: 'Sim, sempre', score: 15 },
      { label: 'Às vezes',   score: 10 },
      { label: 'Raramente',  score: 5  },
      { label: 'Nunca',      score: 0  },
    ],
  },
  {
    id: 'caibras',
    text: 'Histórico de cãibras musculares durante ou após exercício?',
    options: [
      { label: 'Frequentemente',  score: 20 },
      { label: 'Ocasionalmente',  score: 10 },
      { label: 'Nunca',           score: 0  },
    ],
  },
  {
    id: 'gosto',
    text: 'Você sente gosto salgado no suor ou na pele?',
    options: [
      { label: 'Sim, muito', score: 15 },
      { label: 'Um pouco',   score: 10 },
      { label: 'Não noto',   score: 0  },
    ],
  },
]

function getRecommendation(concentration) {
  if (concentration < 40) return 'Reposição hídrica simples é suficiente para a maioria das sessões'
  if (concentration <= 60) return 'Inclua bebida isotônica (sódio 30–60 mEq/L) em sessões > 60 min'
  return 'Priorize reposição com sódio elevado. Considere avaliação especializada'
}

function getBarColor(concentration) {
  if (concentration < 40) return '#4ADE80'   // green
  if (concentration <= 60) return '#FBBF24'  // yellow
  return '#EF4444'                            // red
}

export default function Eletrolitos() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({ marcas: null, caibras: null, gosto: null })
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    api.get('/electrolytes/history').then(r => setHistory(r.data)).catch(() => {})
  }, [])

  const concentration = useMemo(() => {
    const total = Object.values(answers).reduce((sum, score) => sum + (score ?? 0), 0)
    return 20 + total
  }, [answers])

  const allAnswered = Object.values(answers).every((v) => v !== null)
  const barPercent = Math.min(100, Math.max(0, ((concentration - 20) / 60) * 100))
  const barColor = getBarColor(concentration)

  function select(questionId, score) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }))
  }

  async function handleSave() {
    if (!allAnswered) return
    setIsSaving(true)
    try {
      await api.post('/electrolytes', {
        sweatMarksScore: answers.marcas,
        crampScore:      answers.caibras,
        saltyScore:      answers.gosto,
        concentration,
      })
      setToast({ type: 'success', msg: 'Avaliação salva com sucesso!' })
      api.get('/electrolytes/history').then(r => setHistory(r.data)).catch(() => {})
      setTimeout(() => navigate('/historico'), 1500)
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', msg: 'Erro ao salvar. Tente novamente.' })
      setTimeout(() => setToast(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-bg)] font-sans relative">

      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold transition-all ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-6 px-4 rounded-b-[30px] shadow-md relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <button
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Eletrólitos</h1>
            <p className="text-white/80 text-xs font-medium mt-0.5">Estimativa de perdas</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-5">

        {/* Questionário */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-gray-800 font-bold text-base mb-1">Questionário de Suor Salgado</h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-5">
            Responda para estimar a concentração de sódio no suor.{' '}
            <span className="font-medium text-gray-500">Não substitui medidas laboratoriais.</span>
          </p>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id}>
                <p className="text-gray-700 text-sm font-semibold mb-3">
                  {idx + 1}.&nbsp; {q.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.score
                    return (
                      <button
                        key={opt.label}
                        onClick={() => select(q.id, opt.score)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          selected
                            ? 'bg-[var(--color-primary)] text-white shadow-md shadow-red-500/30'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-gray-800 font-bold text-base mb-4">Estimativa de Sódio no Suor</h2>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Concentração estimada:</span>
            <span className="text-base font-bold" style={{ color: barColor }}>
              ~{concentration} mEq/L
            </span>
          </div>

          {/* Bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${barPercent}%`, backgroundColor: barColor }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>Baixo (&lt; 40)</span>
            <span>Alto (&gt; 80)</span>
          </div>

          {/* Recommendation */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <p className="text-gray-700 text-sm">
              <span className="font-bold text-gray-800">Recomendação: </span>
              {getRecommendation(concentration)}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-500 mt-0.5" />
            <p>
              Este módulo não substitui avaliação laboratorial. Use com orientação profissional.
            </p>
          </div>
        </div>

        {/* Histórico de avaliações */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-gray-800 font-bold text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Avaliações Anteriores
            </h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => {
                const color = getBarColor(item.concentration)
                const data = new Date(item.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })
                return (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400">{data}</span>
                    <span className="text-sm font-bold" style={{ color }}>~{item.concentration} mEq/L</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 pb-8">
        <button
          disabled={!allAnswered || isSaving}
          className={`w-full text-white font-bold text-lg py-4 rounded-full shadow-lg transition-all active:scale-95 ${
            allAnswered && !isSaving
              ? 'bg-[var(--color-primary)] shadow-red-500/30 hover:bg-[var(--color-primary-dark)]'
              : 'bg-gray-300 shadow-none cursor-not-allowed'
          }`}
          onClick={handleSave}
        >
          {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>
    </div>
  )
}
