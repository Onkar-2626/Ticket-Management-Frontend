import api from '../api/axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<{ message: string; customer_id: number }> {
    const response = await api.post<{ message: string; customer_id: number }>('/Register', data);
    return response.data;
  },
};
