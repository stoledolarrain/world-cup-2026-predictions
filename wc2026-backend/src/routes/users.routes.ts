import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', AuthController.getProfile);

router.put('/profile', AuthController.updateProfile);

router.get('/dashboard', AuthController.getDashboard);

export default router;