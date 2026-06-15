import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// GET /api/athletes/profile
export const getAthleteProfile = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) return res.status(401).json({ error: 'Não autenticado.' });

  try {
    const profile = await prisma.athleteProfile.findUnique({
      where: { userId: athleteId },
    });

    return res.status(200).json({ profile: profile || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
  }
};

// PATCH /api/athletes/profile
// Body: { idade?, peso?, altura?, sexo? }
// - idade: número (ex: 24) → convertido para birthDate
// - peso: número (ex: 74.5) → weightKg
// - altura: string no formato "1,78" → heightCm (178)
// - sexo: "masculino" | "feminino"
export const updateAthleteProfile = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) return res.status(401).json({ error: 'Não autenticado.' });

  const { idade, peso, altura, sexo, modalidade } = req.body;

  try {
    const updateData: any = {};

    if (idade !== undefined && idade !== '') {
      const anos = parseInt(idade);
      if (!isNaN(anos) && anos > 0 && anos < 120) {
        updateData.birthDate = new Date(new Date().getFullYear() - anos, 0, 1);
      }
    }

    if (peso !== undefined && peso !== '') {
      const kg = parseFloat(String(peso).replace(',', '.'));
      if (!isNaN(kg) && kg > 0) updateData.weightKg = kg;
    }

    if (altura !== undefined && altura !== '') {
      // Aceita "1,78" ou "1.78" ou "178"
      const alturaStr = String(altura).replace(',', '.');
      const metros = parseFloat(alturaStr);
      if (!isNaN(metros) && metros > 0) {
        // Se o valor for menor que 3, está em metros (ex: 1.78) → converte para cm
        updateData.heightCm = metros < 3 ? metros * 100 : metros;
      }
    }

    if (sexo !== undefined && sexo !== '') {
      updateData.sexo = sexo;
    }

    if (modalidade !== undefined && modalidade !== '') {
      updateData.modalidadePrincipal = modalidade;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar.' });
    }

    const profile = await prisma.athleteProfile.upsert({
      where: { userId: athleteId },
      update: updateData,
      create: {
        userId:      athleteId,
        birthDate:   updateData.birthDate   || new Date(),
        weightKg:    updateData.weightKg    || 70.0,
        heightCm:    updateData.heightCm    || 170.0,
        sexo:        updateData.sexo        || null,
        modalidadePrincipal: updateData.modalidadePrincipal || null,
        sweatTaste:  'not_sure',
        sweatMarks:  'rarely',
        crampHistory:'never',
      },
    });

    // Registra novo peso no histórico se foi atualizado
    if (updateData.weightKg) {
      await prisma.weightLog.create({
        data: { athleteId, weightKg: updateData.weightKg, source: 'manual' },
      });
    }

    return res.status(200).json({ message: 'Perfil atualizado com sucesso!', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
};
