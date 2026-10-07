import { IsEnum } from 'class-validator';
import { RolUsuario } from '../entities/usuario.entity';

export class UpdateRolDto {
  @IsEnum(RolUsuario, {
    message: 'El rol debe ser admin o member',
  })
  rol: RolUsuario;
}
