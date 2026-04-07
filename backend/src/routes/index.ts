import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import documentRoutes from './documents';
import performanceRoutes from './performance';
import reviewRoutes from './reviews';
import meetingRoutes from './meetings';
import aiRoutes from './ai';
import notificationRoutes from './notifications';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/documents', documentRoutes);
router.use('/performance', performanceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/meetings', meetingRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

export default router;
