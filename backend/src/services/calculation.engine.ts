import { prisma } from '../config/prisma';

export interface CalculationInputs {
  weightInitial: number;        // peso inicial em kg
  weightPost: number;           // peso pós em kg
  durationMinutes: number;      // duração em minutos
  waterIngestedMl: number;      // água/líquido ingerido em ml
  fluidType: string;            // tipo de bebida ("water", "isotonic", "hypertonic", "other")
  urineColorInitial: number;    // cor da urina pré (1 a 8)
  preSessionUrineColor?: number; // cor da urina antes do treino (1 a 8)
  perceivedExertionRpe: number; // escala de Borg (0 a 10)
  symptoms: string[];           // sintomas ("nausea", "cramps", etc.)
  athleteId: string;            // ID do atleta
  sessionId: string;            // ID da sessão
  groupId?: string | null;      // ID do grupo (opcional)
}

export interface CalculationResults {
  sweatRateMlPerHour: number;
  dehydrationPct: number;
  dehydrationScore: number;
  hydrationRecommendationMl: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  electrolyteRisk: 'low' | 'moderate' | 'high';
  rehydrationTargetMl: number;
  rehydrationAdherence: 'full' | 'partial' | 'none';
  durationMinutes: number;
}

export async function calculateSessionHydration(inputs: CalculationInputs, client: any = prisma): Promise<CalculationResults> {
  const {
    weightInitial,
    weightPost,
    durationMinutes,
    waterIngestedMl,
    fluidType,
    urineColorInitial,
    preSessionUrineColor,
    perceivedExertionRpe,
    symptoms,
    athleteId,
    sessionId,
    groupId
  } = inputs;

  const durationHours = durationMinutes / 60;
  
  // 1. Taxa de Sudorese (sweatRateMlPerHour)
  // Fórmula: ((peso_antes - peso_depois) * 1000 + agua_ingerida) / duracao_horas
  const weightLossKg = weightInitial - weightPost;
  const sweatRateMlPerHour = durationHours > 0 
    ? Math.max(0, ((weightLossKg * 1000) + waterIngestedMl) / durationHours)
    : 0;

  // 2. Percentual de Desidratação (dehydrationPct)
  // Fórmula: ((peso_antes - peso_depois) / peso_antes) * 100
  const dehydrationPct = weightInitial > 0
    ? Math.max(0, (weightLossKg / weightInitial) * 100)
    : 0;

  // 3. Score de Desidratação Integrado (dehydrationScore) [0-100]
  // Baseado no percentual de perda de peso, cor da urina Armstrong, esforço Borg RPE e sintomas relatados.
  let dehydrationScore = 0;

  // Peso da desidratação em si (até 40 pontos)
  dehydrationScore += Math.min(40, dehydrationPct * 20); // 2% = 40 pts

  // Peso da urina de Armstrong (até 25 pontos)
  const finalUrineColor = Math.max(1, Math.min(8, urineColorInitial));
  dehydrationScore += (finalUrineColor - 1) * 3.5; // cor 8 = 24.5 pts

  // Peso da Percepção de Esforço RPE (até 15 pontos)
  const finalRpe = Math.max(0, Math.min(10, perceivedExertionRpe));
  dehydrationScore += finalRpe * 1.5; // RPE 10 = 15 pts

  // Peso dos sintomas clínicos (até 20 pontos)
  let symptomsScore = 0;
  if (!symptoms.includes('none')) {
    symptoms.forEach((symptom) => {
      switch (symptom) {
        case 'vomiting':
        case 'fainting':
          symptomsScore += 12;
          break;
        case 'nausea':
        case 'cramps':
        case 'blurred_vision':
        case 'dizziness':
          symptomsScore += 8;
          break;
        case 'headache':
        case 'gi_pain':
        case 'bloating':
        case 'diarrhea':
          symptomsScore += 5;
          break;
      }
    });
  }
  dehydrationScore += Math.min(20, symptomsScore);

  // Arredondar e limitar a 100
  dehydrationScore = Math.min(100, Math.max(0, Math.round(dehydrationScore)));

  // 4. Recomendação de Hidratação preventiva para a próxima sessão (hydrationRecommendationMl)
  // Base: sweat_rate * duração média de 1 hora + acréscimo climático (já embutido na taxa)
  const hydrationRecommendationMl = Math.round(sweatRateMlPerHour);

  // 5. Nível de Risco Fisiológico (riskLevel)
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';

  if (dehydrationScore >= 75) {
    riskLevel = 'critical';
  } else if (dehydrationScore >= 50) {
    riskLevel = 'high';
  } else if (dehydrationScore >= 25) {
    riskLevel = 'moderate';
  }

  // Regra de Negócio: Urina pré-treino indica desidratação prévia (Armstrong >= 6)
  // O risco parte no mínimo de moderate
  if (preSessionUrineColor && preSessionUrineColor >= 6) {
    if (riskLevel === 'low') {
      riskLevel = 'moderate';
    }
  }

  // Regra de Negócio: Esforço muito alto (RPE >= 8) com perda hídrica expressiva (> 2% peso)
  // O risco nunca pode ser low (mínimo moderate)
  if (dehydrationPct > 2 && perceivedExertionRpe >= 8) {
    if (riskLevel === 'low') {
      riskLevel = 'moderate';
    }
  }

  // 6. Risco de Desequilíbrio Eletrolítico / Hiponatremia (electrolyteRisk)
  let electrolyteRisk: 'low' | 'moderate' | 'high' = 'low';

  // Buscar perfil eletrolítico do atleta para cruzar dados
  const athlete = await client.user.findUnique({
    where: { id: athleteId },
    include: { athleteProfile: true }
  });

  const isSaltySweat = athlete?.athleteProfile?.sweatTaste === 'salty';
  const hasFrequentCramps = athlete?.athleteProfile?.crampHistory === 'during' || athlete?.athleteProfile?.crampHistory === 'both';

  // Regra de Negócio: Sessões de treino prolongadas (> 60min) consumindo apenas água pura
  if (fluidType === 'water' && durationMinutes > 60) {
    electrolyteRisk = 'high';
  } else if (durationMinutes > 60 && (isSaltySweat || hasFrequentCramps)) {
    // Teve suor muito salgado ou histórico de câimbras mesmo com outro líquido
    electrolyteRisk = 'moderate';
  }

  // 7. Meta de Reidratação Pós-Exercício (rehydrationTargetMl)
  // Diretriz científica: repor 125% a 150% do peso perdido (adotaremos 125%)
  // 1 kg perdido = 1 Litro de água
  const rehydrationTargetMl = weightLossKg > 0
    ? Math.round(weightLossKg * 1000 * 1.25)
    : 0;

  // 8. Aderência da Reidratação Pós (rehydrationAdherence)
  // Será avaliada posteriormente no pós-treino através do postSessionFluidMl comparado ao rehydrationTargetMl
  let rehydrationAdherence: 'full' | 'partial' | 'none' = 'none';

  // 9. Gerar Notificações / Alertas Clínicos
  const coach = groupId 
    ? await client.group.findUnique({ where: { id: groupId } }).then((g: any) => g?.coachId)
    : null;

  // Alerta de Hiponatremia (Risco Eletrolítico Alto)
  if (electrolyteRisk === 'high') {
    await client.notificationLog.create({
      data: {
        athleteId,
        sessionId,
        coachId: coach || null,
        type: 'electrolyte_warning',
        channel: 'in_app'
      }
    });
  }

  // Alerta de Desidratação Prévia
  if (preSessionUrineColor && preSessionUrineColor >= 6) {
    await client.notificationLog.create({
      data: {
        athleteId,
        sessionId,
        type: 'dehydration_warning',
        channel: 'in_app'
      }
    });
  }

  // Alertas de Risco Crítico ou Alto (Tanto pro Atleta quanto pro Coach se houver grupo)
  if (riskLevel === 'high' || riskLevel === 'critical') {
    await client.notificationLog.create({
      data: {
        athleteId,
        sessionId,
        coachId: coach || null,
        type: riskLevel === 'critical' ? 'risk_critical' : 'risk_high',
        channel: 'in_app'
      }
    });
  }

  return {
    sweatRateMlPerHour: Math.round(sweatRateMlPerHour * 100) / 100,
    dehydrationPct: Math.round(dehydrationPct * 100) / 100,
    dehydrationScore,
    hydrationRecommendationMl,
    riskLevel,
    electrolyteRisk,
    rehydrationTargetMl,
    rehydrationAdherence,
    durationMinutes
  };
}
