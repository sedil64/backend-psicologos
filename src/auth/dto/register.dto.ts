import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombreCompleto: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'psychologist', 'patient'])
  rol: 'admin' | 'psychologist' | 'patient';
}
