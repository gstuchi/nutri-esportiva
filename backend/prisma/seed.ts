import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação do banco de dados (seed)...');

  // Limpar tabelas para evitar duplicações
  await prisma.notificationLog.deleteMany();
  await prisma.sessionCalculated.deleteMany();
  await prisma.sessionPost.deleteMany();
  await prisma.sessionDuring.deleteMany();
  await prisma.sessionInitial.deleteMany();
  await prisma.session.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.group.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync('123456', 10);

  // 1. Criar Coach Carlos
  const coachUser = await prisma.user.create({
    data: {
      name: 'Carlos Coach',
      email: 'coach@nutri.com',
      passwordHash,
      role: 'coach',
      coachProfile: {
        create: {
          credential: 'CREF 012345-G/SP',
          bio: 'Treinador de alto rendimento especializado em maratonas e ciclismo de estrada.'
        }
      }
    }
  });
  console.log('✅ Coach criado: coach@nutri.com');

  // 2. Criar Atleta Ana
  const athleteUser1 = await prisma.user.create({
    data: {
      name: 'Ana Silva',
      email: 'atleta@nutri.com',
      passwordHash,
      role: 'athlete',
      athleteProfile: {
        create: {
          birthDate: new Date('1995-05-15'),
          weightKg: 62.5,
          heightCm: 168,
          sweatTaste: 'salty',
          sweatMarks: 'always',
          crampHistory: 'during'
        }
      }
    }
  });
  console.log('✅ Atleta 1 criado: atleta@nutri.com');

  // 3. Criar Atleta Bruno (Atleta com desidratação crônica mockada)
  const athleteUser2 = await prisma.user.create({
    data: {
      name: 'Bruno Ramos',
      email: 'bruno@nutri.com',
      passwordHash,
      role: 'athlete',
      athleteProfile: {
        create: {
          birthDate: new Date('1990-11-20'),
          weightKg: 80.0,
          heightCm: 182,
          sweatTaste: 'normal',
          sweatMarks: 'sometimes',
          crampHistory: 'after'
        }
      }
    }
  });
  console.log('✅ Atleta 2 criado: bruno@nutri.com');

  // 4. Criar Grupo e Associar Atletas
  const group = await prisma.group.create({
    data: {
      name: 'Equipe Maratona SP',
      code: 'HID-CORR',
      description: 'Grupo focado no treinamento para a maratona internacional de São Paulo.',
      coachId: coachUser.id,
      memberships: {
        createMany: {
          data: [
            { athleteId: athleteUser1.id, status: 'active' },
            { athleteId: athleteUser2.id, status: 'active' }
          ]
        }
      }
    }
  });
  console.log(`✅ Grupo criado: Equipe Maratona SP (Código: ${group.code})`);

  // 5. Inserir pesos no WeightLog
  await prisma.weightLog.createMany({
    data: [
      { athleteId: athleteUser1.id, weightKg: 62.5, source: 'manual', measuredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
      { athleteId: athleteUser2.id, weightKg: 80.0, source: 'manual', measuredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) }
    ]
  });

  // 6. Criar uma sessão finalizada para a Atleta Ana (com perda de peso expressiva)
  const session1 = await prisma.session.create({
    data: {
      athleteId: athleteUser1.id,
      groupId: group.id,
      sportModality: 'Corrida',
      sessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // ontem
      status: 'completed',
      sessionInitial: {
        create: {
          timeStart: '08:00',
          bodyWeightKg: 62.5,
          urineColor: 3,
          temperatureCelsius: 29.0,
          humidityPercent: 65.0,
          solarExposure: 'full',
          preSessionFluidMl: 300,
          preSessionUrineColor: 3
        }
      },
      sessionDuring: {
        create: {
          waterIngestedMl: 600,
          fluidType: 'water',
          perceivedExertionRpe: 7
        }
      },
      sessionPost: {
        create: {
          timeEnd: '09:30',
          bodyWeightPostKg: 60.8, // perdeu 1.7kg
          hydrationPlanTolerance: 'good',
          notes: 'Treino de corrida no parque, clima ensolarado e abafado.',
          symptoms: 'cramps,headache',
          postSessionFluidMl: 1000
        }
      },
      calculated: {
        create: {
          durationMinutes: 90,
          sweatRateMlPerHour: 1533.33, // ((62.5 - 60.8) * 1000 + 600) / 1.5h = (1700 + 600) / 1.5 = 1533 ml/h
          dehydrationPct: 2.72, // (1.7 / 62.5) * 100 = 2.72%
          dehydrationScore: 68,
          hydrationRecommendationMl: 1380,
          riskLevel: 'moderate',
          electrolyteRisk: 'high', // > 60min com agua pura e sweatTaste salty
          rehydrationTargetMl: 2125, // 1.7kg * 1000 * 1.25 = 2125 ml
          rehydrationAdherence: 'partial', // tomou 1000ml (menos que 2125ml)
          calculationVersion: 'v1.0'
        }
      }
    }
  });

  // Adicionar o peso da sessão ao WeightLog
  await prisma.weightLog.create({
    data: {
      athleteId: athleteUser1.id,
      weightKg: 62.5,
      source: 'session',
      measuredAt: session1.sessionDate
    }
  });

  // 7. Gerar Alertas de teste para a Ana
  await prisma.notificationLog.create({
    data: {
      athleteId: athleteUser1.id,
      sessionId: session1.id,
      coachId: coachUser.id,
      type: 'electrolyte_warning',
      channel: 'in_app',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  });

  console.log('🌱 Banco de dados semeado com sucesso! Pronto para testes acadêmicos.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
