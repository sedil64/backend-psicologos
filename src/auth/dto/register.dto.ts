import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsDateString, IsString } from 'class-validator';
import { Role } from '../entities/account.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombres?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellidos?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  identificacion?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
