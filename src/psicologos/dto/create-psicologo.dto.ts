import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';
import { Role } from '../../auth/entities/account.entity';
/*comentarios*/
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

export class RegisterPsicologoDto extends CreatePsicologoDto {

  @IsEnum(Role)
  role: Role = Role.PSICOLOGO;
}
