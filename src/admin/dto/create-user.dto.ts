import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../auth/entities/account.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
