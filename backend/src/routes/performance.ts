import { Router } from 'express';
import * as performanceController from '../controllers/performanceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/project/:projectId', performanceController.getAnalytics);
router.get('/project/:projectId/leaderboard', performanceController.getLeaderboard);
router.get('/project/:projectId/user/:userId', performanceController.getUserPerformance);
router.get('/project/:projectId/me', performanceController.getUserPerformance);

export default router;
