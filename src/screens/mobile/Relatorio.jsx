import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import BottomNav from '../../components/mobile/BottomNav';

export default function Relatorio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans pb-24">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white pt-12 pb-6 px-4 rounded-b-[30px] shadow-md relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center justify-center mt-10 space-y-4">
        <div className="bg-white p-6 rounded-full shadow-sm">
          <FileText className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">Relatórios individuais em construção...</p>
      </div>

      <BottomNav />
    </div>
  );
}

