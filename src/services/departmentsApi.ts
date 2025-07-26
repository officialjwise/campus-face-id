import { apiClient } from '../lib/api';
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

export const departmentsApi = {
  // Create new department (Admin only)
  create: async (data: CreateDepartmentRequest): Promise<Department> => {
    return apiClient.post<Department>('/departments/', data);
  },

  // Get all departments
  getAll: async (params?: PaginationParams & { college_id?: string }): Promise<Department[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.college_id) queryParams.append('college_id', params.college_id);
    
    const endpoint = `/departments/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Department[]>(endpoint);
  },

  // Get departments by college ID
  getByCollegeId: async (collegeId: string): Promise<Department[]> => {
    return apiClient.get<Department[]>(`/departments/college/${collegeId}`);
  },

  // Get department by ID (Admin only)
  getById: async (departmentId: string): Promise<Department> => {
    return apiClient.get<Department>(`/departments/${departmentId}`);
  },

  // Update department (Admin only)
  update: async (departmentId: string, data: UpdateDepartmentRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/departments/${departmentId}`, data);
  },

  // Delete department (Admin only)
  delete: async (departmentId: string): Promise<void> => {
    return apiClient.delete<void>(`/departments/${departmentId}`);
  },
};
