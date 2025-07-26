import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { setAuthTokens, clearAuthTokens, isAuthenticated, getAuthToken } from '../lib/api';
import type { RegisterRequest, LoginRequest, OTPRequest, EmailRequest } from '../types/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  tokens: () => [...authKeys.all, 'tokens'] as const,
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      console.log('Registration successful:', data.message);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// Verify registration OTP mutation
export const useVerifyRegistrationOTP = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OTPRequest) => authApi.verifyRegistrationOTP(data),
    onSuccess: (data) => {
      setAuthTokens(data.access_token, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
    },
    onError: (error) => {
      console.error('OTP verification failed:', error);
    },
  });
};

// Request login OTP mutation
export const useRequestLoginOTP = () => {
  return useMutation({
    mutationFn: (data: EmailRequest) => authApi.requestLoginOTP(data),
    onSuccess: (data) => {
      console.log('Login OTP sent:', data.message);
    },
    onError: (error) => {
      console.error('Failed to send login OTP:', error);
    },
  });
};

// Verify login OTP mutation
export const useVerifyLoginOTP = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OTPRequest) => authApi.verifyLoginOTP(data),
    onSuccess: (data) => {
      setAuthTokens(data.access_token, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
    },
    onError: (error) => {
      console.error('Login OTP verification failed:', error);
    },
  });
};

// Legacy login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuthTokens(data.access_token, data.refresh_token);
      queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // Try to call the logout endpoint
        await authApi.logout();
      } catch (error) {
        // Even if logout API fails, we should clear local tokens
        console.warn('Logout API call failed, clearing local tokens anyway:', error);
      }
      clearAuthTokens();
      return { message: 'Logged out successfully' };
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      clearAuthTokens();
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  return {
    isAuthenticated: isAuthenticated(),
    accessToken: getAuthToken(),
  };
};
