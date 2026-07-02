import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware); // Todas estas rutas requieren estar autenticado

// Req 6: Crear un grupo de quiniela
router.post('/', GroupController.createGroup);

// Req 9: Visualizar todos los grupos a los que pertenece
router.get('/', GroupController.getMyGroups);

// Req 8: Unirse a un grupo utilizando un código
router.post('/join', GroupController.joinGroup);

// Req 7: Obtener el código de invitación de un grupo
router.get('/:groupId/invite', GroupController.getInviteCode);

// Req 10: Consultar la lista de participantes de un grupo
router.get('/:groupId/members', GroupController.getGroupMembers);

// Req 11 y 20: Visualizar la clasificación actualizada del grupo
router.get('/:groupId/leaderboard', GroupController.getLeaderboard);

export default router;