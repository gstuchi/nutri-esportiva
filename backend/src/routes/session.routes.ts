import { Router } from 'express';
import { startSession, updateDuring, finishSession, fetchSessionResults, fetchAthleteHistory, getActiveSession } from '../controllers/session.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Todas as rotas de sessão requerem login
router.use(authMiddleware);

router.post('/start', roleMiddleware(['athlete']), startSession);
router.post('/:id/during', roleMiddleware(['athlete']), updateDuring);
router.post('/:id/finish', roleMiddleware(['athlete']), finishSession);
router.get('/active', roleMiddleware(['athlete']), getActiveSession);
router.get('/history', roleMiddleware(['athlete']), fetchAthleteHistory);
router.get('/:id/results', fetchSessionResults); // Ambos Atleta e Coach podem ler resultados da sessão

export default router;
