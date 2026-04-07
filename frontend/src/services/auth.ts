import api from './api';

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    api.post('/auth/register', { name, email, password, role }),
  googleAuth: (code: string) => api.post('/auth/google', { code }),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
  getGoogleAuthUrl: () => api.get('/auth/google/url'),
};
