import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, ChevronRight, Activity, Bike, Waves, Trophy, Zap, 
  ChevronDown, Plus, Users, X, AlertTriangle, CheckCircle2, 
  Info
} from 'lucide-react'
import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'

import { useGroupStore } from '../../store/groupStore'

// Mock Data Structure
const initialGroups = [
  {
    id: '1',
    name: 'Equipe Corrida A',
    code: 'CORR-2024',
    athletes: [
      { inicial: 'J', cor: 'bg-blue-500', nome: 'João Silva', modality: 'Corrida', Icone: Activity, lastSession: 'Hoje 09:14', sweatRate: '1.04 L/h', loss: '-1.2%', status: 'attention' },
      { inicial: 'A', cor: 'bg-teal-500', nome: 'Ana Ferreira', modality: 'Corrida', Icone: Activity, lastSession: '23 Mar', sweatRate: '1.35 L/h', loss: '-2.8%', status: 'risk' },
    ]
  },
  {
    id: '2',
    name: 'Equipe Ciclismo',
    code: 'BIKE-X',
    athletes: [
      { inicial: 'M', cor: 'bg-emerald-500', nome: 'Marcos Souza', modality: 'Ciclismo', Icone: Bike, lastSession: 'Ontem 18:30', sweatRate: '1.20 L/h', loss: '-2.1%', status: 'risk' },
      { inicial: 'B', cor: 'bg-violet-500', nome: 'Beatriz Rocha', modality: 'Ciclismo', Icone: Bike, lastSession: '21 Mar', sweatRate: '0.78 L/h', loss: '-0.6%', status: 'ok' },
    ]
  },
  {
    id: '3',
    name: 'Sem Grupo',
    code: 'GERAL-00',
    athletes: [
      { inicial: 'C', cor: 'bg-amber-500', nome: 'Carla Mendes', modality: 'Natação', Icone: Waves, lastSession: 'Ontem 07:00', sweatRate: '0.85 L/h', loss: '-0.8%', status: 'ok' },
    ]
  }
]

const statusConfig = {
  risk: { label: 'Risco', color: 'bg-red-50 text-red-600', icon: AlertTriangle },
  attention: { label: 'Atenção', color: 'bg-amber-50 text-amber-600', icon: Info },
  ok: { label: 'OK', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
}

export default function Atletas() {
  const navigate = useNavigate()
  const { createGroup, groups: apiGroups, fetchCoachGroups } = useGroupStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [groups, setGroups] = useState(initialGroups) // Fallback to mock data visually
  const [expandedGroups, setExpandedGroups] = useState(initialGroups.map(g => g.id))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupCode, setNewGroupCode] = useState('')

  const toggleGroup = (id) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    )
  }

  const openAddModal = () => {
    // Gera código automático: 3 letras + 3 números
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    let code = ''
    for (let i = 0; i < 3; i++) code += letters.charAt(Math.floor(Math.random() * letters.length))
    for (let i = 0; i < 3; i++) code += numbers.charAt(Math.floor(Math.random() * numbers.length))
    
    setNewGroupCode(code)
    setIsModalOpen(true)
  }

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return
    
    try {
      // Integrando com POST /groups
      const newApiGroup = await createGroup(newGroupName, 'Grupo criado no Dashboard');
      
      const newGroup = {
        id: newApiGroup?.id || Math.random().toString(36).substr(2, 9),
        name: newGroupName,
        code: newApiGroup?.code || newGroupCode,
        athletes: []
      }
      
      setGroups([newGroup, ...groups])
      setExpandedGroups([...expandedGroups, newGroup.id])
      setNewGroupName('')
      setIsModalOpen(false)
    } catch (err) {
      console.error(err);
      alert('Erro ao criar grupo via API, usando fallback local.');
      const newGroup = {
        id: Math.random().toString(36).substr(2, 9),
        name: newGroupName,
        code: newGroupCode,
        athletes: []
      }
      setGroups([newGroup, ...groups])
      setExpandedGroups([...expandedGroups, newGroup.id])
      setNewGroupName('')
      setIsModalOpen(false)
    }
  }

  const getFilteredGroups = () => {
    if (!searchTerm.trim()) return groups
    
    return groups.map(group => ({
      ...group,
      athletes: group.athletes.filter(athlete => 
        athlete.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(group => group.athletes.length > 0)
  }

  const filteredGroups = getFilteredGroups()

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Atletas" subtitle="Gerencie e monitore sua equipe por grupos" />

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Sub-header: Busca + Ações */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3.5 w-96 shadow-sm focus-within:ring-2 focus-within:ring-red-100 focus-within:border-[var(--color-primary)] transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar atleta em todos os grupos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full bg-transparent font-medium" 
              />
            </div>

            <button 
              onClick={openAddModal}
              className="bg-[var(--color-primary)] text-white text-sm font-bold px-6 py-3.5 rounded-2xl hover:bg-[var(--color-primary-dark)] flex items-center gap-2 shadow-xl shadow-red-500/20 transition-all active:scale-95 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Novo Grupo
            </button>
          </div>

          <div className="space-y-8 pb-10">
            {filteredGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id)
              
              // TODO: calcular via API nos pontos de integração futura
              const counts = {
                all: group.athletes.length,
                risk: group.athletes.filter(a => a.status === 'risk').length,
                attention: group.athletes.filter(a => a.status === 'attention').length,
                ok: group.athletes.filter(a => a.status === 'ok').length,
              }

              return (
                <div key={group.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  {/* Cabeçalho do Grupo (Accordion Header) */}
                  <div 
                    className="flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`transition-transform duration-300 p-2 rounded-full ${isExpanded ? 'rotate-0 bg-red-50 text-[var(--color-primary)]' : '-rotate-90 bg-gray-50 text-gray-400'}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-none">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">CÓD: {group.code}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Badges de Status */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="text-[var(--color-text-light)] text-[10px] font-black uppercase tracking-tighter mb-1">Total</span>
                          <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{counts.all}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                        <div className="flex flex-col items-center">
                          <span className="text-red-400 text-[10px] font-black uppercase tracking-tighter mb-1">Risco</span>
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">{counts.risk}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-amber-400 text-[10px] font-black uppercase tracking-tighter mb-1">Atenção</span>
                          <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full">{counts.attention}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-tighter mb-1">OK</span>
                          <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">{counts.ok}</span>
                        </div>
                      </div>


                    </div>
                  </div>

                  {/* Conteúdo do Grupo (Tabela) */}
                  {isExpanded && (
                    <div className="border-t border-gray-50 overflow-x-auto bg-white">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/30 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                            <th className="px-8 py-4">Atleta</th>
                            <th className="px-8 py-4">Modalidade</th>
                            <th className="px-8 py-4">Última Sessão</th>
                            <th className="px-8 py-4">Sudorese</th>
                            <th className="px-8 py-4">Perda</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {group.athletes.map((a, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group/row">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className={`w-11 h-11 rounded-2xl ${a.cor || 'bg-gray-200'} flex items-center justify-center text-white text-sm font-black shadow-lg shadow-gray-200/50 transform group-hover/row:scale-110 transition-transform`}>
                                    {a.inicial || a.nome[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-extrabold text-gray-900">{a.nome}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ATL-{(i+1)*128}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                    {a.Icone ? <a.Icone className="w-4 h-4 text-gray-400" /> : <Activity className="w-4 h-4 text-gray-400" />}
                                  </div>
                                  {a.modality}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-xs text-gray-500 font-bold">{a.lastSession}</td>
                              <td className="px-8 py-5 text-xs font-black text-[var(--color-primary)]">{a.sweatRate}</td>
                              <td className="px-8 py-5 text-xs text-gray-500 font-black">{a.loss}</td>
                              <td className="px-8 py-5">
                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusConfig[a.status].color}`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {statusConfig[a.status].label}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-center">
                                <button 
                                  onClick={() => navigate('/sudorese-atleta')} 
                                  className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-[var(--color-primary-dark)] transition-all shadow-lg shadow-red-500/10 active:scale-95"
                                >
                                  Ver Perfil
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}

            {filteredGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-gray-200" />
                </div>
                <p className="text-gray-500 font-extrabold text-lg">Nenhum resultado encontrado</p>
                <p className="text-gray-400 text-sm mt-1">Tente buscar por outro nome de atleta</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-[var(--color-primary)] text-sm font-black uppercase tracking-widest hover:underline bg-red-50 px-6 py-3 rounded-2xl"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Novo Grupo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="bg-[var(--color-primary)] p-8 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Novo Grupo</h3>
                  <p className="text-white/70 text-xs font-bold mt-1 uppercase tracking-widest">Configuração de Equipe</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/20 hover:bg-white/30 p-2.5 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nome do Grupo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Elite Running Club" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-[var(--color-primary)] transition-all font-bold placeholder-gray-300"
                />
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Código Gerado</label>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-800 tracking-[0.2em]">{newGroupCode}</span>
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Ativo</div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 font-medium italic">
                  * Este código será usado pelos atletas para entrar no grupo via aplicativo mobile.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddGroup}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-[var(--color-primary)] text-white rounded-2xl shadow-xl shadow-red-500/20 hover:bg-[var(--color-primary-dark)] transition-all active:scale-95"
                >
                  Criar Grupo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

