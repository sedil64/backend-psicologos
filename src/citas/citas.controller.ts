import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { Cita, EstadoCita } from './entities/citas.entity';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard }   from '../common/guards/roles.guard';
import { Roles }        from '../common/decorators/roles.decorator';
import { Role }         from '../auth/entities/account.entity';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  /**
   * Sólo pacientes pueden solicitar citas
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
  @Post()
  create(@Body() dto: CreateCitaDto): Promise<Cita> {
    return this.citasService.create(dto);
  }

  /**
   * Cualquiera autenticado puede ver la lista
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Cita> {
    return this.citasService.findOne(+id);
  }

  /**
   * Sólo psicólogos (o admin) pueden confirmar
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PSICOLOGO)
  @Post(':id/confirmar')
  confirmar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.confirmar(+id);
  }

  /**
   * Pacientes y psicólogos pueden cancelar
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE, Role.PSICOLOGO)
  @Post(':id/cancelar')
  cancelar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.cancelar(+id);
  }

  /**
   * Sólo admin puede eliminar
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.citasService.remove(+id);
  }
}
