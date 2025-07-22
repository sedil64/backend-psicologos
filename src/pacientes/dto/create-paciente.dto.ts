import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
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

  @IsOptional()
  @IsString()
  antecedentesClinicos?: string;
}
