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

  async register(dto: RegisterPacienteDto): Promise<Paciente> {
    const account = await this.authService.register({
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });

    const paciente = this.pacienteRepo.create({
      account,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      identificacion: dto.identificacion,
      fechaNacimiento: dto.fechaNacimiento,
      genero: dto.genero,
      telefono: dto.telefono,
      telefonoEmergencia: dto.telefonoEmergencia,
      direccion: dto.direccion,
      edad: dto.edad,
      antecedentesClinicos: dto.antecedentesClinicos,
      activo: dto.activo ?? true,
    });

    return this.pacienteRepo.save(paciente);
  }

  async create(dto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepo.create(dto);
    return this.pacienteRepo.save(paciente);
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepo.find({ relations: ['account'] });
  }

  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepo.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);
    return paciente;
  }

  async remove(id: number): Promise<void> {
    await this.pacienteRepo.delete(id);
  }
}
