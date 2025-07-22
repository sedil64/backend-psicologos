import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean, 
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';
import { Role } from '../../auth/entities/account.entity';

export class CreatePacienteDto {
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

  @IsNumber()
  edad: number;

  @IsOptional()
  @IsString()
  antecedentesClinicos?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

// DTO para registro donde sí incluyes el rol de la cuenta, pero no correo ni password acá (eso va en DTO de cuenta)
export class RegisterPacienteDto extends CreatePacienteDto {
  @IsEnum(Role)
  role: Role = Role.PACIENTE;
}
