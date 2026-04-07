import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as notificationService from '../services/notificationService';

export async function getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await notificationService.getNotifications(req.query, (req as AuthRequest).user!.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await notificationService.getUnreadCount((req as AuthRequest).user!.userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notification = await notificationService.markAsRead(req.params.id, (req as AuthRequest).user!.userId);
    if (!notification) {
      res.status(404).json({ success: false, error: 'Notification not found' });
      return;
    }
    res.json({ success: true, message: 'Notification marked as read', data: { notification } });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await notificationService.markAllAsRead((req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await notificationService.deleteNotification(req.params.id, (req as AuthRequest).user!.userId);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Notification not found' });
      return;
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
}
