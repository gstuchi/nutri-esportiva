import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PreSessao.css'

const urineColors = [
  { id: 1, color: '#FEFBD0' },
  { id: 2, color: '#F5E84A' },
  { id: 3, color: '#E8C832' },
  { id: 4, color: '#D4A420' },
  { id: 5, color: '#9B7010' },
  { id: 6, color: '#5C3A10' },
]

const modalidades = ['Corrida', 'Ciclismo', 'Futebol', 'Natação', 'Outro']

const exposicaoOpts = ['Sombra', 'Parcial', 'Sol pleno']

export default function PreSessao() {
  const navigate = useNavigate()
  const [massa, setMassa] = useState('')
  const [urineSel, setUrineSel] = useState(null)
  const [temp, setTemp] = useState('')
  const [umidade, setUmidade] = useState('')
  const [exposicao, setExposicao] = useState(null)
  const [modalidade, setModalidade] = useState('Corrida')

  return (
    <div className="pre">
      {/* Header */}
      <div className="pre-header">
        <div className="pre-statusbar">9:41</div>
        <div className="pre-header-content">
          <button className="pre-back" onClick={() => navigate('/dashboard')}>‹</button>
          <div>
            <h1 className="pre-title">Pré-Sessão</h1>
            <p className="pre-step">Etapa 1 de 3</p>
          </div>
        </div>
        <div className="pre-progress">
          <div className="pre-progress-bar" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="pre-body">

        {/* Card: Massa Corporal */}
        <div className="pre-card">
          <div className="pre-card-header">
            <div>
              <p className="pre-card-title">Massa Corporal Pré-Exercício</p>
              <p className="pre-card-hint">Após esvaziamento vesical, vestimenta mínima</p>
            </div>
          </div>
          <input
            className="pre-input"
            type="number"
            inputMode="decimal"
            placeholder="Ex: 74.5 kg"
            value={massa}
            onChange={(e) => setMassa(e.target.value)}
          />
        </div>

        {/* Card: Cor da Urina */}
        <div className="pre-card">
          <div className="pre-card-header">
            <div>
              <p className="pre-card-title">Cor da Urina</p>
              <p className="pre-card-hint">Selecione a tonalidade mais próxima</p>
            </div>
          </div>
          <div className="urine-swatches">
            {urineColors.map((u) => (
              <button
                key={u.id}
                className={`urine-swatch ${urineSel === u.id ? 'urine-swatch--sel' : ''}`}
                style={{ background: u.color }}
                onClick={() => setUrineSel(u.id)}
                aria-label={`Cor ${u.id}`}
              />
            ))}
          </div>
        </div>

        {/* Card: Condições Ambientais */}
        <div className="pre-card">
          <div className="pre-card-header">
            <div>
              <p className="pre-card-title">Condições Ambientais</p>
            </div>
          </div>
          <div className="amb-row">
            <div className="amb-field">
              <label className="amb-label">Temperatura (°C)</label>
              <input
                className="pre-input"
                type="number"
                inputMode="decimal"
                placeholder="Ex: 28"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
              />
            </div>
            <div className="amb-field">
              <label className="amb-label">Umidade (%)</label>
              <input
                className="pre-input"
                type="number"
                inputMode="decimal"
                placeholder="Ex: 65"
                value={umidade}
                onChange={(e) => setUmidade(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="amb-label" style={{ marginBottom: 8, display: 'block' }}>Exposição Solar</label>
            <div className="pill-group">
              {exposicaoOpts.map((o) => (
                <button
                  key={o}
                  className={`pill ${exposicao === o ? 'pill--active' : ''}`}
                  onClick={() => setExposicao(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Modalidade */}
        <div className="pre-card">
          <div className="pre-card-header">
            <div>
              <p className="pre-card-title">Modalidade</p>
            </div>
          </div>
          <div className="pill-group">
            {modalidades.map((m) => (
              <button
                key={m}
                className={`pill ${modalidade === m ? 'pill--active' : ''}`}
                onClick={() => setModalidade(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* Fixed bottom button */}
      <div className="pre-footer">
        <button className="btn-iniciar" onClick={() => alert('Sessão iniciada!')}>
          Iniciar Sessão →
        </button>
      </div>
    </div>
  )
}
