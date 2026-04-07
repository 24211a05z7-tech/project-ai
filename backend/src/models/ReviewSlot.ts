import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReviewSlot extends Document {
  _id: Types.ObjectId;
  panelMemberId: Types.ObjectId;
  projectId: Types.ObjectId;
  dateTime: Date;
  duration: number;
  capacity: number;
  status: 'open' | 'full' | 'cancelled';
  bookings: Array<{
    userId: Types.ObjectId;
    teamId: Types.ObjectId;
    bookedAt: Date;
  }>;
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSlotSchema = new Schema<IReviewSlot>(
  {
    panelMemberId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    dateTime: { type: Date, required: true },
    duration: { type: Number, default: 30 },
    capacity: { type: Number, default: 1 },
    status: { type: String, enum: ['open', 'full', 'cancelled'], default: 'open' },
    bookings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        teamId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        bookedAt: { type: Date, default: Date.now },
      },
    ],
    location: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const ReviewSlot = mongoose.model<IReviewSlot>('ReviewSlot', reviewSlotSchema);
