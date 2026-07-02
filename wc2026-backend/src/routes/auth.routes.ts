import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.schema';

const router = Router();

// Req 1: Registro (Aplicamos la validación de registerSchema antes de llegar al controlador)
router.post('/register', validateMiddleware(registerSchema), AuthController.register);

// Req 2: Iniciar sesión (Aplicamos la validación de loginSchema)
router.post('/login', validateMiddleware(loginSchema), AuthController.login);

// Req 5: Cerrar sesión
router.post('/logout', AuthController.logout);

export default router;