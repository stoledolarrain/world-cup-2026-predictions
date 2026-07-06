import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await AuthService.register(req.body);
      res
        .status(201)
        .json({ message: "Usuario registrado exitosamente", data: newUser });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.login(
        req.body.email,
        req.body.password,
      );
      res
        .status(200)
        .json({ message: "Inicio de sesión exitoso", token, user });
    } catch (error) {
      console.error("Error en login:", error); // <-- Añade esta línea
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const user = await AuthService.getProfile(userId);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const updatedUser = await AuthService.updateProfile(userId, req.body);
      res
        .status(200)
        .json({ message: "Perfil actualizado", data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const dashboardData = await AuthService.getDashboardSummary(userId);
      res.status(200).json({ data: dashboardData });
    } catch (error) {
      next(error);
    }
  },
};
