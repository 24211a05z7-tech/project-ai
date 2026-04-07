export * from './user';
export * from './project';
export * from './task';
export * from './document';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Performance {
  userId: string;
  totalPoints: number;
  rank: number;
  tasksCompleted: number;
  documentsSubmitted: number;
  completionRate: number;
  insights?: string[];
}

export interface ReviewSlot {
  id: string;
  panelMemberId: string;
  projectId?: string;
  dateTime: string;
  duration: number;
  capacity: number;
  status: 'open' | 'full' | 'cancelled';
  bookings: Array<{ userId: string; teamId: string; bookedAt: string }>;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  projectId: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed';
  participants: string[];
  meetingUrl?: string;
}
