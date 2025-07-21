import { IsEnum, IsEmail, MinLength } from 'class-validator';
import { Role } from '../../auth/entities/account.entity';
import { CreatePsicologoDto } from './create-psicologo.dto';

export class RegisterPsicologoDto extends CreatePsicologoDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role = Role.PSICOLOGO;
}
