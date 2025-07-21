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
import { CrearDisponibilidadDto } from '../disponibilidad/dto/crear-disponibilidad.dto';
import { Disponibilidad } from '../disponibilidad/entity/disponibilidad.entity';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { Role } from '../auth/entities/account.entity';
import { Psicologo } from './entities/psicologos.entity';
import { Cita } from '../citas/entities/citas.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterPsicologoDto): Promise<Psicologo> {
    return this.service.register(dto); // ✅ vincula cuenta al psicólogo
  }

  @Get('me/citas')
  @UseGuards(JwtAuthGuard)
  async getMyCitas(@Req() req: RequestWithUser): Promise<Cita[]> {
    const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
    return this.service.findMyCitas(psicologo.id);
  }

  @Get('me/pacientes')
  @UseGuards(JwtAuthGuard)
  async getMyPacientes(@Req() req: RequestWithUser): Promise<Paciente[]> {
    const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
    return this.service.findMyPacientes(psicologo.id);
  }

  @Post('me/disponibilidad')
  @UseGuards(JwtAuthGuard)
  async crearDisponibilidad(
    @Body() dto: CrearDisponibilidadDto,
    @Req() req: RequestWithUser,
  ): Promise<Disponibilidad> {
    const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
    return this.service.crearDisponibilidad(psicologo.id, dto);
  }

  @Get('me/disponibilidad')
  @UseGuards(JwtAuthGuard)
  async getDisponibilidadesActivas(
    @Req() req: RequestWithUser,
  ): Promise<Disponibilidad[]> {
    const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
    return this.service.getDisponibilidadesActivas(psicologo.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,
  ): Promise<Psicologo> {
    return this.service.create(dto, req.user);
  }

  @Public()
  @Get()
  async findAll(): Promise<Psicologo[]> {
    return this.service.findAll();
  }

  @Get('perfil/:id')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('id') id: number): Promise<any> {
    return this.service.getPerfilCompleto(+id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Psicologo> {
    return this.service.findById(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.delete(+id);
  }

  @Get(':id/tiene-disponibilidad')
  @UseGuards(JwtAuthGuard)
  async tieneDisponibilidad(
    @Param('id') id: number,
  ): Promise<{ disponible: boolean }> {
    const disponible = await this.service.tieneDisponibilidad(+id);
    return { disponible };
  }
}
