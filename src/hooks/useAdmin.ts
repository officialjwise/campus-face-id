import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  charts: () => [...adminKeys.all, 'charts'] as const,
  health: () => [...adminKeys.all, 'health'] as const,
  registrationTrends: () => [...adminKeys.all, 'registration-trends'] as const,
  collegeDistribution: () => [...adminKeys.all, 'college-distribution'] as const,
  departmentEnrollment: () => [...adminKeys.all, 'department-enrollment'] as const,
  systemHealth: () => [...adminKeys.all, 'system-health'] as const,
};

// Get admin dashboard stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get dashboard chart data
export const useAdminCharts = () => {
  return useQuery({
    queryKey: adminKeys.charts(),
    queryFn: () => adminApi.getDashboardCharts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// 📈 Registration Trends
export const useRegistrationTrends = () => {
  return useQuery({
    queryKey: adminKeys.registrationTrends(),
    queryFn: () => adminApi.getRegistrationTrends(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// 🥧 College Distribution
export const useCollegeDistribution = () => {
  return useQuery({
    queryKey: adminKeys.collegeDistribution(),
    queryFn: () => adminApi.getCollegeDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// 📊 Department Enrollment
export const useDepartmentEnrollment = () => {
  return useQuery({
    queryKey: adminKeys.departmentEnrollment(),
    queryFn: () => adminApi.getDepartmentEnrollment(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// ⚡ System Health Metrics
export const useSystemHealth = () => {
  return useQuery({
    queryKey: adminKeys.systemHealth(),
    queryFn: () => adminApi.getSystemHealth(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time monitoring
  });
};

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: adminKeys.health(),
    queryFn: () => adminApi.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};
