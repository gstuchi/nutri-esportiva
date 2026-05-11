import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Calendar, Clock, Activity, Droplets, Zap, ShieldCheck } from 'lucide-react';
import BottomNav from '../../components/mobile/BottomNav';

export default function Relatorio() {
  const navigate = useNavigate();

  // Mock data for the last training
  const lastTraining = {
    type: 'Corrida de Rua',
    duration: '1h 15min',
    date: '10 de Mai, 2026',
    sweatRate: 0.95, // L/h
    hydrationScore: 85,
    effortScore: 7, // 1-10
    recoveryStatus: 'Boa'
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans pb-24">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-16 px-4 rounded-b-[40px] shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Relatório do Treino</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-20 space-y-6">
        
        {/* Main Training Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="bg-red-50 text-[var(--color-primary)] text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">Última Sessão</span>
              <h2 className="text-2xl font-black text-gray-800 mt-2">{lastTraining.type}</h2>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl">
               <Activity className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Data</p>
                <p className="text-sm font-bold text-gray-700">{lastTraining.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Duração</p>
                <p className="text-sm font-bold text-gray-700">{lastTraining.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sweat Rate Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Droplets className="w-32 h-32 text-blue-900" />
          </div>

          <div className="mb-6">
            <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Taxa de Sudorese
            </h3>
          </div>

          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-black text-gray-800 tracking-tighter">{lastTraining.sweatRate}</span>
            <span className="text-gray-400 font-bold mb-2 uppercase text-xs">Litros / Hora</span>
          </div>

          {/* Visual Indicator (Progress Bar Style) */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" 
                style={{ width: `${(lastTraining.sweatRate / 2) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              <span>Baixa</span>
              <span>Moderada</span>
              <span>Alta</span>
            </div>
          </div>
        </div>

        {/* Condition Indicators Grid */}
        <div className="grid grid-cols-2 gap-4">
           {/* Hydration Score */}
           <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-100">
              <Zap className="w-5 h-5 text-yellow-500 mb-3" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hidratação</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-gray-800">{lastTraining.hydrationScore}</span>
                <span className="text-gray-400 font-bold text-xs">%</span>
              </div>
              <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Nível Ideal
              </p>
           </div>

           {/* Recovery Status */}
           <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-100">
              <Activity className="w-5 h-5 text-purple-500 mb-3" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recuperação</p>
              <div className="mt-1">
                <span className="text-xl font-black text-gray-800">{lastTraining.recoveryStatus}</span>
              </div>
              <div className="flex gap-1 mt-3">
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                <div className="h-1.5 flex-1 bg-green-500 rounded-full" />
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full" />
              </div>
           </div>
        </div>

        {/* Tip Card */}
        <div className="bg-gray-800 rounded-3xl p-6 text-white shadow-lg">
           <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Dica Pro</p>
           <h4 className="font-bold text-lg leading-tight mb-2">Ajuste seu protocolo hídrico</h4>
           <p className="text-white/70 text-xs leading-relaxed">
             Baseado na sua taxa de sudorese de {lastTraining.sweatRate} L/h, recomendamos ingerir aproximadamente 250ml de fluidos a cada 15-20 minutos no próximo treino similar.
           </p>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}


