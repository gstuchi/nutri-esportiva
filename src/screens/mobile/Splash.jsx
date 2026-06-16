import { useNavigate } from 'react-router-dom'
import CompassLogo from '../../components/CompassLogo'


export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-col justify-between h-screen w-full bg-[var(--color-primary)] overflow-hidden text-white">
      {/* decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-black/5 rounded-full blur-3xl" />

      <div className="flex flex-col items-center justify-center flex-1 z-10 px-6">
        <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
          <CompassLogo size={110} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">Nutri-Esportiva</h1>
        <p className="text-sm text-white/80 text-center max-w-[240px]">
          Monitoramento de Hidratação para Atletas
        </p>
      </div>

      <div className="flex flex-col gap-4 p-6 w-full max-w-md mx-auto z-10 pb-12">
        <button 
          className="w-full bg-white text-[var(--color-primary)] font-semibold py-4 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-200"
          onClick={() => navigate('/login')}
        >
          Criar Conta
        </button>
        <button 
          className="w-full bg-transparent border border-white text-white font-semibold py-4 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-200"
          onClick={() => navigate('/login')}
        >
          Já tenho conta
        </button>
      </div>
    </div>
  )
}
