import { Router } from 'express';
import { createGroup, joinGroup, fetchCoachGroups, fetchGroupAthletes, fetchAthleteGroups } from '../controllers/group.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Todas as rotas de grupo requerem login
router.use(authMiddleware);

router.post('/', roleMiddleware(['coach']), createGroup);
router.post('/join', roleMiddleware(['athlete']), joinGroup);
router.get('/coach', roleMiddleware(['coach']), fetchCoachGroups);
router.get('/athlete', roleMiddleware(['athlete']), fetchAthleteGroups);
router.get('/:groupId/athletes', roleMiddleware(['coach']), fetchGroupAthletes);

export default router;
