import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as documentService from '../services/documentService';
import * as aiService from '../services/aiService';

export async function uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    if (!documentService.validateFileType(req.file.mimetype)) {
      res.status(400).json({ success: false, error: 'Invalid file type' });
      return;
    }

    const fileUrl = documentService.getFileUrl(req.file.filename);

    const doc = await documentService.uploadDocument(
      {
        taskId: req.body.taskId,
        projectId: req.body.projectId,
        fileName: req.file.originalname,
        fileUrl,
        fileType: req.file.mimetype,
      },
      (req as AuthRequest).user!.userId
    );

    aiService.analyzeDocument(req.file.originalname, req.file.mimetype).then(async (analysis) => {
      await documentService.updateDocumentAiAnalysis(doc._id.toString(), {
        aiScore: analysis.score,
        aiFeedback: analysis.feedback,
        aiSuggestions: analysis.suggestions,
      });
    }).catch(console.error);

    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: { document: doc } });
  } catch (error) {
    next(error);
  }
}

export async function getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = req.params.projectId || (req.query.projectId as string);
    const result = await documentService.getDocuments(req.query, projectId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    res.json({ success: true, data: { document: doc } });
  } catch (error) {
    next(error);
  }
}

export async function reviewDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await documentService.reviewDocument(req.params.id, req.body, (req as AuthRequest).user!.userId);
    res.json({ success: true, message: 'Document reviewed successfully', data: { document: doc } });
  } catch (error) {
    next(error);
  }
}
