import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validation';
import { createProjectSchema, updateProjectSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.get('/', projectController.getProjects);
router.post('/', authorize('team_leader'), validate(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', authorize('team_leader', 'guide'), validate(updateProjectSchema), projectController.updateProject);
router.get('/:id/analytics', projectController.getProjectAnalytics);
router.post('/:id/members', authorize('team_leader'), projectController.addMember);
router.delete('/:id/members/:memberId', authorize('team_leader'), projectController.removeMember);

export default router;
