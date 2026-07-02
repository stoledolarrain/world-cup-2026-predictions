import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // Requiere estar autenticado

// Req 18 y 19: Consultar todos sus pronósticos realizados y los puntos obtenidos
router.get('/', PredictionController.getMyPredictions);

// Req 16: Registrar un pronóstico antes del inicio de un partido
router.post('/', PredictionController.createPrediction);

// Req 17: Modificar un pronóstico (solo si no ha comenzado el partido)
router.put('/:predictionId', PredictionController.updatePrediction);

export default router;