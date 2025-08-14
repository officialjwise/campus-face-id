import { apiClient } from '../lib/api';

export interface FaceRecognitionRequest {
  face_image: string; // Base64 encoded image
}

export interface ExamRoomData {
  room_number: string;
  exam_title: string;
  exam_date: string;
  seat_number?: string;
  building?: string;
  floor?: string;
}

export interface RecognizedStudentData {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  student_id: string;
  index_number: string;
  email: string;
  college_name: string;
  department_name: string;
  exam_room?: ExamRoomData;
}

export interface FaceRecognitionResponse {
  success: boolean;
  student?: RecognizedStudentData;
  confidence?: number;
  recognition_time?: string;
  message: string;
}

export const recognitionApi = {
  // Recognize face and return student data
  recognizeFace: async (data: FaceRecognitionRequest): Promise<FaceRecognitionResponse> => {
    try {
      return await apiClient.post<FaceRecognitionResponse>('/students/recognize', data);
    } catch (error) {
      console.error('Face recognition failed:', error);
      return {
        success: false,
        message: 'Recognition failed. Please try again.',
      };
    }
  },

  // Get student verification status
  verifyStudent: async (studentId: string): Promise<FaceRecognitionResponse> => {
    try {
      return await apiClient.get<FaceRecognitionResponse>(`/students/${studentId}/verify`);
    } catch (error) {
      console.error('Student verification failed:', error);
      return {
        success: false,
        message: 'Verification failed. Please try again.',
      };
    }
  },

  // Test recognition system status
  getRecognitionStatus: async (): Promise<{ available: boolean; models_loaded: boolean }> => {
    try {
      return await apiClient.get<{ available: boolean; models_loaded: boolean }>('/recognition/status');
    } catch (error) {
      console.error('Recognition status check failed:', error);
      return { available: false, models_loaded: false };
    }
  },
};
