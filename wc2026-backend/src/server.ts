import 'reflect-metadata'; // OBLIGATORIO para TypeORM, debe ser la primera línea
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import app from './app';
import { startCronJobs } from './jobs/syncMatches.job';

// Cargar variables de entorno [cite: 67]
dotenv.config();

const PORT = process.env.PORT || 3000;

// Inicializar la conexión a la base de datos relacional 
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Conexión a PostgreSQL establecida con éxito.');

    // Iniciar el servidor Express [cite: 50]
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
      
      // Iniciar los procesos automáticos (Cron Jobs) una vez que el servidor está listo 
      startCronJobs();
    });
  })
  .catch((error) => {
    console.error('❌ Error fatal al conectar con la base de datos:', error);
    process.exit(1); // Detener el proceso si la base de datos falla
  });