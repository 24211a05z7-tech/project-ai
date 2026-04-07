import mongoose, { Schema, Document as MongoDocument, Types } from 'mongoose';

export interface IDocument extends MongoDocument {
  _id: Types.ObjectId;
  taskId: Types.ObjectId;
  projectId: Types.ObjectId;
  uploaderId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  version: number;
  status: 'pending' | 'accepted' | 'rejected';
  aiScore?: number;
  aiFeedback?: string;
  aiSuggestions: string[];
  guideMarks?: number;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  versions: Array<{
    version: number;
    fileUrl: string;
    uploadedAt: Date;
    uploaderId: Types.ObjectId;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    aiScore: { type: Number, min: 0, max: 100 },
    aiFeedback: { type: String },
    aiSuggestions: [{ type: String }],
    guideMarks: { type: Number },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    versions: [
      {
        version: { type: Number, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
