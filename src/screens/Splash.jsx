import { useNavigate } from 'react-router-dom'

function CompassLogo() {
  return (
    <svg viewBox="0 0 120 120" width="110" height="110" className="drop-shadow-lg">
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
    <div className="relative flex flex-col justify-between h-screen w-full bg-[var(--color-primary)] overflow-hidden text-white">
      {/* decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-black/5 rounded-full blur-3xl" />

      <div className="flex flex-col items-center justify-center flex-1 z-10 px-6">
        <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
          <CompassLogo />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">Nutri-Esportiva</h1>
        <p className="text-sm text-white/80 text-center max-w-[240px]">
          Monitoramento de Hidratação para Atletas
        </p>
      </div>

      <div className="flex flex-col gap-4 p-6 w-full max-w-md mx-auto z-10 pb-12">
        <button 
          className="w-full bg-white text-[var(--color-primary)] font-semibold py-4 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-200"
          onClick={() => navigate('/dashboard')}
        >
          Criar Conta
        </button>
        <button 
          className="w-full bg-transparent border border-white text-white font-semibold py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-200"
          onClick={() => navigate('/dashboard')}
        >
          Já tenho conta
        </button>
      </div>
    </div>
  )
}
