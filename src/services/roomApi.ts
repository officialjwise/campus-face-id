import { apiClient } from '../lib/api';
import type {
  RoomAssignment,
  CreateRoomAssignmentRequest,
  UpdateRoomAssignmentRequest,
  RoomRecognitionRequest,
  RoomValidationResponse,
  QuickValidationResponse,
  RoomStatus,
  RecognitionLog,
  PaginatedResponse,
  PaginationParams,
  RoomPreviewRequest,
  RoomPreviewResponse,
  RoomDetails,
} from '../types/api';

export const roomApi = {
  // 🔒 ADMIN ENDPOINTS (Require JWT Authentication)
  
  // 1. Preview Room Assignment (Admin only)
  previewAssignment: async (data: RoomPreviewRequest): Promise<RoomPreviewResponse> => {
    const queryParams = new URLSearchParams({
      index_start: data.index_start.toString(),
      index_end: data.index_end.toString(),
    });
    return apiClient.get<RoomPreviewResponse>(
      `/exam-room/assignments/preview?${queryParams.toString()}`
    );
  },
  
  // 2. Create Exam Room Assignment (Admin only)
  create: async (data: CreateRoomAssignmentRequest): Promise<RoomAssignment> => {
    try {
      console.log('Creating room assignment with data:', data);
      const response = await apiClient.post<RoomAssignment>('/exam-room/assign', {
        room_code: data.room_code,
        room_name: data.room_name,
        index_start: data.index_start.toString(),
        index_end: data.index_end.toString(),
        capacity: data.capacity,
        description: data.description,
      });
      console.log('Room assignment created successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to create room assignment:', error);
      throw error;
    }
  },

  // 3. Update Exam Room Assignment (Admin only)
  update: async (assignmentId: string, data: UpdateRoomAssignmentRequest): Promise<RoomAssignment> => {
    return apiClient.put<RoomAssignment>(`/exam-room/assign/${assignmentId}`, {
      room_code: data.room_code,
      room_name: data.room_name,
      index_start: data.index_start?.toString(),
      index_end: data.index_end?.toString(),
      capacity: data.capacity,
      description: data.description,
    });
  },

  // 4. Delete Exam Room Assignment (Admin only)
  delete: async (assignmentId: string): Promise<void> => {
    return apiClient.delete<void>(`/exam-room/assign/${assignmentId}`);
  },

  // 5. Get Specific Room by ID with Students (Admin only)
  getById: async (assignmentId: string): Promise<RoomDetails> => {
    return apiClient.get<RoomDetails>(`/exam-room/mappings/${assignmentId}/students`);
  },

  // 🔓 PUBLIC ENDPOINTS (No Authentication Required)
  
  // 6. List All Room Mappings (Public)
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<RoomAssignment>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/exam-room/mappings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await apiClient.get<any>(endpoint);
      
      // Handle the API response structure based on your backend implementation
      if (response && typeof response === 'object') {
        // If it's already in paginated format
        if ('data' in response && Array.isArray(response.data)) {
          return {
            items: response.data,
            total: response.data.length,
            page: 1,
            limit: response.data.length,
            total_pages: 1
          } as PaginatedResponse<RoomAssignment>;
        }
        
        // If it's a direct paginated response
        if ('items' in response) {
          return response as PaginatedResponse<RoomAssignment>;
        }
        
        // If it's a direct array
        if (Array.isArray(response)) {
          return {
            items: response,
            total: response.length,
            page: 1,
            limit: response.length,
            total_pages: 1
          } as PaginatedResponse<RoomAssignment>;
        }
      }
      
      // Fallback: empty response
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0
      } as PaginatedResponse<RoomAssignment>;
      
    } catch (error) {
      console.error('Failed to fetch room assignments:', error);
      throw error;
    }
  },

  // 7. ⭐ CORE FEATURE: Face Recognition with Room Validation (Public)
  recognizeStudent: async (data: RoomRecognitionRequest): Promise<RoomValidationResponse> => {
    return apiClient.post<RoomValidationResponse>('/exam-room/recognize', {
      face_image: data.face_image,
      room_code: data.room_code
    });
  },

  // 8. Quick Index Number Validation (Public)
  validateQuick: async (roomCode: string, indexNumber: string): Promise<QuickValidationResponse> => {
    return apiClient.get<QuickValidationResponse>(
      `/exam-room/validate/${roomCode}/${indexNumber}`
    );
  },

  // 9. Get Room Status Dashboard (Public)
  getRoomStatus: async (): Promise<RoomStatus[]> => {
    return apiClient.get<RoomStatus[]>('/exam-room/status');
  },

  // 10. Get Recognition Logs (Public with optional filters)
  getRecognitionLogs: async (params?: PaginationParams & {
    room_code?: string;
    student_id?: string;
    status?: 'valid' | 'invalid' | 'not_found';
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedResponse<RecognitionLog>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.room_code) queryParams.append('room_code', params.room_code);
    if (params?.student_id) queryParams.append('student_id', params.student_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);

    const endpoint = `/exam-room/recognition-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<RecognitionLog>>(endpoint);
  },
};
