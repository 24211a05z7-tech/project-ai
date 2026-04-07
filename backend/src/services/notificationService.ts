import { Notification, INotification, NotificationType } from '../models/Notification';
import { emitToUser } from '../config/socket';
import { getPaginationOptions, buildPaginatedResult } from '../utils/helpers';
import { Request } from 'express';
import { Types } from 'mongoose';

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: { type: string; id: string };
  expiresAt?: Date;
}): Promise<INotification> {
  const notification = await Notification.create({
    ...data,
    relatedEntity: data.relatedEntity
      ? { type: data.relatedEntity.type, id: new Types.ObjectId(data.relatedEntity.id) }
      : undefined,
  });

  emitToUser(data.userId, 'notification', {
    id: notification._id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
  });

  return notification;
}

export async function getNotifications(query: Request['query'], userId: string) {
  const options = getPaginationOptions(query);
  const filter: Record<string, unknown> = { userId };

  if (query.read !== undefined) filter.read = query.read === 'true';
  if (query.type) filter.type = query.type;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit),
    Notification.countDocuments(filter),
  ]);

  return buildPaginatedResult(notifications, total, options);
}

export async function markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true, readAt: new Date() },
    { new: true }
  );
}

export async function markAllAsRead(userId: string): Promise<void> {
  await Notification.updateMany({ userId, read: false }, { read: true, readAt: new Date() });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return Notification.countDocuments({ userId, read: false });
}

export async function deleteNotification(notificationId: string, userId: string): Promise<boolean> {
  const result = await Notification.deleteOne({ _id: notificationId, userId });
  return result.deletedCount > 0;
}

export async function broadcastToProject(
  projectId: string,
  memberIds: string[],
  notification: { type: NotificationType; title: string; message: string; relatedEntity?: { type: string; id: string } }
): Promise<void> {
  const notifications = memberIds.map((userId) => ({
    userId,
    ...notification,
    relatedEntity: notification.relatedEntity
      ? { type: notification.relatedEntity.type, id: new Types.ObjectId(notification.relatedEntity.id) }
      : undefined,
  }));

  await Notification.insertMany(notifications);

  memberIds.forEach((userId) => {
    emitToUser(userId, 'notification', {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      projectId,
    });
  });
}
