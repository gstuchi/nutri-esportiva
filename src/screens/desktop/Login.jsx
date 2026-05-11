import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

function CompassLogo({ size = 32 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.15)" />
      <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,0.1)" />
      <polygon points="60,10 66,52 60,60 54,52" fill="white" />
      <polygon points="60,110 66,68 60,60 54,68" fill="white" />
      <polygon points="110,60 68,54 60,60 68,66" fill="white" />
      <polygon points="10,60 52,54 60,60 52,66" fill="white" />
      <polygon points="97,23 66,55 60,60 65,53" fill="rgba(255,255,255,0.6)" />
      <polygon points="23,97 54,65 60,60 55,67" fill="rgba(255,255,255,0.6)" />
      <polygon points="23,23 55,55 60,60 53,55" fill="rgba(255,255,255,0.6)" />
      <polygon points="97,97 65,65 60,60 67,65" fill="rgba(255,255,255,0.6)" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin]     = useState(true)
  const [email, setEmail]         = useState('')
  const [nome, setNome]           = useState('')
  const [senha, setSenha]         = useState('')
  const [verSenha, setVerSenha]   = useState(false)
  const [manter, setManter]       = useState(false)

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] font-sans">

      {/* Painel esquerdo — vermelho */}
      <div className="hidden lg:flex w-[42%] bg-[var(--color-primary)] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorações */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <CompassLogo size={40} />
          <div>
            <p className="text-white font-bold text-lg leading-tight">Nutri-Esportiva</p>
            <p className="text-white/70 text-xs">Painel Web</p>
          </div>
        </div>

        {/* Copy central */}
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold leading-snug mb-4">
            Monitoramento de hidratação inteligente para atletas.
          </h1>
          <p className="text-white/75 text-sm leading-relaxed">
            Acompanhe a taxa de sudorese, o balanço hídrico e a triagem de risco
            de toda a sua equipe em um só lugar.
          </p>
        </div>

        {/* Badge parceria */}
        <div className="relative z-10">
          <span className="inline-block border border-white/30 text-white/80 text-xs px-4 py-2 rounded-full">
            Em parceria com São Camilo
          </span>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white lg:bg-transparent">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <CompassLogo size={20} />
            </div>
            <span className="font-bold text-[var(--color-primary)]">Nutri-Esportiva</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">
            {isLogin ? 'Entrar no painel' : 'Criar sua conta'}
          </h2>
          <p className="text-sm text-[var(--color-text-light)] mb-8">
            {isLogin ? 'Painel exclusivo para Treinadores e Staff' : 'Comece a monitorar sua equipe hoje'}
          </p>

          {/* Campos */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">E-mail</label>
              <input
                type="email"
                placeholder="nutricionista@saocamilo.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={verSenha ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {verSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Confirmar Senha</label>
                <input
                  type={verSenha ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            )}
          </div>

          {/* Manter + esqueci */}
          {isLogin && (
            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={manter}
                  onChange={(e) => setManter(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)] rounded"
                />
                <span className="text-sm text-[var(--color-text-light)]">Manter conectado</span>
              </label>
              <button className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Botão entrar/cadastrar */}
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full ${isLogin ? 'bg-[var(--color-primary)]' : 'bg-gray-800'} text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 hover:opacity-90 active:scale-95 transition-all text-sm mt-6`}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[var(--color-text-light)]"
            >
              {isLogin ? (
                <>Não tem uma conta? <span className="text-[var(--color-primary)] font-bold">Cadastre-se</span></>
              ) : (
                <>Já tem uma conta? <span className="text-[var(--color-primary)] font-bold">Faça login</span></>
              )}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white lg:bg-[var(--color-bg)] px-2 text-gray-400">ou entrar com</span></div>
          </div>

          <button className="w-full border border-gray-200 bg-white text-[var(--color-text)] text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  )
}
