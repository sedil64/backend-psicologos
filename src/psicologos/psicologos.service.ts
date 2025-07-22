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

  /**
   * Valida que el accountId recibido sea un número válido.
   * @param accountId Valor a validar.
   * @returns El accountId como número.
   * @throws BadRequestException si no es un número válido.
   */
  private validarAccountId(accountId: unknown): number {
    const id = Number(accountId);
    if (isNaN(id) || id <= 0) {
      this.logger.warn(`accountId inválido recibido: ${accountId}`);
      throw new BadRequestException('ID de cuenta inválido');
    }
    return id;
  }

  /**
   * Obtiene el psicólogo relacionado con el accountId.
   * @param accountId Id de la cuenta.
   * @returns Psicólogo asociado.
   * @throws NotFoundException si no existe psicólogo para esa cuenta.
   */
  async getPsicologoByAccountId(accountId: unknown): Promise<Psicologo> {
    const id = this.validarAccountId(accountId);
    this.logger.log(`Buscando psicólogo con accountId=${id}`);

    const psicologo = await this.psicRepo
      .createQueryBuilder('psicologo')
      .innerJoinAndSelect('psicologo.account', 'account')
      .where('account.id = :id', { id })
      .getOne();

    if (!psicologo) {
      this.logger.warn(`No se encontró psicólogo para accountId=${id}`);
      throw new NotFoundException(`Psicólogo no encontrado para accountId ${id}`);
    }

    this.logger.log(
      `Psicólogo encontrado: id=${psicologo.id}, nombres=${psicologo.nombres}, email=${psicologo.account?.email}`,
    );

    return psicologo;
  }

  /**
   * Registra un nuevo psicólogo creando primero la cuenta y luego el perfil.
   * @param dto Datos para registro.
   * @returns Psicólogo creado.
   * @throws BadRequestException en caso de errores.
   */
  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const {
      email,
      password,
      role, // descartado para evitar override
      ...profile
    } = dto;

    this.logger.log(`Intentando registrar psicólogo con email=${email}`);

    const existingAccount = await this.accountRepo.findOne({ where: { email } });
    if (existingAccount) {
      this.logger.warn(`El email ${email} ya está registrado`);
      throw new BadRequestException('El email ya está registrado');
    }

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

  /**
   * Crea un psicólogo asociado a una cuenta ya existente.
   * @param dto Datos del psicólogo.
   * @param account Cuenta asociada.
   * @returns Psicólogo creado.
   */
  async create(dto: CreatePsicologoDto, account: Account): Promise<Psicologo> {
    const psicologo = this.psicRepo.create({ ...dto, account });
    const saved = await this.psicRepo.save(psicologo);
    this.logger.log(`Psicólogo creado con id=${saved.id}`);
    return saved;
  }

  /**
   * Obtiene todos los psicólogos con sus cuentas.
   */
  async findAll(): Promise<Psicologo[]> {
    this.logger.log('Obteniendo todos los psicólogos');
    return this.psicRepo.find({ relations: ['account'] });
  }

  /**
   * Busca un psicólogo por id con su cuenta.
   * @throws NotFoundException si no existe.
   */
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

  /**
   * Obtiene el perfil completo incluyendo certificaciones.
   */
  async getPerfilCompleto(id: number): Promise<any> {
    this.logger.log(`Obteniendo perfil completo para psicólogo id=${id}`);
    const psicologo = await this.findById(id);
    const mongoDoc = await this.certService.obtenerPorPsicologo(id);
    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  /**
   * Elimina un psicólogo por id.
   */
  async delete(id: number): Promise<void> {
    this.logger.log(`Eliminando psicólogo con id=${id}`);
    await this.psicRepo.delete(id);
    this.logger.log(`Psicólogo eliminado con id=${id}`);
  }

  /**
   * Obtiene las citas del psicólogo identificado por accountId.
   */
  async findMyCitas(psicologoAccountId: unknown): Promise<Cita[]> {
    const id = this.validarAccountId(psicologoAccountId);
    this.logger.log(`Obteniendo citas para accountId=${id}`);
    const psicologo = await this.getPsicologoByAccountId(id);
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
      order: { fecha: 'DESC', hora: 'ASC' },
    });
    this.logger.log(`Citas encontradas: ${citas.length}`);
    return citas;
  }

  /**
   * Obtiene los pacientes únicos del psicólogo mediante sus citas.
   */
  async findMyPacientes(psicologoAccountId: unknown): Promise<Paciente[]> {
    const id = this.validarAccountId(psicologoAccountId);
    this.logger.log(`Obteniendo pacientes para accountId=${id}`);
    const psicologo = await this.getPsicologoByAccountId(id);
    const citas = await this.citaRepo.find({
      where: { psicologo: { id: psicologo.id } },
      relations: ['paciente'],
    });

    // Usamos Map para evitar duplicados de pacientes
    const map = new Map<number, Paciente>();
    citas.forEach(c => map.set(c.paciente.id, c.paciente));

    this.logger.log(`Pacientes únicos encontrados: ${map.size}`);
    return Array.from(map.values());
  }

  /**
   * Crea una nueva disponibilidad para el psicólogo.
   * Valida que la fecha no sea pasada y que no exista duplicado.
   */
  async crearDisponibilidad(
    accountId: unknown,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const id = this.validarAccountId(accountId);
    this.logger.log(`Creando disponibilidad para accountId=${id} con datos: ${JSON.stringify(dto)}`);
    const psicologo = await this.getPsicologoByAccountId(id);

    const fechaObj = new Date(dto.fecha);
    const ahora = new Date();

    // Compara solo fecha sin hora para evitar confusión con la hora actual
    if (fechaObj.setHours(0, 0, 0, 0) < ahora.setHours(0, 0, 0, 0)) {
      this.logger.warn('Intento de crear disponibilidad en fecha pasada');
      throw new BadRequestException('No puedes liberar horarios en fechas pasadas');
    }

    // Verificar si ya existe disponibilidad con misma fecha y hora inicio
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

  /**
   * Obtiene disponibilidades activas (libres y actuales o futuras) para el psicólogo.
   */
  async getDisponibilidadesActivas(
    accountId: unknown,
  ): Promise<Disponibilidad[]> {
    const id = this.validarAccountId(accountId);
    this.logger.log(`Obteniendo disponibilidades activas para accountId=${id}`);
    const psicologo = await this.getPsicologoByAccountId(id);
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

  /**
   * Verifica si el psicólogo tiene alguna disponibilidad libre futura.
   */
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

  /**
   * Busca psicólogos que tengan disponibilidades libres activas.
   */
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
