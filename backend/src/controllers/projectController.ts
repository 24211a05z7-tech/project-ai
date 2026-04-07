import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as projectService from '../services/projectService';

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.createProject(req.body, (req as AuthRequest).user!.userId);
    res.status(201).json({ success: true, message: 'Project created successfully', data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await projectService.getProjects(req.query, (req as AuthRequest).user!.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.getProjectById(req.params.id, (req as AuthRequest).user!.userId);
    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Project updated successfully', data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { memberId, role } = req.body;
    const project = await projectService.addTeamMember(req.params.id, memberId, role || 'member', (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Member added successfully', data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectService.removeTeamMember(req.params.id, req.params.memberId, (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Member removed successfully', data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function getProjectAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const analytics = await projectService.getProjectAnalytics(req.params.id);
    res.json({ success: true, data: { analytics } });
  } catch (error) {
    next(error);
  }
}
