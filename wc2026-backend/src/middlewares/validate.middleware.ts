import { Request, Response, NextFunction } from 'express';

// Recibimos el esquema como "any" para evitar conflictos de importación de Zod
export const validateMiddleware = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      // FUERZA BRUTA: Obligamos a TypeScript a tratar el error como "any" (cualquier cosa)
      // Esto apaga las alertas rojas y nos permite acceder a la propiedad .errors sin que se queje.
      const err = error as any;
      
      // Verificamos si el error viene de Zod (es decir, si tiene la propiedad errors)
      if (err && err.errors) {
        const errorMessages = err.errors.map((e: any) => ({
          // Si por alguna razón falla el join, ponemos 'campo' por defecto para que no se caiga
          field: e.path ? e.path.join('.') : 'campo',
          message: e.message,
        }));
        
        res.status(400).json({ 
          message: 'Error de validación de datos', 
          errors: errorMessages 
        });
        return; // Cortamos la ejecución aquí
      }
      
      // Si es otro tipo de error (no de validación), lo pasamos al error global
      next(error);
    }
  };
};