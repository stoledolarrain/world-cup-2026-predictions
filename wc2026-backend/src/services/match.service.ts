import { AppDataSource } from '../config/database';
import { Match } from '../entities/Match';
import { Between } from 'typeorm';

export const MatchService = {
  async getMatches(filters: any) {
    const matchRepo = AppDataSource.getRepository(Match);
    
    const whereClause: any = {};
    if (filters.stage) whereClause.stage = filters.stage;
    if (filters.status) whereClause.status = filters.status;
    if (filters.date) {
      const startDate = new Date(filters.date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filters.date as string);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.matchDate = Between(startDate, endDate); 
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
    
    delete data.homeScore;
    delete data.awayScore;

    await matchRepo.update(matchId, data);
    return await matchRepo.findOne({ where: { id: matchId } });
  }
};