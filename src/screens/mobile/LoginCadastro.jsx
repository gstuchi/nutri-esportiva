import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function LoginCadastro() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, 'athlete');

        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans flex flex-col">
      {}
      <div className="bg-[var(--color-primary)] text-white pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden flex flex-col items-center">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md mb-6 ring-1 ring-white/30">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
             <span className="text-[var(--color-primary)] text-3xl font-black">SC</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo</h1>
        <p className="text-white/80 text-sm font-medium text-center">Sua performance começa com uma boa hidratação</p>
      </div>

      {}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-1.5 flex ring-1 ring-gray-100">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400'}`}
          >
            Cadastro
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 px-6 pt-8 pb-12 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">Nome Completo</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-100 text-gray-800 text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-primary)] transition-all font-medium shadow-sm"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">E-mail</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-100 text-gray-800 text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-primary)] transition-all font-medium shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">Senha</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-100 text-gray-800 text-base rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-primary)] transition-all font-medium shadow-sm"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-gray-500 text-xs font-bold ml-1 uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-100 text-gray-800 text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[var(--color-primary)] transition-all font-medium shadow-sm"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                Esqueceu a senha?
              </button>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-red-500/30 hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-[1px] bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 font-bold uppercase">Ou continue com</span>
          <div className="h-[1px] bg-gray-200 flex-1" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 py-3 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">G</div>
            <span className="text-sm font-bold text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 py-3 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
             <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">A</div>
            <span className="text-sm font-bold text-gray-700">Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
