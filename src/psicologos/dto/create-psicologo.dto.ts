import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';

export class CreatePsicologoDto {
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

  @IsEmail()
  email: string;

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
}
