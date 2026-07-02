import { AppDataSource } from '../config/database';
import { Match } from '../entities/Match';

export const MatchService = {
  async getMatches(filters: any) {
    const matchRepo = AppDataSource.getRepository(Match);
    
    // Construir los filtros dinámicamente según el Req 13
    const whereClause: any = {};
    if (filters.stage) whereClause.stage = filters.stage;
    if (filters.status) whereClause.status = filters.status;
    if (filters.date) {
      // Filtrar por fecha requiere un rango para cubrir todo el día en timestamp
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filters.date);
      endDate.setHours(23, 59, 59, 999);
      // requires TypeORM Between operator (import { Between } from 'typeorm')
      // whereClause.matchDate = Between(startDate, endDate); 
    }

    return await matchRepo.find({
      where: whereClause,
      order: { matchDate: 'ASC' }
    });
  },

  async createMatch(data: any) {
    const matchRepo = AppDataSource.getRepository(Match);
    const match = matchRepo.create(data);
    return await matchRepo.save(match);
  },

  async updateMatch(matchId: string, data: any) {
    const matchRepo = AppDataSource.getRepository(Match);
    
    // Req 27: No se podrá modificar el resultado manualmente
    delete data.homeScore;
    delete data.awayScore;

    await matchRepo.update(matchId, data);
    return await matchRepo.findOne({ where: { id: matchId } });
  }
};