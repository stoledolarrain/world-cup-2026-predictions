import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/User';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  // Asumimos que authMiddleware ya se ejecutó y validó el token
  if (!user || user.role !== UserRole.ADMIN) {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de Administrador.' });
    return;
  }

  next();
};