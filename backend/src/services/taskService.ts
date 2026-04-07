import { Task, ITask } from '../models/Task';
import { Project } from '../models/Project';
import { createError } from '../middleware/errorHandler';
import { getPaginationOptions, buildPaginatedResult } from '../utils/helpers';
import { Request } from 'express';
import { Types } from 'mongoose';

export async function createTask(
  data: {
    projectId: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    assignedTo?: string;
    dueDate?: string;
    points?: number;
  },
  creatorId: string
): Promise<ITask> {
  const project = await Project.findById(data.projectId);
  if (!project) throw createError('Project not found', 404);

  const isLeader = project.leaderId.toString() === creatorId;
  const isGuide = project.guideId?.toString() === creatorId;
  if (!isLeader && !isGuide) throw createError('Only project leader or guide can create tasks', 403);

  const task = await Task.create({
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });

  await Project.findByIdAndUpdate(data.projectId, { $push: { tasks: task._id } });
  return task;
}

export async function getTasks(query: Request['query'], projectId: string) {
  const options = getPaginationOptions(query);
  const filter: Record<string, unknown> = { projectId };

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('completedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit),
    Task.countDocuments(filter),
  ]);

  return buildPaginatedResult(tasks, total, options);
}

export async function getTaskById(taskId: string): Promise<ITask> {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email avatar')
    .populate('completedBy', 'name email avatar')
    .populate('subtasks.assignedTo', 'name email avatar');

  if (!task) throw createError('Task not found', 404);
  return task;
}

export async function updateTask(
  taskId: string,
  updates: Partial<ITask>,
  userId: string
): Promise<ITask> {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const project = await Project.findById(task.projectId);
  if (!project) throw createError('Project not found', 404);

  const isLeader = project.leaderId.toString() === userId;
  const isAssignee = task.assignedTo?.toString() === userId;
  const isGuide = project.guideId?.toString() === userId;

  if (!isLeader && !isAssignee && !isGuide) {
    throw createError('You do not have permission to update this task', 403);
  }

  if (updates.status === 'completed' && task.status !== 'completed') {
    (updates as Record<string, unknown>).completedBy = new Types.ObjectId(userId);
    (updates as Record<string, unknown>).completedAt = new Date();

    const isFirst = !(await Task.exists({ projectId: task.projectId, status: 'completed', _id: { $ne: task._id } }));
    if (isFirst) {
      (updates as Record<string, unknown>).firstSubmitBonus = true;
      (updates as Record<string, unknown>).bonusPoints = 5;
    }
  }

  const updated = await Task.findByIdAndUpdate(taskId, { $set: updates }, { new: true, runValidators: true });
  if (!updated) throw createError('Task not found', 404);
  return updated;
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const project = await Project.findById(task.projectId);
  if (!project) throw createError('Project not found', 404);

  if (project.leaderId.toString() !== userId) {
    throw createError('Only the project leader can delete tasks', 403);
  }

  await Task.findByIdAndDelete(taskId);
  await Project.findByIdAndUpdate(task.projectId, { $pull: { tasks: task._id } });
}

export async function addSubtask(
  taskId: string,
  subtaskData: { title: string; description?: string; assignedTo?: string; dueDate?: string },
  userId: string
): Promise<ITask> {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const project = await Project.findById(task.projectId);
  if (!project) throw createError('Project not found', 404);

  const isLeader = project.leaderId.toString() === userId;
  const isAssignee = task.assignedTo?.toString() === userId;
  if (!isLeader && !isAssignee) throw createError('Permission denied', 403);

  task.subtasks.push({
    title: subtaskData.title,
    description: subtaskData.description,
    status: 'todo',
    assignedTo: subtaskData.assignedTo ? new Types.ObjectId(subtaskData.assignedTo) : undefined,
    dueDate: subtaskData.dueDate ? new Date(subtaskData.dueDate) : undefined,
  } as never);

  await task.save();
  return task;
}

export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  updates: Record<string, unknown>
): Promise<ITask> {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw createError('Subtask not found', 404);

  Object.assign(subtask, updates);
  if (updates.status === 'completed') subtask.completedAt = new Date();
  await task.save();
  return task;
}
