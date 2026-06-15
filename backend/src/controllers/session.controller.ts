import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { calculateSessionHydration } from '../services/calculation.engine';

// Helper para calcular a duração em minutos entre "HH:MM" de início e término
function calculateDuration(start: string, end: string): number {
  try {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      return 0;
    }

    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) {
      // Cruzou a meia-noite (adicionar 24 horas)
      diff += 24 * 60;
    }
    return diff;
  } catch {
    return 0;
  }
}

export function formatSessionResultsForFrontend(session: any) {
  if (!session) return null;
  const calc = session.calculated || {};
  const initial = session.sessionInitial || {};
  const during = session.sessionDuring || {};
  const post = session.sessionPost || {};
  
  return {
    id: session.id,
    athlete_id: session.athleteId,
    group_id: session.groupId,
    sport_modality: session.sportModality,
    status: session.status,
    session_date: session.sessionDate,
    created_at: session.createdAt,
    
    // Flat calculated results
    sweat_rate_ml_per_h: calc.sweatRateMlPerHour || null,
    dehydration_pct: calc.dehydrationPct || null,
    dehydration_score: calc.dehydrationScore || null,
    hydration_recommendation_ml: calc.hydrationRecommendationMl || null,
    risk_level: calc.riskLevel || 'low',
    electrolyte_risk: calc.electrolyteRisk || 'low',
    rehydration_target_ml: calc.rehydrationTargetMl || null,
    rehydration_adherence: calc.rehydrationAdherence || 'none',
    duration_minutes: (calc.durationMinutes !== undefined && calc.durationMinutes !== null) ? calc.durationMinutes : null,
    
    // Embedded relationships in expected formats
    initial: {
      time_start: initial.timeStart,
      body_weight_kg: initial.bodyWeightKg,
      urine_color: initial.urineColor,
      temperature_celsius: initial.temperatureCelsius,
      humidity_percent: initial.humidityPercent,
      solar_exposure: initial.solarExposure,
      pre_session_fluid_ml: initial.preSessionFluidMl,
      pre_session_urine_color: initial.preSessionUrineColor,
    },
    during: {
      water_ingested_ml: during.waterIngestedMl,
      fluid_type: during.fluidType,
      perceived_exertion_rpe: during.perceivedExertionRpe,
    },
    post: {
      time_end: post.timeEnd,
      body_weight_post_kg: post.bodyWeightPostKg,
      hydration_plan_tolerance: post.hydrationPlanTolerance,
      notes: post.notes,
      symptoms: post.symptoms ? post.symptoms.split(',') : [],
      post_session_fluid_ml: post.postSessionFluidMl,
    },
    notifications: session.notifications || [],
  };
}

export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  const sportModality = req.body.sportModality || req.body.sport_modality;
  const bodyWeightKg = req.body.bodyWeightKg || req.body.body_weight_kg;
  const urineColor = req.body.urineColor !== undefined ? req.body.urineColor : req.body.urine_color;
  const temperatureCelsius = req.body.temperatureCelsius !== undefined ? req.body.temperatureCelsius : req.body.temperature_celsius;
  const humidityPercent = req.body.humidityPercent !== undefined ? req.body.humidityPercent : req.body.humidity_percent;
  const solarExposure = req.body.solarExposure || req.body.solar_exposure;
  const preSessionFluidMl = req.body.preSessionFluidMl !== undefined ? req.body.preSessionFluidMl : req.body.pre_session_fluid_ml;
  const preSessionUrineColor = req.body.preSessionUrineColor !== undefined ? req.body.preSessionUrineColor : req.body.pre_session_urine_color;

  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Atleta não identificado.' });
  }

  if (!sportModality || !bodyWeightKg || urineColor === undefined || urineColor === null) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: sportModality, bodyWeightKg, urineColor.' });
  }

  try {
    // Buscar se o atleta pertence a algum grupo ativo para associar
    const membership = await prisma.groupMembership.findFirst({
      where: { athleteId, status: 'active' }
    });
    const groupId = membership?.groupId || null;

    // Horário atual formatado como HH:MM
    const now = new Date();
    const timeStart = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const session = await prisma.$transaction(async (tx) => {
      // 1. Criar a sessão
      const newSession = await tx.session.create({
        data: {
          athleteId,
          groupId,
          sportModality,
          status: 'in_progress',
        }
      });

      // 2. Criar a SessionInitial
      await tx.sessionInitial.create({
        data: {
          sessionId: newSession.id,
          timeStart,
          bodyWeightKg: parseFloat(bodyWeightKg),
          urineColor: parseInt(urineColor),
          temperatureCelsius: temperatureCelsius ? parseFloat(temperatureCelsius) : 25.0,
          humidityPercent: humidityPercent ? parseFloat(humidityPercent) : 50.0,
          solarExposure: solarExposure || 'none',
          preSessionFluidMl: preSessionFluidMl ? parseInt(preSessionFluidMl) : null,
          preSessionUrineColor: preSessionUrineColor ? parseInt(preSessionUrineColor) : null,
        }
      });

      // 3. Registrar no histórico de peso (WeightLog)
      await tx.weightLog.create({
        data: {
          athleteId,
          weightKg: parseFloat(bodyWeightKg),
          source: 'session',
          measuredAt: newSession.sessionDate,
        }
      });

      return newSession;
    });


    // Buscar sessão completa com a etapa inicial inclusa
    const completeSession = await prisma.session.findUnique({
      where: { id: session.id },
      include: { sessionInitial: true }
    });

    return res.status(201).json(completeSession);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao iniciar sessão.' });
  }
};

export const updateDuring = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const waterIngestedMl = req.body.waterIngestedMl !== undefined ? req.body.waterIngestedMl : req.body.water_ingested_ml;
  const fluidType = req.body.fluidType || req.body.fluid_type;
  const perceivedExertionRpe = req.body.perceivedExertionRpe !== undefined ? req.body.perceivedExertionRpe : req.body.perceived_exertion_rpe;

  if (!id) {
    return res.status(400).json({ error: 'O ID da sessão é obrigatório.' });
  }

  if (waterIngestedMl === undefined || waterIngestedMl === null || !fluidType || perceivedExertionRpe === undefined || perceivedExertionRpe === null) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: waterIngestedMl, fluidType, perceivedExertionRpe.' });
  }

  try {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada.' });
    }

    if (session.status !== 'in_progress') {
      return res.status(400).json({ error: 'Esta sessão já foi concluída e não pode ser editada durante o treino.' });
    }

    // Criar ou atualizar SessionDuring (1:1 com Session)
    const sessionDuring = await prisma.sessionDuring.upsert({
      where: { sessionId: id },
      update: {
        waterIngestedMl: parseInt(waterIngestedMl),
        fluidType,
        perceivedExertionRpe: parseInt(perceivedExertionRpe)
      },
      create: {
        sessionId: id,
        waterIngestedMl: parseInt(waterIngestedMl),
        fluidType,
        perceivedExertionRpe: parseInt(perceivedExertionRpe)
      }
    });

    return res.status(200).json({ message: 'Durante-sessão atualizado com sucesso!', sessionDuring });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar dados durante o treino.' });
  }
};

export const finishSession = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const bodyWeightPostKg = req.body.bodyWeightPostKg || req.body.body_weight_post_kg;
  const hydrationPlanTolerance = req.body.hydrationPlanTolerance || req.body.hydration_plan_tolerance;
  const notes = req.body.notes;
  const symptoms = req.body.symptoms;
  const postSessionFluidMl = req.body.postSessionFluidMl !== undefined ? req.body.postSessionFluidMl : req.body.post_session_fluid_ml;

  if (!id) {
    return res.status(400).json({ error: 'O ID da sessão é obrigatório.' });
  }

  if (!bodyWeightPostKg || !hydrationPlanTolerance) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: bodyWeightPostKg, hydrationPlanTolerance.' });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        sessionInitial: true,
        sessionDuring: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada.' });
    }

    if (session.status !== 'in_progress') {
      return res.status(400).json({ error: 'Esta sessão já foi encerrada.' });
    }

    if (!session.sessionInitial) {
      return res.status(400).json({ error: 'A sessão não possui dados iniciais registrados.' });
    }

    // Horário de fim atual HH:MM
    const now = new Date();
    const timeEnd = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Normalizar sintomas
    const symptomsArray = Array.isArray(symptoms) ? symptoms : [];
    const symptomsString = symptomsArray.length > 0 ? symptomsArray.join(',') : 'none';

    // Se o durante-sessão não foi preenchido, gerar um default básico
    const during = session.sessionDuring || await prisma.sessionDuring.create({
      data: {
        sessionId: id,
        waterIngestedMl: 0,
        fluidType: 'water',
        perceivedExertionRpe: 5
      }
    });

    // Calcular duração real
    const durationMinutes = calculateDuration(session.sessionInitial.timeStart, timeEnd);

    // Disparar transação para salvar SessionPost, atualizar status e rodar Engine de Cálculo
    const calculatedResult = await prisma.$transaction(async (tx) => {
      // 1. Criar SessionPost
      const post = await tx.sessionPost.create({
        data: {
          sessionId: id,
          timeEnd,
          bodyWeightPostKg: parseFloat(bodyWeightPostKg),
          hydrationPlanTolerance,
          notes: notes || null,
          symptoms: symptomsString,
          postSessionFluidMl: postSessionFluidMl ? parseInt(postSessionFluidMl) : null,
        }
      });

      // 2. Atualizar status da sessão
      await tx.session.update({
        where: { id },
        data: { status: 'completed' }
      });

      // 3. Executar o motor de cálculo científico (cria alertas automaticamente)
      const results = await calculateSessionHydration({
        weightInitial: session.sessionInitial!.bodyWeightKg,
        weightPost: parseFloat(bodyWeightPostKg),
        durationMinutes,
        waterIngestedMl: during.waterIngestedMl,
        fluidType: during.fluidType,
        urineColorInitial: session.sessionInitial!.urineColor,
        preSessionUrineColor: session.sessionInitial!.preSessionUrineColor || undefined,
        perceivedExertionRpe: during.perceivedExertionRpe,
        symptoms: symptomsArray,
        athleteId: session.athleteId,
        sessionId: id,
        groupId: session.groupId
      }, tx);

      // Avaliar reidratação pós se houver
      let rehydrationAdherence: 'full' | 'partial' | 'none' = 'none';
      if (postSessionFluidMl && results.rehydrationTargetMl > 0) {
        const mlIngested = parseInt(postSessionFluidMl);
        if (mlIngested >= results.rehydrationTargetMl) {
          rehydrationAdherence = 'full';
        } else if (mlIngested >= results.rehydrationTargetMl * 0.5) {
          rehydrationAdherence = 'partial';
        }
      }

      // 4. Salvar cálculos persistidos no banco
      const calculatedRecord = await tx.sessionCalculated.create({
        data: {
          sessionId: id,
          durationMinutes,
          sweatRateMlPerHour: results.sweatRateMlPerHour,
          dehydrationPct: results.dehydrationPct,
          dehydrationScore: results.dehydrationScore,
          hydrationRecommendationMl: results.hydrationRecommendationMl,
          riskLevel: results.riskLevel,
          electrolyteRisk: results.electrolyteRisk,
          rehydrationTargetMl: results.rehydrationTargetMl,
          rehydrationAdherence,
          calculationVersion: 'v1.0'
        }
      });

      return calculatedRecord;
    });

    // Buscar a sessão completa pós-calculada com todas as relações e alertas
    const fullSession = await prisma.session.findUnique({
      where: { id },
      include: {
        sessionInitial: true,
        sessionDuring: true,
        sessionPost: true,
        calculated: true,
        notifications: true
      }
    });

    return res.status(200).json(formatSessionResultsForFrontend(fullSession));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao finalizar e calcular sessão.' });
  }
};

export const fetchSessionResults = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'O ID da sessão é obrigatório.' });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        sessionInitial: true,
        sessionDuring: true,
        sessionPost: true,
        calculated: true,
        notifications: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada.' });
    }

    // Validação básica de posse
    if (req.user?.role === 'athlete' && session.athleteId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado às informações de outro atleta.' });
    }

    return res.status(200).json(formatSessionResultsForFrontend(session));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar resultados da sessão.' });
  }
};

export const fetchAthleteHistory = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: { athleteId, status: 'completed' },
      include: {
        calculated: true,
        sessionInitial: true,
        sessionDuring: true,
        sessionPost: true,
        notifications: true
      },
      orderBy: { sessionDate: 'desc' }
    });
    return res.status(200).json(sessions.map(formatSessionResultsForFrontend));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar histórico de treinos.' });
  }
};

export const getActiveSession = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const session = await prisma.session.findFirst({
      where: { athleteId, status: 'in_progress' },
      include: {
        sessionInitial: true,
        sessionDuring: true
      }
    });
    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar sessão ativa.' });
  }
};
