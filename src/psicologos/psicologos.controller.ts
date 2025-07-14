// src/psicologos/psicologos.controller.ts

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { PsicologosService } from './psicologos.service';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { RegisterPsicologoDto } from './dto/register-psicologo.dto';

import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { Account, Role } from '../auth/entities/account.entity';
import { Psicologo } from './entities/psicologos.entity';

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  /**
   * Registro público de psicólogo
   */
  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterPsicologoDto,
  ): Promise<Psicologo> {
    console.log('📨 DTO recibido en /psicologos/register:', dto);
    const psicologo = await this.service.register(dto);
    console.log('✅ Psicólogo registrado:', {
      id: psicologo.id,
      email: psicologo.account.email,
    });
    return psicologo;
  }

  /**
   * Creación de psicólogo por ADMIN
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,
  ): Promise<Psicologo> {
    const adminAccount: Account = req.user;
    console.log('🧑‍⚕️ Admin creando psicólogo:', adminAccount.id);
    const psicologo = await this.service.create(dto, adminAccount);
    console.log('✅ Perfil de psicólogo creado por admin:', psicologo.id);
    return psicologo;
  }

  /**
   * Obtener todos los psicólogos
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Psicologo[]> {
    return this.service.findAll();
  }

  /**
   * Obtener un psicólogo por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Psicologo> {
    return this.service.findById(+id);
  }

  /**
   * Obtener perfil completo de un psicólogo
   */
  @Get('perfil/:id')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('id') id: number): Promise<any> {
    return this.service.getPerfilCompleto(+id);
  }

  /**
   * Eliminar un psicólogo por ADMIN
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.delete(+id);
  }
}
