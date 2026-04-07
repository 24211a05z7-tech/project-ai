export interface RegisterBody {
  email: string;
  name: string;
  password: string;
  roles?: string[];
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateProjectBody {
  title: string;
  problemStatement: string;
  description?: string;
  teamSize: number;
  deadlines: {
    start: string;
    end: string;
    reviewDeadlines?: string[];
  };
  guideId?: string;
  panelIds?: string[];
}

export interface UpdateProjectBody extends Partial<CreateProjectBody> {
  status?: 'active' | 'completed' | 'archived';
}

export interface CreateTaskBody {
  projectId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  points?: number;
}

export interface UpdateTaskBody extends Partial<Omit<CreateTaskBody, 'projectId'>> {
  status?: 'todo' | 'in_progress' | 'completed';
}

export interface CreateSubtaskBody {
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface NotificationBody {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedEntity?: {
    type: string;
    id: string;
  };
}
