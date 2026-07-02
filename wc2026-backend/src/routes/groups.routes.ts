import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); 

router.post('/', GroupController.createGroup);

router.get('/', GroupController.getMyGroups);

router.post('/join', GroupController.joinGroup);

router.get('/:groupId/invite', GroupController.getInviteCode);

router.get('/:groupId/members', GroupController.getGroupMembers);

router.get('/:groupId/leaderboard', GroupController.getLeaderboard);

export default router;