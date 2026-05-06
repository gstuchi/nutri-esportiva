import Sidebar from '../../components/desktop/Sidebar'
import TopBar from '../../components/desktop/TopBar'

export default function PerfilDesk() {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Perfil" subtitle="Configurações da conta" />
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800">Em construção...</h2>
        </div>
      </div>
    </div>
  )
}

