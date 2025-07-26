import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '../services/departmentsApi';
import type { CreateDepartmentRequest, UpdateDepartmentRequest, PaginationParams } from '../types/api';

// Query Keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params?: PaginationParams & { college_id?: string }) => [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  byCollege: (collegeId: string) => [...departmentKeys.all, 'college', collegeId] as const,
};

// Get all departments
export const useDepartments = (params?: PaginationParams & { college_id?: string }) => {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => departmentsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get departments by college ID
export const useDepartmentsByCollege = (collegeId: string) => {
  return useQuery({
    queryKey: departmentKeys.byCollege(collegeId),
    queryFn: () => departmentsApi.getByCollegeId(collegeId),
    enabled: !!collegeId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get department by ID
export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(departmentId),
    queryFn: () => departmentsApi.getById(departmentId),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create department mutation
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentsApi.create(data),
    onSuccess: (newDepartment) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.byCollege(newDepartment.college_id) });
    },
    onError: (error) => {
      console.error('Failed to create department:', error);
    },
  });
};

// Update department mutation
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      departmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error('Failed to update department:', error);
    },
  });
};

// Delete department mutation
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (departmentId: string) => departmentsApi.delete(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete department:', error);
    },
  });
};
