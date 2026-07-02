import express, { Application } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import groupRoutes from './routes/groups.routes';
import matchRoutes from './routes/matches.routes';
import predictionRoutes from './routes/predictions.routes';

import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/predictions', predictionRoutes);

app.use(errorMiddleware);

export default app;