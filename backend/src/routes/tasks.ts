import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createTaskSchema, updateTaskSchema, createSubtaskSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/:id', taskController.getTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/subtasks', validate(createSubtaskSchema), taskController.addSubtask);
router.put('/:id/subtasks/:subtaskId', taskController.updateSubtask);

export default router;
