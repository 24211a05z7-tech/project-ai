import { DocumentModel, IDocument } from '../models/Document';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { createError } from '../middleware/errorHandler';
import { getPaginationOptions, buildPaginatedResult, validateObjectId } from '../utils/helpers';
import { Request } from 'express';
import { Types } from 'mongoose';

export async function uploadDocument(
  data: {
    taskId: string;
    projectId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  },
  uploaderId: string
): Promise<IDocument> {
  validateObjectId(data.taskId, 'taskId');
  validateObjectId(data.projectId, 'projectId');
  validateObjectId(uploaderId, 'uploaderId');

  const [task, project] = await Promise.all([
    Task.findById(new Types.ObjectId(data.taskId)),
    Project.findById(new Types.ObjectId(data.projectId)),
  ]);

  if (!task) throw createError('Task not found', 404);
  if (!project) throw createError('Project not found', 404);

  const existingDoc = await DocumentModel.findOne({
    taskId: new Types.ObjectId(data.taskId),
    uploaderId: new Types.ObjectId(uploaderId),
  });

  if (existingDoc) {
    const newVersion = existingDoc.version + 1;
    existingDoc.versions.push({
      version: newVersion,
      fileUrl: data.fileUrl,
      uploadedAt: new Date(),
      uploaderId: new Types.ObjectId(uploaderId),
    });
    existingDoc.version = newVersion;
    existingDoc.fileUrl = data.fileUrl;
    existingDoc.fileName = data.fileName;
    existingDoc.status = 'pending';
    existingDoc.aiScore = undefined;
    existingDoc.aiFeedback = undefined;
    existingDoc.aiSuggestions = [];
    await existingDoc.save();
    return existingDoc;
  }

  const doc = await DocumentModel.create({
    ...data,
    uploaderId,
    versions: [{ version: 1, fileUrl: data.fileUrl, uploadedAt: new Date(), uploaderId }],
  });

  await Project.findByIdAndUpdate(data.projectId, { $addToSet: { documents: doc._id } });
  return doc;
}

export async function getDocuments(query: Request['query'], projectId: string) {
  validateObjectId(projectId, 'projectId');
  const options = getPaginationOptions(query);
  const filter: Record<string, unknown> = { projectId: new Types.ObjectId(projectId) };

  if (query.status) filter.status = String(query.status);
  if (query.taskId) {
    const taskId = String(query.taskId);
    if (Types.ObjectId.isValid(taskId)) filter.taskId = new Types.ObjectId(taskId);
  }

  const [documents, total] = await Promise.all([
    DocumentModel.find(filter)
      .populate('uploaderId', 'name email avatar')
      .populate('reviewedBy', 'name email avatar')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit),
    DocumentModel.countDocuments(filter),
  ]);

  return buildPaginatedResult(documents, total, options);
}

export async function getDocumentById(documentId: string): Promise<IDocument> {
  validateObjectId(documentId, 'documentId');
  const doc = await DocumentModel.findById(new Types.ObjectId(documentId))
    .populate('uploaderId', 'name email avatar')
    .populate('reviewedBy', 'name email avatar')
    .populate('taskId', 'title');

  if (!doc) throw createError('Document not found', 404);
  return doc;
}

export async function reviewDocument(
  documentId: string,
  reviewData: { status: 'accepted' | 'rejected'; guideMarks?: number; feedback?: string },
  reviewerId: string
): Promise<IDocument> {
  validateObjectId(documentId, 'documentId');
  validateObjectId(reviewerId, 'reviewerId');
  const doc = await DocumentModel.findById(new Types.ObjectId(documentId));
  if (!doc) throw createError('Document not found', 404);

  const project = await Project.findById(doc.projectId);
  if (!project) throw createError('Project not found', 404);

  const isGuide = project.guideId?.toString() === reviewerId;
  const isPanelMember = project.panelIds.some((p) => p.toString() === reviewerId);
  if (!isGuide && !isPanelMember) throw createError('Only the guide or panel members can review documents', 403);

  doc.status = reviewData.status;
  doc.reviewedBy = new Types.ObjectId(reviewerId);
  doc.reviewedAt = new Date();
  if (reviewData.guideMarks !== undefined) doc.guideMarks = reviewData.guideMarks;
  if (reviewData.feedback) doc.aiFeedback = reviewData.feedback;

  await doc.save();
  return doc;
}

export async function updateDocumentAiAnalysis(
  documentId: string,
  analysis: { aiScore: number; aiFeedback: string; aiSuggestions: string[] }
): Promise<IDocument> {
  const doc = await DocumentModel.findByIdAndUpdate(documentId, { $set: analysis }, { new: true });
  if (!doc) throw createError('Document not found', 404);
  return doc;
}

export function getFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function validateFileType(mimetype: string): boolean {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
  ];
  return allowed.includes(mimetype);
}
