import { apiClient } from '../lib/api';
import type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  FaceRecognitionResponse,
  RecognitionEvent,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

export const studentsApi = {
  // Register new student (Public)
  register: async (data: CreateStudentRequest): Promise<Student> => {
    return apiClient.post<Student>('/students/', data);
  },

  // Get all students (Admin only)
  getAll: async (params?: PaginationParams & { 
    college_id?: string; 
    department_id?: string;
  }): Promise<PaginatedResponse<Student>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.college_id) queryParams.append('college_id', params.college_id);
    if (params?.department_id) queryParams.append('department_id', params.department_id);
    
    const endpoint = `/students/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<Student>>(endpoint);
  },

  // Get student by ID (Admin only)
  getById: async (studentId: string): Promise<Student> => {
    return apiClient.get<Student>(`/students/${studentId}`);
  },

  // Update student (Admin only)
  update: async (studentId: string, data: UpdateStudentRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/students/${studentId}`, data);
  },

  // Delete student (Admin only)
  delete: async (studentId: string): Promise<void> => {
    return apiClient.delete<void>(`/students/${studentId}`);
  },

  // Upload student photo (Admin only)
  uploadPhoto: async (studentId: string, photo: File): Promise<{ message: string }> => {
    return apiClient.uploadFile<{ message: string }>(`/students/${studentId}/photo`, photo);
  },

  // Face recognition (Public)
  recognize: async (imageFile: File): Promise<FaceRecognitionResponse> => {
    return apiClient.uploadFile<FaceRecognitionResponse>('/students/recognize', imageFile);
  },

  // Get recognition events (Admin only)
  getRecognitionEvents: async (params?: PaginationParams & {
    student_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedResponse<RecognitionEvent>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.student_id) queryParams.append('student_id', params.student_id);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    const endpoint = `/students/recognition-events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<RecognitionEvent>>(endpoint);
  },
};
