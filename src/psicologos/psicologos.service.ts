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
import { RegisterDto } from '../auth/dto/register.dto';
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

  async getPsicologoByAccountId(accountId: number): Promise<Psicologo> {
    const psicologo = await this.psicRepo.findOne({
      where: { account: { id: accountId } },
      relations: ['account'], // asegura relación cargada
    });

    if (!psicologo) {
      throw new NotFoundException(`No existe perfil de psicólogo para cuenta ${accountId}`);
    }

    return psicologo;
  }

  // Registro completo con vinculación entre Account y Psicologo, con validación email único y manejo errores
  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const { email, password, ...profile } = dto;

    // Verificar si el email ya existe
    const existingAccount = await this.accountRepo.findOne({ where: { email } });
    if (existingAccount) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Crear DTO para registro de cuenta
    const registerDto: RegisterDto = {
      email,
      password,
      role: Role.PSICOLOGO,
    };

    // Crear cuenta
    let account: Account;
    try {
      account = await this.authService.register(registerDto);
    } catch (error) {
      throw new BadRequestException('Error al crear la cuenta: ' + error.message);
    }

    // Crear perfil psicólogo vinculado
    const psicologo = this.psicRepo.create({
      ...profile,
      account,
    });

    try {
      return await this.psicRepo.save(psicologo);
    } catch (error) {
      // En caso de error al guardar psicólogo, elimina la cuenta para mantener consistencia
      await this.accountRepo.delete(account.id);
      throw new BadRequestException('Error al crear el perfil psicólogo: ' + error.message);
    }
  }

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

  async findMyCitas(psicologoAccountId: number): Promise<Cita[]> {
    const psicologo = await this.getPsicologoByAccountId(psicologoAccountId);
    return this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
      order: { fecha: 'DESC', hora: 'ASC' },
    });
  }

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

  async findAllWithDisponibilidad(): Promise<Psicologo[]> {
    return this.psicRepo
      .createQueryBuilder('psicologo')
      .innerJoin(
        'psicologo.disponibilidades',
        'disponibilidad',
        'disponibilidad.estado = :estado AND disponibilidad.fecha >= :hoy',
        {
          estado: EstadoDisponibilidad.Libre,
          hoy: new Date(),
        },
      )
      .leftJoinAndSelect('psicologo.account', 'account')
      .getMany();
  }
}
