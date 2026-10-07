import api from './api';
import type { Usuario } from '../types/models';

export const usuarioService = {
  async getUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/api/usuarios');
    return response.data;
  },

  async getPerfil(): Promise<Usuario> {
    const response = await api.get<Usuario>('/api/usuarios/perfil');
    return response.data;
  },

  async updateRol(id: string, rol: 'admin' | 'member'): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/api/usuarios/${id}/rol`, { rol });
    return response.data;
  },

  async deactivateUser(id: string): Promise<Usuario> {
    const response = await api.patch<Usuario>(`/api/usuarios/${id}/desactivar`);
    return response.data;
  },
};