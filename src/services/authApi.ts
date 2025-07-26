import { apiClient } from '../lib/api';
import type {
  AuthResponse,
  OTPResponse,
  RegisterRequest,
  LoginRequest,
  OTPRequest,
  EmailRequest,
} from '../types/api';

export const authApi = {
  // Register new admin
  register: async (data: RegisterRequest): Promise<OTPResponse> => {
    return apiClient.post<OTPResponse>('/auth/register', data);
  },

  // Verify registration OTP
  verifyRegistrationOTP: async (data: OTPRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify-otp', data);
  },

  // Request login OTP (recommended)
  requestLoginOTP: async (data: EmailRequest): Promise<OTPResponse> => {
    return apiClient.post<OTPResponse>('/auth/login-otp', data);
  },

  // Verify login OTP
  verifyLoginOTP: async (data: OTPRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify-login-otp', data);
  },

  // Legacy direct login (not recommended)
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    return apiClient.post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken,
    });
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/logout', {});
  },
};
