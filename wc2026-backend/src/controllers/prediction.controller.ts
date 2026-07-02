import { Request, Response, NextFunction } from 'express';

export const PredictionController = {
  // Req 16: Registrar pronóstico (Solo si no ha empezado)
  async createPrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { matchId, predictedHomeScore, predictedAwayScore } = req.body;
      
      // La validación de si el partido ya empezó se hace dentro del servicio
      // const prediction = await PredictionService.createPrediction(userId, req.body);
      res.status(201).json({ message: 'Pronóstico registrado', /* data: prediction */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 17: Modificar pronóstico (Solo si no ha empezado)
  async updatePrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const predictionId = req.params.predictionId;
      const { predictedHomeScore, predictedAwayScore } = req.body;

      // const updatedPrediction = await PredictionService.updatePrediction(userId, predictionId, req.body);
      res.status(200).json({ message: 'Pronóstico actualizado', /* data: updatedPrediction */ });
    } catch (error) {
      next(error);
    }
  },

  // Req 18 y 19: Consultar todos sus pronósticos y los puntos obtenidos
  async getMyPredictions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      // const predictions = await PredictionService.getUserPredictions(userId);
      res.status(200).json({ /* data: predictions */ });
    } catch (error) {
      next(error);
    }
  }
};