import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDateString,
  IsString,
  IsNumber,
} from 'class-validator';
import { Role } from '../entities/account.entity';
import { Genero } from '../../common/enums/genero.enum';

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

  @IsOptional()
  @IsString()
  telefonoEmergencia?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  // Campos específicos del psicólogo
  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsString()
  universidad?: string;

  @IsOptional()
  @IsNumber()
  experiencia?: number;

  @IsOptional()
  @IsString()
  certificaciones?: string;
}
