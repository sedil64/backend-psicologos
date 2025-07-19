import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
} from 'typeorm';

import { Psicologo } from './entities/psicologos.entity';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { RegisterPsicologoDto } from './dto/register-psicologo.dto';

import { Account } from '../auth/entities/account.entity';
import { AuthService } from '../auth/auth.service';
import { CertificacionesService } from '../certificaciones/certificaciones.service';
import { Cita } from '../citas/entities/citas.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

import {
  Disponibilidad,
  EstadoDisponibilidad,
} from '../disponibilidad/entity/disponibilidad.entity';
import { CrearDisponibilidadDto } from '../disponibilidad/dto/crear-disponibilidad.dto';

@Injectable()
export class PsicologosService {
  constructor(
    @InjectRepository(Psicologo)
    private readonly psicRepo: Repository<Psicologo>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,

    @InjectRepository(Disponibilidad)
    private readonly disponibilidadRepo: Repository<Disponibilidad>,

    private readonly authService: AuthService,
    private readonly certService: CertificacionesService,
  ) {}

  // Registro público
  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const { email, password, role, ...profile } = dto;
    const account = await this.authService.register({ email, password, role });
    const psicologo = this.psicRepo.create({ account, ...profile });
    return this.psicRepo.save(psicologo);
  }

  // Creación por ADMIN
  async create(dto: CreatePsicologoDto, account: Account): Promise<Psicologo> {
    const psicologo = this.psicRepo.create({ ...dto, account });
    return this.psicRepo.save(psicologo);
  }

  async findAll(): Promise<Psicologo[]> {
    return this.psicRepo.find({ relations: ['account'] });
  }

  async findById(id: number): Promise<Psicologo> {
    const psicologo = await this.psicRepo.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID ${id} no encontrado`);
    }
    return psicologo;
  }

  async getPerfilCompleto(id: number): Promise<any> {
    const psicologo = await this.findById(id);
    const mongoDoc = await this.certService.obtenerPorPsicologo(id);
    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  async delete(id: number): Promise<void> {
    await this.psicRepo.delete(id);
  }

  // Mis citas
  async findMyCitas(psicologoId: number): Promise<Cita[]> {
    return this.citaRepo.find({
      where: { psicologo: { id: psicologoId } },
      relations: ['paciente'],
      order: { fecha: 'DESC', hora: 'ASC' },
    });
  }

  // Mis pacientes
  async findMyPacientes(psicologoId: number): Promise<Paciente[]> {
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologoId } },
      relations: ['paciente'],
    });
    const map = new Map<number, Paciente>();
    citas.forEach(c => map.set(c.paciente.id, c.paciente));
    return Array.from(map.values());
  }

  // Liberar nueva disponibilidad
  async crearDisponibilidad(
    psicologoId: number,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const psicologo = await this.psicRepo.findOne({
      where: { id: psicologoId },
    });
    if (!psicologo) throw new NotFoundException('Psicólogo no encontrado');

    const fechaObj = new Date(dto.fecha);
    if (fechaObj < new Date())
      throw new BadRequestException(
        'No puedes liberar horarios en fechas pasadas',
      );

    const existe = await this.disponibilidadRepo.findOne({
      where: {
        psicologo: { id: psicologoId },
        fecha: fechaObj,
        horaInicio: dto.horaInicio,
      },
    });
    if (existe)
      throw new BadRequestException(
        'Ya existe una disponibilidad con esa fecha y hora',
      );

    const nueva: Partial<Disponibilidad> = {
      psicologo,
      fecha: fechaObj,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoDisponibilidad.Libre,
    };
    const disponibilidad = this.disponibilidadRepo.create(nueva);
    return this.disponibilidadRepo.save(disponibilidad);
  }

  // Listar disponibilidades libres y futuras
  async getDisponibilidadesActivas(
    psicologoId: number,
  ): Promise<Disponibilidad[]> {
    return this.disponibilidadRepo.find({
      where: {
        psicologo: { id: psicologoId },
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }
}
