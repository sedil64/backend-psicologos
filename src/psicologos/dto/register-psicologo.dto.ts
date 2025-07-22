import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsEmail,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';
import { Role } from '../../auth/entities/account.entity';

export class RegisterPsicologoDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role = Role.PSICOLOGO;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  identificacion: string;

  @IsDateString()
  fechaNacimiento: Date;

  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  telefonoEmergencia?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsString()
  especialidad: string;

  @IsOptional()
  @IsString()
  universidad?: string;

  @IsOptional()
  @IsNumber()
  experiencia?: number;

  @IsOptional()
  @IsString()
  certificaciones?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
