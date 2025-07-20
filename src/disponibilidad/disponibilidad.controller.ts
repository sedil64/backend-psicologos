// src/disponibilidad/disponibilidad.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { Disponibilidad } from './entity/disponibilidad.entity';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/entities/account.entity';
import { CrearDisponibilidadDto } from './dto/crear-disponibilidad.dto';

@Controller('disponibilidades')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  // Solo PACIENTE: ver bloques libres
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
  @Get('libres')
  async listarDisponibilidadesLibres(): Promise<Disponibilidad[]> {
    return this.disponibilidadService.getDisponibilidadesLibresParaPaciente();
  }

  // Solo PSICÓLOGO: crear disponibilidad
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PSICOLOGO)
  @Post()
  async crearDisponibilidad(
    @Request() req,
    @Body() dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const psicologoId = req.user.id;;
    return this.disponibilidadService.crearDisponibilidad(psicologoId, dto);
  }

  // Solo PSICÓLOGO: ver sus propias disponibilidades
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PSICOLOGO)
  @Get('mias')
  async listarDisponibilidadesPropias(
    @Request() req,
  ): Promise<Disponibilidad[]> {
    const psicologoId = req.user.id;;
    return this.disponibilidadService.getDisponibilidadesPorPsicologo(psicologoId);
  }
}
