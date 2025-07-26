import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collegesApi } from '../services/collegesApi';
import type { CreateCollegeRequest, UpdateCollegeRequest, PaginationParams } from '../types/api';

// Query Keys
export const collegeKeys = {
  all: ['colleges'] as const,
  lists: () => [...collegeKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...collegeKeys.lists(), params] as const,
  details: () => [...collegeKeys.all, 'detail'] as const,
  detail: (id: string) => [...collegeKeys.details(), id] as const,
};

// Get all colleges
export const useColleges = (params?: PaginationParams) => {
  return useQuery({
    queryKey: collegeKeys.list(params),
    queryFn: () => collegesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get college by ID
export const useCollege = (collegeId: string) => {
  return useQuery({
    queryKey: collegeKeys.detail(collegeId),
    queryFn: () => collegesApi.getById(collegeId),
    enabled: !!collegeId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create college mutation
export const useCreateCollege = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCollegeRequest) => collegesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collegeKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create college:', error);
    },
  });
};

// Update college mutation
export const useUpdateCollege = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollegeRequest }) =>
      collegesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: collegeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: collegeKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Failed to update college:', error);
    },
  });
};

// Delete college mutation
export const useDeleteCollege = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collegeId: string) => collegesApi.delete(collegeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collegeKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete college:', error);
    },
  });
};
