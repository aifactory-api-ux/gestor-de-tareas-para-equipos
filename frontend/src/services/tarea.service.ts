import api from './api';
import type { Tarea, TareaCreatePayload, TareaUpdatePayload, PrioridadTarea, EstadoTarea } from '../types/models';

export interface TareaFiltros {
  estado?: EstadoTarea;
  prioridad?: PrioridadTarea;
}

export interface TareasResponse {
  tareas: Tarea[];
  total: number;
}

export interface TareasVencidasResponse {
  tareas: Tarea[];
}

export interface DashboardData {
  pendientes: number;
  en_curso: number;
  terminadas: number;
  total: number;
}

export const tareaService = {
  async getTareas(filtros?: TareaFiltros): Promise<TareasResponse> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.prioridad) params.append('prioridad', filtros.prioridad);
    const queryString = params.toString();
    const url = queryString ? `/api/tareas?${queryString}` : '/api/tareas';
    const response = await api.get<TareasResponse>(url);
    return response.data;
  },

  async getTareasVencidas(): Promise<TareasVencidasResponse> {
    const response = await api.get<TareasVencidasResponse>('/api/tareas/vencidas');
    return response.data;
  },

  async getTareasDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/api/tareas/dashboard');
    return response.data;
  },

  async createTarea(payload: TareaCreatePayload): Promise<Tarea> {
    const response = await api.post<Tarea>('/api/tareas', payload);
    return response.data;
  },

  async updateTarea(id: string, payload: TareaUpdatePayload): Promise<Tarea> {
    const response = await api.patch<Tarea>(`/api/tareas/${id}`, payload);
    return response.data;
  },

  async deleteTarea(id: string): Promise<void> {
    await api.delete(`/api/tareas/${id}`);
  },
};