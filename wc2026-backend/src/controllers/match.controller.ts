import { Request, Response, NextFunction } from 'express';

export const MatchController = {
  // Req 12 y 13: Consultar calendario y filtrar por fase, fecha o estado
  async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraemos los filtros de la URL (ej: /matches?stage=grupos&status=SCHEDULED)
      const { stage, date, status } = req.query; 
      // const matches = await MatchService.getMatches({ stage, date, status });
      res.status(200).json({ /* data: matches */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 14 y 15: Consultar detalle de un partido (incluye ciudad del estadio)
  async getMatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = req.params.matchId;
      // const match = await MatchService.getMatchById(matchId);
      res.status(200).json({ /* data: match */ });
    } catch (error) {
      next(error);
    }
  },

  // --- RUTAS DE ADMINISTRADOR ---

  // Req 26: Registrar partidos (Solo Admin)
  async createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      // const newMatch = await MatchService.createMatch(req.body);
      res.status(201).json({ message: 'Partido registrado', /* data: newMatch */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 27: Modificar información de un partido (No el resultado) (Solo Admin)
  async updateMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = req.params.matchId;
      // req.body no debe contener homeScore ni awayScore (se valida en middleware o servicio)
      // const updatedMatch = await MatchService.updateMatch(matchId, req.body);
      res.status(200).json({ message: 'Partido actualizado', /* data: updatedMatch */ });
    } catch (error) {
      next(error);
    }
  }
};