import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum Rol {
  Admin = 'admin',
  Psychologist = 'psychologist',
  Patient = 'patient',
}

export class RegisterDto {
  @IsString()
  nombreCompleto: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Rol)
  rol: Rol;
}
