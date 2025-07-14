import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';

export class CreatePacienteDto {
  @IsString() nombres: string;
  @IsString() apellidos: string;
  @IsString() identificacion: string;
  @IsDateString() fechaNacimiento: string;
  @IsOptional() @IsEnum(Genero) genero?: Genero;
  @IsString() telefono: string;
  @IsOptional() @IsString() telefonoEmergencia?: string;
  @IsString() correoElectronico: string;
  @IsOptional() @IsString() direccion?: string;
  @IsNumber() edad: number;
  @IsOptional() @IsString() antecedentesClinicos?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;     // nuevo campo validado como booleano
}
