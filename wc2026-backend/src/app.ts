import express, { Application } from 'express';
import cors from 'cors';

// Importación de Rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import groupRoutes from './routes/groups.routes';
import matchRoutes from './routes/matches.routes';
import predictionRoutes from './routes/predictions.routes';

// Importación del Middleware Global de Errores
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite a Express entender el cuerpo de las peticiones en formato JSON [cite: 60]

// Rutas base de la API REST [cite: 51]
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);

// Manejo global de errores (Debe ser el último middleware inyectado) [cite: 61, 65]
app.use(errorMiddleware);

export default app;