import api from './api';

export const projectsService = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: { title: string; description: string; deadline?: string }) => api.post('/projects', data),
  update: (id: string, data: Partial<{ title: string; description: string; status: string; deadline: string }>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  inviteMembers: (id: string, emails: string[], role: string) =>
    api.post(`/projects/${id}/invite`, { emails, role }),
  getActivity: (id: string) => api.get(`/projects/${id}/activity`),
};
