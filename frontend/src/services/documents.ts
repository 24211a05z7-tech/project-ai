import api from './api';

export const documentsService = {
  list: (projectId?: string) => api.get('/documents', { params: { projectId } }),
  get: (id: string) => api.get(`/documents/${id}`),
  upload: (projectId: string, file: File, title: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('projectId', projectId);
    return api.post('/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  versions: (id: string) => api.get(`/documents/${id}/versions`),
  accept: (id: string, marks: number, feedback: string) =>
    api.patch(`/documents/${id}/accept`, { marks, feedback }),
  reject: (id: string, feedback: string) => api.patch(`/documents/${id}/reject`, { feedback }),
};
