import { IsString, IsEnum, IsDateString, IsNotEmpty, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PrioridadTarea } from '../entities/tarea.entity';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    if (!value) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limitDate = new Date(value);
    return limitDate >= today;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'La fecha límite debe ser futura';
  }
}

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsEnum(PrioridadTarea, { message: 'La prioridad debe ser alta, media o baja' })
  prioridad: PrioridadTarea;

  @IsDateString({}, { message: 'La fecha límite debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha límite es obligatoria' })
  @Validate(IsFutureDateConstraint)
  fecha_limite: string;
}