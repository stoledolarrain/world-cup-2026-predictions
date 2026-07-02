import cron from 'node-cron';
import { TheSportsDBService } from '../services/thesportsdb.service';

export const startCronJobs = () => {
  cron.schedule('*/20 * * * *', async () => {
    console.log('Ejecutando sincronización automática de partidos...');
    try {
      await TheSportsDBService.syncMatchScores();
      console.log('Sincronización de marcadores completada con éxito.');
    } catch (error) {
      console.error('Error durante la sincronización automática:', error);
    }
  });

  console.log('Cron Jobs iniciados (Sincronización configurada cada 20 minutos).');
};