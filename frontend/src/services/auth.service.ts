import api from './api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/models';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse['usuario']> {
    const response = await api.post<AuthResponse['usuario']>('/api/auth/register', payload);
    return response.data;
  },
};
