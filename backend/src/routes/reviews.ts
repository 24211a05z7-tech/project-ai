import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validation';
import { createReviewSlotSchema, bookReviewSlotSchema } from '../utils/validators';
import { ReviewSlot } from '../models/ReviewSlot';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';
import { Types } from 'mongoose';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.status) filter.status = req.query.status;
    const slots = await ReviewSlot.find(filter)
      .populate('panelMemberId', 'name email avatar')
      .populate('projectId', 'title')
      .sort({ dateTime: 1 });
    res.json({ success: true, data: { slots } });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('panel_member'), validate(createReviewSlotSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await ReviewSlot.create({ ...req.body, panelMemberId: (req as AuthRequest).user!.userId, dateTime: new Date(req.body.dateTime) });
    res.status(201).json({ success: true, message: 'Review slot created', data: { slot } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await ReviewSlot.findById(req.params.id)
      .populate('panelMemberId', 'name email avatar')
      .populate('projectId', 'title');
    if (!slot) {
      res.status(404).json({ success: false, error: 'Review slot not found' });
      return;
    }
    res.json({ success: true, data: { slot } });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/book', validate(bookReviewSlotSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await ReviewSlot.findById(req.params.id);
    if (!slot) throw createError('Review slot not found', 404);
    if (slot.status === 'full' || slot.status === 'cancelled') throw createError('Slot is not available', 400);
    if (slot.bookings.length >= slot.capacity) {
      slot.status = 'full';
      await slot.save();
      throw createError('Slot is full', 400);
    }
    slot.bookings.push({ userId: new Types.ObjectId((req as AuthRequest).user!.userId), teamId: new Types.ObjectId(req.body.teamId), bookedAt: new Date() });
    if (slot.bookings.length >= slot.capacity) slot.status = 'full';
    await slot.save();
    res.json({ success: true, message: 'Slot booked successfully', data: { slot } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authorize('panel_member'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slot = await ReviewSlot.findOneAndUpdate(
      { _id: req.params.id, panelMemberId: (req as AuthRequest).user!.userId },
      { status: 'cancelled' },
      { new: true }
    );
    if (!slot) {
      res.status(404).json({ success: false, error: 'Review slot not found or not authorized' });
      return;
    }
    res.json({ success: true, message: 'Review slot cancelled', data: { slot } });
  } catch (error) {
    next(error);
  }
});

export default router;
