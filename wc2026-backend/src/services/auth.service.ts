import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { GroupMember } from '../entities/GroupMember';
import { Match, MatchStatus } from '../entities/Match';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AuthService = {
  async register(data: any) {
    const userRepository = AppDataSource.getRepository(User);
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const newUser = userRepository.create({
      ...data,
      password: hashedPassword
    });
    
    await userRepository.save(newUser);
    
    // Retornar sin la contraseña
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(email: string, pass: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) throw new Error('Credenciales inválidas');
    
    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Credenciales inválidas');

    // La aplicación deberá utilizar JWT para la autenticación
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  // Resumen del dashboard (Req 25)
  async getDashboardSummary(userId: string) {
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);
    const matchRepo = AppDataSource.getRepository(Match);

    // Cantidad de grupos y puntaje acumulado global (suma de puntos en todos los grupos)
    const memberships = await groupMemberRepo.find({
      where: { user: { id: userId } },
      relations: ['group']
    });

    const totalGroups = memberships.length;
    const totalPoints = memberships.reduce((acc, curr) => acc + curr.totalPoints, 0);

    // Próximos partidos pendientes (estado SCHEDULED)
    const upcomingMatches = await matchRepo.find({
      where: { status: MatchStatus.SCHEDULED },
      order: { matchDate: 'ASC' },
      take: 5 // Mostrar los próximos 5
    });

    // Posición en cada grupo
    const groupPositions = await Promise.all(memberships.map(async (membership) => {
      // Contar cuántos miembros en el mismo grupo tienen más puntos
      const higherRanked = await groupMemberRepo.count({
        where: { 
          group: { id: membership.group.id },
        }
      });
      // Lógica simplificada: si los traemos ordenados, encontramos su índice
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

    return {
      totalGroups,
      upcomingMatches,
      groupPositions,
      totalPoints
    };
  }
};