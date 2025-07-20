// src/pacientes/pacientes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { RegisterPacienteDto } from './dto/register-paciente.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,

    private readonly authService: AuthService,
  ) {}

  /**
   * Registro público: crea cuenta + perfil de paciente
   * @param dto datos de registro
   * @returns paciente creado
   */
  async register(dto: RegisterPacienteDto): Promise<Paciente> {
    // 1️⃣ Crear cuenta con AuthService
    const account = await this.authService.register({
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });

    // 2️⃣ Crear perfil Paciente vinculado a esa cuenta
    const paciente = this.pacienteRepo.create({
      account,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      identificacion: dto.identificacion,
      fechaNacimiento: dto.fechaNacimiento,
      genero: dto.genero,
      telefono: dto.telefono,
      telefonoEmergencia: dto.telefonoEmergencia,
      correoElectronico: dto.correoElectronico,
      direccion: dto.direccion,
      edad: dto.edad,
      antecedentesClinicos: dto.antecedentesClinicos,
    });

    return this.pacienteRepo.save(paciente);
  }

  /**
   * Creación de paciente (admin)
   * @param dto datos para crear paciente
   * @returns paciente creado
   */
  async create(dto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepo.create(dto);
    return this.pacienteRepo.save(paciente);
  }

  /**
   * Obtiene todos los pacientes
   * @returns lista de pacientes
   */
  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepo.find();
  }

  /**
   * Obtiene paciente por id
   * @param id identificador del paciente
   * @returns paciente encontrado
   */
  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepo.findOneBy({ id });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);
    return paciente;
  }

  /**
   * Elimina paciente por id
   * @param id identificador del paciente
   */
  async remove(id: number): Promise<void> {
    await this.pacienteRepo.delete(id);
  }
}
