import { apiClient } from './client';
import { LoginCredentials, RegisterData, AuthResponse } from './types/auth.types';

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/api/v1/auth/login', credentials),

  register: (userData: RegisterData): Promise<AuthResponse> =>
    apiClient.post('/api/v1/auth/register', userData),
};
