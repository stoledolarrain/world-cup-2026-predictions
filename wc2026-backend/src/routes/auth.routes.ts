import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.schema';

const router = Router();

router.post('/register', validateMiddleware(registerSchema), AuthController.register);

router.post('/login', validateMiddleware(loginSchema), AuthController.login);

router.post('/logout', AuthController.logout);

export default router;