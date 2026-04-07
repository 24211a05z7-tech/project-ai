import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotificationType =
  | 'task_update'
  | 'task_assigned'
  | 'task_completed'
  | 'document_accepted'
  | 'document_rejected'
  | 'document_uploaded'
  | 'review_scheduled'
  | 'review_cancelled'
  | 'project_update'
  | 'member_joined'
  | 'member_left'
  | 'performance_update'
  | 'deadline_reminder'
  | 'general';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: {
    type: string;
    id: Types.ObjectId;
  };
  read: boolean;
  readAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'task_update', 'task_assigned', 'task_completed', 'document_accepted',
        'document_rejected', 'document_uploaded', 'review_scheduled', 'review_cancelled',
        'project_update', 'member_joined', 'member_left', 'performance_update',
        'deadline_reminder', 'general',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntity: {
      type: { type: String },
      id: { type: Schema.Types.ObjectId },
    },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
