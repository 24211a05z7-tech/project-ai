import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    roles: z.array(z.enum(['team_leader', 'member', 'guide', 'panel_member'])).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    problemStatement: z.string().min(10, 'Problem statement must be at least 10 characters'),
    description: z.string().optional(),
    teamSize: z.number().int().min(1).max(20),
    deadlines: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
      reviewDeadlines: z.array(z.string().datetime()).optional(),
    }),
    guideId: z.string().optional(),
    panelIds: z.array(z.string()).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    problemStatement: z.string().min(10).optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    teamSize: z.number().int().min(1).max(20).optional(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, 'Project ID is required'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    assignedTo: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    points: z.number().int().min(0).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    assignedTo: z.string().optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const createSubtaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

export const reviewDocumentSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'rejected']),
    guideMarks: z.number().min(0).max(100).optional(),
    feedback: z.string().optional(),
  }),
});

export const createReviewSlotSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, 'Project ID is required'),
    dateTime: z.string().datetime(),
    duration: z.number().int().min(15).max(120).default(30),
    capacity: z.number().int().min(1).max(10).default(1),
    location: z.string().min(1, 'Location is required'),
    notes: z.string().optional(),
  }),
});

export const bookReviewSlotSchema = z.object({
  body: z.object({
    teamId: z.string().min(1, 'Team/Project ID is required'),
  }),
});
