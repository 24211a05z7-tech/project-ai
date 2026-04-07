import { User, UserRole } from './user';

export type ProjectStatus = 'active' | 'completed' | 'archived' | 'on_hold';

export interface ProjectMember {
  userId: string;
  user: User;
  role: UserRole;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  deadline?: string;
  members: ProjectMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
}
