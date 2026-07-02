import { Request, Response, NextFunction } from 'express';

export const validateMiddleware = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const err = error as any;
      
      if (err && err.errors) {
        const errorMessages = err.errors.map((e: any) => ({
          field: e.path ? e.path.join('.') : 'campo',
          message: e.message,
        }));
        
        res.status(400).json({ 
          message: 'Error de validación de datos', 
          errors: errorMessages 
        });
        return; 
      }
      
      next(error);
    }
  };
};