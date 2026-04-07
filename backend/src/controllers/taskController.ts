import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as taskService from '../services/taskService';

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.createTask(req.body, (req as AuthRequest).user!.userId);
    res.status(201).json({ success: true, message: 'Task created successfully', data: { task } });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = req.params.projectId || (req.query.projectId as string);
    const result = await taskService.getTasks(req.query, projectId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Task updated successfully', data: { task } });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await taskService.deleteTask(req.params.id, (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function addSubtask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.addSubtask(req.params.id, req.body, (req as AuthRequest).user!.userId);
    res.status(201).json({ success: true, message: 'Subtask added successfully', data: { task } });
  } catch (error) {
    next(error);
  }
}

export async function updateSubtask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.updateSubtask(req.params.id, req.params.subtaskId, req.body);
    res.json({ success: true, message: 'Subtask updated successfully', data: { task } });
  } catch (error) {
    next(error);
  }
}
