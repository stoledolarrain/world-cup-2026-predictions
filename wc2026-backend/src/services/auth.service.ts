import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { GroupMember } from "../entities/GroupMembers";
import { Match, MatchStatus } from "../entities/Match";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AuthService = {
  async register(data: any) {
    const userRepository = AppDataSource.getRepository(User);

    // 1. Validar que el usuario no exista para evitar errores SQL genéricos
    const existingUser = await userRepository.findOne({
      where: { email: data.email },
    });
    if (existingUser)
      throw new Error("El correo electrónico ya está registrado");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 2. FIX DE SEGURIDAD: Asignación explícita en lugar de "...data"
    // Esto evita que un usuario inyecte el rol "ADMIN" por la fuerza.
    const newUser = userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    const userResponse = { ...newUser };
    delete (userResponse as any).password;

    return userResponse;
  },

  async login(email: string, pass: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) throw new Error("Credenciales inválidas");

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error("Credenciales inválidas");

    // 3. DEBUG CLAVE: Validar que el entorno tenga el secreto antes de que jwt explote
    if (!process.env.JWT_SECRET) {
      console.error(
        "ERROR CRÍTICO: JWT_SECRET no está definido en process.env",
      );
      throw new Error("Error de configuración del servidor");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    const userResponse = { ...user };
    delete (userResponse as any).password;

    return { token, user: userResponse };
  },

  async getProfile(userId: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) throw new Error("Usuario no encontrado");

    const userResponse = { ...user };
    delete (userResponse as any).password;

    return userResponse;
  },

  async updateProfile(userId: string, data: any) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) throw new Error("Usuario no encontrado");

    // Si el usuario envía una nueva contraseña, la encriptamos antes de guardar
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    userRepository.merge(user, data);
    await userRepository.save(user);

    const userResponse = { ...user };
    delete (userResponse as any).password;

    return userResponse;
  },

  async getDashboardSummary(userId: string) {
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);
    const matchRepo = AppDataSource.getRepository(Match);

    const memberships = await groupMemberRepo.find({
      where: { user: { id: userId } },
      relations: { group: true },
    });

    const totalGroups = memberships.length;
    const totalPoints = memberships.reduce(
      (acc, curr) => acc + curr.totalPoints,
      0,
    );

    const upcomingMatches = await matchRepo.find({
      where: { status: MatchStatus.SCHEDULED },
      order: { matchDate: "ASC" },
      take: 5,
    });

    const groupPositions = await Promise.all(
      memberships.map(async (membership) => {
        const allMembers = await groupMemberRepo.find({
          where: { group: { id: membership.group.id } },
          order: { totalPoints: "DESC" },
        });
        const position =
          allMembers.findIndex((m) => m.id === membership.id) + 1;

        return {
          groupName: membership.group.name,
          position,
          points: membership.totalPoints,
        };
      }),
    );

    return { totalGroups, upcomingMatches, groupPositions, totalPoints };
  },
};
