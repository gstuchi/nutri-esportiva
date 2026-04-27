import { useNavigate } from 'react-router-dom'
import './Splash.css'

function CompassLogo() {
  return (
    <svg viewBox="0 0 120 120" width="110" height="110" className="splash-logo-svg">
      <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.15)" />
      <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,0.1)" />
      {/* North */}
      <polygon points="60,10 66,52 60,60 54,52" fill="white" />
      {/* South */}
      <polygon points="60,110 66,68 60,60 54,68" fill="white" />
      {/* East */}
      <polygon points="110,60 68,54 60,60 68,66" fill="white" />
      {/* West */}
      <polygon points="10,60 52,54 60,60 52,66" fill="white" />
      {/* NE */}
      <polygon points="97,23 66,55 60,60 65,53" fill="rgba(255,255,255,0.65)" />
      {/* SW */}
      <polygon points="23,97 54,65 60,60 55,67" fill="rgba(255,255,255,0.65)" />
      {/* NW */}
      <polygon points="23,23 55,55 60,60 53,55" fill="rgba(255,255,255,0.65)" />
      {/* SE */}
      <polygon points="97,97 65,65 60,60 67,65" fill="rgba(255,255,255,0.65)" />
    </svg>
  )
}

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="splash">
      {/* decorative circles */}
      <div className="splash-deco splash-deco-1" />
      <div className="splash-deco splash-deco-2" />

      <div className="splash-content">
        <div className="splash-logo-wrap">
          <CompassLogo />
        </div>

        <h1 className="splash-title">Nutri-Esportiva</h1>
        <p className="splash-subtitle">Monitoramento de Hidratação para Atletas</p>
      </div>

      <div className="splash-buttons">
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          Criar Conta
        </button>
        <button className="btn-outline" onClick={() => navigate('/dashboard')}>
          Já tenho conta
        </button>
      </div>
    </div>
  )
}
