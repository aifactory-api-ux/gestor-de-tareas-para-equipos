import { RolUsuario } from '../entities/usuario.entity';

export class UsuarioResponseDto {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
