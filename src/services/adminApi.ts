import { apiClient } from '../lib/api';
import type { 
  AdminStats, 
  HealthCheck, 
  DashboardChartData,
  RegistrationTrendData,
  CollegeDistributionData,
  DepartmentEnrollmentData,
  SystemHealthMetrics
} from '../types/api';

export const adminApi = {
  // Get admin dashboard stats (Admin only)
  getStats: async (): Promise<AdminStats> => {
    return apiClient.get<AdminStats>('/admin/stats');
  },

  // Get dashboard chart data (Admin only)
  getDashboardCharts: async (): Promise<DashboardChartData> => {
    return apiClient.get<DashboardChartData>('/admin/dashboard-charts');
  },

  // 📈 Registration Trends - Line/bar chart showing registration over time
  getRegistrationTrends: async (): Promise<RegistrationTrendData[]> => {
    return apiClient.get<RegistrationTrendData[]>('/admin/analytics/registration-trends');
  },

  // 🥧 College Distribution - Pie chart showing student distribution by college
  getCollegeDistribution: async (): Promise<CollegeDistributionData[]> => {
    return apiClient.get<CollegeDistributionData[]>('/admin/analytics/college-distribution');
  },

  // 📊 Department Enrollment - Bar chart showing enrollment by department
  getDepartmentEnrollment: async (): Promise<DepartmentEnrollmentData[]> => {
    return apiClient.get<DepartmentEnrollmentData[]>('/admin/analytics/department-enrollment');
  },

  // ⚡ System Health Metrics - Performance metrics and system monitoring
  getSystemHealth: async (): Promise<SystemHealthMetrics> => {
    return apiClient.get<SystemHealthMetrics>('/admin/analytics/system-health');
  },

  // Health check (Public)
  healthCheck: async (): Promise<HealthCheck> => {
    return apiClient.get<HealthCheck>('/');
  },
};
