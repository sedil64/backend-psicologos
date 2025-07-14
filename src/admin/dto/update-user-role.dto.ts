import { IsEnum } from 'class-validator';
import { Role } from '../../auth/entities/account.entity';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}
