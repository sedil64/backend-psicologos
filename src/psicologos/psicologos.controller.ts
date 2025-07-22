import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Logger,
  NotFoundException,
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
  private readonly logger = new Logger(PsicologosController.name);

  constructor(private readonly service: PsicologosService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterPsicologoDto): Promise<Psicologo> {
    this.logger.log(`Registro de nuevo psicólogo con datos: ${JSON.stringify(dto)}`);
    console.log('Register DTO:', dto);
    const result = await this.service.register(dto);
    this.logger.log(`Psicólogo registrado con id: ${result.id}`);
    console.log('Psicólogo registrado:', result);
    return result;
  }

  @Get('me/citas')
  async getMyCitas(@Req() req: RequestWithUser): Promise<Cita[]> {
    this.logger.log(`Obteniendo citas para accountId=${req.user.id}`);
    console.log(`Obteniendo citas para accountId=${req.user.id}`);
    try {
      const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
      console.log('Psicólogo encontrado:', psicologo);
      if (!psicologo) {
        this.logger.warn(`No se encontró psicólogo para accountId=${req.user.id}`);
        console.warn(`No se encontró psicólogo para accountId=${req.user.id}`);
        throw new NotFoundException('Psicólogo no encontrado');
      }
      this.logger.log(`Psicólogo encontrado: id=${psicologo.id}`);

      const citas = await this.service.findMyCitas(psicologo.id);
      this.logger.log(`Número de citas encontradas: ${citas.length}`);
      console.log(`Número de citas encontradas: ${citas.length}`, citas);

      return citas;
    } catch (error) {
      this.logger.error(`Error al obtener citas: ${error.message}`);
      console.error('Error al obtener citas:', error);
      throw error; // para que lo maneje el filtro global
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('me/pacientes')
  async getMyPacientes(@Req() req: RequestWithUser): Promise<Paciente[]> {
    this.logger.log(`Obteniendo pacientes para accountId=${req.user.id}`);
    console.log(`Obteniendo pacientes para accountId=${req.user.id}`);
    const psicologo = await this.service.getPsicologoByAccountId(req.user.id);
    console.log('Psicólogo encontrado:', psicologo);
    this.logger.log(`Psicólogo encontrado: id=${psicologo.id}`);
    const pacientes = await this.service.findMyPacientes(psicologo.id);
    this.logger.log(`Número de pacientes encontrados: ${pacientes.length}`);
    console.log(`Número de pacientes encontrados: ${pacientes.length}`, pacientes);
    return pacientes;
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/disponibilidad')
  async crearDisponibilidad(
    @Body() dto: CrearDisponibilidadDto,
    @Req() req: RequestWithUser,
  ): Promise<Disponibilidad> {
    this.logger.log(`Creando disponibilidad para accountId=${req.user.id} con datos: ${JSON.stringify(dto)}`);
    console.log(`Creando disponibilidad para accountId=${req.user.id} con datos:`, dto);
    const result = await this.service.crearDisponibilidad(req.user.id, dto);
    this.logger.log(`Disponibilidad creada con id: ${result.id}`);
    console.log('Disponibilidad creada:', result);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/disponibilidad')
  async getDisponibilidadesActivas(
    @Req() req: RequestWithUser,
  ): Promise<Disponibilidad[]> {
    this.logger.log(`Obteniendo disponibilidades activas para accountId=${req.user.id}`);
    console.log(`Obteniendo disponibilidades activas para accountId=${req.user.id}`);
    const disponibilidades = await this.service.getDisponibilidadesActivas(req.user.id);
    this.logger.log(`Número de disponibilidades activas: ${disponibilidades.length}`);
    console.log(`Número de disponibilidades activas: ${disponibilidades.length}`, disponibilidades);
    return disponibilidades;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,
  ): Promise<Psicologo> {
    this.logger.log(`ADMIN creando psicólogo con datos: ${JSON.stringify(dto)} por usuario: ${req.user.id}`);
    console.log('ADMIN creando psicólogo con datos:', dto, 'por usuario:', req.user.id);
    const result = await this.service.create(dto, req.user);
    this.logger.log(`Psicólogo creado con id: ${result.id}`);
    console.log('Psicólogo creado:', result);
    return result;
  }

  @Public()
  @Get()
  async findAll(): Promise<Psicologo[]> {
    this.logger.log(`Obteniendo todos los psicólogos`);
    console.log('Obteniendo todos los psicólogos');
    const psicologos = await this.service.findAll();
    this.logger.log(`Número total de psicólogos: ${psicologos.length}`);
    console.log(`Número total de psicólogos: ${psicologos.length}`, psicologos);
    return psicologos;
  }

  @Public()
  @Get('perfil/:id')
  async getPerfil(@Param('id') id: number): Promise<any> {
    this.logger.log(`Obteniendo perfil completo para psicólogo id=${id}`);
    console.log(`Obteniendo perfil completo para psicólogo id=${id}`);
    const perfil = await this.service.getPerfilCompleto(id);
    this.logger.log(`Perfil obtenido para psicólogo id=${id}`);
    console.log(`Perfil obtenido para psicólogo id=${id}`, perfil);
    return perfil;
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Psicologo> {
    this.logger.log(`Buscando psicólogo con id=${id}`);
    console.log(`Buscando psicólogo con id=${id}`);
    const psicologo = await this.service.findById(id);
    this.logger.log(`Psicólogo encontrado: id=${psicologo.id}`);
    console.log('Psicólogo encontrado:', psicologo);
    return psicologo;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    this.logger.log(`ADMIN eliminando psicólogo con id=${id}`);
    console.log(`ADMIN eliminando psicólogo con id=${id}`);
    await this.service.delete(id);
    this.logger.log(`Psicólogo eliminado con id=${id}`);
    console.log(`Psicólogo eliminado con id=${id}`);
  }

  @Public()
  @Get(':id/tiene-disponibilidad')
  async tieneDisponibilidad(
    @Param('id') id: number,
  ): Promise<{ disponible: boolean }> {
    this.logger.log(`Consultando disponibilidad para psicólogo id=${id}`);
    console.log(`Consultando disponibilidad para psicólogo id=${id}`);
    const disponible = await this.service.tieneDisponibilidad(id);
    this.logger.log(`Disponibilidad para psicólogo id=${id}: ${disponible}`);
    console.log(`Disponibilidad para psicólogo id=${id}: ${disponible}`);
    return { disponible };
  }
}
