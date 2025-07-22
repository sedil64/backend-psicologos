// create-paciente.dto.ts
import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';

export class CreatePacienteDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  identificacion: string;

  @IsDateString()
  fechaNacimiento: Date;

  @IsEnum(Genero)
  @IsOptional()
  genero?: Genero;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  telefonoEmergencia?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsNumber()
  edad: number;

  @IsOptional()
  @IsString()
  antecedentesClinicos?: string;
}
