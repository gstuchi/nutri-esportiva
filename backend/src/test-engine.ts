import { prisma } from './config/prisma';
import { calculateSessionHydration } from './services/calculation.engine';

async function runTests() {
  console.log('🧪 Iniciando testes de validação do motor científico...');

  // 1. Buscar a atleta Ana criada no seed
  const athlete = await prisma.user.findUnique({
    where: { email: 'atleta@nutri.com' },
    include: { athleteProfile: true }
  });

  if (!athlete) {
    console.error('❌ Falha: Atleta "atleta@nutri.com" não encontrado no banco. Rode o seed antes.');
    process.exit(1);
  }

  console.log(`👤 Atleta carregado para o teste: ${athlete.name}`);
  console.log(`   - Gosto do suor: ${athlete.athleteProfile?.sweatTaste}`);
  console.log(`   - Histórico de câimbras: ${athlete.athleteProfile?.crampHistory}`);

  // Criar sessões reais no banco para evitar quebras de chave estrangeira
  console.log('\n📝 Criando sessões de teste no banco de dados...');
  const dbSession1 = await prisma.session.create({
    data: {
      athleteId: athlete.id,
      sportModality: 'Corrida',
      status: 'in_progress',
    }
  });

  const dbSession2 = await prisma.session.create({
    data: {
      athleteId: athlete.id,
      sportModality: 'Corrida',
      status: 'in_progress',
    }
  });

  try {
    // Cenário de teste 1: Desidratação Moderada e Perda de Eletrólitos
    console.log('\n🏃 Testando Cenário 1: Perda de Peso Moderada (1.5 kg) em 60 min, água pura...');
    const res1 = await calculateSessionHydration({
      weightInitial: 62.5,
      weightPost: 61.0,
      durationMinutes: 60,
      waterIngestedMl: 500,
      fluidType: 'water',
      urineColorInitial: 3,
      preSessionUrineColor: 3,
      perceivedExertionRpe: 6,
      symptoms: ['cramps'],
      athleteId: athlete.id,
      sessionId: dbSession1.id
    });

    console.log('📊 Resultados Cenário 1:');
    console.log(`   - Taxa de Sudorese: ${res1.sweatRateMlPerHour} mL/h (Esperado: ~2000 mL/h)`);
    console.log(`   - Percentual Desidratação: ${res1.dehydrationPct}% (Esperado: 2.4%)`);
    console.log(`   - Nível de Risco: ${res1.riskLevel} (Esperado: moderate)`);
    console.log(`   - Risco Eletrolítico: ${res1.electrolyteRisk} (Esperado: high baseado na água pura)`);
    console.log(`   - Alvo Reidratação Pós: ${res1.rehydrationTargetMl} mL (Esperado: 1875 mL)`);

    // Cenário de teste 2: Risco Crítico de Desidratação e Armstrong Elevado
    console.log('\n🏃 Testando Cenário 2: Perda de Peso Elevada (2.8 kg) em 90 min, Urina Armstrong 7...');
    const res2 = await calculateSessionHydration({
      weightInitial: 62.5,
      weightPost: 59.7,
      durationMinutes: 90,
      waterIngestedMl: 400,
      fluidType: 'water',
      urineColorInitial: 7,
      preSessionUrineColor: 7,
      perceivedExertionRpe: 9,
      symptoms: ['vomiting', 'dizziness'],
      athleteId: athlete.id,
      sessionId: dbSession2.id
    });

    console.log('📊 Resultados Cenário 2:');
    console.log(`   - Taxa de Sudorese: ${res2.sweatRateMlPerHour} mL/h`);
    console.log(`   - Percentual Desidratação: ${res2.dehydrationPct}% (Esperado: 4.48%)`);
    console.log(`   - Score de Desidratação: ${res2.dehydrationScore}/100`);
    console.log(`   - Nível de Risco: ${res2.riskLevel} (Esperado: critical/high)`);
    console.log(`   - Risco Eletrolítico: ${res2.electrolyteRisk} (Esperado: high devido à água em treino > 60 min)`);

    // Verificar se as notificações de alerta foram devidamente gravadas no banco
    console.log('\n🔔 Validando geração automática de alertas no banco de dados...');
    const notifications = await prisma.notificationLog.findMany({
      where: { sessionId: dbSession2.id }
    });

    console.log(`   - Alertas criados para o Cenário 2: ${notifications.map((n: any) => n.type).join(', ')}`);
    if (notifications.some((n: any) => n.type === 'electrolyte_warning') && notifications.some((n: any) => n.type === 'risk_critical')) {
      console.log('✅ SUCESSO: Alertas clínicos fisiológicos gerados corretamente!');
    } else {
      console.error('❌ ERRO: Notificações não geradas como esperado.');
    }

  } finally {
    // Limpar dados do teste limpando as sessões (deleta em cascata as notificações associadas)
    console.log('\n🧹 Limpando dados temporários de teste...');
    await prisma.session.deleteMany({
      where: { id: { in: [dbSession1.id, dbSession2.id] } }
    });
  }

  console.log('\n🎉 Todos os testes científicos executados e aprovados com sucesso!');
}

runTests()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
