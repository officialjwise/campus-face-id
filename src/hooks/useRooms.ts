import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../services/roomApi';
import type { 
  CreateRoomAssignmentRequest, 
  UpdateRoomAssignmentRequest,
  RoomRecognitionRequest,
  RoomPreviewRequest,
  PaginationParams 
} from '../types/api';

// Query Keys
export const roomKeys = {
  all: ['rooms'] as const,
  assignments: () => [...roomKeys.all, 'assignments'] as const,
  assignmentsList: (params?: PaginationParams) => [...roomKeys.assignments(), params] as const,
  assignmentDetail: (id: string) => [...roomKeys.assignments(), 'detail', id] as const,
  assignmentPreview: (params: RoomPreviewRequest) => [...roomKeys.assignments(), 'preview', params] as const,
  roomStatus: () => [...roomKeys.all, 'status'] as const,
  recognitionLogs: () => [...roomKeys.all, 'recognition-logs'] as const,
  recognitionLogsList: (params?: PaginationParams & {
    room_code?: string;
    student_id?: string;
    status?: 'valid' | 'invalid' | 'not_found';
    date_from?: string;
    date_to?: string;
  }) => [...roomKeys.recognitionLogs(), params] as const,
};

// 🔓 PUBLIC QUERIES

// Get all room assignments (Public)
export const useRoomAssignments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: roomKeys.assignmentsList(params),
    queryFn: () => roomApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get room status dashboard (Public)
export const useRoomStatus = () => {
  return useQuery({
    queryKey: roomKeys.roomStatus(),
    queryFn: () => roomApi.getRoomStatus(),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

// 🔒 ADMIN QUERIES

// Preview room assignment before creating (Admin)
export const useRoomPreview = (params: RoomPreviewRequest, enabled: boolean = false) => {
  return useQuery({
    queryKey: roomKeys.assignmentPreview(params),
    queryFn: () => roomApi.previewAssignment(params),
    enabled: enabled && !!params.index_start && !!params.index_end,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get room assignment by ID (Admin)
export const useRoomAssignment = (assignmentId: string) => {
  return useQuery({
    queryKey: roomKeys.assignmentDetail(assignmentId),
    queryFn: () => roomApi.getById(assignmentId),
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get recognition logs (Admin)
export const useRecognitionLogs = (params?: PaginationParams & {
  room_code?: string;
  student_id?: string;
  status?: 'valid' | 'invalid' | 'not_found';
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: roomKeys.recognitionLogsList(params),
    queryFn: () => roomApi.getRecognitionLogs(params),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent for logs)
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

// 🔒 ADMIN MUTATIONS

// Create room assignment mutation (Admin)
export const useCreateRoomAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoomAssignmentRequest) => roomApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.assignments() });
      queryClient.invalidateQueries({ queryKey: roomKeys.roomStatus() });
    },
    onError: (error) => {
      console.error('Failed to create room assignment:', error);
    },
  });
};

// Update room assignment mutation (Admin)
export const useUpdateRoomAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomAssignmentRequest }) =>
      roomApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.assignments() });
      queryClient.invalidateQueries({ queryKey: roomKeys.assignmentDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roomKeys.roomStatus() });
    },
    onError: (error) => {
      console.error('Failed to update room assignment:', error);
    },
  });
};

// Delete room assignment mutation (Admin)
export const useDeleteRoomAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (assignmentId: string) => roomApi.delete(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.assignments() });
      queryClient.invalidateQueries({ queryKey: roomKeys.roomStatus() });
    },
    onError: (error) => {
      console.error('Failed to delete room assignment:', error);
    },
  });
};

// 🔓 PUBLIC MUTATIONS

// ⭐ CORE FEATURE: Face Recognition with Room Validation (Public)
export const useRoomRecognition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RoomRecognitionRequest) => roomApi.recognizeStudent(data),
    onSuccess: () => {
      // Invalidate recognition logs and room status for real-time updates
      queryClient.invalidateQueries({ queryKey: roomKeys.recognitionLogs() });
      queryClient.invalidateQueries({ queryKey: roomKeys.roomStatus() });
    },
    onError: (error) => {
      console.error('Room recognition failed:', error);
    },
  });
};

// Quick index validation mutation (Public)
export const useQuickValidation = () => {
  return useMutation({
    mutationFn: ({ roomCode, indexNumber }: { roomCode: string; indexNumber: string }) =>
      roomApi.validateQuick(roomCode, indexNumber),
    onError: (error) => {
      console.error('Quick validation failed:', error);
    },
  });
};
