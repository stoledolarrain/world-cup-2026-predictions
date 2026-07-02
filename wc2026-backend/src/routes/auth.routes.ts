import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { authSchema } from '../validations/auth.schema';

const router = Router();

// Req 1 y 3: Un visitante podrá registrarse (Ruta pública)
router.post('/register', AuthController.register);

// Req 2 y 3: Un visitante podrá iniciar sesión (Ruta pública)
router.post('/login', AuthController.login);

// Req 5: Un usuario podrá cerrar sesión (Puede requerir token dependiendo de tu lógica de frontend)
router.post('/logout', AuthController.logout);

export default router;