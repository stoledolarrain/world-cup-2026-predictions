import { Request, Response, NextFunction } from "express";
import { MatchService } from "../services/match.service";
import { TheSportsDBService } from "../services/thesportsdb.service";

export const MatchController = {
  async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const { stage, date, status } = req.query;
      const matches = await MatchService.getMatches({ stage, date, status });
      res.status(200).json({ data: matches });
    } catch (error) {
      next(error);
    }
  },

  async createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const newMatch = await MatchService.createMatch(req.body);
      res.status(201).json({ message: "Partido registrado", data: newMatch });
    } catch (error) {
      next(error);
    }
  },

  async updateMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = req.params.matchId as string;
      const updatedMatch = await MatchService.updateMatch(matchId, req.body);
      res
        .status(200)
        .json({ message: "Partido actualizado", data: updatedMatch });
    } catch (error) {
      next(error);
    }
  },

  async seedMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const leagueId = process.env.ID_LIGA_MUNDIAL || "4429";
      const result = await TheSportsDBService.fetchAndSaveAllMatches(leagueId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
