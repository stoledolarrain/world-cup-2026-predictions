import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Obtenemos el token del header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verificamos el token con la firma secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Inyectamos los datos del usuario en la request para que los controladores puedan usarlos
    (req as any).user = decoded;

    next(); // Pasamos al siguiente middleware o controlador
  } catch (error) {
    res.status(401).json({ message: 'No autorizado. Token inválido o expirado.' });
  }
};