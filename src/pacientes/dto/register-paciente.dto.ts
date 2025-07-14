import { IsEnum, IsEmail, MinLength } from 'class-validator';
import { Role } from '../../auth/entities/account.entity';
import { CreatePacienteDto } from './create-paciente.dto';

export class RegisterPacienteDto extends CreatePacienteDto {
  @IsEmail()    email: string;
  @MinLength(6) password: string;

  @IsEnum(Role)
  role: Role = Role.PACIENTE;
}
