import { IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PrioridadTarea, EstadoTarea } from '../entities/tarea.entity';

export class UpdateTareaDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'El título no puede estar vacío' })
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(PrioridadTarea, { message: 'La prioridad debe ser alta, media o baja' })
  prioridad?: PrioridadTarea;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => {
    if (value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const limitDate = new Date(value);
      if (limitDate < today) {
        throw new Error('La fecha límite debe ser futura');
      }
    }
    return value;
  })
  fecha_limite?: string;

  @IsOptional()
  @IsEnum(EstadoTarea, { message: 'El estado debe ser pendiente, en curso o terminada' })
  estado?: EstadoTarea;
}