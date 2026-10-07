import { useState, useCallback } from 'react';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/models';
import { apiFetch } from '../lib/api';

const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

export function useAuth() {
  const [data, setData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const payload: LoginPayload = { email, password };
      const response = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(response.usuario));
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (nombre: string, email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const payload: RegisterPayload = { nombre, email, password };
      const response = await apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(response.usuario));
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setData(null);
  }, []);

  return {
    data,
    loading,
    error,
    login,
    register,
    logout,
  };
}