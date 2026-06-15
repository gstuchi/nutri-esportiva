import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import CompassLogo from '../../components/CompassLogo'


export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const register = useAuthStore(state => state.register)
  
  const [isLogin, setIsLogin]     = useState(true)
  const [email, setEmail]         = useState('')
  const [nome, setNome]           = useState('')
  const [senha, setSenha]         = useState('')
  const [confirmSenha, setConfirmSenha] = useState('')
  const [verSenha, setVerSenha]   = useState(false)
  const [manter, setManter]       = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [successText, setSuccessText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorText('')
    setSuccessText('')

    if (!email || !senha) {
      setErrorText('E-mail e senha são obrigatórios.')
      return
    }

    if (!isLogin && senha !== confirmSenha) {
      setErrorText('As senhas não coincidem.')
      return
    }

    setIsLoading(true)
    try {
      if (isLogin) {
        const user = await login(email, senha)
        if (user.role !== 'coach') {
          useAuthStore.getState().logout()
          setErrorText('Acesso exclusivo para treinadores e nutricionistas cadastrados.')
          setIsLoading(false)
          return
        }
        navigate('/dashboard')
      } else {
        if (!nome) {
          setErrorText('O nome completo é obrigatório.')
          setIsLoading(false)
          return
        }
        await register(nome, email, senha, 'coach')
        setSuccessText('Cadastro concluído! Agora você pode realizar o seu login.')
        setIsLogin(true)
        setNome('')
        setSenha('')
        setConfirmSenha('')
      }
    } catch (err) {
      console.error(err)
      setErrorText(err.response?.data?.error || 'E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] font-sans">
      <div className="hidden lg:flex w-[42%] bg-[var(--color-primary)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <CompassLogo size={40} />
          <div>
            <p className="text-white font-bold text-lg leading-tight">Nutri-Esportiva</p>
            <p className="text-white/70 text-xs">Painel Web</p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold leading-snug mb-4">
            Monitoramento de hidratação inteligente para atletas.
          </h1>
          <p className="text-white/75 text-sm leading-relaxed">
            Acompanhe a taxa de sudorese, o balanço hídrico e a triagem de risco
            de toda a sua equipe em um só lugar.
          </p>
        </div>

        <div className="relative z-10">
          <span className="inline-block border border-white/30 text-white/80 text-xs px-4 py-2 rounded-full">
            Em parceria com São Camilo
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white lg:bg-transparent">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
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

          {errorText && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {successText && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <span>{successText}</span>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Nome Completo</label>
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
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">E-mail</label>
              <input
                type="email"
                placeholder="nutricionista@saocamilo.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Senha</label>
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
                <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type={verSenha ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={confirmSenha}
                    onChange={(e) => setConfirmSenha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[var(--color-primary)] transition-all pr-12"
                  />
                </div>
              </div>
            )}
          </div>

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
              <button type="button" className="text-sm text-[var(--color-primary)] font-semibold hover:underline">
                Esqueci minha senha
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLogin ? 'bg-[var(--color-primary)]' : 'bg-gray-800'} text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 hover:opacity-90 active:scale-95 transition-all text-sm mt-6 cursor-pointer`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Entrar' : 'Cadastrar'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setErrorText('')
                setSuccessText('')
              }}
              className="text-sm text-[var(--color-text-light)]"
            >
              {isLogin ? (
                <>Não tem uma conta? <span className="text-[var(--color-primary)] font-bold">Cadastre-se</span></>
              ) : (
                <>Já tem uma conta? <span className="text-[var(--color-primary)] font-bold">Faça login</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
