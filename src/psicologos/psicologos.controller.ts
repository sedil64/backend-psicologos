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
import { Cita } from '../citas/entities/citas.entity';       // ← ruta corregida
import { Paciente } from '../pacientes/entities/paciente.entity';

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  // 1) Registro público
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterPsicologoDto): Promise<Psicologo> {
    console.log('📨 DTO recibido en /psicologos/register:', dto);
    const psicologo = await this.service.register(dto);
    console.log('✅ Psicólogo registrado:', {
      id: psicologo.id,
      email: psicologo.account.email,
    });
    return psicologo;
  }

  // 2) Mis citas – debe ir ANTES de cualquier ':id'
  @Get('me/citas')
  @UseGuards(JwtAuthGuard)
  async getMyCitas(@Req() req: RequestWithUser): Promise<Cita[]> {
    return this.service.findMyCitas(req.user.id);
  }

  // 3) Mis pacientes – también ANTES de ':id'
  @Get('me/pacientes')
  @UseGuards(JwtAuthGuard)
  async getMyPacientes(@Req() req: RequestWithUser): Promise<Paciente[]> {
    return this.service.findMyPacientes(req.user.id);
  }

  // 4) Creación por ADMIN
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,
  ): Promise<Psicologo> {
    const admin: Account = req.user;
    console.log('🧑‍⚕️ Admin creando psicólogo:', admin.id);
    return this.service.create(dto, admin);
  }

  // 5) Listar todos
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Psicologo[]> {
    return this.service.findAll();
  }

  // 6) Perfil público de otro psicólogo
  @Get('perfil/:id')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('id') id: number): Promise<any> {
    return this.service.getPerfilCompleto(+id);
  }

  // 7) Obtener uno por ID – dinámico, va al final
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Psicologo> {
    return this.service.findById(+id);
  }

  // 8) Eliminar por ADMIN
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number): Promise<void> {
    return this.service.delete(+id);
  }
}
