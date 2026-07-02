import 'reflect-metadata'; 
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import app from './app';
import { startCronJobs } from './jobs/syncMatches.job';

dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Conexión a PostgreSQL establecida con éxito.');

    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
      
      startCronJobs();
    });
  })
  .catch((error) => {
    console.error('Error fatal al conectar con la base de datos:', error);
    process.exit(1); 
  });