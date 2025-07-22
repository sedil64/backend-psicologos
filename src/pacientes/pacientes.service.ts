import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { RegisterPacienteDto } from './dto/register-paciente.dto';
import { Account, Role } from '../auth/entities/account.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // Obtener paciente por ID
  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente ${id} no encontrado`);
    }

    return paciente;
  }

  // Obtener paciente por el ID de cuenta asociada
  async getPacienteByAccountId(accountId: number): Promise<Paciente> {
    // Validar que el accountId sea un número válido y loguear el valor recibido
    if (accountId === null || accountId === undefined) {
      throw new BadRequestException('ID de cuenta no proporcionado');
    }
    const id = Number(accountId);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID de cuenta inválido: recibido='${accountId}'`);
    }

    // Intento estándar (TypeORM relación)
    let paciente = await this.pacienteRepository.findOne({
      where: { account: { id } },
      relations: ['account'],
    });

    // Si no lo encuentra, buscar por account_id directo (más robusto)
    if (!paciente) {
      paciente = await this.pacienteRepository
        .createQueryBuilder('paciente')
        .leftJoinAndSelect('paciente.account', 'account')
        .where('paciente.account_id = :accountId', { accountId: id })
        .getOne();
    }

    if (!paciente) {
      throw new NotFoundException(`Paciente no encontrado para accountId ${id}`);
    }

    // Log para depuración: mostrar el id real del paciente y el account_id
    // eslint-disable-next-line no-console
    console.log('[getPacienteByAccountId] Retornando paciente:', {
      id: paciente.id,
      account_id: paciente.account?.id,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos
    });

    return paciente;
  }

  // Crear un paciente desde DTO sin cuenta
  async create(dto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepository.create(dto);
    return await this.pacienteRepository.save(paciente);
  }

  // Registro completo de paciente con cuenta
  async register(dto: RegisterPacienteDto): Promise<Paciente> {
    const { email, password, role, ...pacienteData } = dto;

    const existing = await this.accountRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const account = this.accountRepository.create({
      email,
      password,
      role: Role.PACIENTE,
    });

    const paciente = this.pacienteRepository.create({
      ...pacienteData,
      account,
    });

    return await this.pacienteRepository.save(paciente);
  }

  // Listar todos los pacientes
  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({ relations: ['account'] });
  }

  // Eliminar paciente por ID
  async remove(id: number): Promise<void> {
    await this.pacienteRepository.delete(id);
  }
}
