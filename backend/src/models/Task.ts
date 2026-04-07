import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubtask {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo?: Types.ObjectId;
  dueDate?: Date;
  completedAt?: Date;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: Types.ObjectId;
  subtasks: Types.DocumentArray<ISubtask & Document>;
  dueDate?: Date;
  firstSubmitBonus: boolean;
  points: number;
  bonusPoints: number;
  completedBy?: Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<ISubtask>({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  completedAt: { type: Date },
});

const taskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    subtasks: [subtaskSchema],
    dueDate: { type: Date },
    firstSubmitBonus: { type: Boolean, default: false },
    points: { type: Number, default: 10 },
    bonusPoints: { type: Number, default: 0 },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
