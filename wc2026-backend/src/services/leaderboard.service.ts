import { AppDataSource } from '../config/database';
import { GroupMember } from '../entities/GroupMembers';

export const LeaderboardService = {
  async getGroupLeaderboard(groupId: string) {
    const memberRepo = AppDataSource.getRepository(GroupMember);
    
    const leaderboard = await memberRepo.find({
      where: { group: { id: groupId } },
      relations: { user: true }, 
      order: { totalPoints: 'DESC' } 
    });

    return leaderboard.map((member, index) => ({
      position: index + 1,
      userId: member.user.id,
      userName: member.user.name,
      points: member.totalPoints
    }));
  }
};