// Antes estabas importando “Rol” del wrong path
// import { Rol } from '../../auth/dto/register.dto';

import { Role } from '../../auth/entities/account.entity'; // <— CORREGIDO
import { IsEmail, MinLength, IsEnum } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['admin','psicologo','paciente'])
  role: Role;

  // otros campos…
}
