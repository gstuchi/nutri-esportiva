import React, { useEffect, useState, useRef } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ROLE_LABEL = { coach: 'Treinador', athlete: 'Atleta' };

export default function TopBar({ title, subtitle }) {
  const { user } = useAuthStore();
  const [riskAthletes, setRiskAthletes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.role !== 'coach') return;

    const checkRisks = async () => {
      try {
        const resGroups = await api.get('/groups/coach');
        const athletesWithRisk = [];
        for (const g of resGroups.data) {
          const resAthletes = await api.get(`/groups/${g.id}/athletes`);
          for (const a of resAthletes.data) {
            const latest = a.latestSession;
            if (latest?.calculated) {
              const risk = latest.calculated.riskLevel;
              if (risk === 'high' || risk === 'critical') {
                athletesWithRisk.push({
                  id: a.id,
                  name: a.name,
                  risk: risk,
                });
              }
            }
          }
        }
        setRiskAthletes(athletesWithRisk);
      } catch (error) {
        console.error("Erro ao checar alertas de risco:", error);
      }
    };

    checkRisks();
  }, [user]);

  // Fechar dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Usuário';
  const userRole = ROLE_LABEL[user?.role] || user?.role || '';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-50">
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-red-50 rounded-full transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            {riskAthletes.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Dropdown de Notificações */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">Notificações de Risco</h3>
                {riskAthletes.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {riskAthletes.length}
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {riskAthletes.length > 0 ? (
                  riskAthletes.map((athlete) => (
                    <button
                      key={athlete.id}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate(`/sudorese?athleteId=${athlete.id}`);
                      }}
                      className="w-full text-left p-3 hover:bg-red-50/50 rounded-xl transition-colors flex gap-3 items-start group"
                    >
                      <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${athlete.risk === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors">{athlete.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                          {athlete.risk === 'critical' ? 'Risco Crítico. Necessita intervenção imediata.' : 'Atenção. Desidratação ou sintomas observados.'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm font-medium">
                    Nenhum alerta de risco no momento.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-gray-100" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{userName}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-red-500/20 ring-2 ring-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

