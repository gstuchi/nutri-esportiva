import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, ...profileData } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: name, email, password, role.' });
  }

  if (role !== 'coach' && role !== 'athlete') {
    return res.status(400).json({ error: 'O papel (role) deve ser coach ou athlete.' });
  }

  try {
    // Verificar se e-mail já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está sendo utilizado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário e perfil correspondente em transação
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      if (role === 'athlete') {
        const birthDate = profileData.birthDate ? new Date(profileData.birthDate) : new Date();
        const weightKg = profileData.weightKg ? parseFloat(profileData.weightKg) : 70.0;
        const heightCm = profileData.heightCm ? parseFloat(profileData.heightCm) : 170.0;

        await tx.athleteProfile.create({
          data: {
            userId: user.id,
            birthDate,
            weightKg,
            heightCm,
            sweatTaste: profileData.sweatTaste || 'not_sure',
            sweatMarks: profileData.sweatMarks || 'rarely',
            crampHistory: profileData.crampHistory || 'never',
          },
        });

        // Registrar peso inicial no WeightLog
        await tx.weightLog.create({
          data: {
            athleteId: user.id,
            weightKg,
            source: 'manual',
          },
        });
      } else if (role === 'coach') {
        await tx.coachProfile.create({
          data: {
            userId: user.id,
            credential: profileData.credential || null,
            bio: profileData.bio || null,
          },
        });
      }

      return user;
    });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        athleteProfile: true,
        coachProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.role === 'athlete' ? user.athleteProfile : user.coachProfile,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        athleteProfile: true,
        coachProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.role === 'athlete' ? user.athleteProfile : user.coachProfile,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
  }
};
