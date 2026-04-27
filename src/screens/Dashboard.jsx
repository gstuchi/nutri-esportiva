import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const stats = [
  { value: '0.9 L/h', label: 'Taxa Média' },
  { value: '2 dias', label: 'Última sessão' },
  { value: '-1.2%', label: 'Desidratação' },
]

const fluxo = [
  {
    id: 1,
    title: 'Pré-Sessão',
    sub: 'Pesagem + condições ambientais',
    badge: 'FAZER',
    path: '/pre-sessao',
  },
  {
    id: 2,
    title: 'Durante a Sessão',
    sub: 'Registro de fluidos em tempo real',
    badge: null,
    path: null,
  },
  {
    id: 3,
    title: 'Pós-Sessão',
    sub: 'Pesagem final + sintomas',
    badge: null,
    path: null,
  },
  {
    id: 4,
    title: 'Relatório',
    sub: 'Taxa de sudorese + recomendações',
    badge: null,
    path: null,
  },
]

const navItems = [
  { label: 'Início', active: true },
  { label: 'Histórico', active: false },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="dash">
      {/* Status bar */}
      <div className="statusbar">9:41</div>

      {/* Header */}
      <div className="dash-header">
        <h1 className="dash-greeting">Olá, João</h1>
        <p className="dash-sub">Pronto para registrar a sessão de hoje?</p>
      </div>

      {/* Stats card */}
      <div className="stats-card">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Session flow */}
      <div className="dash-section">
        <h2 className="section-title">Fluxo da Sessão</h2>

        <div className="flow-card">
          {fluxo.map((item, i) => (
            <div key={item.id}>
              <button
                className="flow-item"
                onClick={() => item.path && navigate(item.path)}
                style={{ cursor: item.path ? 'pointer' : 'default' }}
              >
                <div className="flow-text">
                  <span className="flow-title" style={{ color: item.badge ? 'var(--red)' : 'var(--text)' }}>
                    {item.title}
                  </span>
                  <span className="flow-sub">{item.sub}</span>
                </div>
                <div className="flow-right">
                  {item.badge && <span className="flow-badge">{item.badge}</span>}
                  <span className="flow-arrow">›</span>
                </div>
              </button>
              {i < fluxo.length - 1 && <div className="flow-divider" />}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {navItems.map((n) => (
          <button key={n.label} className={`nav-btn ${n.active ? 'nav-btn--active' : ''}`}>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}

        <button className="nav-fab">+</button>

        <button className="nav-btn">
          <span className="nav-label">Relatório</span>
        </button>
        <button className="nav-btn">
          <span className="nav-label">Perfil</span>
        </button>
      </nav>
    </div>
  )
}
