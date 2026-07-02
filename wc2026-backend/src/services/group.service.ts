import { AppDataSource } from '../config/database';
import { Group } from '../entities/Group';
import { GroupMember } from '../entities/GroupMembers';

export const GroupService = {
  async createGroup(userId: string, name: string) {
    const groupRepo = AppDataSource.getRepository(Group);
    const memberRepo = AppDataSource.getRepository(GroupMember);

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const group = groupRepo.create({
      name,
      inviteCode,
      owner: { id: userId }
    });

    await groupRepo.save(group);

    const member = memberRepo.create({
      user: { id: userId },
      group: { id: group.id }
    });
    await memberRepo.save(member);

    return group;
  },

  async joinGroup(userId: string, inviteCode: string) {
    const groupRepo = AppDataSource.getRepository(Group);
    const memberRepo = AppDataSource.getRepository(GroupMember);

    const group = await groupRepo.findOne({ where: { inviteCode } });
    if (!group) throw new Error('Código de invitación inválido');

    const existingMember = await memberRepo.findOne({
      where: { user: { id: userId }, group: { id: group.id } }
    });

    if (existingMember) throw new Error('Ya perteneces a este grupo');

    const member = memberRepo.create({
      user: { id: userId },
      group: { id: group.id }
    });

    await memberRepo.save(member);
    return group;
  },

  async getUserGroups(userId: string) {
    const memberRepo = AppDataSource.getRepository(GroupMember);
    const memberships = await memberRepo.find({
      where: { user: { id: userId } },
      relations: { 
        group: {
          owner: true
        } 
      } 
    });
    return memberships.map(m => m.group);
  },

  async getGroupMembers(groupId: string) {
    const memberRepo = AppDataSource.getRepository(GroupMember);
    return await memberRepo.find({
      where: { group: { id: groupId } },
      relations: { user: true }, 
      order: { totalPoints: 'DESC' }
    });
  }
};