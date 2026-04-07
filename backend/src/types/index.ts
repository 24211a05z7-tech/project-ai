import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  googleId?: string;
  password?: string;
  avatar?: string;
  roles: UserRole[];
  projects: Types.ObjectId[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserRole = 'team_leader' | 'member' | 'guide' | 'panel_member';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    roles: UserRole[];
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  roles: UserRole[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
