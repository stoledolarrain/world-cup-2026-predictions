import { z } from 'zod';

export const createPredictionSchema = z.object({
  matchId: z.string({ required_error: 'El ID del partido es obligatorio' }).uuid('ID de partido inválido'),
  predictedHomeScore: z.number({ required_error: 'El puntaje local es obligatorio' }).int().min(0, 'El puntaje no puede ser negativo'),
  predictedAwayScore: z.number({ required_error: 'El puntaje visitante es obligatorio' }).int().min(0, 'El puntaje no puede ser negativo'),
});

export const updatePredictionSchema = z.object({
  predictedHomeScore: z.number().int().min(0, 'El puntaje no puede ser negativo').optional(),
  predictedAwayScore: z.number().int().min(0, 'El puntaje no puede ser negativo').optional(),
});