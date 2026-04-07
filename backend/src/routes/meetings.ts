import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { ReviewSlot } from '../models/ReviewSlot';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const meetings = await ReviewSlot.find({
      $or: [
        { panelMemberId: userId },
        { 'bookings.userId': userId },
      ],
      status: { $ne: 'cancelled' },
    })
      .populate('panelMemberId', 'name email avatar')
      .populate('projectId', 'title')
      .sort({ dateTime: 1 });
    res.json({ success: true, data: { meetings } });
  } catch (error) {
    next(error);
  }
});

router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.userId;
    const meetings = await ReviewSlot.find({
      $or: [
        { panelMemberId: userId },
        { 'bookings.userId': userId },
      ],
      dateTime: { $gte: new Date() },
      status: { $ne: 'cancelled' },
    })
      .populate('panelMemberId', 'name email avatar')
      .populate('projectId', 'title')
      .sort({ dateTime: 1 })
      .limit(10);
    res.json({ success: true, data: { meetings } });
  } catch (error) {
    next(error);
  }
});

export default router;
