import api from './api';

export const tasksService = {
  list: (projectId?: string) => api.get('/tasks', { params: { projectId } }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: object) => api.post('/tasks', data),
  update: (id: string, data: object) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  complete: (id: string) => api.patch(`/tasks/${id}/complete`),
  createSubtask: (taskId: string, title: string) => api.post(`/tasks/${taskId}/subtasks`, { title }),
  completeSubtask: (taskId: string, subtaskId: string) =>
    api.patch(`/tasks/${taskId}/subtasks/${subtaskId}/complete`),
  aiSuggestSubtasks: (taskId: string) => api.post(`/tasks/${taskId}/ai-suggest`),
};
