import { AppDataSource } from '../config/database';
import { Prediction } from '../entities/Prediction';
import { Match, MatchStatus } from '../entities/Match';

export const PredictionService = {
  async createPrediction(userId: string, data: any) {
    const matchRepo = AppDataSource.getRepository(Match);
    const predictionRepo = AppDataSource.getRepository(Prediction);

    const match = await matchRepo.findOne({ where: { id: data.matchId } });
    if (!match) throw new Error('Partido no encontrado');

    // Req 16: Registrar pronóstico antes del inicio
    if (match.status !== MatchStatus.SCHEDULED || new Date() >= match.matchDate) {
      throw new Error('El partido ya ha comenzado o finalizado. No se permiten pronósticos.');
    }

    const prediction = predictionRepo.create({
      predictedHomeScore: data.predictedHomeScore,
      predictedAwayScore: data.predictedAwayScore,
      user: { id: userId },
      match: { id: match.id }
    });

    return await predictionRepo.save(prediction);
  },

  async updatePrediction(userId: string, predictionId: string, data: any) {
    const predictionRepo = AppDataSource.getRepository(Prediction);
    
    const prediction = await predictionRepo.findOne({
      where: { id: predictionId, user: { id: userId } },
      relations: ['match']
    });

    if (!prediction) throw new Error('Pronóstico no encontrado');

    // Req 17: Modificar pronóstico únicamente mientras no haya comenzado
    if (prediction.match.status !== MatchStatus.SCHEDULED || new Date() >= prediction.match.matchDate) {
      throw new Error('El partido ya ha comenzado. No se puede modificar el pronóstico.');
    }

    prediction.predictedHomeScore = data.predictedHomeScore;
    prediction.predictedAwayScore = data.predictedAwayScore;

    return await predictionRepo.save(prediction);
  },

  async getUserPredictions(userId: string) {
    const predictionRepo = AppDataSource.getRepository(Prediction);
    return await predictionRepo.find({
      where: { user: { id: userId } },
      relations: ['match'],
      order: { createdAt: 'DESC' }
    });
  }
};