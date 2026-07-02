import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { GroupMember } from '../entities/GroupMembers';
import { Match, MatchStatus } from '../entities/Match';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AuthService = {
  async register(data: any) {
    const userRepository = AppDataSource.getRepository(User);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Forzamos a TypeScript a entender que esto es un único objeto User
    const newUser = userRepository.create({
      ...data,
      password: hashedPassword
    } as Partial<User>); 
    
    await userRepository.save(newUser);
    
    // Forma segura de quitar el password para la respuesta
    const userResponse = { ...newUser };
    delete (userResponse as any).password;
    
    return userResponse;
  },

  async login(email: string, pass: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) throw new Error('Credenciales inválidas');
    
    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Credenciales inválidas');

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const userResponse = { ...user };
    delete (userResponse as any).password;
    
    return { token, user: userResponse };
  },

  async getDashboardSummary(userId: string) {
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);
    const matchRepo = AppDataSource.getRepository(Match);

    const memberships = await groupMemberRepo.find({
      where: { user: { id: userId } },
      relations: { group: true } // ¡CORREGIDO AQUÍ!
    });

    const totalGroups = memberships.length;
    const totalPoints = memberships.reduce((acc, curr) => acc + curr.totalPoints, 0);

    const upcomingMatches = await matchRepo.find({
      where: { status: MatchStatus.SCHEDULED },
      order: { matchDate: 'ASC' },
      take: 5
    });

    const groupPositions = await Promise.all(memberships.map(async (membership) => {
      const allMembers = await groupMemberRepo.find({
        where: { group: { id: membership.group.id } },
        order: { totalPoints: 'DESC' }
      });
      const position = allMembers.findIndex(m => m.id === membership.id) + 1;

      return {
        groupName: membership.group.name,
        position,
        points: membership.totalPoints
      };
    }));

    return { totalGroups, upcomingMatches, groupPositions, totalPoints };
  }
};