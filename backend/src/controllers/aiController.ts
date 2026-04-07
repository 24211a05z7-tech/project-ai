import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/aiService';

export async function suggestSubtasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { taskTitle, taskDescription, projectContext } = req.body;
    const suggestions = await aiService.suggestSubtasks(taskTitle, taskDescription, projectContext);
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    next(error);
  }
}

export async function analyzeDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileName, fileType, taskTitle, projectTitle } = req.body;
    const analysis = await aiService.analyzeDocument(fileName, fileType, { taskTitle, projectTitle });
    res.json({ success: true, data: { analysis } });
  } catch (error) {
    next(error);
  }
}

export async function analyzePerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const insights = await aiService.analyzePerformance(req.body);
    res.json({ success: true, data: { insights } });
  } catch (error) {
    next(error);
  }
}

export async function generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const report = await aiService.generateProjectReport(req.body);
    res.json({ success: true, data: { report } });
  } catch (error) {
    next(error);
  }
}
