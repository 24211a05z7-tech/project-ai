import { Project, IProject } from '../models/Project';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { getPaginationOptions, buildPaginatedResult } from '../utils/helpers';
import { Request } from 'express';
import { Types } from 'mongoose';

export async function createProject(
  data: {
    title: string;
    problemStatement: string;
    description?: string;
    teamSize: number;
    deadlines: { start: string; end: string; reviewDeadlines?: string[] };
    guideId?: string;
    panelIds?: string[];
  },
  leaderId: string
): Promise<IProject> {
  const project = await Project.create({
    ...data,
    leaderId,
    teamMembers: [{ userId: leaderId, role: 'team_leader', joinedAt: new Date() }],
    deadlines: {
      start: new Date(data.deadlines.start),
      end: new Date(data.deadlines.end),
      reviewDeadlines: (data.deadlines.reviewDeadlines || []).map((d) => new Date(d)),
    },
  });

  await User.findByIdAndUpdate(leaderId, { $addToSet: { projects: project._id } });
  return project;
}

export async function getProjects(query: Request['query'], userId: string) {
  const options = getPaginationOptions(query);
  const filter: Record<string, unknown> = {};

  if (query.status) filter.status = String(query.status);
  if (query.search) {
    const searchStr = String(query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: searchStr, $options: 'i' } },
      { problemStatement: { $regex: searchStr, $options: 'i' } },
    ];
  }

  const userFilter = {
    $or: [
      { leaderId: new Types.ObjectId(userId) },
      { 'teamMembers.userId': new Types.ObjectId(userId) },
      { guideId: new Types.ObjectId(userId) },
      { panelIds: new Types.ObjectId(userId) },
    ],
    ...filter,
  };

  const [projects, total] = await Promise.all([
    Project.find(userFilter)
      .populate('leaderId', 'name email avatar')
      .populate('teamMembers.userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit),
    Project.countDocuments(userFilter),
  ]);

  return buildPaginatedResult(projects, total, options);
}

export async function getProjectById(projectId: string, userId: string): Promise<IProject> {
  const project = await Project.findById(projectId)
    .populate('leaderId', 'name email avatar')
    .populate('teamMembers.userId', 'name email avatar')
    .populate('guideId', 'name email avatar')
    .populate('panelIds', 'name email avatar');

  if (!project) throw createError('Project not found', 404);

  const isMember =
    project.leaderId._id.toString() === userId ||
    project.teamMembers.some((m) => m.userId.toString() === userId) ||
    project.guideId?.toString() === userId ||
    project.panelIds.some((p) => p.toString() === userId);

  if (!isMember) throw createError('Access denied', 403);
  return project;
}

export async function updateProject(
  projectId: string,
  updates: Partial<IProject>,
  userId: string
): Promise<IProject> {
  const project = await Project.findById(projectId);
  if (!project) throw createError('Project not found', 404);
  if (project.leaderId.toString() !== userId) throw createError('Only the project leader can update the project', 403);

  const updated = await Project.findByIdAndUpdate(projectId, { $set: updates }, { new: true, runValidators: true });
  if (!updated) throw createError('Project not found', 404);
  return updated;
}

export async function addTeamMember(projectId: string, memberId: string, role: string, requesterId: string): Promise<IProject> {
  const project = await Project.findById(projectId);
  if (!project) throw createError('Project not found', 404);
  if (project.leaderId.toString() !== requesterId) throw createError('Only the leader can add members', 403);

  const alreadyMember = project.teamMembers.some((m) => m.userId.toString() === memberId);
  if (alreadyMember) throw createError('User is already a team member', 409);

  project.teamMembers.push({ userId: new Types.ObjectId(memberId), role, joinedAt: new Date() });
  await project.save();
  await User.findByIdAndUpdate(memberId, { $addToSet: { projects: project._id } });
  return project;
}

export async function removeTeamMember(projectId: string, memberId: string, requesterId: string): Promise<IProject> {
  const project = await Project.findById(projectId);
  if (!project) throw createError('Project not found', 404);
  if (project.leaderId.toString() !== requesterId) throw createError('Only the leader can remove members', 403);

  project.teamMembers = project.teamMembers.filter((m) => m.userId.toString() !== memberId);
  await project.save();
  await User.findByIdAndUpdate(memberId, { $pull: { projects: project._id } });
  return project;
}

export async function getProjectAnalytics(projectId: string) {
  const project = await Project.findById(projectId)
    .populate('tasks')
    .populate('documents');
  if (!project) throw createError('Project not found', 404);

  const totalTasks = project.tasks.length;
  const completedTasksResult = await import('../models/Task').then(({ Task }) =>
    Task.countDocuments({ projectId, status: 'completed' })
  );
  const progress = project.status === 'completed'
    ? 100
    : totalTasks > 0
    ? Math.round((completedTasksResult / totalTasks) * 100)
    : 0;

  return {
    projectId,
    title: project.title,
    status: project.status,
    teamSize: project.teamMembers.length,
    tasksCount: totalTasks,
    documentsCount: project.documents.length,
    reviewsCount: project.reviewsCount,
    totalPoints: project.metadata.totalPoints,
    progress,
  };
}
