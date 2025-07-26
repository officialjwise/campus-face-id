import { apiClient } from '../lib/api';
import type {
  College,
  CreateCollegeRequest,
  UpdateCollegeRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

export const collegesApi = {
  // Create new college (Admin only)
  create: async (data: CreateCollegeRequest): Promise<College> => {
    return apiClient.post<College>('/colleges/', data);
  },

  // Get all colleges (Public)
  getAll: async (params?: PaginationParams): Promise<College[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = `/colleges/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<College[]>(endpoint);
  },

  // Get college by ID (Admin only)
  getById: async (collegeId: string): Promise<College> => {
    return apiClient.get<College>(`/colleges/${collegeId}`);
  },

  // Update college (Admin only)
  update: async (collegeId: string, data: UpdateCollegeRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/colleges/${collegeId}`, data);
  },

  // Delete college (Admin only)
  delete: async (collegeId: string): Promise<void> => {
    return apiClient.delete<void>(`/colleges/${collegeId}`);
  },
};
