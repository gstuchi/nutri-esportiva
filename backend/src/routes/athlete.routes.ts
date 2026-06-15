import { Router } from 'express';
import { getAthleteProfile, updateAthleteProfile } from '../controllers/athlete.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['athlete']));

router.get('/profile', getAthleteProfile);
router.patch('/profile', updateAthleteProfile);

export default router;
