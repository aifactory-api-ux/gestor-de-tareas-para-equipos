import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email: string;

  @IsString()
  password: string;
}
