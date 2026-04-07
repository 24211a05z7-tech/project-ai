import { Router } from 'express';
import * as aiController from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/suggest-subtasks', aiController.suggestSubtasks);
router.post('/analyze-document', aiController.analyzeDocument);
router.post('/analyze-performance', aiController.analyzePerformance);
router.post('/generate-report', aiController.generateReport);

export default router;
