import { Router } from 'express';
import { saveElectrolyteAssessment, getElectrolyteHistory } from '../controllers/electrolyte.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['athlete']));

router.post('/', saveElectrolyteAssessment);
router.get('/history', getElectrolyteHistory);

export default router;
