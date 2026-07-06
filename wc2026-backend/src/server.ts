import 'reflect-metadata'; 
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import app from './app';
import { startCronJobs } from './jobs/syncMatches.job';
import { User, UserRole } from './entities/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 3000;

const createAdminUser = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const adminEmail = 'admin@quiniela.com';
  
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    console.log('⚙️ Creando usuario administrador por defecto...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN 
    });
    
    await userRepository.save(adminUser);
    console.log('Administrador creado: Correo: admin@quiniela.com | Clave: admin123');
  }
};

AppDataSource.initialize()
  .then(async () => {
    console.log('Conexión a PostgreSQL establecida con éxito.');

    await createAdminUser();

    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
      
      startCronJobs();
    });
  })
  .catch((error) => {
    console.error('Error fatal al conectar con la base de datos:', error);
    process.exit(1); 
  });