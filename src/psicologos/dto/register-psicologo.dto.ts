import { IsEmail, MinLength, IsEnum } from 'class-validator';
import { CreatePsicologoDto } from './create-psicologo.dto';
import { Role } from '../../auth/entities/account.entity';

export class RegisterPsicologoDto extends CreatePsicologoDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['psicologo'])
  role: Role; // Siempre 'psicologo'
}
