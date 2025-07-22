// src/auth/dto/register.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsDateString } from 'class-validator';
import { Role } from '../entities/account.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;


  @IsOptional()
  @IsNotEmpty()
  nombres?: string;

  @IsOptional()
  @IsNotEmpty()
  apellidos?: string;

  @IsOptional()
  @IsNotEmpty()
  identificacion?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  telefono?: string;

}
