import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
    }

    return next();
  };
}
