import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../services/studentsApi';
import type { 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  PaginationParams 
} from '../types/api';

// Query Keys
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { college_id?: string; department_id?: string }) => 
    [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  recognitionEvents: () => [...studentKeys.all, 'recognition-events'] as const,
  recognitionEventsList: (params?: PaginationParams & {
    student_id?: string;
    date_from?: string;
    date_to?: string;
  }) => [...studentKeys.recognitionEvents(), params] as const,
};

// Get all students
export const useStudents = (params?: PaginationParams & { 
  college_id?: string; 
  department_id?: string;
}) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get student by ID
export const useStudent = (studentId: string) => {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => studentsApi.getById(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get recognition events
export const useRecognitionEvents = (params?: PaginationParams & {
  student_id?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: studentKeys.recognitionEventsList(params),
    queryFn: () => studentsApi.getRecognitionEvents(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for events)
  });
};

// Register student mutation
export const useRegisterStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStudentRequest) => studentsApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to register student:', error);
    },
  });
};

// Update student mutation
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      studentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Failed to update student:', error);
    },
  });
};

// Delete student mutation
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (studentId: string) => studentsApi.delete(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete student:', error);
    },
  });
};

// Upload student photo mutation
export const useUploadStudentPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, photo }: { studentId: string; photo: File }) =>
      studentsApi.uploadPhoto(studentId, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.studentId) });
    },
    onError: (error) => {
      console.error('Failed to upload student photo:', error);
    },
  });
};

// Face recognition mutation
export const useFaceRecognition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (imageFile: File) => studentsApi.recognize(imageFile),
    onSuccess: () => {
      // Invalidate recognition events to show the new event
      queryClient.invalidateQueries({ queryKey: studentKeys.recognitionEvents() });
    },
    onError: (error) => {
      console.error('Face recognition failed:', error);
    },
  });
};
