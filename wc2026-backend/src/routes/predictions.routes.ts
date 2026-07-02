import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', PredictionController.getMyPredictions);

router.post('/', PredictionController.createPrediction);

router.put('/:predictionId', PredictionController.updatePrediction);

export default router;