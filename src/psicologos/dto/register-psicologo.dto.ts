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
import { CreatePsicologoDto } from './create-psicologo.dto';

export class RegisterPsicologoDto extends CreatePsicologoDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role = Role.PSICOLOGO;
}
