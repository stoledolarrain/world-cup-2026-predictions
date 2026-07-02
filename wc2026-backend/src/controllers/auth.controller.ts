import { Request, Response, NextFunction } from 'express';
// Importaremos los servicios más adelante: import { AuthService } from '../services/auth.service';

export const AuthController = {
  // Req 1: Registro de visitante
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // const newUser = await AuthService.register(req.body);
      res.status(201).json({ message: 'Usuario registrado exitosamente', /* data: newUser */ });
    } catch (error) {
      next(error); // Pasa el error al error.middleware.ts
    }
  },

  // Req 2: Iniciar sesión
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // const { token, user } = await AuthService.login(req.body.email, req.body.password);
      res.status(200).json({ message: 'Inicio de sesión exitoso', /* token, user */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 5: Cerrar sesión
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Al usar JWT, el logout suele manejarse en el frontend borrando el token, 
      // pero puedes invalidarlo aquí si implementas una lista negra de tokens.
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      next(error);
    }
  },

  // Req 4: Consultar perfil
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // const user = await AuthService.getProfile(userId);
      res.status(200).json({ /* data: user */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 4: Modificar información personal
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // const updatedUser = await AuthService.updateProfile(userId, req.body);
      res.status(200).json({ message: 'Perfil actualizado', /* data: updatedUser */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 25: Dashboard (Resumen del usuario)
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // const dashboardData = await AuthService.getDashboardSummary(userId);
      // Devuelve: cantidad de grupos, próximos partidos, posición, puntaje acumulado
      res.status(200).json({ /* data: dashboardData */ });
    } catch (error) {
      next(error);
    }
  }
};