import { Router } from 'express';
import { MatchController } from '../controllers/match.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.use(authMiddleware); 


router.get('/', MatchController.getMatches);

router.get('/:matchId', MatchController.getMatchById);



router.post('/', adminMiddleware, MatchController.createMatch);
router.post('/', MatchController.createMatch);

router.put('/:matchId', adminMiddleware, MatchController.updateMatch);
router.put('/:matchId', MatchController.updateMatch);

export default router;