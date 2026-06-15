const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const athleteId = 'ec7b5654-23ac-4bf7-9dba-9de3e511d296';
  const sportModality = 'Corrida';
  const bodyWeightKg = 75.0;

  // Mesma lógica do startSession
  const membership = await prisma.groupMembership.findFirst({
    where: { athleteId, status: 'active' }
  });
  const groupId = membership?.groupId || null;
  console.log('groupId encontrado:', groupId);

  const now = new Date();
  const timeStart = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const session = await prisma.$transaction(async (tx) => {
    console.log('Criando sessão...');
    const newSession = await tx.session.create({
      data: { athleteId, groupId, sportModality, status: 'in_progress' }
    });
    console.log('Sessão criada:', newSession.id);

    console.log('Criando SessionInitial...');
    await tx.sessionInitial.create({
      data: {
        sessionId: newSession.id,
        timeStart,
        bodyWeightKg,
        urineColor: 2,
        temperatureCelsius: 28.5,
        humidityPercent: 65,
        solarExposure: 'full',
        preSessionFluidMl: null,
        preSessionUrineColor: null,
      }
    });

    console.log('Criando WeightLog...');
    await tx.weightLog.create({
      data: { athleteId, weightKg: bodyWeightKg, source: 'session', measuredAt: newSession.sessionDate }
    });

    return newSession;
  });

  console.log('\nSESSAO CRIADA COM SUCESSO:', session.id);

  // Limpar para não poluir o banco
  await prisma.session.delete({ where: { id: session.id } });
  console.log('Sessão removida (limpeza do teste)');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error('\nERRO:', e.message); prisma.$disconnect(); });
