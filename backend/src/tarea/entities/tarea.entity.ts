import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
export { Usuario } from '../../usuario/entities/usuario.entity';

export enum PrioridadTarea {
  ALTA = 'alta',
  MEDIA = 'media',
  BAJA = 'baja',
}

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en curso',
  TERMINADA = 'terminada',
}

@Entity('tarea')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuario_id: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  prioridad: PrioridadTarea;

  @Column({ type: 'date', name: 'fecha_limite' })
  fecha_limite: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: EstadoTarea.PENDIENTE,
  })
  estado: EstadoTarea;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fecha_actualizacion: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.tareas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
