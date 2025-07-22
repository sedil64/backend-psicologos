import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { RegisterPacienteDto } from './dto/register-paciente.dto';
import { Account } from '../auth/entities/account.entity';
import { Role } from '../auth/entities/account.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async register(dto: RegisterPacienteDto): Promise<Paciente> {
    const { email, password, role, ...pacienteData } = dto;

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

  async create(dto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepository.create(dto);
    return this.pacienteRepository.save(paciente);
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find({ relations: ['account'] });
  }

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

  async remove(id: number): Promise<void> {
    await this.pacienteRepository.delete(id);
  }
}
