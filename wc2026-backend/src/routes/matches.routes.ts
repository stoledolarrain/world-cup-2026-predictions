import { Router } from 'express';
import { MatchController } from '../controllers/match.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.use(authMiddleware); // Requiere estar autenticado

// --- RUTAS DE USUARIO ---

// Req 12 y 13: Consultar calendario completo y filtrar por fase, fecha o estado
router.get('/', MatchController.getMatches);

// Req 14 y 15: Consultar el detalle de un partido y la ciudad del estadio
router.get('/:matchId', MatchController.getMatchById);


// --- RUTAS DE ADMINISTRADOR ---

// Req 26: Un administrador podrá registrar partidos
router.post('/', adminMiddleware, MatchController.createMatch);
router.post('/', MatchController.createMatch);

// Req 27: Un administrador podrá modificar la información de un partido
router.put('/:matchId', adminMiddleware, MatchController.updateMatch);
router.put('/:matchId', MatchController.updateMatch);

export default router;