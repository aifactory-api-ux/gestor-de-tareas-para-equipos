import { PrioridadTarea, EstadoTarea } from '../entities/tarea.entity';

export class TareaResponseDto {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: PrioridadTarea;
  fecha_limite: Date;
  estado: EstadoTarea;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  isOverdue: boolean;
  nombre_usuario?: string;

  constructor(partial: Partial<TareaResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: any): TareaResponseDto {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const fechaLimite = new Date(entity.fecha_limite);
    fechaLimite.setHours(0, 0, 0, 0);
    const isOverdue = fechaLimite < now && entity.estado !== EstadoTarea.TERMINADA;

    return new TareaResponseDto({
      id: entity.id,
      usuario_id: entity.usuario_id,
      titulo: entity.titulo,
      descripcion: entity.descripcion,
      prioridad: entity.prioridad,
      fecha_limite: entity.fecha_limite,
      estado: entity.estado,
      fecha_creacion: entity.fecha_creacion,
      fecha_actualizacion: entity.fecha_actualizacion,
      isOverdue,
      nombre_usuario: entity.usuario?.nombre,
    });
  }
}

export class TareaListResponseDto {
  tareas: TareaResponseDto[];
  total: number;

  constructor(tareas: TareaResponseDto[], total: number) {
    this.tareas = tareas;
    this.total = total;
  }
}

export class DashboardResponseDto {
  pendientes: number;
  en_curso: number;
  terminadas: number;
  total: number;

  constructor(pendientes: number, en_curso: number, terminadas: number) {
    this.pendientes = pendientes;
    this.en_curso = en_curso;
    this.terminadas = terminadas;
    this.total = pendientes + en_curso + terminadas;
  }
}