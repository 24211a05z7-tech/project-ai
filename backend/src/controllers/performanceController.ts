import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as performanceService from '../services/performanceService';

export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const leaderboard = await performanceService.getLeaderboard(req.params.projectId);
    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    next(error);
  }
}

export async function getUserPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId || (req as AuthRequest).user!.userId;
    const performance = await performanceService.getUserPerformance(userId, req.params.projectId);
    res.json({ success: true, data: { performance } });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const analytics = await performanceService.getPerformanceAnalytics(req.params.projectId);
    res.json({ success: true, data: { analytics } });
  } catch (error) {
    next(error);
  }
}
