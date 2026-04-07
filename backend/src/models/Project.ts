import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  problemStatement: string;
  description?: string;
  leaderId: Types.ObjectId;
  teamMembers: Array<{
    userId: Types.ObjectId;
    role: string;
    joinedAt: Date;
  }>;
  guideId?: Types.ObjectId;
  panelIds: Types.ObjectId[];
  tasks: Types.ObjectId[];
  documents: Types.ObjectId[];
  deadlines: {
    start: Date;
    end: Date;
    reviewDeadlines: Date[];
  };
  reviewsCount: number;
  teamSize: number;
  status: 'active' | 'completed' | 'archived';
  metadata: {
    aiSuggested: boolean;
    totalPoints: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true },
    description: { type: String },
    leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamMembers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, default: 'member' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    guideId: { type: Schema.Types.ObjectId, ref: 'User' },
    panelIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    deadlines: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      reviewDeadlines: [{ type: Date }],
    },
    reviewsCount: { type: Number, default: 0 },
    teamSize: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    metadata: {
      aiSuggested: { type: Boolean, default: false },
      totalPoints: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
