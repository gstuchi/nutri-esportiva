import { useNavigate } from 'react-router-dom'
import { Activity, Droplets, Bike, Trophy } from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'

// dados das sessões — vai vir do banco futuramente
const sessoes = [
  { data: 'Hoje 09:14', modalidade: 'Corrida',  Icone: Activity, duracao: '48 min',   taxa: '1.04 L/h', perda: '-1.2%', status: 'Atenção', cor: 'bg-amber-50 text-amber-600'     },
  { data: '28 Mar',     modalidade: 'Ciclismo', Icone: Bike,     duracao: '1h 12min', taxa: '1.20 L/h', perda: '-2.1%', status: 'Risco',   cor: 'bg-red-50 text-red-600'         },
  { data: '26 Mar',     modalidade: 'Corrida',  Icone: Activity, duracao: '35 min',   taxa: '0.85 L/h', perda: '-0.8%', status: 'OK',      cor: 'bg-emerald-50 text-emerald-600' },
  { data: '24 Mar',     modalidade: 'Futebol',  Icone: Trophy,   duracao: '90 min',   taxa: '0.95 L/h', perda: '-1.0%', status: 'OK',      cor: 'bg-emerald-50 text-emerald-600' },
  { data: '22 Mar',     modalidade: 'Corrida',  Icone: Activity, duracao: '52 min',   taxa: '1.10 L/h', perda: '-1.5%', status: 'Atenção', cor: 'bg-amber-50 text-amber-600'     },
  { data: '20 Mar',     modalidade: 'Corrida',  Icone: Activity, duracao: '44 min',   taxa: '0.92 L/h', perda: '-0.9%', status: 'OK',      cor: 'bg-emerald-50 text-emerald-600' },
  { data: '18 Mar',     modalidade: 'Ciclismo', Icone: Bike,     duracao: '1h 05min', taxa: '1.18 L/h', perda: '-1.8%', status: 'Atenção', cor: 'bg-amber-50 text-amber-600'     },
]

// barras do gráfico — altura em % relativa ao maior valor (1.20)
const barras = [
  { label: '18 Mar', valor: '0.70', altura: '58%'  },
  { label: '20 Mar', valor: '1.00', altura: '83%'  },
  { label: '22 Mar', valor: '0.80', altura: '67%'  },
  { label: '24 Mar', valor: '1.20', altura: '100%' },
  { label: '26 Mar', valor: '0.90', altura: '75%'  },
  { label: '28 Mar', valor: '1.00', altura: '83%'  },
  { label: '01 Abr', valor: '1.10', altura: '92%'  },
  { label: 'Hoje',   valor: '1.04', altura: '87%', destaque: true },
]

export default function SudoreseAtleta() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="João Silva" subtitle="Perfil do atleta · ATL-0142" />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* cards de estatísticas */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Taxa Média</p>
              <p className="text-3xl font-bold text-[#B91C1C]">1.04 L/h</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Sessões (30d)</p>
              <p className="text-3xl font-bold text-emerald-500">8</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Perda Média</p>
              <p className="text-3xl font-bold text-amber-500">-1.4%</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Alertas</p>
              <p className="text-3xl font-bold text-blue-500">2</p>
            </div>
          </div>

          <div className="flex gap-5 items-start">

            {/* card de perfil do atleta */}
            <div className="w-56 flex-shrink-0 bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
              <div className="bg-[#B91C1C] h-16 relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-6 w-16 h-16 rounded-full bg-[#D01F25] border-4 border-white flex items-center justify-center text-white text-xl font-bold">JS</div>
              </div>
              <div className="pt-12 pb-6 px-5 space-y-3.5">
                <p className="text-sm font-bold text-gray-800 text-center mb-1">João Silva</p>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Idade</p><p className="text-sm font-semibold text-gray-700">24 anos</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Peso</p><p className="text-sm font-semibold text-gray-700">74,5 kg</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Altura</p><p className="text-sm font-semibold text-gray-700">178 cm</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Modalidade</p><p className="text-sm font-semibold text-gray-700">Corrida de Rua</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Nível</p><p className="text-sm font-semibold text-gray-700">Amador avançado</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Membro desde</p><p className="text-sm font-semibold text-gray-700">Jan 2025</p></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* gráfico de barras */}
              <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4 text-[#B91C1C]" />
                  <p className="font-bold text-sm text-gray-800">Taxa de Sudorese — Últimas 8 Sessões</p>
                </div>
                <div className="flex gap-1">{barras.map(b => <div key={b.label} className="flex-1 text-center"><span className="text-[10px] text-gray-400">{b.valor}</span></div>)}</div>
                <div className="flex items-end gap-1 h-28 mt-1 border-b border-gray-100">
                  {barras.map(b => <div key={b.label} className={`flex-1 rounded-t ${b.destaque ? 'bg-[#B91C1C]' : 'bg-red-100'}`} style={{ height: b.altura }} />)}
                </div>
                <div className="flex gap-1 mt-1.5">{barras.map(b => <div key={b.label} className="flex-1 text-center"><span className="text-[10px] text-gray-400">{b.label}</span></div>)}</div>
              </div>

              {/* tabela de sessões */}
              <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <p className="font-bold text-sm text-gray-800 px-5 py-4 border-b border-gray-100">Sessões Recentes</p>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3 font-bold">Data</th>
                      <th className="px-5 py-3 font-bold">Modalidade</th>
                      <th className="px-5 py-3 font-bold">Duração</th>
                      <th className="px-5 py-3 font-bold">Taxa</th>
                      <th className="px-5 py-3 font-bold">Perda</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sessoes.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-xs font-medium text-gray-700">{s.data}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-700">
                          <div className="flex items-center gap-1.5"><s.Icone className="w-3.5 h-3.5 text-gray-400" />{s.modalidade}</div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{s.duracao}</td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-700">{s.taxa}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{s.perda}</td>
                        <td className="px-5 py-3.5"><span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.cor}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
