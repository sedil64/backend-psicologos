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
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { RegisterPacienteDto } from './dto/register-paciente.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/entities/account.entity';
import { Paciente } from './entities/paciente.entity';


@Controller('pacientes')
export class PacientesController {
  constructor(private readonly service: PacientesService) {}

  /**
   * Registro público de paciente
   */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterPacienteDto) {
    return this.service.register(dto);
  }

  /**
   * Creación de paciente por ADMIN
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreatePacienteDto): Promise<Paciente> {
    return this.service.create(dto);
  }

  /**
   * Obtener lista de todos los pacientes
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Paciente[]> {
    return this.service.findAll();
  }

  /**
   * Obtener el perfil del paciente autenticado
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any): Promise<Paciente> {
    const accountId = req.user.id;
    return this.service.getPacienteByAccountId(accountId);
  }

  /**
   * Obtener un paciente por su ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Paciente> {
    return this.service.findById(+id);
  }

  /**
   * Eliminar un paciente por ADMIN
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.remove(+id);
  }
}

