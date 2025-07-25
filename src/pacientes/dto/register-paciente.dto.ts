import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Genero } from '../../common/enums/genero.enum';
import { Role } from '../../auth/entities/account.entity';
import { CreatePacienteDto } from './create-paciente.dto';

export class RegisterPacienteDto extends CreatePacienteDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional() 
  role?: Role = Role.PACIENTE;
}
