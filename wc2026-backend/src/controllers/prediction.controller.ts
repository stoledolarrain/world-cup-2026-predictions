import { Request, Response, NextFunction } from 'express';
import { PredictionService } from '../services/prediction.service';

export const PredictionController = {
  async createPrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const prediction = await PredictionService.createPrediction(userId, req.body);
      res.status(201).json({ message: 'Pronóstico registrado', data: prediction });
    } catch (error) {
      next(error);
    }
  },

  async updatePrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const predictionId = req.params.predictionId as string;
      const updatedPrediction = await PredictionService.updatePrediction(userId, predictionId, req.body);
      res.status(200).json({ message: 'Pronóstico actualizado', data: updatedPrediction });
    } catch (error) {
      next(error);
    }
  },

  async getMyPredictions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const predictions = await PredictionService.getUserPredictions(userId);
      res.status(200).json({ data: predictions });
    } catch (error) {
      next(error);
    }
  }
};