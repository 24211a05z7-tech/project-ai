export type DocumentStatus = 'pending' | 'accepted' | 'rejected' | 'under_review';

export interface DocumentVersion {
  id: string;
  version: number;
  fileUrl: string;
  uploadedAt: string;
  aiScore?: number;
}

export interface Document {
  id: string;
  title: string;
  projectId: string;
  uploadedBy: string;
  status: DocumentStatus;
  currentVersion: number;
  versions: DocumentVersion[];
  aiScore?: number;
  marks?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}
