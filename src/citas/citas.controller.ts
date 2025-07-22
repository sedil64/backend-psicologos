import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';

import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { Cita } from './entities/citas.entity';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE)
  @Post()
  async create(@Body() dto: CreateCitaDto): Promise<Cita> {
    console.log('POST /citas - DTO recibido:', dto);
    return this.citasService.create(dto);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PSICOLOGO)
  @Post(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number): Promise<Cita> {
    return this.citasService.confirmar(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PACIENTE, Role.PSICOLOGO)
  @Post(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number): Promise<Cita> {
    return this.citasService.cancelar(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.citasService.remove(id);
  }
}
