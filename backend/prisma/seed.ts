import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados...');

  await prisma.notificationLog.deleteMany();
  await prisma.sessionCalculated.deleteMany();
  await prisma.sessionPost.deleteMany();
  await prisma.sessionDuring.deleteMany();
  await prisma.sessionInitial.deleteMany();
  await prisma.session.deleteMany();
  await prisma.electrolyteAssessment.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.group.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = bcrypt.hashSync('123456', 10);

  // ── COACH ──────────────────────────────────────────────────────────
  const coach = await prisma.user.create({
    data: {
      name: 'Carlos Coach',
      email: 'coach@nutri.com',
      passwordHash: hash,
      role: 'coach',
      coachProfile: { create: { credential: 'CREF 012345-G/SP', bio: 'Treinador de alto rendimento.' } },
    },
  });
  console.log('✅ Coach: coach@nutri.com / 123456');

  // ── ATLETAS ────────────────────────────────────────────────────────
  const ana = await prisma.user.create({
    data: {
      name: 'Ana Silva',
      email: 'atleta@nutri.com',
      passwordHash: hash,
      role: 'athlete',
      athleteProfile: {
        create: {
          birthDate: new Date('1995-05-15'),
          weightKg: 62.5,
          heightCm: 168,
          sexo: 'feminino',
          modalidadePrincipal: 'Corrida de Rua',
          sweatTaste: 'salty',
          sweatMarks: 'always',
          crampHistory: 'during',
        },
      },
    },
  });

  const bruno = await prisma.user.create({
    data: {
      name: 'Bruno Ramos',
      email: 'bruno@nutri.com',
      passwordHash: hash,
      role: 'athlete',
      athleteProfile: {
        create: {
          birthDate: new Date('1990-11-20'),
          weightKg: 80.0,
          heightCm: 182,
          sexo: 'masculino',
          modalidadePrincipal: 'Ciclismo',
          sweatTaste: 'normal',
          sweatMarks: 'sometimes',
          crampHistory: 'after',
        },
      },
    },
  });

  const julia = await prisma.user.create({
    data: {
      name: 'Julia Ferreira',
      email: 'julia@nutri.com',
      passwordHash: hash,
      role: 'athlete',
      athleteProfile: {
        create: {
          birthDate: new Date('1998-03-22'),
          weightKg: 55.0,
          heightCm: 162,
          sexo: 'feminino',
          modalidadePrincipal: 'Natação',
          sweatTaste: 'not_sure',
          sweatMarks: 'rarely',
          crampHistory: 'never',
        },
      },
    },
  });
  console.log('✅ Atletas: Ana, Bruno, Julia criados');

  // ── GRUPO ──────────────────────────────────────────────────────────
  const group = await prisma.group.create({
    data: {
      name: 'Equipe Maratona SP',
      code: 'HID-CORR',
      description: 'Grupo focado no treinamento para a maratona de São Paulo.',
      coachId: coach.id,
      memberships: {
        createMany: {
          data: [
            { athleteId: ana.id, status: 'active' },
            { athleteId: bruno.id, status: 'active' },
            { athleteId: julia.id, status: 'active' },
          ],
        },
      },
    },
  });
  console.log(`✅ Grupo: ${group.name} (${group.code})`);

  // ── AVALIAÇÕES ELETROLÍTICAS ────────────────────────────────────────
  await prisma.electrolyteAssessment.create({
    data: {
      athleteId: ana.id,
      sweatMarksScore: 2,
      crampScore: 2,
      saltyScore: 2,
      concentration: 1,
      createdAt: new Date(Date.now() - 7 * 864e5),
    },
  });
  await prisma.electrolyteAssessment.create({
    data: {
      athleteId: bruno.id,
      sweatMarksScore: 1,
      crampScore: 2,
      saltyScore: 1,
      concentration: 1,
      createdAt: new Date(Date.now() - 5 * 864e5),
    },
  });
  console.log('✅ Avaliações eletrolíticas criadas');

  // ── HELPER: criar sessão completa ──────────────────────────────────
  async function criarSessao(opts: {
    athleteId: string;
    groupId: string;
    daysAgo: number;
    modality: string;
    weightBefore: number;
    weightAfter: number;
    waterMl: number;
    rpe: number;
    durationMin: number;
    riskLevel: string;
    electrolyteRisk: string;
    symptoms: string;
  }) {
    const date = new Date(Date.now() - opts.daysAgo * 864e5);
    const sweatRate =
      ((opts.weightBefore - opts.weightAfter) * 1000 + opts.waterMl) /
      (opts.durationMin / 60);
    const dehydPct =
      ((opts.weightBefore - opts.weightAfter) / opts.weightBefore) * 100;
    const rehydTarget = Math.round(
      (opts.weightBefore - opts.weightAfter) * 1000 * 1.25
    );

    await prisma.session.create({
      data: {
        athleteId: opts.athleteId,
        groupId: opts.groupId,
        sportModality: opts.modality,
        sessionDate: date,
        status: 'completed',
        sessionInitial: {
          create: {
            timeStart: '07:00',
            bodyWeightKg: opts.weightBefore,
            urineColor: 3,
            temperatureCelsius: 28,
            humidityPercent: 65,
            solarExposure: 'full',
            preSessionFluidMl: 300,
            preSessionUrineColor: 3,
          },
        },
        sessionDuring: {
          create: {
            waterIngestedMl: opts.waterMl,
            fluidType: 'water',
            perceivedExertionRpe: opts.rpe,
          },
        },
        sessionPost: {
          create: {
            timeEnd: '08:30',
            bodyWeightPostKg: opts.weightAfter,
            hydrationPlanTolerance: 'partial',
            symptoms: opts.symptoms,
            postSessionFluidMl: 800,
          },
        },
        calculated: {
          create: {
            durationMinutes: opts.durationMin,
            sweatRateMlPerHour: Math.round(sweatRate),
            dehydrationPct: parseFloat(dehydPct.toFixed(2)),
            dehydrationScore: Math.min(100, Math.round(dehydPct * 15 + opts.rpe * 3)),
            hydrationRecommendationMl: Math.round(sweatRate * 0.8),
            riskLevel: opts.riskLevel,
            electrolyteRisk: opts.electrolyteRisk,
            rehydrationTargetMl: rehydTarget,
            rehydrationAdherence: 800 >= rehydTarget ? 'full' : 800 >= rehydTarget * 0.5 ? 'partial' : 'none',
            calculationVersion: 'v1.0',
          },
        },
      },
    });
  }

  // ── SESSÕES DA ANA (6 treinos) ─────────────────────────────────────
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 22, modality: 'Corrida', weightBefore: 62.5, weightAfter: 61.4, waterMl: 500, rpe: 6, durationMin: 180, riskLevel: 'low', electrolyteRisk: 'moderate', symptoms: 'none' });
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 18, modality: 'Corrida', weightBefore: 62.3, weightAfter: 60.5, waterMl: 600, rpe: 8, durationMin: 90, riskLevel: 'high', electrolyteRisk: 'high', symptoms: 'cramps,headache' });
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 14, modality: 'Corrida', weightBefore: 62.6, weightAfter: 61.4, waterMl: 700, rpe: 6, durationMin: 75, riskLevel: 'low', electrolyteRisk: 'moderate', symptoms: 'none' });
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 10, modality: 'Corrida', weightBefore: 62.5, weightAfter: 60.9, waterMl: 550, rpe: 8, durationMin: 90, riskLevel: 'moderate', electrolyteRisk: 'high', symptoms: 'fatigue' });
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 5, modality: 'Corrida', weightBefore: 62.8, weightAfter: 61.2, waterMl: 500, rpe: 7, durationMin: 75, riskLevel: 'moderate', electrolyteRisk: 'high', symptoms: 'cramps' });
  await criarSessao({ athleteId: ana.id, groupId: group.id, daysAgo: 1, modality: 'Corrida', weightBefore: 62.5, weightAfter: 60.8, waterMl: 600, rpe: 7, durationMin: 90, riskLevel: 'moderate', electrolyteRisk: 'high', symptoms: 'cramps,headache' });
  console.log('✅ 6 sessões da Ana criadas');

  // ── SESSÕES DO BRUNO (5 treinos) ───────────────────────────────────
  await criarSessao({ athleteId: bruno.id, groupId: group.id, daysAgo: 20, modality: 'Ciclismo', weightBefore: 80.0, weightAfter: 79.2, waterMl: 800, rpe: 5, durationMin: 60, riskLevel: 'low', electrolyteRisk: 'low', symptoms: 'none' });
  await criarSessao({ athleteId: bruno.id, groupId: group.id, daysAgo: 15, modality: 'Ciclismo', weightBefore: 80.2, weightAfter: 79.0, waterMl: 600, rpe: 6, durationMin: 75, riskLevel: 'low', electrolyteRisk: 'moderate', symptoms: 'none' });
  await criarSessao({ athleteId: bruno.id, groupId: group.id, daysAgo: 10, modality: 'Ciclismo', weightBefore: 80.5, weightAfter: 78.9, waterMl: 500, rpe: 7, durationMin: 90, riskLevel: 'moderate', electrolyteRisk: 'moderate', symptoms: 'fatigue' });
  await criarSessao({ athleteId: bruno.id, groupId: group.id, daysAgo: 5, modality: 'Ciclismo', weightBefore: 80.0, weightAfter: 78.4, waterMl: 700, rpe: 6, durationMin: 90, riskLevel: 'moderate', electrolyteRisk: 'moderate', symptoms: 'none' });
  await criarSessao({ athleteId: bruno.id, groupId: group.id, daysAgo: 2, modality: 'Ciclismo', weightBefore: 80.3, weightAfter: 78.0, waterMl: 600, rpe: 8, durationMin: 90, riskLevel: 'high', electrolyteRisk: 'high', symptoms: 'fatigue,cramps' });
  console.log('✅ 5 sessões do Bruno criadas');

  // ── SESSÕES DA JULIA (3 treinos) ───────────────────────────────────
  await criarSessao({ athleteId: julia.id, groupId: group.id, daysAgo: 15, modality: 'Natação', weightBefore: 55.0, weightAfter: 54.5, waterMl: 400, rpe: 5, durationMin: 60, riskLevel: 'low', electrolyteRisk: 'low', symptoms: 'none' });
  await criarSessao({ athleteId: julia.id, groupId: group.id, daysAgo: 8, modality: 'Natação', weightBefore: 55.2, weightAfter: 54.6, waterMl: 450, rpe: 5, durationMin: 60, riskLevel: 'low', electrolyteRisk: 'low', symptoms: 'none' });
  await criarSessao({ athleteId: julia.id, groupId: group.id, daysAgo: 2, modality: 'Natação', weightBefore: 55.1, weightAfter: 54.7, waterMl: 500, rpe: 6, durationMin: 60, riskLevel: 'low', electrolyteRisk: 'low', symptoms: 'none' });
  console.log('✅ 3 sessões da Julia criadas');

  console.log('\n🎉 Banco populado com sucesso!');
  console.log('📧 Logins (senha: 123456)');
  console.log('   coach@nutri.com   → Dashboard do Técnico');
  console.log('   atleta@nutri.com  → Atleta Ana (risco moderado/alto)');
  console.log('   bruno@nutri.com   → Atleta Bruno (risco moderado)');
  console.log('   julia@nutri.com   → Atleta Julia (risco baixo)');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
