import api from './api';

export const performanceService = {
  getUserMetrics: (userId?: string) => api.get('/performance/metrics', { params: { userId } }),
  getLeaderboard: (projectId?: string) => api.get('/performance/leaderboard', { params: { projectId } }),
  getAnalytics: () => api.get('/performance/analytics'),
};
