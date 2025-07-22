import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

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
  private readonly logger = new Logger(PsicologosService.name);

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
    this.logger.log(`Buscando psicólogo con accountId=${accountId}`);

    const psicologo = await this.psicRepo.findOne({
      where: { account: { id: accountId } },
      relations: ['account'],
    });

    if (!psicologo) {
      this.logger.warn(`No se encontró psicólogo para accountId=${accountId}`);
      throw new NotFoundException(
        `Psicólogo no encontrado para accountId ${accountId}`,
      );
    }

    this.logger.log(
      `Psicólogo encontrado: id=${psicologo.id}, nombres=${psicologo.nombres}, email=${psicologo.account?.email}`,
    );

    return psicologo;
  }

  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const {
      email,
      password,
      role, // descartado explícitamente
      ...profile
    } = dto;

    this.logger.log(`Intentando registrar psicólogo con email=${email}`);

    const existingAccount = await this.accountRepo.findOne({ where: { email } });
    if (existingAccount) {
      this.logger.warn(`El email ${email} ya está registrado`);
      throw new BadRequestException('El email ya está registrado');
    }

    // Aquí la corrección: no llamar toISOString, profile.fechaNacimiento es string ISO
    const registerDto: RegisterDto = {
      email,
      password,
      role: Role.PSICOLOGO,
      ...profile,
      fechaNacimiento: profile.fechaNacimiento,
    };

    let account: Account;
    try {
      account = await this.authService.register(registerDto);
      this.logger.log(`Cuenta creada con id=${account.id}`);
    } catch (error) {
      this.logger.error('Error al crear la cuenta', error.stack);
      throw new BadRequestException('Error al crear la cuenta: ' + error.message);
    }

    const psicologo = this.psicRepo.create({
      ...profile,
      account,
    });

    try {
      const saved = await this.psicRepo.save(psicologo);
      this.logger.log(
        `Perfil psicólogo creado: id=${saved.id}, nombres=${saved.nombres}, email=${account.email}`,
      );
      return saved;
    } catch (error) {
      this.logger.error('Error al crear perfil psicólogo, eliminando cuenta creada', error.stack);
      try {
        await this.accountRepo.delete(account.id);
      } catch (deleteError) {
        this.logger.error('Error al eliminar cuenta tras fallo en psicólogo', deleteError.stack);
      }
      throw new BadRequestException('Error al crear el perfil psicólogo: ' + error.message);
    }
  }

  async create(dto: CreatePsicologoDto, account: Account): Promise<Psicologo> {
    const psicologo = this.psicRepo.create({ ...dto, account });
    const saved = await this.psicRepo.save(psicologo);
    this.logger.log(`Psicólogo creado con id=${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Psicologo[]> {
    this.logger.log('Obteniendo todos los psicólogos');
    return this.psicRepo.find({ relations: ['account'] });
  }

  async findById(id: number): Promise<Psicologo> {
    this.logger.log(`Buscando psicólogo con id=${id}`);
    const psicologo = await this.psicRepo.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!psicologo) {
      this.logger.warn(`Psicólogo con id=${id} no encontrado`);
      throw new NotFoundException(`Psicólogo con ID ${id} no encontrado`);
    }
    return psicologo;
  }

  async getPerfilCompleto(id: number): Promise<any> {
    this.logger.log(`Obteniendo perfil completo para psicólogo id=${id}`);
    const psicologo = await this.findById(id);
    const mongoDoc = await this.certService.obtenerPorPsicologo(id);
    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando psicólogo con id=${id}`);
    await this.psicRepo.delete(id);
    this.logger.log(`Psicólogo eliminado con id=${id}`);
  }

  async findMyCitas(psicologoAccountId: number): Promise<Cita[]> {
    this.logger.log(`Obteniendo citas para accountId=${psicologoAccountId}`);
    const psicologo = await this.getPsicologoByAccountId(psicologoAccountId);
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
      order: { fecha: 'DESC', hora: 'ASC' },
    });
    this.logger.log(`Citas encontradas: ${citas.length}`);
    return citas;
  }

  async findMyPacientes(psicologoAccountId: number): Promise<Paciente[]> {
    this.logger.log(`Obteniendo pacientes para accountId=${psicologoAccountId}`);
    const psicologo = await this.getPsicologoByAccountId(psicologoAccountId);
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
    });
    const map = new Map<number, Paciente>();
    citas.forEach(c => map.set(c.paciente.id, c.paciente));
    this.logger.log(`Pacientes únicos encontrados: ${map.size}`);
    return Array.from(map.values());
  }

  async crearDisponibilidad(
    accountId: number,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    this.logger.log(`Creando disponibilidad para accountId=${accountId} con datos: ${JSON.stringify(dto)}`);
    const psicologo = await this.getPsicologoByAccountId(accountId);

    const fechaObj = new Date(dto.fecha);
    if (fechaObj < new Date()) {
      this.logger.warn('Intento de crear disponibilidad en fecha pasada');
      throw new BadRequestException('No puedes liberar horarios en fechas pasadas');
    }

    const existe = await this.disponibilidadRepo.findOne({
      where: {
        psicologo: { id: psicologo.id },
        fecha: fechaObj,
        horaInicio: dto.horaInicio,
      },
    });

    if (existe) {
      this.logger.warn('Ya existe una disponibilidad con esa fecha y hora');
      throw new BadRequestException('Ya existe una disponibilidad con esa fecha y hora');
    }

    const nueva: Partial<Disponibilidad> = {
      psicologo,
      fecha: fechaObj,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoDisponibilidad.Libre,
    };

    const disponibilidad = this.disponibilidadRepo.create(nueva);
    const saved = await this.disponibilidadRepo.save(disponibilidad);
    this.logger.log(`Disponibilidad creada con id=${saved.id}`);
    return saved;
  }

  async getDisponibilidadesActivas(
    accountId: number,
  ): Promise<Disponibilidad[]> {
    this.logger.log(`Obteniendo disponibilidades activas para accountId=${accountId}`);
    const psicologo = await this.getPsicologoByAccountId(accountId);
    const disponibilidades = await this.disponibilidadRepo.find({
      where: {
        psicologo: { id: psicologo.id },
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
    this.logger.log(`Disponibilidades activas encontradas: ${disponibilidades.length}`);
    return disponibilidades;
  }

  async tieneDisponibilidad(psicologoId: number): Promise<boolean> {
    this.logger.log(`Consultando disponibilidad para psicólogo id=${psicologoId}`);
    const count = await this.disponibilidadRepo.count({
      where: {
        psicologo: { id: psicologoId },
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
    });
    this.logger.log(`Cantidad de disponibilidades libres: ${count}`);
    return count > 0;
  }

  async findAllWithDisponibilidad(): Promise<Psicologo[]> {
    this.logger.log('Buscando psicólogos con disponibilidad libre');
    const psicologos = await this.psicRepo
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
    this.logger.log(`Psicólogos encontrados con disponibilidad: ${psicologos.length}`);
    return psicologos;
  }
}
