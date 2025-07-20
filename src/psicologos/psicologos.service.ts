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

import { Account, Role } from '../auth/entities/account.entity';
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

  // 🔐 Método para obtener el psicólogo por el ID de cuenta del usuario logueado
  async getPsicologoByAccountId(accountId: number): Promise<Psicologo> {
    const psicologo = await this.psicRepo.findOne({
      where: { account: { id: accountId } },
    });

    if (!psicologo) {
      throw new NotFoundException(`No existe perfil de psicólogo para cuenta ${accountId}`);
    }

    return psicologo;
  }

  // Registro público
  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const { email, password, ...profile } = dto;

    const account = await this.authService.register({
      email,
      password,
      role: Role.PSICOLOGO,
    });

    const psicologo = this.psicRepo.create({
      ...profile,
      account, // ✅ asociación correcta con la cuenta
    });

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
  async findMyCitas(psicologoAccountId: number): Promise<Cita[]> {
    const psicologo = await this.getPsicologoByAccountId(psicologoAccountId);
    return this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
      order: { fecha: 'DESC', hora: 'ASC' },
    });
  }

  // Mis pacientes
  async findMyPacientes(psicologoAccountId: number): Promise<Paciente[]> {
    const psicologo = await this.getPsicologoByAccountId(psicologoAccountId);
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
    });
    const map = new Map<number, Paciente>();
    citas.forEach(c => map.set(c.paciente.id, c.paciente));
    return Array.from(map.values());
  }

  // Liberar nueva disponibilidad
  async crearDisponibilidad(
    accountId: number,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const psicologo = await this.getPsicologoByAccountId(accountId);

    const fechaObj = new Date(dto.fecha);
    if (fechaObj < new Date())
      throw new BadRequestException('No puedes liberar horarios en fechas pasadas');

    const existe = await this.disponibilidadRepo.findOne({
      where: {
        psicologo: { id: psicologo.id },
        fecha: fechaObj,
        horaInicio: dto.horaInicio,
      },
    });

    if (existe)
      throw new BadRequestException('Ya existe una disponibilidad con esa fecha y hora');

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
    accountId: number,
  ): Promise<Disponibilidad[]> {
    const psicologo = await this.getPsicologoByAccountId(accountId);
    return this.disponibilidadRepo.find({
      where: {
        psicologo: { id: psicologo.id },
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  // Verificar si psicólogo tiene disponibilidad libre y futura
  async tieneDisponibilidad(psicologoId: number): Promise<boolean> {
    const count = await this.disponibilidadRepo.count({
      where: {
        psicologo: { id: psicologoId },
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
    });
    return count > 0;
  }

  // Listar psicólogos con disponibilidad activa
  async findAllWithDisponibilidad(): Promise<Psicologo[]> {
    return this.psicRepo
      .createQueryBuilder('psicologo')
      .innerJoin('psicologo.disponibilidades', 'disponibilidad', 'disponibilidad.estado = :estado AND disponibilidad.fecha >= :hoy', {
        estado: EstadoDisponibilidad.Libre,
        hoy: new Date(),
      })
      .leftJoinAndSelect('psicologo.account', 'account')
      .getMany();
  }
}
