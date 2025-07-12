import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Rol } from '../../auth/dto/register.dto';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombreCompleto: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'psychologist', 'patient'])
  rol: 'admin' | 'psychologist' | 'patient';
}
