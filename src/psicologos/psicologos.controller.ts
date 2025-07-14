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

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { Account } from '../auth/entities/account.entity';
import { Psicologo } from './entities/psicologos.entity';  // <–– nombre correcto del fichero

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,           // 👈 aquí ya req.user es Account
  ): Promise<Psicologo> {
    const adminAccount: Account = req.user; // 👈 ya no hace falta cast
    console.log('🧑‍⚕️ Admin creando psicólogo:', adminAccount.id);
    const psicologo = await this.service.create(dto, adminAccount);
    console.log('✅ Perfil de psicólogo creado por admin:', psicologo.id);
    return psicologo;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Psicologo[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Psicologo> {
    return this.service.findById(+id);
  }

  @Get('perfil/:id')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('id') id: number): Promise<any> {
    return this.service.getPerfilCompleto(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.delete(+id);
  }
}
