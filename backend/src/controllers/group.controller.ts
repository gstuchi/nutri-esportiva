import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O nome do grupo é obrigatório.' });
  }

  try {
    const coachId = req.user?.id;
    if (!coachId) {
      return res.status(401).json({ error: 'Técnico não identificado.' });
    }

    // Gerar código único HID-XXXX
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      code = randStr;
      
      const checkCode = await prisma.group.findUnique({ where: { code } });
      if (!checkCode) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Erro ao gerar código único de grupo.' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || null,
        code,
        coachId,
      },
    });

    return res.status(201).json(group);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao criar grupo.' });
  }
};

export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'O código do grupo é obrigatório.' });
  }

  try {
    const athleteId = req.user?.id;
    if (!athleteId) {
      return res.status(401).json({ error: 'Atleta não identificado.' });
    }

    // Buscar grupo
    const group = await prisma.group.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado com o código fornecido.' });
    }

    // Verificar se já é membro
    const existingMembership = await prisma.groupMembership.findUnique({
      where: {
        groupId_athleteId: {
          groupId: group.id,
          athleteId,
        },
      },
    });

    if (existingMembership) {
      if (existingMembership.status === 'active') {
        return res.status(400).json({ error: 'Você já faz parte deste grupo.' });
      }
      
      // Reativar membro removido ou que saiu
      const updated = await prisma.groupMembership.update({
        where: { id: existingMembership.id },
        data: { status: 'active', joinedAt: new Date() },
      });
      return res.status(200).json({ message: 'Reingressou no grupo com sucesso!', group });
    }

    // Criar membro
    await prisma.groupMembership.create({
      data: {
        groupId: group.id,
        athleteId,
        status: 'active',
      },
    });

    return res.status(201).json({ message: 'Ingressou no grupo com sucesso!', group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao ingressar no grupo.' });
  }
};

export const fetchCoachGroups = async (req: AuthenticatedRequest, res: Response) => {
  const coachId = req.user?.id;
  if (!coachId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const groups = await prisma.group.findMany({
      where: { coachId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar grupos do técnico.' });
  }
};

export const fetchGroupAthletes = async (req: AuthenticatedRequest, res: Response) => {
  const { groupId } = req.params;
  const coachId = req.user?.id;

  if (!groupId) {
    return res.status(400).json({ error: 'O ID do grupo é obrigatório.' });
  }

  try {
    // Validar se o grupo pertence ao Coach logado
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }
    
    if (group.coachId !== coachId) {
      return res.status(403).json({ error: 'Você não tem permissão para gerenciar este grupo.' });
    }

    const memberships = await prisma.groupMembership.findMany({
      where: { groupId, status: 'active' },
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            email: true,
            athleteProfile: true,
            electrolyteAssessments: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            sessions: {
              where: { status: 'completed' },
              orderBy: { sessionDate: 'desc' },
              take: 5,
              include: {
                calculated: true,
                sessionInitial: true,
                sessionDuring: true,
                sessionPost: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    // Mapear retorno formatado e amigável
    const athletes = memberships.map((m) => {
      const ath = m.athlete;
      const latestSession = ath.sessions[0] || null;
      return {
        id: ath.id,
        name: ath.name,
        email: ath.email,
        profile: ath.athleteProfile,
        latestElectrolyteAssessment: ath.electrolyteAssessments?.[0] || null,
        latestSession,
        recentSessions: ath.sessions,
      };
    });

    return res.status(200).json(athletes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar atletas do grupo.' });
  }
};

export const fetchAthleteGroups = async (req: AuthenticatedRequest, res: Response) => {
  const athleteId = req.user?.id;
  if (!athleteId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const memberships = await prisma.groupMembership.findMany({
      where: { athleteId, status: 'active' },
      include: {
        group: {
          include: {
            coach: {
              select: {
                name: true
              }
            },
            _count: {
              select: { memberships: { where: { status: 'active' } } }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' },
    });

    // Format the response to be easy for the frontend to consume
    const groups = memberships.map(m => ({
      id: m.group.code, // Usando code como id para exibição (GRP-XXXX), ou podemos mandar os dois
      realId: m.group.id,
      name: m.group.name,
      coach: m.group.coach.name,
      members: m.group._count.memberships,
      code: m.group.code
    }));

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar grupos do atleta.' });
  }
};
