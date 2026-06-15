import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import Sidebar from '../../components/desktop/Sidebar';
import TopBar from '../../components/desktop/TopBar';
import { api } from '../../services/api';

const SYMPTOM_PT = {
  cramps:       'Cãibras',
  headache:     'Dor de cabeça',
  fatigue:      'Fadiga',
  nausea:       'Náusea',
  dizziness:    'Tontura',
  vomito:       'Vômito',
  tontura:      'Tontura',
  'dor de cabeça': 'Dor de cabeça',
  'cãibras':    'Cãibras',
};

function traduzirSintomas(symptomsStr) {
  return symptomsStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s && s !== 'none')
    .map(s => SYMPTOM_PT[s] || s)
    .join(', ');
}

export default function Triagem() {
  const navigate = useNavigate();
  const [screeningAlerts, setScreeningAlerts] = useState([]);
  const [counts, setCounts] = useState({ critico: 0, atencao: 0, ok: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadScreeningData = async () => {
      setIsLoading(true);
      try {
        const resGroups = await api.get('/groups/coach');
        const compiledAthletes = [];
        const seenIds = new Set();

        for (const g of resGroups.data) {
          const resAthletes = await api.get(`/groups/${g.id}/athletes`);
          for (const a of resAthletes.data) {
            if (!seenIds.has(a.id)) {
              seenIds.add(a.id);
              compiledAthletes.push(a);
            }
          }
        }

        const alerts = [];
        let criticoCount = 0;
        let atencaoCount = 0;

        compiledAthletes.forEach(athlete => {
          const latest = athlete.latestSession;
          if (!latest) return;

          const calc = latest.calculated;
          const initial = latest.sessionInitial;
          const post = latest.sessionPost;

          if (calc?.riskLevel === 'high' || calc?.riskLevel === 'critical') {
            const severity = calc.riskLevel === 'critical' ? 'Crítico' : 'Atenção';
            if (severity === 'Crítico') criticoCount++; else atencaoCount++;

            alerts.push({
              id: `${athlete.id}-dehyd`,
              athleteId: athlete.id,
              name: athlete.name,
              initials: athlete.name[0],
              signal: 'Desidratação Severa',
              indicator: `-${calc.dehydrationPct?.toFixed(1)}% massa`,
              limit: '> 2% massa',
              severity,
              recommendation: calc.riskLevel === 'critical'
                ? 'Perda crítica > 2%. Risco de choque por exaustão. Iniciar reposição hídrica de emergência.'
                : 'Perda significativa. Ingerir 150% da perda em fluidos nas próximas 2 horas.'
            });
          }

          if (initial?.urineColor && initial.urineColor >= 5) {
            atencaoCount++;
            alerts.push({
              id: `${athlete.id}-urine`,
              athleteId: athlete.id,
              name: athlete.name,
              initials: athlete.name[0],
              signal: 'Hipoidratação Pré',
              indicator: `Urina cor ${initial.urineColor}`,
              limit: 'Escala >= 5',
              severity: 'Atenção',
              recommendation: 'Atleta iniciou a sessão já desidratado. Estimular ingestão hídrica prévia.'
            });
          }

          if (calc?.electrolyteRisk === 'high') {
            atencaoCount++;
            alerts.push({
              id: `${athlete.id}-electro`,
              athleteId: athlete.id,
              name: athlete.name,
              initials: athlete.name[0],
              signal: 'Risco Eletrolítico',
              indicator: 'Sódio esgotado',
              limit: 'Perfil Salino Elevado',
              severity: 'Atenção',
              recommendation: 'Atleta apresenta alto índice de perda de sódio. Incluir eletrólitos/cápsulas de sal.'
            });
          }

          if (post?.symptoms && post.symptoms !== 'none') {
            const symptomsArray = post.symptoms.split(',').map(s => s.trim().toLowerCase());
            const hasCriticalSymptoms = symptomsArray.includes('nausea') || symptomsArray.includes('tontura') || symptomsArray.includes('dizziness') || symptomsArray.includes('vomito');
            const hasAttentionSymptoms = symptomsArray.includes('cramps') || symptomsArray.includes('cãibras') || symptomsArray.includes('headache') || symptomsArray.includes('dor de cabeça');

            if (hasCriticalSymptoms) {
              criticoCount++;
              alerts.push({
                id: `${athlete.id}-critsymp`,
                athleteId: athlete.id,
                name: athlete.name,
                initials: athlete.name[0],
                signal: 'Sintomas Clínicos',
                indicator: traduzirSintomas(post.symptoms),
                limit: 'Sintomático Crítico',
                severity: 'Crítico',
                recommendation: 'Sintomas severos relatados (náusea/tontura). Pausar treino e acompanhar clinicamente.'
              });
            } else if (hasAttentionSymptoms) {
              atencaoCount++;
              alerts.push({
                id: `${athlete.id}-attsymp`,
                athleteId: athlete.id,
                name: athlete.name,
                initials: athlete.name[0],
                signal: 'Sintomas Clínicos',
                indicator: traduzirSintomas(post.symptoms),
                limit: 'Sintomático Moderado',
                severity: 'Atenção',
                recommendation: 'Atleta com dores de cabeça ou cãibras musculares. Ajustar protocolo de eletrólitos.'
              });
            }
          }
        });

        const total = compiledAthletes.length;
        const ok = Math.max(total - criticoCount - atencaoCount, 0);

        setScreeningAlerts(alerts);
        setCounts({
          critico: criticoCount,
          atencao: atencaoCount,
          ok,
          total
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadScreeningData();
  }, []);

  const totalAlertsCount = counts.critico + counts.atencao;

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <TopBar title="Triagem de Risco" subtitle="Avaliação automática clínica fisiológica dos atletas" />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            Carregando triagens clínicas...
          </div>
        ) : (
          <div className="p-8 max-w-[1400px] w-full space-y-6">
            {totalAlertsCount > 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-amber-800 font-bold text-sm">
                    {totalAlertsCount} sinalizações de risco clínico/fisiológico ativas hoje
                  </h3>
                  <p className="text-amber-700/80 text-xs mt-1">
                    Verifique as recomendações de segurança sugeridas na tabela abaixo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-800 font-bold text-sm">Nenhum atleta apresenta risco clínico</h3>
                  <p className="text-green-700/80 text-xs mt-1">Todos os atletas que sincronizaram treinos estão em estado saudável.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-red-500">
                <div className="text-3xl font-extrabold text-red-500">{counts.critico}</div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Crítico</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-amber-400">
                <div className="text-3xl font-extrabold text-amber-400">{counts.atencao}</div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Atenção</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-emerald-400">
                <div className="text-3xl font-extrabold text-emerald-400">{counts.ok}</div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">OK / Seguro</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 border-t-4 border-t-[#B91C1C]">
                <div className="text-3xl font-extrabold text-[#B91C1C]">{counts.total}</div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Total de Atletas</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden mt-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                      <th className="p-5 font-black">Atleta</th>
                      <th className="p-5 font-black">Sinal Clínico</th>
                      <th className="p-5 font-black">Indicador</th>
                      <th className="p-5 font-black">Limiar</th>
                      <th className="p-5 font-black">Severidade</th>
                      <th className="p-5 font-black">Recomendação do Sistema</th>
                      <th className="p-5 font-black text-right pr-8">Análise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {screeningAlerts.length > 0 ? (
                      screeningAlerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#B91C1C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                {alert.initials}
                              </div>
                              <span className="font-extrabold text-gray-800 text-sm">{alert.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-sm text-gray-600 font-bold">{alert.signal}</td>
                          <td className="p-5 text-sm text-gray-600 font-semibold">{alert.indicator}</td>
                          <td className="p-5 text-sm text-gray-400 font-bold">{alert.limit}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter inline-flex items-center
                              ${alert.severity === 'Crítico' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}
                            `}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="p-5 text-xs text-gray-500 font-medium max-w-xs leading-relaxed">{alert.recommendation}</td>
                          <td className="p-5 pr-5 text-right">
                            <button 
                              onClick={() => navigate(`/sudorese?athleteId=${alert.athleteId}`)}
                              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
                            >
                              Análise <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-400 text-xs font-semibold">
                          Nenhum alerta de risco clínico ativo no momento
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}
