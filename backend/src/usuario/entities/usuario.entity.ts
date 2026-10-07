import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tarea } from '../../tarea/entities/tarea.entity';

export enum RolUsuario {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  password_hash: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: RolUsuario.MEMBER,
  })
  rol: RolUsuario;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fecha_actualizacion: Date;

  @OneToMany(() => Tarea, (tarea) => tarea.usuario)
  tareas: Tarea[];
}
