import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPerformance extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  totalPoints: number;
  rank: number;
  tasksCompleted: number;
  documentsSubmitted: number;
  averageScore: number;
  metrics: {
    onTimeDelivery: number;
    qualityScore: number;
    collaborationScore: number;
    aiScore: number;
  };
  history: Array<{
    date: Date;
    points: number;
    action: string;
  }>;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const performanceSchema = new Schema<IPerformance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    documentsSubmitted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    metrics: {
      onTimeDelivery: { type: Number, default: 0 },
      qualityScore: { type: Number, default: 0 },
      collaborationScore: { type: Number, default: 0 },
      aiScore: { type: Number, default: 0 },
    },
    history: [
      {
        date: { type: Date, default: Date.now },
        points: { type: Number, required: true },
        action: { type: String, required: true },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

performanceSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const Performance = mongoose.model<IPerformance>('Performance', performanceSchema);
