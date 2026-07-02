import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/group.service';
import { LeaderboardService } from '../services/leaderboard.service';

export const GroupController = {
  async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { name } = req.body;
      const newGroup = await GroupService.createGroup(userId, name);
      res.status(201).json({ message: 'Grupo creado exitosamente', data: newGroup });
    } catch (error) {
      next(error);
    }
  },

  async getInviteCode(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId as string;
      res.status(200).json({ message: 'Código obtenido' });
    } catch (error) {
      next(error);
    }
  },

  async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { inviteCode } = req.body;
      await GroupService.joinGroup(userId, inviteCode);
      res.status(200).json({ message: 'Te has unido al grupo exitosamente' });
    } catch (error) {
      next(error);
    }
  },

  async getMyGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const groups = await GroupService.getUserGroups(userId);
      res.status(200).json({ data: groups });
    } catch (error) {
      next(error);
    }
  },

  async getGroupMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId as string;
      const members = await GroupService.getGroupMembers(groupId);
      res.status(200).json({ data: members });
    } catch (error) {
      next(error);
    }
  },

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.params.groupId as string;
      const leaderboard = await LeaderboardService.getGroupLeaderboard(groupId);
      res.status(200).json({ data: leaderboard });
    } catch (error) {
      next(error);
    }
  }
};