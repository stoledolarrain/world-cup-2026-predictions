import { AppDataSource } from '../config/database';
import { GroupMember } from '../entities/GroupMembers';

export const LeaderboardService = {
  // Req 11 y 20: Obtener la clasificación de un grupo ordenado por puntaje
  async getGroupLeaderboard(groupId: string) {
    const memberRepo = AppDataSource.getRepository(GroupMember);
    
    const leaderboard = await memberRepo.find({
      where: { group: { id: groupId } },
      relations: { user: true }, // Cargamos los datos del usuario para mostrar su nombre
      order: { totalPoints: 'DESC' } // El que tiene más puntos va primero
    });

    // Mapeamos los datos para no enviar información innecesaria (como el password)
    return leaderboard.map((member, index) => ({
      position: index + 1,
      userId: member.user.id,
      userName: member.user.name,
      points: member.totalPoints
    }));
  }
};