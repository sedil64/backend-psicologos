import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { Cita, EstadoCita } from './entities/citas.entity';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/entities/account.entity';

interface RequestWithUser extends Request {
  user: { id: number; role: Role };
}

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  /**
   * Sólo pacientes pueden solicitar citas tradicionalmente
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
  @Post()
  create(@Body() dto: CreateCitaDto): Promise<Cita> {
    return this.citasService.create(dto);
  }

  /**
   * Endpoint para agendar cita desde disponibilidad
   * Sólo pacientes
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
  @Post('agendar')
  async agendarDesdeDisponibilidad(
    @Req() req: RequestWithUser,
    @Body() body: { disponibilidadId: number; nombreCliente: string },
  ): Promise<Cita> {
    return this.citasService.agendarDesdeDisponibilidad(
      req.user.id,
      body.disponibilidadId,
      body.nombreCliente,
    );
  }

  /**
   * Cualquiera autenticado puede ver la lista de todas las citas
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  /**
   * Obtener una cita por id
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Cita> {
    return this.citasService.findOne(+id);
  }

  /**
   * Sólo psicólogos (o admin) pueden confirmar una cita
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PSICOLOGO)
  @Post(':id/confirmar')
  confirmar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.confirmar(+id);
  }

  /**
   * Pacientes y psicólogos pueden cancelar citas
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE, Role.PSICOLOGO)
  @Post(':id/cancelar')
  cancelar(@Param('id') id: number): Promise<Cita> {
    return this.citasService.cancelar(+id);
  }

  /**
   * Sólo admin puede eliminar citas
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.citasService.remove(+id);
  }
}
