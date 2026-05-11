import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Activity, Bike, Waves, Trophy, Zap } from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'

// lista de atletas — vai vir do banco futuramente
const atletas = [
  { inicial: 'J', cor: 'bg-blue-500',    nome: 'João Silva',    modalidade: 'Corrida',   Icone: Activity, ultimaSessao: 'Hoje 09:14',  taxa: '1.04 L/h', perda: '-1.2%', status: 'Atenção', corStatus: 'bg-amber-50 text-amber-600'     },
  { inicial: 'M', cor: 'bg-emerald-500', nome: 'Marcos Souza',  modalidade: 'Ciclismo',  Icone: Bike,     ultimaSessao: 'Ontem 18:30', taxa: '1.20 L/h', perda: '-2.1%', status: 'Risco',   corStatus: 'bg-red-50 text-red-600'         },
  { inicial: 'C', cor: 'bg-amber-500',   nome: 'Carla Mendes',  modalidade: 'Natação',   Icone: Waves,    ultimaSessao: 'Ontem 07:00', taxa: '0.85 L/h', perda: '-0.8%', status: 'OK',      corStatus: 'bg-emerald-50 text-emerald-600' },
  { inicial: 'P', cor: 'bg-purple-500',  nome: 'Pedro Lima',    modalidade: 'Futebol',   Icone: Trophy,   ultimaSessao: '24 Mar',      taxa: '0.95 L/h', perda: '-1.0%', status: 'OK',      corStatus: 'bg-emerald-50 text-emerald-600' },
  { inicial: 'A', cor: 'bg-teal-500',    nome: 'Ana Ferreira',  modalidade: 'Corrida',   Icone: Activity, ultimaSessao: '23 Mar',      taxa: '1.35 L/h', perda: '-2.8%', status: 'Risco',   corStatus: 'bg-red-50 text-red-600'         },
  { inicial: 'L', cor: 'bg-green-500',   nome: 'Lucas Costa',   modalidade: 'Triathlon', Icone: Zap,      ultimaSessao: '22 Mar',      taxa: '1.10 L/h', perda: '-1.5%', status: 'Atenção', corStatus: 'bg-amber-50 text-amber-600'     },
  { inicial: 'B', cor: 'bg-violet-500',  nome: 'Beatriz Rocha', modalidade: 'Ciclismo',  Icone: Bike,     ultimaSessao: '21 Mar',      taxa: '0.78 L/h', perda: '-0.6%', status: 'OK',      corStatus: 'bg-emerald-50 text-emerald-600' },
]

export default function Atletas() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Atletas" subtitle="Gerencie e monitore sua equipe" />

        <div className="flex-1 overflow-y-auto p-6">

          {/* barra de busca e filtros */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar atleta..." className="border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-[#B91C1C] text-white text-sm font-bold px-4 py-2.5 rounded-xl">Todos (24)</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50">Em risco (3)</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50">Atenção (7)</button>
              <button className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50">OK (14)</button>
            </div>
          </div>

          {/* tabela de atletas */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3 font-bold">Atleta</th>
                  <th className="px-5 py-3 font-bold">Modalidade</th>
                  <th className="px-5 py-3 font-bold">Última Sessão</th>
                  <th className="px-5 py-3 font-bold">Taxa Sudorese</th>
                  <th className="px-5 py-3 font-bold">Perda</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {atletas.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${a.cor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{a.inicial}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{a.nome}</p>
                          <p className="text-xs text-gray-400">Atleta</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-700">
                      <div className="flex items-center gap-1.5"><a.Icone className="w-3.5 h-3.5 text-gray-400" />{a.modalidade}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{a.ultimaSessao}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#B91C1C]">{a.taxa}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{a.perda}</td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold ${a.corStatus}`}>{a.status}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={() => navigate('/sudorese-atleta')} className="flex items-center gap-1 bg-[#B91C1C] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#991B1B]">
                        Ver perfil <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
