import { z } from 'zod';

export const createPredictionSchema = z.object({
  matchId: z.string({ message: 'El ID del partido es obligatorio' })
    .uuid('ID de partido inválido'),
    
  predictedHomeScore: z.number({ message: 'El puntaje local es obligatorio' })
    .int()
    .min(0, 'El puntaje no puede ser negativo'),
    
  predictedAwayScore: z.number({ message: 'El puntaje visitante es obligatorio' })
    .int()
    .min(0, 'El puntaje no puede ser negativo'), 
});

export const updatePredictionSchema = z.object({
  predictedHomeScore: z.number().int().min(0, 'El puntaje no puede ser negativo').optional(),
  predictedAwayScore: z.number().int().min(0, 'El puntaje no puede ser negativo').optional(),
});