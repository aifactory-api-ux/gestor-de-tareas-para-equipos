export type PrioridadTarea = 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en curso' | 'terminada';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'member';
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Tarea {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: PrioridadTarea;
  fecha_limite: string;
  estado: EstadoTarea;
  fecha_creacion: string;
  fecha_actualizacion: string;
  isOverdue?: boolean;
  nombre_usuario?: string;
}

export interface TareaCreatePayload {
  titulo: string;
  descripcion: string;
  prioridad: PrioridadTarea;
  fecha_limite: string;
}

export interface TareaUpdatePayload {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fecha_limite?: string;
  estado?: EstadoTarea;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
