import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard }   from '../common/guards/roles.guard';
import { Roles }        from '../common/decorators/roles.decorator';
import { Role }         from '../auth/entities/account.entity';
import { Account }      from '../auth/entities/account.entity';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  @Get()
  list(): Promise<Account[]> {
    return this.svc.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<Account> {
    return this.svc.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<Account> {
    return this.svc.create(dto);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<Account> {
    return this.svc.updateRole(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.svc.remove(+id);
  }
}
