import { Request, Response, NextFunction } from 'express';

export const GroupController = {
  // Req 6: Crear un grupo de quiniela
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { name } = req.body;
      // const newGroup = await GroupService.createGroup(userId, name);
      res.status(201).json({ message: 'Grupo creado exitosamente', /* data: newGroup */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 7: Obtener el código de invitación
  async getInviteCode(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId;
      // const inviteCode = await GroupService.getInviteCode(groupId);
      res.status(200).json({ /* data: { inviteCode } */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 8: Unirse a un grupo con código
  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { inviteCode } = req.body;
      // await GroupService.joinGroup(userId, inviteCode);
      res.status(200).json({ message: 'Te has unido al grupo exitosamente' });
    } catch (error) {
      next(error);
    }
  },

  // Req 9: Visualizar todos los grupos a los que pertenece
  async getMyGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // const groups = await GroupService.getUserGroups(userId);
      res.status(200).json({ /* data: groups */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 10: Consultar participantes de un grupo
  async getGroupMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId;
      // const members = await GroupService.getGroupMembers(groupId);
      res.status(200).json({ /* data: members */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 11 y 20: Visualizar clasificación (Leaderboard) y posición
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId;
      // const leaderboard = await LeaderboardService.getGroupLeaderboard(groupId);
      res.status(200).json({ /* data: leaderboard */ });
    } catch (error) {
      next(error);
    }
  }
};