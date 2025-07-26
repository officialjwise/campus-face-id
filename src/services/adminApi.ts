import { apiClient } from '../lib/api';
import type { AdminStats, HealthCheck } from '../types/api';

export const adminApi = {
  // Get admin dashboard stats (Admin only)
  getStats: async (): Promise<AdminStats> => {
    return apiClient.get<AdminStats>('/admin/stats');
  },

  // Health check (Public)
  healthCheck: async (): Promise<HealthCheck> => {
    return apiClient.get<HealthCheck>('/');
  },
};
