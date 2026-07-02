import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Aplicamos el middleware a todas las rutas de este archivo
router.use(authMiddleware);

// Req 4: Consultar información personal
router.get('/profile', AuthController.getProfile);

// Req 4: Modificar información personal
router.put('/profile', AuthController.updateProfile);

// Req 25: Visualizar un resumen (Dashboard)
router.get('/dashboard', AuthController.getDashboard);

export default router;