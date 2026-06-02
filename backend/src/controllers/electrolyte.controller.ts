import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const saveElectrolyteAssessment = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Atleta não identificado.' });
  }

  const { sweatMarksScore, crampScore, saltyScore, concentration } = req.body;

  if (sweatMarksScore === undefined || crampScore === undefined || saltyScore === undefined || concentration === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  try {
    const assessment = await prisma.electrolyteAssessment.create({
      data: {
        athleteId,
        sweatMarksScore: parseInt(sweatMarksScore),
        crampScore: parseInt(crampScore),
        saltyScore: parseInt(saltyScore),
        concentration: parseInt(concentration),
      },
    });

    return res.status(201).json({ message: 'Avaliação salva com sucesso!', assessment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao salvar avaliação de eletrólitos.' });
  }
};

export const getElectrolyteHistory = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Atleta não identificado.' });
  }

  try {
    const assessments = await prisma.electrolyteAssessment.findMany({
      where: { athleteId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(assessments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar histórico de eletrólitos.' });
  }
};
